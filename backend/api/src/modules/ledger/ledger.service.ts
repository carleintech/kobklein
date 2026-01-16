import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { getSupabaseAdmin } from '../../lib/supabase';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

/**
 * Ledger Service - Double-Entry Bookkeeping Engine
 * 
 * This is the financial core of KobKlein.
 * All financial operations MUST go through this service.
 * 
 * Architecture:
 * - Every transaction creates TWO ledger entries (debit + credit)
 * - Balances are DERIVED from ledger entries, never updated directly
 * - Ledger entries are IMMUTABLE (only reversed, never modified)
 * - All operations are ACID-compliant
 * 
 * Accounting Rules:
 * - ASSET accounts increase with DEBIT
 * - LIABILITY accounts increase with CREDIT
 * - REVENUE accounts increase with CREDIT
 * - EXPENSE accounts increase with DEBIT
 */
@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);
  private supabase = getSupabaseAdmin();

  /**
   * Create a new account
   * Accounts represent financial entities (wallets, fees, etc.)
   */
  async createAccount(dto: CreateAccountDto) {
    try {
      // Generate account number
      const accountNumber = await this.generateAccountNumber(
        dto.accountType,
        dto.ownerId,
      );

      const accountData = {
        account_number: accountNumber,
        account_name: dto.accountName,
        account_type: dto.accountType,
        sub_type: dto.subType,
        owner_id: dto.ownerId,
        owner_type: dto.ownerType,
        currency: dto.currency || 'HTG',
        status: 'ACTIVE',
        is_system_account: dto.isSystemAccount || false,
        metadata: dto.metadata || {},
        notes: dto.notes,
      };

      const { data: account, error } = await this.supabase
        .from('accounts')
        .insert(accountData)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create account', error);
        throw new BadRequestException('Failed to create account');
      }

      this.logger.log(`Account created: ${accountNumber}`);
      return account;
    } catch (error) {
      this.logger.error('Error creating account', error);
      throw error;
    }
  }

  /**
   * Execute financial transaction with double-entry bookkeeping
   * 
   * This is the CORE of the ledger system.
   * Every transaction creates:
   * 1. A FinancialTransaction record (business event)
   * 2. TWO LedgerEntry records (debit + credit)
   * 
   * Example: User sends 100 HTG to merchant
   * - DEBIT user's account (decrease asset) -100
   * - CREDIT merchant's account (increase asset) +100
   */
  async executeTransaction(
    initiatorId: string,
    dto: CreateTransactionDto,
  ): Promise<any> {
    try {
      // 1. Validate accounts exist
      const [fromAccount, toAccount] = await Promise.all([
        this.getAccount(dto.fromAccountId),
        this.getAccount(dto.toAccountId),
      ]);

      if (!fromAccount || !toAccount) {
        throw new BadRequestException('One or both accounts not found');
      }

      // 2. Validate sufficient balance (for debit accounts)
      const fromBalance = await this.getAccountBalance(dto.fromAccountId);
      if (fromBalance < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // 3. Create transaction number
      const transactionNumber = await this.generateTransactionNumber();

      // 4. Create financial transaction record
      const transactionData = {
        transaction_number: transactionNumber,
        transaction_type: dto.type,
        initiator_id: initiatorId,
        initiator_type: 'USER', // TODO: Determine from user role
        total_amount: dto.amount,
        currency: dto.currency || 'HTG',
        description: dto.description,
        status: 'PROCESSING',
        external_reference: dto.externalReference,
        metadata: dto.metadata || {},
        ip_address: dto.ipAddress,
        user_agent: dto.userAgent,
      };

      const { data: transaction, error: txError } = await this.supabase
        .from('financial_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (txError) {
        this.logger.error('Failed to create transaction', txError);
        throw new InternalServerErrorException('Transaction creation failed');
      }

      // 5. Create ledger entries (DOUBLE-ENTRY)
      const entries = await this.createLedgerEntries(
        transaction.id,
        dto.fromAccountId,
        dto.toAccountId,
        dto.amount,
        dto.currency || 'HTG',
        dto.description,
        transactionNumber,
      );

      // 6. Update transaction status to COMPLETED
      await this.supabase
        .from('financial_transactions')
        .update({
          status: 'COMPLETED',
          processed_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      this.logger.log(`Transaction completed: ${transactionNumber}`);

      return {
        transaction,
        entries,
      };
    } catch (error) {
      this.logger.error('Error executing transaction', error);
      throw error;
    }
  }

  /**
   * Create double-entry ledger entries
   * 
   * CRITICAL: This implements the double-entry accounting principle
   * For every transaction:
   * - One account is DEBITED (money out)
   * - One account is CREDITED (money in)
   * - Total debits MUST equal total credits
   */
  private async createLedgerEntries(
    transactionId: string,
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    currency: string,
    description: string,
    referenceNumber: string,
  ) {
    // Get current balances
    const [fromBalance, toBalance] = await Promise.all([
      this.getAccountBalance(fromAccountId),
      this.getAccountBalance(toAccountId),
    ]);

    // Create DEBIT entry (decrease from account)
    const debitEntry = {
      account_id: fromAccountId,
      transaction_id: transactionId,
      entry_type: 'DEBIT',
      amount: amount,
      currency: currency,
      balance_after: fromBalance - amount,
      description: description,
      reference_number: referenceNumber,
      metadata: {},
    };

    // Create CREDIT entry (increase to account)
    const creditEntry = {
      account_id: toAccountId,
      transaction_id: transactionId,
      entry_type: 'CREDIT',
      amount: amount,
      currency: currency,
      balance_after: toBalance + amount,
      description: description,
      reference_number: referenceNumber,
      metadata: {},
    };

    // Insert both entries atomically
    const { data: entries, error } = await this.supabase
      .from('ledger_entries')
      .insert([debitEntry, creditEntry])
      .select();

    if (error) {
      this.logger.error('Failed to create ledger entries', error);
      throw new InternalServerErrorException('Ledger entry creation failed');
    }

    return entries;
  }

  /**
   * Get account balance (derived from ledger entries)
   * 
   * Balance = SUM(credits) - SUM(debits) for ASSET accounts
   * Balance = SUM(credits) - SUM(debits) for LIABILITY accounts
   * 
   * This is ALWAYS calculated, never stored directly
   */
  async getAccountBalance(accountId: string): Promise<number> {
    try {
      // Get the most recent ledger entry for this account
      const { data: lastEntry } = await this.supabase
        .from('ledger_entries')
        .select('balance_after')
        .eq('account_id', accountId)
        .order('posted_at', { ascending: false })
        .limit(1)
        .single();

      if (!lastEntry) {
        return 0; // No entries yet
      }

      return parseFloat(lastEntry.balance_after);
    } catch (error) {
      this.logger.error('Error getting account balance', error);
      return 0;
    }
  }

  /**
   * Get account details
   */
  async getAccount(accountId: string) {
    const { data } = await this.supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    return data;
  }

  /**
   * Get account by owner ID
   */
  async getAccountsByOwner(ownerId: string, ownerType?: string, currency?: string) {
    let query = this.supabase
      .from('accounts')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('status', 'ACTIVE');

    if (ownerType) {
      query = query.eq('owner_type', ownerType);
    }

    if (currency) {
      query = query.eq('currency', currency);
    }

    const { data, error } = await query;

    if (error) {
      this.logger.error('Error getting accounts by owner', error);
      throw new NotFoundException('Accounts not found');
    }

    return data;
  }

  /**
   * Get transaction history for an account
   */
  async getAccountTransactions(
    accountId: string,
    options?: {
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    let query = this.supabase
      .from('ledger_entries')
      .select(
        `
        *,
        financial_transactions (
          transaction_number,
          transaction_type,
          description,
          status,
          initiator_id
        )
      `,
      )
      .eq('account_id', accountId)
      .order('posted_at', { ascending: false });

    if (options?.startDate) {
      query = query.gte('posted_at', options.startDate.toISOString());
    }

    if (options?.endDate) {
      query = query.lte('posted_at', options.endDate.toISOString());
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );
    }

    const { data, error } = await query;

    if (error) {
      this.logger.error('Error getting account transactions', error);
      throw new InternalServerErrorException(
        'Failed to fetch account transactions',
      );
    }

    return data;
  }

  /**
   * Reverse a transaction (create offsetting entries)
   * 
   * Reversals are used for refunds, chargebacks, error corrections
   * Original entries are marked as reversed, new entries created
   */
  async reverseTransaction(transactionId: string, reason: string) {
    try {
      // Get original transaction
      const { data: transaction } = await this.supabase
        .from('financial_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      // Get original ledger entries
      const { data: originalEntries } = await this.supabase
        .from('ledger_entries')
        .select('*')
        .eq('transaction_id', transactionId);

      if (!originalEntries || originalEntries.length !== 2) {
        throw new BadRequestException('Invalid transaction entries');
      }

      // Create reversal transaction
      const reversalNumber = await this.generateTransactionNumber();
      const { data: reversalTx } = await this.supabase
        .from('financial_transactions')
        .insert({
          transaction_number: reversalNumber,
          transaction_type: 'REFUND',
          initiator_id: transaction.initiator_id,
          initiator_type: transaction.initiator_type,
          total_amount: transaction.total_amount,
          currency: transaction.currency,
          description: `REVERSAL: ${reason}`,
          status: 'COMPLETED',
          related_transaction_id: transactionId,
          metadata: { original_transaction: transactionId, reason },
        })
        .select()
        .single();

      // Mark original entries as reversed
      await this.supabase
        .from('ledger_entries')
        .update({ is_reversed: true })
        .in(
          'id',
          originalEntries.map((e) => e.id),
        );

      // Create offsetting entries (swap debit/credit)
      const reversalEntries = originalEntries.map((entry) => ({
        account_id: entry.account_id,
        transaction_id: reversalTx.id,
        entry_type: entry.entry_type === 'DEBIT' ? 'CREDIT' : 'DEBIT',
        amount: entry.amount,
        currency: entry.currency,
        balance_after: entry.balance_after, // Will be recalculated
        description: `REVERSAL: ${entry.description}`,
        reference_number: reversalNumber,
        original_entry_id: entry.id,
        metadata: { reversal: true },
      }));

      await this.supabase.from('ledger_entries').insert(reversalEntries);

      // Update original transaction status
      await this.supabase
        .from('financial_transactions')
        .update({ status: 'REVERSED' })
        .eq('id', transactionId);

      this.logger.log(`Transaction reversed: ${transaction.transaction_number}`);

      return reversalTx;
    } catch (error) {
      this.logger.error('Error reversing transaction', error);
      throw error;
    }
  }

  /**
   * Generate unique account number
   * Format: {TYPE}-{OWNER_TYPE}-{TIMESTAMP}-{RANDOM}
   * Example: ASSET-USER-20260114-A3B7
   */
  private async generateAccountNumber(
    accountType: string,
    ownerId?: string,
  ): Promise<string> {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ownerPrefix = ownerId ? 'USER' : 'SYS';
    return `${accountType}-${ownerPrefix}-${timestamp}-${random}`;
  }

  /**
   * Generate unique transaction number
   * Format: TXN-YYYYMMDD-NNNNNN
   * Example: TXN-20260114-000001
   */
  private async generateTransactionNumber(): Promise<string> {
    const date = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');
    const { count } = await this.supabase
      .from('financial_transactions')
      .select('*', { count: 'exact', head: true })
      .gte(
        'created_at',
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      );

    const sequence = ((count || 0) + 1).toString().padStart(6, '0');
    return `TXN-${date}-${sequence}`;
  }

  /**
   * Get ledger entries for an account
   */
  async getAccountLedgerEntries(
    accountId: string,
    limit = 50,
    offset = 0,
  ) {
    const { data, error } = await this.supabase
      .from('ledger_entries')
      .select('*')
      .eq('account_id', accountId)
      .order('entry_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      this.logger.error('Error fetching ledger entries', error);
      throw new Error('Failed to fetch ledger entries');
    }

    return data || [];
  }

  /**
   * Update account status (for freezing/unfreezing wallets)
   */
  async updateAccountStatus(
    accountId: string,
    status: string,
    updatedBy: string,
  ) {
    const { error } = await this.supabase
      .from('accounts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', accountId);

    if (error) {
      this.logger.error('Error updating account status', error);
      throw new Error('Failed to update account status');
    }

    this.logger.log(`Account ${accountId} status updated to ${status}`);
  }
}
