import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { NfcPaymentsService } from './nfc-payments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { extractError } from '../../utils/error.utils';

interface NFCPaymentData {
  amount: number;
  currency: string;
  description?: string;
  merchantId?: string;
  merchantName?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  metadata?: Record<string, any>;
}

interface InitiateNFCDto {
  paymentData: NFCPaymentData;
  proximityDistance?: number; // meters
  timeout?: number; // seconds
}

interface ProcessNFCDto {
  nfcData: string;
  deviceInfo?: {
    nfcCapabilities: string[];
    deviceId: string;
    userAgent: string;
  };
}

@Controller('advanced-payments/nfc')
export class NfcPaymentsController {
  private readonly logger = new Logger(NfcPaymentsController.name);

  constructor(private readonly nfcPaymentsService: NfcPaymentsService) {}

  // ==============================
  // INITIATE NFC PAYMENT
  // ==============================
  @Post('initiate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async initiateNFCPayment(@Request() req: any, @Body() initiateDto: InitiateNFCDto) {
    try {
      const userId = req.user.id;
      const userRole = req.user.primaryRole || req.user.role;

      this.logger.log(`Initiating NFC payment for user ${userId}`, { 
        amount: initiateDto.paymentData.amount,
        currency: initiateDto.paymentData.currency
      });

      const nfcSession = await this.nfcPaymentsService.initiateNFCPayment(userId, initiateDto);

      return {
        success: true,
        data: {
          sessionId: nfcSession.id,
          nfcData: nfcSession.nfcData,
          proximityRequired: nfcSession.proximityRequired,
          timeout: nfcSession.timeout,
          expiresAt: nfcSession.expiresAt,
          status: nfcSession.status
        },
        message: 'NFC payment session initiated'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error initiating NFC payment', error);
      throw new HttpException(
        err.message || 'Failed to initiate NFC payment',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // PROCESS NFC PAYMENT
  // ==============================
  @Post('process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async processNFCPayment(@Request() req: any, @Body() processDto: ProcessNFCDto) {
    try {
      const userId = req.user.id;

      this.logger.log(`Processing NFC payment for user ${userId}`);

      const result = await this.nfcPaymentsService.processNFCPayment(userId, processDto);

      return {
        success: true,
        data: {
          paymentId: result.paymentId,
          status: result.status,
          amount: result.amount,
          currency: result.currency,
          merchant: result.merchant,
          reference: result.reference,
          completedAt: result.completedAt,
          requiresConfirmation: result.requiresConfirmation
        },
        message: result.requiresConfirmation ? 'Payment requires confirmation' : 'NFC payment processed successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error processing NFC payment', error);
      throw new HttpException(
        err.message || 'Failed to process NFC payment',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // CONFIRM NFC PAYMENT
  // ==============================
  @Post('confirm/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async confirmNFCPayment(
    @Param('sessionId') sessionId: string,
    @Request() req: any,
    @Body() body: { confirmed: boolean; pin?: string; biometric?: string }
  ) {
    try {
      const userId = req.user.id;
      const { confirmed, pin, biometric } = body;

      if (!confirmed) {
        throw new HttpException('Payment not confirmed', HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Confirming NFC payment for user ${userId}`, { sessionId });

      const payment = await this.nfcPaymentsService.confirmNFCPayment(userId, sessionId, { pin, biometric });

      return {
        success: true,
        data: {
          paymentId: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          reference: payment.referenceId,
          completedAt: payment.completedAt
        },
        message: 'NFC payment confirmed successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error confirming NFC payment', error);
      throw new HttpException(
        err.message || 'Failed to confirm NFC payment',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET NFC SESSIONS
  // ==============================
  @Get('sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getNFCSessions(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const page = parseInt(query.page) || 1;
      const limit = Math.min(parseInt(query.limit) || 20, 100);
      const status = query.status; // 'active' | 'completed' | 'expired' | 'cancelled'

      const sessions = await this.nfcPaymentsService.getNFCSessions(userId, { page, limit, status });

      return {
        success: true,
        data: sessions.items,
        pagination: {
          page,
          limit,
          total: sessions.total,
          totalPages: Math.ceil(sessions.total / limit),
        }
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting NFC sessions', error);
      throw new HttpException(
        err.message || 'Failed to get NFC sessions',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // GET NFC SESSION DETAILS
  // ==============================
  @Get('sessions/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getNFCSession(@Param('sessionId') sessionId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const session = await this.nfcPaymentsService.getNFCSession(sessionId, userId);

      if (!session) {
        throw new HttpException('NFC session not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: session
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting NFC session', error);
      throw new HttpException(
        err.message || 'Failed to get NFC session',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // CANCEL NFC SESSION
  // ==============================
  @Patch('sessions/:sessionId/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async cancelNFCSession(@Param('sessionId') sessionId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const session = await this.nfcPaymentsService.cancelNFCSession(sessionId, userId);

      return {
        success: true,
        data: session,
        message: 'NFC session cancelled successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error cancelling NFC session', error);
      throw new HttpException(
        err.message || 'Failed to cancel NFC session',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET NFC ANALYTICS
  // ==============================
  @Get('analytics/usage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getNFCAnalytics(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      const analytics = await this.nfcPaymentsService.getNFCAnalytics(userId, { startDate, endDate });

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting NFC analytics', error);
      throw new HttpException(
        err.message || 'Failed to get NFC analytics',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // CHECK NFC CAPABILITIES
  // ==============================
  @Get('capabilities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async checkNFCCapabilities(@Request() req: any, @Query() query: any) {
    try {
      const userAgent = query.userAgent || req.headers['user-agent'];
      const deviceType = query.deviceType; // 'mobile' | 'tablet' | 'desktop'

      const capabilities = await this.nfcPaymentsService.checkNFCCapabilities(userAgent, deviceType);

      return {
        success: true,
        data: capabilities
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error checking NFC capabilities', error);
      throw new HttpException(
        err.message || 'Failed to check NFC capabilities',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // GET NEARBY MERCHANTS
  // ==============================
  @Get('merchants/nearby')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getNearbyMerchants(@Request() req: any, @Query() query: any) {
    try {
      const latitude = parseFloat(query.latitude);
      const longitude = parseFloat(query.longitude);
      const radius = parseFloat(query.radius) || 1000; // meters

      if (!latitude || !longitude) {
        throw new HttpException('Location coordinates required', HttpStatus.BAD_REQUEST);
      }

      const merchants = await this.nfcPaymentsService.getNearbyMerchants({ latitude, longitude }, radius);

      return {
        success: true,
        data: merchants
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting nearby merchants', error);
      throw new HttpException(
        err.message || 'Failed to get nearby merchants',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }
}