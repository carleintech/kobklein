import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PaymentRequestsService } from './payment-requests.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { extractError } from '../../utils/error.utils';

interface CreatePaymentRequestDto {
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  amount: number;
  currency: string;
  description?: string;
  dueDate?: Date;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: Date;
    maxOccurrences?: number;
  };
  metadata?: Record<string, any>;
}

interface RespondToRequestDto {
  action: 'approve' | 'decline' | 'partial';
  amount?: number; // For partial payments
  message?: string;
  scheduleDate?: Date; // For scheduled payments
}

@Controller('advanced-payments/requests')
export class PaymentRequestsController {
  private readonly logger = new Logger(PaymentRequestsController.name);

  constructor(private readonly paymentRequestsService: PaymentRequestsService) {}

  // ==============================
  // CREATE PAYMENT REQUEST
  // ==============================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createPaymentRequest(@Request() req: any, @Body() createDto: CreatePaymentRequestDto) {
    try {
      const userId = req.user.id;
      
      this.logger.log(`Creating payment request for user ${userId}`, { 
        amount: createDto.amount,
        currency: createDto.currency
      });

      const paymentRequest = await this.paymentRequestsService.createPaymentRequest(userId, createDto);

      return {
        success: true,
        data: paymentRequest,
        message: 'Payment request created successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error creating payment request', error);
      throw new HttpException(
        err.message || 'Failed to create payment request',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET PAYMENT REQUESTS (SENT)
  // ==============================
  @Get('sent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSentRequests(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const page = parseInt(query.page) || 1;
      const limit = Math.min(parseInt(query.limit) || 20, 100);
      const status = query.status;

      const requests = await this.paymentRequestsService.getPaymentRequests(userId, 'sent', { page, limit, status });

      return {
        success: true,
        data: requests.items,
        pagination: {
          page,
          limit,
          total: requests.total,
          totalPages: Math.ceil(requests.total / limit),
        }
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting sent requests', error);
      throw new HttpException(
        err.message || 'Failed to get sent requests',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // GET PAYMENT REQUESTS (RECEIVED)
  // ==============================
  @Get('received')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getReceivedRequests(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const page = parseInt(query.page) || 1;
      const limit = Math.min(parseInt(query.limit) || 20, 100);
      const status = query.status;

      const requests = await this.paymentRequestsService.getPaymentRequests(userId, 'received', { page, limit, status });

      return {
        success: true,
        data: requests.items,
        pagination: {
          page,
          limit,
          total: requests.total,
          totalPages: Math.ceil(requests.total / limit),
        }
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting received requests', error);
      throw new HttpException(
        err.message || 'Failed to get received requests',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // GET PAYMENT REQUEST DETAILS
  // ==============================
  @Get(':requestId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getPaymentRequest(@Param('requestId') requestId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const paymentRequest = await this.paymentRequestsService.getPaymentRequestById(requestId, userId);

      if (!paymentRequest) {
        throw new HttpException('Payment request not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: paymentRequest
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting payment request', error);
      throw new HttpException(
        err.message || 'Failed to get payment request',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // RESPOND TO PAYMENT REQUEST
  // ==============================
  @Post(':requestId/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async respondToPaymentRequest(
    @Param('requestId') requestId: string,
    @Request() req: any,
    @Body() respondDto: RespondToRequestDto
  ) {
    try {
      const userId = req.user.id;

      this.logger.log(`Responding to payment request ${requestId}`, { 
        action: respondDto.action,
        userId
      });

      const response = await this.paymentRequestsService.respondToPaymentRequest(userId, requestId, respondDto);

      return {
        success: true,
        data: response,
        message: `Payment request ${respondDto.action}ed successfully`
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error responding to payment request', error);
      throw new HttpException(
        err.message || 'Failed to respond to payment request',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // CANCEL PAYMENT REQUEST
  // ==============================
  @Patch(':requestId/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async cancelPaymentRequest(@Param('requestId') requestId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const paymentRequest = await this.paymentRequestsService.cancelPaymentRequest(requestId, userId);

      return {
        success: true,
        data: paymentRequest,
        message: 'Payment request cancelled successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error cancelling payment request', error);
      throw new HttpException(
        err.message || 'Failed to cancel payment request',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // RESEND PAYMENT REQUEST
  // ==============================
  @Post(':requestId/resend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async resendPaymentRequest(@Param('requestId') requestId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const result = await this.paymentRequestsService.resendPaymentRequest(requestId, userId);

      return {
        success: true,
        data: result,
        message: 'Payment request resent successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error resending payment request', error);
      throw new HttpException(
        err.message || 'Failed to resend payment request',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET RECURRING REQUESTS
  // ==============================
  @Get('recurring/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getActiveRecurringRequests(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const type = query.type || 'all'; // 'sent' | 'received' | 'all'

      const recurringRequests = await this.paymentRequestsService.getRecurringRequests(userId, type);

      return {
        success: true,
        data: recurringRequests
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting recurring requests', error);
      throw new HttpException(
        err.message || 'Failed to get recurring requests',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // UPDATE RECURRING REQUEST
  // ==============================
  @Patch('recurring/:requestId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateRecurringRequest(
    @Param('requestId') requestId: string,
    @Request() req: any,
    @Body() updateDto: { frequency?: string; endDate?: Date; maxOccurrences?: number; active?: boolean }
  ) {
    try {
      const userId = req.user.id;

      const recurringRequest = await this.paymentRequestsService.updateRecurringRequest(requestId, userId, updateDto);

      return {
        success: true,
        data: recurringRequest,
        message: 'Recurring request updated successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error updating recurring request', error);
      throw new HttpException(
        err.message || 'Failed to update recurring request',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET REQUEST ANALYTICS
  // ==============================
  @Get('analytics/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getRequestAnalytics(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      const analytics = await this.paymentRequestsService.getRequestAnalytics(userId, { startDate, endDate });

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting request analytics', error);
      throw new HttpException(
        err.message || 'Failed to get request analytics',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // BULK OPERATIONS
  // ==============================
  @Post('bulk/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createBulkRequests(@Request() req: any, @Body() body: { requests: CreatePaymentRequestDto[] }) {
    try {
      const userId = req.user.id;
      const { requests } = body;

      if (!requests || requests.length === 0) {
        throw new HttpException('No requests provided', HttpStatus.BAD_REQUEST);
      }

      if (requests.length > 50) {
        throw new HttpException('Maximum 50 requests allowed per bulk operation', HttpStatus.BAD_REQUEST);
      }

      const results = await this.paymentRequestsService.createBulkRequests(userId, requests);

      return {
        success: true,
        data: results,
        message: `Created ${results.successful.length} of ${requests.length} payment requests`
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error creating bulk requests', error);
      throw new HttpException(
        err.message || 'Failed to create bulk requests',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }
}