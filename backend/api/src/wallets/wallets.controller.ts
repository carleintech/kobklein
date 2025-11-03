import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletsService } from './wallets.service';

@ApiTags('Wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  @Roles(UserRole.CLIENT, UserRole.MERCHANT, UserRole.DISTRIBUTOR)
  create(@Body() createWalletDto: CreateWalletDto, @Request() req) {
    return this.walletsService.create(createWalletDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wallets for user' })
  findAll(@Request() req, @Query('currency') currency?: string) {
    return this.walletsService.findAllByUser(req.user.id, currency);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wallet by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.walletsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update wallet' })
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Request() req,
  ) {
    return this.walletsService.update(id, updateWalletDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete wallet' })
  remove(@Param('id') id: string, @Request() req) {
    return this.walletsService.remove(id, req.user.id);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer funds between wallets' })
  @Roles(UserRole.CLIENT, UserRole.MERCHANT, UserRole.DISTRIBUTOR)
  transferFunds(@Body() transferFundsDto: TransferFundsDto, @Request() req) {
    return this.walletsService.transferFunds(transferFundsDto, req.user.id);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  getBalance(@Param('id') id: string, @Request() req) {
    return this.walletsService.getBalance(id, req.user.id);
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  getTransactions(
    @Param('id') id: string,
    @Request() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.walletsService.getTransactionHistory(
      id,
      req.user.id,
      limit || 10,
      offset || 0,
    );
  }
}
