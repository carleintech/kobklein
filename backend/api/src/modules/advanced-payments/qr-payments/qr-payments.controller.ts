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
import { QrPaymentsService } from './qr-payments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { extractError } from '../../../utils/error.utils';

interface QRPaymentData {
  type: 'payment' | 'request' | 'merchant';
  amount?: number;
  currency: string;
  description?: string;
  recipient?: {
    id: string;
    name: string;
    type: 'user' | 'merchant';
  };
  sender?: {
    id: string;
    name: string;
  };
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

interface CreateQRCodeDto {
  paymentData: QRPaymentData;
  size?: number;
  format?: 'png' | 'svg' | 'jpeg';
}

interface ScanQRCodeDto {
  qrCode: string;
  deviceInfo?: {
    userAgent: string;
    location?: string;
    deviceId?: string;
  };
}

@Controller('advanced-payments/qr')
export class QrPaymentsController {
  private readonly logger = new Logger(QrPaymentsController.name);

  constructor(private readonly qrPaymentsService: QrPaymentsService) {}

  // ==============================
  // GENERATE QR CODE
  // ==============================
  @Post('generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async generateQRCode(@Request() req: any, @Body() createQRDto: CreateQRCodeDto) {
    try {
      const userId = req.user.id;
      const userRole = req.user.primaryRole || req.user.role;

      this.logger.log(`Generating QR code for user ${userId}`, { type: createQRDto.paymentData.type });

      const qrCode = await this.qrPaymentsService.generateQRCode(userId, createQRDto);

      return {
        success: true,
        data: {
          qrId: qrCode.id,
          qrImage: qrCode.imageUrl,
          qrData: qrCode.data,
          paymentLink: qrCode.paymentLink,
          expiresAt: qrCode.expiresAt,
          createdAt: qrCode.createdAt,
        },
        message: 'QR code generated successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error generating QR code', error);
      throw new HttpException(
        err.message || 'Failed to generate QR code',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // SCAN QR CODE
  // ==============================
  @Post('scan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async scanQRCode(@Request() req: any, @Body() scanDto: ScanQRCodeDto) {
    try {
      const userId = req.user.id;
      
      this.logger.log(`Scanning QR code for user ${userId}`);

      const scanResult = await this.qrPaymentsService.scanQRCode(userId, scanDto);

      return {
        success: true,
        data: {
          valid: scanResult.valid,
          paymentData: scanResult.paymentData,
          requiresConfirmation: scanResult.requiresConfirmation,
          securityCheck: scanResult.securityCheck,
          estimatedFees: scanResult.estimatedFees,
        },
        message: scanResult.valid ? 'QR code scanned successfully' : 'Invalid QR code'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error scanning QR code', error);
      throw new HttpException(
        err.message || 'Failed to scan QR code',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // PROCESS QR PAYMENT
  // ==============================
  @Post('process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async processQRPayment(@Request() req: any, @Body() body: { qrId: string; confirmed: boolean; pin?: string }) {
    try {
      const userId = req.user.id;
      const { qrId, confirmed, pin } = body;

      if (!confirmed) {
        throw new HttpException('Payment not confirmed', HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Processing QR payment for user ${userId}`, { qrId });

      const payment = await this.qrPaymentsService.processQRPayment(userId, qrId, pin);

      return {
        success: true,
        data: {
          paymentId: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          recipient: payment.userId,
          reference: payment.referenceId,
          completedAt: payment.completedAt,
        },
        message: 'QR payment processed successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error processing QR payment', error);
      throw new HttpException(
        err.message || 'Failed to process QR payment',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET QR CODE HISTORY
  // ==============================
  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getQRHistory(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const page = parseInt(query.page) || 1;
      const limit = Math.min(parseInt(query.limit) || 20, 100);
      const type = query.type; // 'generated' | 'scanned' | 'all'

      const history = await this.qrPaymentsService.getQRHistory(userId, { page, limit, type });

      return {
        success: true,
        data: history.items,
        pagination: {
          page,
          limit,
          total: history.total,
          totalPages: Math.ceil(history.total / limit),
        }
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting QR history', error);
      throw new HttpException(
        err.message || 'Failed to get QR history',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // GET QR CODE DETAILS
  // ==============================
  @Get(':qrId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getQRCode(@Param('qrId') qrId: string, @Request() req: any) {
    try {
      const userId = req.user.id;
      const userRole = req.user.primaryRole || req.user.role;

      const qrCode = await this.qrPaymentsService.getQRCode(qrId, userId);

      if (!qrCode) {
        throw new HttpException('QR code not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: qrCode
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting QR code', error);
      throw new HttpException(
        err.message || 'Failed to get QR code',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // DEACTIVATE QR CODE
  // ==============================
  @Patch(':qrId/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deactivateQRCode(@Param('qrId') qrId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const qrCode = await this.qrPaymentsService.deactivateQRCode(qrId, userId);

      return {
        success: true,
        data: qrCode,
        message: 'QR code deactivated successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error deactivating QR code', error);
      throw new HttpException(
        err.message || 'Failed to deactivate QR code',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // QR CODE ANALYTICS
  // ==============================
  @Get('analytics/usage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getQRAnalytics(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      const analytics = await this.qrPaymentsService.getQRAnalytics(userId, { startDate, endDate });

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting QR analytics', error);
      throw new HttpException(
        err.message || 'Failed to get QR analytics',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}