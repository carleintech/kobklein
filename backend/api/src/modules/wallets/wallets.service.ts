import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { LedgerService } from '../ledger/ledger.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

/**
 * Wallet Service - High-level wallet management built on ledger system
 * 
 * This service provides a user-friendly interface for wallet operations while
 * delegating all financial accounting to the double-entry ledger system.
 * 
 * Key Principle: Wallets are just ASSET accounts in the ledger with user ownership.
 * Balance is ALWAYS derived from ledger entries, never stored directly.
 */
@Injectable()
export class WalletsService {
  private readonly logger = new Logger(WalletsService.name);

  constructor(private readonly ledgerService: LedgerService) {}

  /**
   * Create a new wallet for a user
   * Creates an ASSET account in the ledger system
   */
  async createWallet(createWalletDto: CreateWalletDto) {
    const { userId, currency = 'HTG', walletName } = createWalletDto;

    this.logger.log(`Creating wallet for user ${userId} in ${currency}`);

    try {
      // Create ASSET account in ledger (this IS the wallet)
      const account = await this.ledgerService.createAccount({
        accountName: walletName || `User Wallet (${currency})`,
        accountType: 'ASSET' as any,
        ownerType: 'USER' as any,
        ownerId: userId,
        currency: currency,
        notes: `Personal wallet for user ${userId}`,
      });

      return {
        walletId: account.id,
        accountNumber: account.account_number,
        userId,
        currency: account.currency,
        status: account.status,
        balance: 0, // New wallets start at 0
        createdAt: account.created_at,
      };
    } catch (error) {
      this.logger.error(`Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException('Failed to create wallet');
    }
  }

  /**
   * Get wallet balance - ALWAYS derived from ledger entries
   * Never trust a stored balance field
   */
  async getWalletBalance(walletId: string) {
    this.logger.debug(`Fetching balance for wallet ${walletId}`);

    try {
      // Get balance from ledger entries (the single source of truth)
      const balance = await this.ledgerService.getAccountBalance(walletId);
      const account = await this.ledgerService.getAccount(walletId);

      return {
        walletId: account.id,
        accountNumber: account.account_number,
        balance,
        currency: account.currency,
        status: account.status,
        lastUpdated: new Date(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Wallet ${walletId} not found`);
      }
      throw error;
    }
  }

  /**
   * Get all wallets for a user
   */
  async getUserWallets(userId: string) {
    this.logger.debug(`Fetching wallets for user ${userId}`);

    try {
      // Get all ASSET accounts owned by this user
      const accounts = await this.ledgerService.getAccountsByOwner(userId, 'INDIVIDUAL');

      // Get balance for each wallet
      const wallets = await Promise.all(
        accounts.map(async (account) => {
          const balance = await this.ledgerService.getAccountBalance(account.id);
          return {
            walletId: account.id,
            accountNumber: account.account_number,
            accountName: account.account_name,
            balance,
            currency: account.currency,
            status: account.status,
            createdAt: account.created_at,
          };
        }),
      );

      return wallets;
    } catch (error) {
      this.logger.error(`Failed to fetch user wallets: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException('Failed to fetch wallets');
    }
  }

  /**
   * Transfer money between wallets (P2P transfer)
   * This creates a financial transaction in the ledger
   */
  async transferBetweenWallets(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    description: string,
    userId: string,
  ) {
    this.logger.log(`Transfer: ${fromWalletId} -> ${toWalletId}, amount: ${amount}`);

    // Validate wallets exist and belong to user
    const fromWallet = await this.ledgerService.getAccount(fromWalletId);
    const toWallet = await this.ledgerService.getAccount(toWalletId);

    if (fromWallet.owner_id !== userId) {
      throw new BadRequestException('You do not own the source wallet');
    }

    // Currency check
    if (fromWallet.currency !== toWallet.currency) {
      throw new BadRequestException('Cross-currency transfers not yet supported');
    }

    // Check sufficient balance
    const balance = await this.ledgerService.getAccountBalance(fromWalletId);
    if (balance < amount) {
      throw new BadRequestException(`Insufficient balance. Available: ${balance}, Required: ${amount}`);
    }

    // Execute transfer through ledger (double-entry bookkeeping)
    const transaction = await this.ledgerService.executeTransaction(userId, {
      type: 'TRANSFER' as any,
      fromAccountId: fromWalletId,
      toAccountId: toWalletId,
      amount,
      currency: fromWallet.currency,
      description,
    });

    return {
      transactionId: transaction.id,
      transactionNumber: transaction.transaction_number,
      fromWalletId,
      toWalletId,
      amount,
      currency: transaction.currency,
      status: transaction.status,
      executedAt: transaction.executed_at,
    };
  }

  /**
   * Get wallet transaction history
   */
  async getWalletTransactions(walletId: string, limit = 50, offset = 0) {
    this.logger.debug(`Fetching transactions for wallet ${walletId}`);

    try {
      const entries = await this.ledgerService.getAccountLedgerEntries(walletId, limit, offset);

      return {
        walletId,
        transactions: entries.map((entry) => ({
          entryId: entry.id,
          entryNumber: entry.entry_number,
          transactionId: entry.financial_transaction_id,
          type: entry.entry_type,
          amount: entry.amount,
          balanceAfter: entry.balance_after,
          description: entry.description,
          date: entry.entry_date,
        })),
        pagination: {
          limit,
          offset,
          hasMore: entries.length === limit,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException('Failed to fetch transaction history');
    }
  }

  /**
   * Freeze/unfreeze a wallet (compliance)
   */
  async freezeWallet(walletId: string, reason: string, adminId: string) {
    this.logger.warn(`Freezing wallet ${walletId}. Reason: ${reason}`);

    try {
      await this.ledgerService.updateAccountStatus(walletId, 'FROZEN', adminId);
      return { walletId, status: 'FROZEN', reason };
    } catch (error) {
      this.logger.error(`Failed to freeze wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException('Failed to freeze wallet');
    }
  }

  async unfreezeWallet(walletId: string, adminId: string) {
    this.logger.log(`Unfreezing wallet ${walletId}`);

    try {
      await this.ledgerService.updateAccountStatus(walletId, 'ACTIVE', adminId);
      return { walletId, status: 'ACTIVE' };
    } catch (error) {
      this.logger.error(`Failed to unfreeze wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException('Failed to unfreeze wallet');
    }
  }
}
