import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            receiver: {
              select: {
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: {
        balance: true,
        currency: true,
        frozenBalance: true,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      balance: wallet.balance,
      availableBalance: wallet.balance - (wallet.frozenBalance || 0),
      frozenBalance: wallet.frozenBalance || 0,
      currency: wallet.currency,
    };
  }

  async addFunds(userId: string, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Use transaction to ensure consistency
    return this.prisma.$transaction(async (prisma) => {
      // Update wallet balance
      const updatedWallet = await prisma.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          senderId: userId, // Self-funding
          receiverId: userId,
          amount,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          description: description || 'Funds added to wallet',
          balanceAfter: updatedWallet.balance,
        },
      });

      return updatedWallet;
    });
  }

  async withdrawFunds(userId: string, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const availableBalance = wallet.balance - (wallet.frozenBalance || 0);
    if (availableBalance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Use transaction to ensure consistency
    return this.prisma.$transaction(async (prisma) => {
      // Update wallet balance
      const updatedWallet = await prisma.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          senderId: userId,
          receiverId: userId, // Self-withdrawal
          amount,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.COMPLETED,
          description: description || 'Funds withdrawn from wallet',
          balanceAfter: updatedWallet.balance,
        },
      });

      return updatedWallet;
    });
  }

  async transfer(
    fromUserId: string,
    toUserId: string,
    amount: number,
    description?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    if (fromUserId === toUserId) {
      throw new BadRequestException('Cannot transfer to same wallet');
    }

    const [senderWallet, receiverWallet] = await Promise.all([
      this.prisma.wallet.findUnique({ where: { userId: fromUserId } }),
      this.prisma.wallet.findUnique({ where: { userId: toUserId } }),
    ]);

    if (!senderWallet) {
      throw new NotFoundException('Sender wallet not found');
    }

    if (!receiverWallet) {
      throw new NotFoundException('Receiver wallet not found');
    }

    const availableBalance =
      senderWallet.balance - (senderWallet.frozenBalance || 0);
    if (availableBalance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Use transaction to ensure consistency
    return this.prisma.$transaction(async (prisma) => {
      // Update sender wallet
      const updatedSenderWallet = await prisma.wallet.update({
        where: { userId: fromUserId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Update receiver wallet
      const updatedReceiverWallet = await prisma.wallet.update({
        where: { userId: toUserId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          senderId: fromUserId,
          receiverId: toUserId,
          amount,
          type: TransactionType.TRANSFER,
          status: TransactionStatus.COMPLETED,
          description: description || 'Wallet to wallet transfer',
          balanceAfter: updatedSenderWallet.balance,
        },
        include: {
          sender: {
            select: {
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          receiver: {
            select: {
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return {
        transaction,
        senderWallet: updatedSenderWallet,
        receiverWallet: updatedReceiverWallet,
      };
    });
  }

  async freezeAmount(userId: string, amount: number, reason?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const availableBalance = wallet.balance - (wallet.frozenBalance || 0);
    if (availableBalance < amount) {
      throw new BadRequestException('Insufficient available funds to freeze');
    }

    return this.prisma.wallet.update({
      where: { userId },
      data: {
        frozenBalance: {
          increment: amount,
        },
      },
    });
  }

  async unfreezeAmount(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if ((wallet.frozenBalance || 0) < amount) {
      throw new BadRequestException('Insufficient frozen funds');
    }

    return this.prisma.wallet.update({
      where: { userId },
      data: {
        frozenBalance: {
          decrement: amount,
        },
      },
    });
  }

  async getTransactionHistory(
    userId: string,
    params?: {
      skip?: number;
      take?: number;
      type?: TransactionType;
      status?: TransactionStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const { skip, take, type, status, startDate, endDate } = params || {};

    const where: Prisma.TransactionWhereInput = {
      OR: [{ senderId: userId }, { receiverId: userId }],
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take,
        include: {
          sender: {
            select: {
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          receiver: {
            select: {
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      total,
      page: skip ? Math.floor(skip / (take || 10)) + 1 : 1,
      pageSize: take || 10,
    };
  }

  async getWalletStats(userId: string) {
    const [
      totalSent,
      totalReceived,
      totalDeposits,
      totalWithdrawals,
      transactionCount,
    ] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          senderId: userId,
          status: TransactionStatus.COMPLETED,
          type: TransactionType.TRANSFER,
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.transaction.aggregate({
        where: {
          receiverId: userId,
          status: TransactionStatus.COMPLETED,
          type: TransactionType.TRANSFER,
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.transaction.aggregate({
        where: {
          receiverId: userId,
          status: TransactionStatus.COMPLETED,
          type: TransactionType.DEPOSIT,
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.transaction.aggregate({
        where: {
          senderId: userId,
          status: TransactionStatus.COMPLETED,
          type: TransactionType.WITHDRAWAL,
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.transaction.count({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      }),
    ]);

    return {
      totalSent: totalSent._sum.amount || 0,
      totalReceived: totalReceived._sum.amount || 0,
      totalDeposits: totalDeposits._sum.amount || 0,
      totalWithdrawals: totalWithdrawals._sum.amount || 0,
      transactionCount,
      sentCount: totalSent._count,
      receivedCount: totalReceived._count,
    };
  }
}
