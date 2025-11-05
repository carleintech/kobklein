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
import { PaymentSecurityService } from './payment-security.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { extractError } from '../../utils/error.utils';

interface SecuritySetupDto {
  biometricEnabled?: boolean;
  pinRequired?: boolean;
  twoFactorEnabled?: boolean;
  transactionLimits?: {
    daily: number;
    weekly: number;
    monthly: number;
    perTransaction: number;
  };
  trustedDevices?: boolean;
  geofencing?: {
    enabled: boolean;
    allowedCountries: string[];
    allowedRegions: string[];
  };
}

interface VerifyTransactionDto {
  transactionId: string;
  verificationType: 'pin' | 'biometric' | 'sms' | 'email';
  verificationCode?: string;
  biometricData?: string;
  deviceInfo?: {
    deviceId: string;
    userAgent: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

@Controller('advanced-payments/security')
export class PaymentSecurityController {
  private readonly logger = new Logger(PaymentSecurityController.name);

  constructor(private readonly paymentSecurityService: PaymentSecurityService) {}

  // ==============================
  // GET SECURITY SETTINGS
  // ==============================
  @Get('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSecuritySettings(@Request() req: any) {
    try {
      const userId = req.user.id;

      const settings = await this.paymentSecurityService.getSecuritySettings(userId);

      return {
        success: true,
        data: settings
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting security settings', error);
      throw new HttpException(
        err.message || 'Failed to get security settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // UPDATE SECURITY SETTINGS
  // ==============================
  @Patch('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateSecuritySettings(@Request() req: any, @Body() setupDto: SecuritySetupDto) {
    try {
      const userId = req.user.id;

      this.logger.log(`Updating security settings for user ${userId}`);

      const settings = await this.paymentSecurityService.updateSecuritySettings(userId, setupDto);

      return {
        success: true,
        data: settings,
        message: 'Security settings updated successfully'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error updating security settings', error);
      throw new HttpException(
        err.message || 'Failed to update security settings',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // VERIFY TRANSACTION
  // ==============================
  @Post('verify-transaction')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async verifyTransaction(@Request() req: any, @Body() verifyDto: VerifyTransactionDto) {
    try {
      const userId = req.user.id;

      this.logger.log(`Verifying transaction for user ${userId}`, { 
        transactionId: verifyDto.transactionId,
        verificationType: verifyDto.verificationType
      });

      const result = await this.paymentSecurityService.verifyTransaction(userId, verifyDto);

      return {
        success: true,
        data: result,
        message: result.verified ? 'Transaction verified successfully' : 'Transaction verification failed'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error verifying transaction', error);
      throw new HttpException(
        err.message || 'Failed to verify transaction',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET FRAUD ALERTS
  // ==============================
  @Get('fraud-alerts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFraudAlerts(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const page = parseInt(query.page) || 1;
      const limit = Math.min(parseInt(query.limit) || 20, 100);
      const severity = query.severity; // 'low' | 'medium' | 'high' | 'critical'

      const alerts = await this.paymentSecurityService.getFraudAlerts(userId, { page, limit, severity });

      return {
        success: true,
        data: alerts.items,
        pagination: {
          page,
          limit,
          total: alerts.total,
          totalPages: Math.ceil(alerts.total / limit),
        }
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting fraud alerts', error);
      throw new HttpException(
        err.message || 'Failed to get fraud alerts',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // ACKNOWLEDGE FRAUD ALERT
  // ==============================
  @Patch('fraud-alerts/:alertId/acknowledge')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async acknowledgeFraudAlert(@Param('alertId') alertId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      const alert = await this.paymentSecurityService.acknowledgeFraudAlert(alertId, userId);

      return {
        success: true,
        data: alert,
        message: 'Fraud alert acknowledged'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error acknowledging fraud alert', error);
      throw new HttpException(
        err.message || 'Failed to acknowledge fraud alert',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET TRUSTED DEVICES
  // ==============================
  @Get('trusted-devices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getTrustedDevices(@Request() req: any) {
    try {
      const userId = req.user.id;

      const devices = await this.paymentSecurityService.getTrustedDevices(userId);

      return {
        success: true,
        data: devices
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting trusted devices', error);
      throw new HttpException(
        err.message || 'Failed to get trusted devices',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // ADD TRUSTED DEVICE
  // ==============================
  @Post('trusted-devices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addTrustedDevice(@Request() req: any, @Body() body: { deviceName: string; deviceFingerprint: string }) {
    try {
      const userId = req.user.id;
      const { deviceName, deviceFingerprint } = body;

      const device = await this.paymentSecurityService.addTrustedDevice(userId, deviceName, deviceFingerprint);

      return {
        success: true,
        data: device,
        message: 'Device added to trusted list'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error adding trusted device', error);
      throw new HttpException(
        err.message || 'Failed to add trusted device',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // REMOVE TRUSTED DEVICE
  // ==============================
  @Delete('trusted-devices/:deviceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeTrustedDevice(@Param('deviceId') deviceId: string, @Request() req: any) {
    try {
      const userId = req.user.id;

      await this.paymentSecurityService.removeTrustedDevice(deviceId, userId);

      return {
        success: true,
        message: 'Device removed from trusted list'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error removing trusted device', error);
      throw new HttpException(
        err.message || 'Failed to remove trusted device',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET SECURITY SCORE
  // ==============================
  @Get('score')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSecurityScore(@Request() req: any) {
    try {
      const userId = req.user.id;

      const securityScore = await this.paymentSecurityService.calculateSecurityScore(userId);

      return {
        success: true,
        data: securityScore
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting security score', error);
      throw new HttpException(
        err.message || 'Failed to get security score',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // GET SECURITY AUDIT LOG
  // ==============================
  @Get('audit-log')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSecurityAuditLog(@Request() req: any, @Query() query: any) {
    try {
      const userId = req.user.id;
      const page = parseInt(query.page) || 1;
      const limit = Math.min(parseInt(query.limit) || 20, 100);
      const eventType = query.eventType;

      const auditLog = await this.paymentSecurityService.getSecurityAuditLog(userId, { page, limit, eventType });

      return {
        success: true,
        data: auditLog.items,
        pagination: {
          page,
          limit,
          total: auditLog.total,
          totalPages: Math.ceil(auditLog.total / limit),
        }
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting security audit log', error);
      throw new HttpException(
        err.message || 'Failed to get security audit log',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ==============================
  // ENABLE TWO-FACTOR AUTHENTICATION
  // ==============================
  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async enableTwoFactor(@Request() req: any, @Body() body: { method: 'sms' | 'email' | 'app'; contact?: string }) {
    try {
      const userId = req.user.id;
      const { method, contact } = body;

      const twoFactorSetup = await this.paymentSecurityService.enableTwoFactor(userId, method, contact);

      return {
        success: true,
        data: twoFactorSetup,
        message: 'Two-factor authentication enabled'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error enabling two-factor authentication', error);
      throw new HttpException(
        err.message || 'Failed to enable two-factor authentication',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // DISABLE TWO-FACTOR AUTHENTICATION
  // ==============================
  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async disableTwoFactor(@Request() req: any, @Body() body: { verificationCode: string }) {
    try {
      const userId = req.user.id;
      const { verificationCode } = body;

      await this.paymentSecurityService.disableTwoFactor(userId, verificationCode);

      return {
        success: true,
        message: 'Two-factor authentication disabled'
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error disabling two-factor authentication', error);
      throw new HttpException(
        err.message || 'Failed to disable two-factor authentication',
        err.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ==============================
  // GET SECURITY RECOMMENDATIONS
  // ==============================
  @Get('recommendations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSecurityRecommendations(@Request() req: any) {
    try {
      const userId = req.user.id;

      const recommendations = await this.paymentSecurityService.getSecurityRecommendations(userId);

      return {
        success: true,
        data: recommendations
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error getting security recommendations', error);
      throw new HttpException(
        err.message || 'Failed to get security recommendations',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}