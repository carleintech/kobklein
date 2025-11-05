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
import { MerchantQrService } from './merchant-qr.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { extractError } from '../../utils/error.utils';

interface CreateMerchantQRDto {
  merchantName: string;
  businessType?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  paymentMethods: string[];
  currency: string;
  fixedAmount?: number;
  variableAmountLimits?: {
    min: number;
    max: number;
  };
  description?: string;
  metadata?: Record<string, any>;
}

@Controller('advanced-payments/merchant-qr')
export class MerchantQrController {
  private readonly logger = new Logger(MerchantQrController.name);

  constructor(private readonly merchantQrService: MerchantQrService) {}

  // ==============================
  // CREATE MERCHANT QR CODE
  // ==============================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createMerchantQR(@Request() req: any, @Body() createDto: CreateMerchantQRDto) {
    try {
      const userId = req.user.id;
      const userRole = req.user.primaryRole || req.user.role;

      // Check if user has merchant permissions
      if (!['MERCHANT', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        throw new HttpException('Insufficient permissions to create merchant QR', HttpStatus.FORBIDDEN);
      }

      this.logger.log(`Creating merchant QR for user ${userId}`, {
        merchantName: createDto.merchantName,
        businessType: createDto.businessType
      });

      const merchantQR = await this.merchantQrService.createMerchantQR(userId, createDto);

      return {
        success: true,
        data: merchantQR,
        message: 'Merchant QR code created successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error creating merchant QR', error);
      throw new HttpException(
        err.message || 'Failed to create merchant QR',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET MERCHANT QR CODES
  // ==============================
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMerchantQRs(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const page = parseInt(query.page) || 1;
      const limit = Math.min(parseInt(query.limit) || 20, 100);
      const status = query.status;

      const merchantQRs = await this.merchantQrService.getMerchantQRs(userId, { page, limit, status });

      return {
        success: true,
        data: merchantQRs.items,
        pagination: {
          page,
          limit,
          total: merchantQRs.total,
          totalPages: Math.ceil(merchantQRs.total / limit),
        }
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting merchant QRs', error);
      throw new HttpException(
        err.message || 'Failed to get merchant QRs',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // GET MERCHANT QR DETAILS
  // ==============================
  @Get(':qrId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMerchantQR(@Param('qrId') qrId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const merchantQR = await this.merchantQrService.getMerchantQR(qrId, userId);

      if (!merchantQR) {
        throw new HttpException('Merchant QR not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: merchantQR
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting merchant QR', error);
      throw new HttpException(
        err.message || 'Failed to get merchant QR',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // UPDATE MERCHANT QR
  // ==============================
  @Patch(':qrId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateMerchantQR(@Param('qrId') qrId: string, @Request() req: any, @Body() updateDto: Partial<CreateMerchantQRDto>) {
    try {
      const userId = req.user.id;

      const merchantQR = await this.merchantQrService.updateMerchantQR(qrId, userId, updateDto);

      return {
        success: true,
        data: merchantQR,
        message: 'Merchant QR updated successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error updating merchant QR', error);
      throw new HttpException(
        err.message || 'Failed to update merchant QR',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // DEACTIVATE MERCHANT QR
  // ==============================
  @Patch(':qrId/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deactivateMerchantQR(@Param('qrId') qrId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const merchantQR = await this.merchantQrService.deactivateMerchantQR(qrId, userId);

      return {
        success: true,
        data: merchantQR,
        message: 'Merchant QR deactivated successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error deactivating merchant QR', error);
      throw new HttpException(
        err.message || 'Failed to deactivate merchant QR',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET MERCHANT QR ANALYTICS
  // ==============================
  @Get(':qrId/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMerchantQRAnalytics(@Param('qrId') qrId: string, @Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate ? new Date(query.endDate) : new Date();

      const analytics = await this.merchantQrService.getMerchantQRAnalytics(qrId, userId, { startDate, endDate });

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting merchant QR analytics', error);
      throw new HttpException(
        err.message || 'Failed to get merchant QR analytics',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // GET MERCHANT QR TRANSACTIONS
  // ==============================
  @Get(':qrId/transactions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMerchantQRTransactions(@Param('qrId') qrId: string, @Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const page = parseInt(query.page) || 1;
      const limit = Math.min(parseInt(query.limit) || 20, 100);

      const transactions = await this.merchantQrService.getMerchantQRTransactions(qrId, userId, { page, limit });

      return {
        success: true,
        data: transactions.items,
        pagination: {
          page,
          limit,
          total: transactions.total,
          totalPages: Math.ceil(transactions.total / limit),
        }
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting merchant QR transactions', error);
      throw new HttpException(
        err.message || 'Failed to get merchant QR transactions',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // PROCESS MERCHANT QR PAYMENT
  // ==============================
  @Post(':qrId/process-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async processMerchantQRPayment(
    @Param('qrId') qrId: string,
    @Request() req: any,
    @Body() body: { amount: number; paymentMethod: string; description?: string }
  ) {
    try {
      const userId = req.user.id;
      const { amount, paymentMethod, description } = body;

      this.logger.log(`Processing merchant QR payment`, { qrId, amount, paymentMethod, userId });

      const payment = await this.merchantQrService.processMerchantQRPayment(
        userId,
        qrId,
        { amount, paymentMethod, description }
      );

      return {
        success: true,
        data: payment,
        message: 'Merchant QR payment processed successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error processing merchant QR payment', error);
      throw new HttpException(
        err.message || 'Failed to process merchant QR payment',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET PUBLIC MERCHANT INFO
  // ==============================
  @Get('public/:qrId/info')
  async getPublicMerchantInfo(@Param('qrId') qrId: string) {
    try {
      const merchantInfo = await this.merchantQrService.getPublicMerchantInfo(qrId);

      if (!merchantInfo) {
        throw new HttpException('Merchant QR not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: merchantInfo
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting public merchant info', error);
      throw new HttpException(
        err.message || 'Failed to get merchant info',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // SEARCH NEARBY MERCHANTS
  // ==============================
  @Get('nearby/search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async searchNearbyMerchants(@Request() req: any, @Query() query: any) {
    try {
      const latitude = parseFloat(query.latitude);
      const longitude = parseFloat(query.longitude);
      const radius = parseFloat(query.radius) || 1000; // meters
      const businessType = query.businessType;

      if (!latitude || !longitude) {
        throw new HttpException('Location coordinates required', HttpStatus.BAD_REQUEST);
      }

      const merchants = await this.merchantQrService.searchNearbyMerchants(
        { latitude, longitude },
        radius,
        { businessType }
      );

      return {
        success: true,
        data: merchants
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error searching nearby merchants', error);
      throw new HttpException(
        err.message || 'Failed to search nearby merchants',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET MERCHANT DASHBOARD
  // ==============================
  @Get('dashboard/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMerchantDashboard(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const userRole = req.user.primaryRole || req.user.role;

      if (!['MERCHANT', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
      }

      const period = query.period || '7d'; // 1d, 7d, 30d, 90d

      const dashboard = await this.merchantQrService.getMerchantDashboard(userId, period);

      return {
        success: true,
        data: dashboard
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting merchant dashboard', error);
      throw new HttpException(
        err.message || 'Failed to get merchant dashboard',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}