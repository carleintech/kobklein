import { Controller, Post, Get, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  async createWallet(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.createWallet(createWalletDto);
  }

  @Get(':walletId/balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getBalance(@Param('walletId') walletId: string) {
    return this.walletsService.getWalletBalance(walletId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all wallets for a user' })
  @ApiResponse({ status: 200, description: 'Wallets retrieved successfully' })
  async getUserWallets(@Param('userId') userId: string) {
    return this.walletsService.getUserWallets(userId);
  }

  @Get(':walletId/transactions')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async getTransactions(
    @Param('walletId') walletId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.walletsService.getWalletTransactions(
      walletId,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transfer money between wallets' })
  @ApiResponse({ status: 200, description: 'Transfer completed successfully' })
  async transfer(
    @Body()
    transferDto: {
      fromWalletId: string;
      toWalletId: string;
      amount: number;
      description: string;
      userId: string;
    },
  ) {
    return this.walletsService.transferBetweenWallets(
      transferDto.fromWalletId,
      transferDto.toWalletId,
      transferDto.amount,
      transferDto.description,
      transferDto.userId,
    );
  }
}
