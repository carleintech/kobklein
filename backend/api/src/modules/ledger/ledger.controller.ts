import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LedgerService } from './ledger.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Ledger')
@Controller('ledger')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class LedgerController {
  private readonly logger = new Logger(LedgerController.name);

  constructor(private readonly ledgerService: LedgerService) {}

  // ==================== ACCOUNTS ====================

  @Post('accounts')
  @ApiOperation({
    summary: 'Create account',
    description: 'Create a new financial account (wallet, revenue account, etc.)',
  })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid account data' })
  async createAccount(@Body() dto: CreateAccountDto, @Request() req: any) {
    try {
      const account = await this.ledgerService.createAccount(dto);
      return {
        success: true,
        data: { account },
        message: 'Account created successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error creating account', error);
      throw new HttpException(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create account',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('accounts/owner/:ownerId')
  @ApiOperation({
    summary: 'Get accounts by owner',
    description: 'Retrieve all accounts for a specific owner',
  })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  async getAccountsByOwner(
    @Param('ownerId') ownerId: string,
    @Query('currency') currency?: string,
  ) {
    try {
      const accounts = await this.ledgerService.getAccountsByOwner(
        ownerId,
        currency,
      );
      return {
        success: true,
        data: { accounts },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting accounts', error);
      throw new HttpException(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to get accounts',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('accounts/:accountId/balance')
  @ApiOperation({
    summary: 'Get account balance',
    description: 'Get current balance (derived from ledger entries)',
  })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getAccountBalance(@Param('accountId') accountId: string) {
    try {
      const balance = await this.ledgerService.getAccountBalance(accountId);
      return {
        success: true,
        data: { balance, accountId },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting balance', error);
      throw new HttpException(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to get balance',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('accounts/:accountId/transactions')
  @ApiOperation({
    summary: 'Get account transactions',
    description: 'Retrieve transaction history for an account',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  async getAccountTransactions(
    @Param('accountId') accountId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    try {
      const transactions = await this.ledgerService.getAccountTransactions(
        accountId,
        {
          limit: limit ? parseInt(String(limit)) : 50,
          offset: offset ? parseInt(String(offset)) : 0,
        },
      );
      return {
        success: true,
        data: { transactions },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting transactions', error);
      throw new HttpException(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to get transactions',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== TRANSACTIONS ====================

  @Post('transactions')
  @ApiOperation({
    summary: 'Execute transaction',
    description:
      'Execute a financial transaction with double-entry bookkeeping',
  })
  @ApiResponse({ status: 201, description: 'Transaction executed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid transaction data' })
  async executeTransaction(@Body() dto: CreateTransactionDto, @Request() req: any) {
    try {
      const userId = req.user.id;
      const result = await this.ledgerService.executeTransaction(userId, dto);
      return {
        success: true,
        data: result,
        message: 'Transaction executed successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error executing transaction', error);
      throw new HttpException(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to execute transaction',
          timestamp: new Date().toISOString(),
        },
        (error as any)?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('transactions/:transactionId/reverse')
  @ApiOperation({
    summary: 'Reverse transaction',
    description: 'Reverse a completed transaction (refund, chargeback, etc.)',
  })
  @ApiResponse({ status: 200, description: 'Transaction reversed successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async reverseTransaction(
    @Param('transactionId') transactionId: string,
    @Body('reason') reason: string,
  ) {
    try {
      const reversal = await this.ledgerService.reverseTransaction(
        transactionId,
        reason,
      );
      return {
        success: true,
        data: { reversal },
        message: 'Transaction reversed successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error reversing transaction', error);
      throw new HttpException(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to reverse transaction',
          timestamp: new Date().toISOString(),
        },
        (error as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
