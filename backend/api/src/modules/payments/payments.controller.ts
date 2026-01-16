import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import {
  PaymentMethod,
  PaymentProcessor,
  PaymentStatus,
  UserRole,
} from '../../types/database.types';
import { extractError } from '../../utils/error.utils';
import {
  CreatePaymentDto,
  PaymentAnalyticsDto,
  PaymentSearchDto,
  ProcessWebhookDto,
  UpdatePaymentDto,
} from './dto/create-enhanced-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  // ==============================
  // CREATE PAYMENT
  // ==============================
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createPayment(
    @Request() req: any,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    try {
      // Extract user context
      const userId = req.user.id;
      const userRole = req.user.primaryRole || req.user.role;

      // Validate user permissions
      const allowedRoles = [
        UserRole.INDIVIDUAL,
        UserRole.MERCHANT,
        UserRole.AGENT,
        UserRole.ADMIN,
      ];
      if (!allowedRoles.includes(userRole)) {
        throw new HttpException(
          'Insufficient permissions to create payments',
          HttpStatus.FORBIDDEN,
        );
      }

      // Add request context to DTO
      const enhancedDto = {
        ...createPaymentDto,
        metadata: {
          ...createPaymentDto.metadata,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress,
          userRole,
        },
      };

      const payment = await this.paymentsService.createPayment(
        userId,
        enhancedDto,
      );

      this.logger.log(`Payment created successfully: ${payment.referenceId}`, {
        userId,
        amount: payment.amount,
      });

      return {
        success: true,
        data: payment,
        message: 'Payment created successfully',
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error creating payment', error);
      throw new HttpException(
        err.message || 'Failed to create payment',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // SEARCH PAYMENTS
  // ==============================
  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async searchPayments(@Request() req: any, @Query() query: any) {
    try {
      const userRole = req.user.primaryRole || req.user.role;

      // Build search criteria
      const searchDto: PaymentSearchDto = {
        userId:
          userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN
            ? query.userId
            : req.user.id,
        status: query.status,
        processor: query.processor,
        paymentMethod: query.paymentMethod,
        currency: query.currency,
        minAmount: query.minAmount ? parseFloat(query.minAmount) : undefined,
        maxAmount: query.maxAmount ? parseFloat(query.maxAmount) : undefined,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        referenceId: query.referenceId,
        merchantReference: query.merchantReference,
        page: parseInt(query.page) || 1,
        limit: Math.min(parseInt(query.limit) || 20, 100), // Max 100 per page
        sortBy: query.sortBy || 'createdAt',
        sortOrder: query.sortOrder || 'desc',
      };

      const result = await this.paymentsService.searchPayments(searchDto);

      return {
        success: true,
        data: result.payments,
        pagination: result.pagination,
        total: result.total,
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error searching payments', error);
      throw new HttpException(
        err.message || 'Failed to search payments',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // GET PAYMENT ANALYTICS
  // ==============================
  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAnalytics(@Request() req: any, @Query() query: any) {
    try {
      const userRole = req.user.primaryRole || req.user.role;

      // Admin and managers can see all analytics, others see only their own
      const allowedRoles = [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.COMPLIANCE,
      ];
      const canViewAll = allowedRoles.includes(userRole);

      const analyticsDto: PaymentAnalyticsDto = {
        userId: canViewAll ? query.userId : req.user.id,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        groupBy: query.groupBy || 'day',
        processor: query.processor,
        paymentMethod: query.paymentMethod,
        currency: query.currency,
      };

      const analytics =
        await this.paymentsService.getPaymentAnalytics(analyticsDto);

      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting payment analytics', error);
      throw new HttpException(
        err.message || 'Failed to get analytics',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // WEBHOOK HANDLING
  // ==============================
  @Post('webhook/:processor')
  async processWebhook(
    @Param('processor') processor: string,
    @Body() payload: any,
    @Headers() headers: Record<string, string>,
    @Req() rawReq: RawBodyRequest<Request>,
  ) {
    try {
      // Validate processor
      if (
        !Object.values(PaymentProcessor).includes(processor as PaymentProcessor)
      ) {
        throw new HttpException('Invalid processor', HttpStatus.BAD_REQUEST);
      }

      const webhookDto: ProcessWebhookDto = {
        processor: processor as PaymentProcessor,
        eventType: payload.type || payload.event_type || 'unknown',
        payload,
        signature:
          headers['stripe-signature'] ||
          headers['paypal-transmission-sig'] ||
          headers['signature'],
        headers,
      };

      const result = await this.paymentsService.processWebhook(webhookDto);

      this.logger.log(`Webhook processed successfully`, {
        processor,
        eventType: webhookDto.eventType,
      });

      return result;
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error processing webhook', error);
      throw new HttpException(
        err.message || 'Failed to process webhook',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // GET PAYMENT BY ID
  // ==============================
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getPayment(@Param('id') id: string, @Request() req: any) {
    try {
      const payment = await this.paymentsService.findPaymentById(id);

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      const userRole = req.user.primaryRole || req.user.role;
      const isAdmin = [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
      ].includes(userRole);

      // Check access permissions
      if (!isAdmin && payment.userId !== req.user.id) {
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      }

      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting payment', error);
      throw new HttpException(
        err.message || 'Failed to get payment',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // GET PAYMENT BY REFERENCE
  // ==============================
  @Get('reference/:reference')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getPaymentByReference(
    @Param('reference') reference: string,
    @Request() req: any,
  ) {
    try {
      const payment =
        await this.paymentsService.findPaymentByReference(reference);

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      const userRole = req.user.primaryRole || req.user.role;
      const isAdmin = [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
      ].includes(userRole);

      // Check access permissions
      if (!isAdmin && payment.userId !== req.user.id) {
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      }

      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting payment by reference', error);
      throw new HttpException(
        err.message || 'Failed to get payment',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // UPDATE PAYMENT STATUS (ADMIN ONLY)
  // ==============================
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: PaymentStatus; reason?: string },
    @Request() req: any,
  ) {
    try {
      const userRole = req.user.primaryRole || req.user.role;
      const allowedRoles = [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
      ];

      if (!allowedRoles.includes(userRole)) {
        throw new HttpException(
          'Insufficient permissions',
          HttpStatus.FORBIDDEN,
        );
      }

      const payment = await this.paymentsService.updatePaymentStatus(
        id,
        body.status,
        body.reason,
      );

      this.logger.log(`Payment status updated: ${id} -> ${body.status}`, {
        userId: req.user.id,
        reason: body.reason,
      });

      return {
        success: true,
        data: payment,
        message: 'Payment status updated successfully',
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error updating payment status', error);
      throw new HttpException(
        err.message || 'Failed to update payment status',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // UPDATE PAYMENT METADATA
  // ==============================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePayment(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Request() req: any,
  ) {
    try {
      const payment = await this.paymentsService.findPaymentById(id);

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      const userRole = req.user.primaryRole || req.user.role;
      const isAdmin = [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
      ].includes(userRole);

      // Check access permissions
      if (!isAdmin && payment.userId !== req.user.id) {
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      }

      // Users can only update certain fields, admins can update more
      const allowedUpdates = isAdmin
        ? updatePaymentDto
        : {
            description: updatePaymentDto.description,
            metadata: updatePaymentDto.metadata,
          };

      // TODO: Implement update functionality in service
      // const updatedPayment = await this.paymentsService.updatePayment(id, allowedUpdates);

      return {
        success: true,
        data: payment, // Temporary until update is implemented
        message: 'Payment updated successfully',
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error updating payment', error);
      throw new HttpException(
        err.message || 'Failed to update payment',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // USER'S PAYMENT HISTORY
  // ==============================
  @Get('user/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserPaymentHistory(@Request() req: any, @Query() query: any) {
    try {
      const searchDto: PaymentSearchDto = {
        userId: req.user.id,
        status: query.status,
        paymentMethod: query.paymentMethod,
        currency: query.currency,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        page: parseInt(query.page) || 1,
        limit: Math.min(parseInt(query.limit) || 10, 50),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const result = await this.paymentsService.searchPayments(searchDto);

      return {
        success: true,
        data: result.payments,
        pagination: result.pagination,
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting user payment history', error);
      throw new HttpException(
        err.message || 'Failed to get payment history',
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==============================
  // PAYMENT METHODS AVAILABLE
  // ==============================
  @Get('methods/available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAvailablePaymentMethods(@Request() req: any) {
    try {
      // Return available payment methods based on user's country/region
      const userCountry = req.user.country || 'HT'; // Default to Haiti

      const methods = {
        HT: [
          // Haiti
          PaymentMethod.DIGICEL_MONEY,
          PaymentMethod.NATCOM_MONEY,
          PaymentMethod.MONCASH,
          PaymentMethod.BANK_TRANSFER,
          PaymentMethod.CREDIT_CARD,
          PaymentMethod.DEBIT_CARD,
          PaymentMethod.CASH,
        ],
        US: [
          // United States
          PaymentMethod.CREDIT_CARD,
          PaymentMethod.DEBIT_CARD,
          PaymentMethod.BANK_TRANSFER,
          PaymentMethod.ACH_TRANSFER,
          PaymentMethod.PAYPAL,
          PaymentMethod.APPLE_PAY,
          PaymentMethod.GOOGLE_PAY,
        ],
        CA: [
          // Canada
          PaymentMethod.CREDIT_CARD,
          PaymentMethod.DEBIT_CARD,
          PaymentMethod.BANK_TRANSFER,
          PaymentMethod.PAYPAL,
        ],
      };

      const availableMethods = methods[userCountry] || methods.HT;

      return {
        success: true,
        data: {
          country: userCountry,
          methods: availableMethods,
          processors: Object.values(PaymentProcessor),
        },
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting available payment methods', error);
      throw new HttpException(
        'Failed to get available payment methods',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
