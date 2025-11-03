import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles(Role.CLIENT, Role.MERCHANT, Role.DISTRIBUTOR, Role.DIASPORA)
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: any,
  ) {
    try {
      return await this.transactionsService.create(
        createTransactionDto,
        req.user.id,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('transfer')
  @Roles(Role.CLIENT, Role.MERCHANT, Role.DISTRIBUTOR, Role.DIASPORA)
  async transferFunds(
    @Body() transferFundsDto: TransferFundsDto,
    @Request() req: any,
  ) {
    try {
      return await this.transactionsService.transferFunds(
        transferFundsDto,
        req.user.id,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Transfer failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @Roles(
    Role.CLIENT,
    Role.MERCHANT,
    Role.DISTRIBUTOR,
    Role.DIASPORA,
    Role.ADMIN,
  )
  async findAll(@Request() req: any, @Query() query: any) {
    const { page = 1, limit = 20, status, type } = query;

    // Admins can see all transactions, others see only their own
    const userId = req.user.role === Role.ADMIN ? undefined : req.user.id;

    return await this.transactionsService.findAll({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      type,
    });
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.DISTRIBUTOR)
  async findUserTransactions(
    @Param('userId') userId: string,
    @Query() query: any,
  ) {
    const { page = 1, limit = 20, status, type } = query;

    return await this.transactionsService.findAll({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      type,
    });
  }

  @Get('analytics')
  @Roles(Role.ADMIN, Role.DISTRIBUTOR, Role.MERCHANT)
  async getAnalytics(@Request() req: any, @Query() query: any) {
    const { startDate, endDate, groupBy = 'day' } = query;

    // Merchants and distributors see only their own analytics
    const userId = req.user.role === Role.ADMIN ? undefined : req.user.id;

    return await this.transactionsService.getAnalytics({
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      groupBy,
    });
  }

  @Get(':id')
  @Roles(
    Role.CLIENT,
    Role.MERCHANT,
    Role.DISTRIBUTOR,
    Role.DIASPORA,
    Role.ADMIN,
  )
  async findOne(@Param('id') id: string, @Request() req: any) {
    const transaction = await this.transactionsService.findOne(id);

    // Check ownership or admin role
    if (
      req.user.role !== Role.ADMIN &&
      transaction.senderId !== req.user.id &&
      transaction.receiverId !== req.user.id
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return transaction;
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DISTRIBUTOR)
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: any,
  ) {
    try {
      return await this.transactionsService.update(
        id,
        updateTransactionDto,
        req.user.id,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.DISTRIBUTOR)
  async approveTransaction(@Param('id') id: string, @Request() req: any) {
    try {
      return await this.transactionsService.approveTransaction(id, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to approve transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN, Role.DISTRIBUTOR)
  async rejectTransaction(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    try {
      return await this.transactionsService.rejectTransaction(
        id,
        reason,
        req.user.id,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to reject transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @Request() req: any) {
    return await this.transactionsService.remove(id, req.user.id);
  }
}
