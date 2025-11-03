import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionStatus, TransactionType, UserRole, Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const { fromWalletId, toWalletId, amount, currency, type } = createTransactionDto;

    // Validate wallets exist and user has access
    const fromWallet = await this.prisma.wallet.findFirst({
      where: { id: fromWalletId, userId },
    });

    if (!fromWallet) {
      throw new NotFoundException('Source wallet not found');
    }

    const toWallet = await this.prisma.wallet.findUnique({
      where: { id: toWalletId },
    });

    if (!toWallet) {
      throw new NotFoundException('Destination wallet not found');
    }

    // Check sufficient balance
    if (fromWallet.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Start transaction
    return this.prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          ...createTransactionDto,
          status: TransactionStatus.PENDING,
          userId,
        },
      });

      // Update wallet balances
      await tx.wallet.update({
        where: { id: fromWalletId },
        data: { balance: { decrement: amount } },
      });

      await tx.wallet.update({
        where: { id: toWalletId },
        data: { balance: { increment: amount } },
      });

      // Update transaction status
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.COMPLETED },
      });

      return transaction;
    });
  }

  async findAll(userId: string, filters?: any) {
    const where: Prisma.TransactionWhereInput = {
      OR: [
        { userId },
        { fromWallet: { userId } },
        { toWallet: { userId } },
      ],
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.currency) {
      where.currency = filters.currency;
    }

    return this.prisma.transaction.findMany({
      where,
      include: {
        fromWallet: {
          select: { id: true, name: true, currency: true },
        },
        toWallet: {
          select: { id: true, name: true, currency: true },
        },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { fromWallet: { userId } },
          { toWallet: { userId } },
        ],
      },
      include: {
        fromWallet: true,
        toWallet: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string) {
    const transaction = await this.findOne(id, userId);

    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed transaction');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  async cancel(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending transactions');
    }

    return this.prisma.$transaction(async (tx) => {
      // Reverse the transaction
      if (transaction.status === TransactionStatus.PENDING) {
        await tx.wallet.update({
          where: { id: transaction.fromWalletId },
          data: { balance: { increment: transaction.amount } },
        });

        await tx.wallet.update({
          where: { id: transaction.toWalletId },
          data: { balance: { decrement: transaction.amount } },
        });
      }

      // Update transaction status
      return tx.transaction.update({
        where: { id },
        data: {
          status: TransactionStatus.CANCELLED,
          updatedAt: new Date(),
        },
      });
    });
  }

  async getTransactionStats(userId: string, timeframe: 'day' | 'week' | 'month' | 'year') {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
        status: TransactionStatus.COMPLETED,
      },
    });

    const stats = {
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      byType: {} as Record<string, number>,
      byCurrency: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
    };

    transactions.forEach((t) => {
      stats.byType[t.type] = (stats.byType[t.type] || 0) + 1;
      stats.byCurrency[t.currency] = (stats.byCurrency[t.currency] || 0) + t.amount;
      stats.byStatus[t.status] = (stats.byStatus[t.status] || 0) + 1;
    });

    return stats;
  }
}