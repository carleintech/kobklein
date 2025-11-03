import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentStatus, TransactionType } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessStripePaymentDto } from './dto/process-stripe-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private walletsService: WalletsService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async create(createPaymentDto: CreatePaymentDto, userId: string) {
    try {
      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          ...createPaymentDto,
          userId,
          status: PaymentStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return payment;
    } catch (error) {
      throw new HttpException(
        `Failed to create payment: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async processStripePayment(
    paymentDto: ProcessStripePaymentDto,
    userId: string,
  ) {
    try {
      // Create Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(paymentDto.amount * 100), // Convert to cents
        currency: paymentDto.currency.toLowerCase(),
        payment_method: paymentDto.paymentMethodId,
        confirm: true,
        metadata: {
          userId,
          description: paymentDto.description || '',
        },
        return_url: process.env.STRIPE_RETURN_URL,
      });

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          userId,
          amount: paymentDto.amount,
          currency: paymentDto.currency,
          method: PaymentMethod.STRIPE,
          status: PaymentStatus.PENDING,
          stripePaymentIntentId: paymentIntent.id,
          description: paymentDto.description,
          metadata: JSON.stringify({
            stripePaymentIntent: paymentIntent.id,
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // If payment successful, update wallet balance
      if (paymentIntent.status === 'succeeded') {
        await this.confirmPayment(payment.id, userId);
      }

      return {
        payment,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      };
    } catch (error) {
      throw new HttpException(
        `Payment processing failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async confirmPayment(paymentId: string, userId: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
        include: { user: true },
      });

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      if (payment.userId !== userId) {
        throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
      }

      // Update payment status
      const updatedPayment = await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.COMPLETED,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Add funds to user's wallet
      const wallet = await this.walletsService.findUserWallet(
        userId,
        payment.currency,
      );

      if (wallet) {
        await this.walletsService.updateBalance(
          wallet.id,
          payment.amount,
          'add',
        );
      } else {
        // Create new wallet if doesn't exist
        await this.walletsService.create({
          userId,
          currency: payment.currency,
          balance: payment.amount,
          isDefault: true,
        });
      }

      // Create transaction record
      await this.prisma.transaction.create({
        data: {
          senderId: userId,
          receiverId: userId,
          amount: payment.amount,
          currency: payment.currency,
          type: TransactionType.DEPOSIT,
          status: PaymentStatus.COMPLETED,
          description: `Deposit via ${payment.method}`,
          reference: payment.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return updatedPayment;
    } catch (error) {
      throw new HttpException(
        `Payment confirmation failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleStripeWebhook(signature: string, payload: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handleSuccessfulPayment(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handleFailedPayment(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      throw new HttpException(
        `Webhook error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment && payment.status === PaymentStatus.PENDING) {
      await this.confirmPayment(payment.id, payment.userId);
    }
  }

  private async handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          updatedAt: new Date(),
        },
      });
    }
  }

  async findAll(options: {
    userId?: string;
    page?: number;
    limit?: number;
    status?: PaymentStatus;
    method?: PaymentMethod;
  }) {
    const { userId, page = 1, limit = 20, status, method } = options;

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (method) where.method = method;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, userId: string) {
    const payment = await this.findOne(id);

    // Only admins can update payments or the payment owner for certain fields
    if (payment.userId !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.payment.update({
      where: { id },
      data: {
        ...updatePaymentDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string, userId: string) {
    const payment = await this.findOne(id);

    if (payment.userId !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.payment.delete({
      where: { id },
    });
  }

  async getPaymentAnalytics(options: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
  }) {
    const { userId, startDate, endDate, groupBy = 'day' } = options;

    const where: any = {};
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Get payment statistics
    const [totalPayments, successfulPayments, failedPayments, totalVolume] =
      await Promise.all([
        this.prisma.payment.count({ where }),
        this.prisma.payment.count({
          where: { ...where, status: PaymentStatus.COMPLETED },
        }),
        this.prisma.payment.count({
          where: { ...where, status: PaymentStatus.FAILED },
        }),
        this.prisma.payment.aggregate({
          where: { ...where, status: PaymentStatus.COMPLETED },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalPayments,
      successfulPayments,
      failedPayments,
      successRate:
        totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
      totalVolume: totalVolume._sum.amount || 0,
    };
  }
}
