import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

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

@Injectable()
export class PaymentSecurityService {
  private readonly logger = new Logger(PaymentSecurityService.name);
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // ==============================
  // GET SECURITY SETTINGS
  // ==============================
  async getSecuritySettings(userId: string) {
    try {
      const { data: settings, error } = await this.supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        this.logger.error('Database error getting security settings', error);
        throw new HttpException('Failed to get security settings', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // If no settings exist, return defaults
      if (!settings) {
        return this.getDefaultSecuritySettings();
      }

      return this.mapDatabaseSettingsToInfo(settings);

    } catch (error) {
      this.logger.error('Error getting security settings', error);
      throw error;
    }
  }

  // ==============================
  // UPDATE SECURITY SETTINGS
  // ==============================
  async updateSecuritySettings(userId: string, setupDto: SecuritySetupDto) {
    try {
      // Get current settings or create defaults
      let currentSettings = await this.getSecuritySettings(userId);

      // Merge with new settings
      const updatedSettings = {
        user_id: userId,
        biometric_enabled: setupDto.biometricEnabled ?? currentSettings.biometricEnabled,
        pin_required: setupDto.pinRequired ?? currentSettings.pinRequired,
        two_factor_enabled: setupDto.twoFactorEnabled ?? currentSettings.twoFactorEnabled,
        transaction_limits: setupDto.transactionLimits || currentSettings.transactionLimits,
        trusted_devices_enabled: setupDto.trustedDevices ?? currentSettings.trustedDevicesEnabled,
        geofencing_config: setupDto.geofencing || currentSettings.geofencingConfig,
        updated_at: new Date().toISOString()
      };

      const { data: settings, error } = await this.supabase
        .from('user_security_settings')
        .upsert(updatedSettings)
        .select()
        .single();

      if (error) {
        this.logger.error('Database error updating security settings', error);
        throw new HttpException('Failed to update security settings', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log security change
      await this.logSecurityEvent(userId, 'settings_updated', {
        changes: setupDto
      });

      return this.mapDatabaseSettingsToInfo(settings);

    } catch (error) {
      this.logger.error('Error updating security settings', error);
      throw error;
    }
  }

  // ==============================
  // VERIFY TRANSACTION
  // ==============================
  async verifyTransaction(userId: string, verifyDto: VerifyTransactionDto) {
    try {
      const { transactionId, verificationType, verificationCode, biometricData, deviceInfo } = verifyDto;

      // Get pending verification
      const { data: verification, error } = await this.supabase
        .from('transaction_verifications')
        .select('*')
        .eq('transaction_id', transactionId)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single();

      if (error || !verification) {
        throw new HttpException('Verification request not found', HttpStatus.NOT_FOUND);
      }

      // Check if verification has expired
      if (new Date() > new Date(verification.expires_at)) {
        await this.updateVerificationStatus(verification.id, 'expired');
        throw new HttpException('Verification has expired', HttpStatus.BAD_REQUEST);
      }

      // Perform verification based on type
      let verified = false;
      let verificationDetails = {};

      switch (verificationType) {
        case 'pin':
          verified = await this.verifyPin(userId, verificationCode!);
          verificationDetails = { method: 'pin' };
          break;
        case 'biometric':
          verified = await this.verifyBiometric(userId, biometricData!);
          verificationDetails = { method: 'biometric', data: 'biometric_hash' };
          break;
        case 'sms':
          verified = await this.verifySMSCode(userId, verificationCode!);
          verificationDetails = { method: 'sms', code: verificationCode };
          break;
        case 'email':
          verified = await this.verifyEmailCode(userId, verificationCode!);
          verificationDetails = { method: 'email', code: verificationCode };
          break;
      }

      // Update verification status
      const newStatus = verified ? 'verified' : 'failed';
      await this.updateVerificationStatus(verification.id, newStatus, verificationDetails);

      // Perform fraud/security checks
      const securityCheck = await this.performSecurityCheck(userId, deviceInfo);

      // Log verification attempt
      await this.logSecurityEvent(userId, 'transaction_verification', {
        transactionId,
        verificationType,
        verified,
        securityCheck,
        deviceInfo
      });

      return {
        verified,
        transactionId,
        verificationType,
        securityCheck,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.logger.error('Error verifying transaction', error);
      throw error;
    }
  }

  // ==============================
  // GET FRAUD ALERTS
  // ==============================
  async getFraudAlerts(userId: string, options: { page: number; limit: number; severity?: string }) {
    try {
      const { page, limit, severity } = options;
      const offset = (page - 1) * limit;

      let query = this.supabase
        .from('fraud_alerts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (severity && severity !== 'all') {
        query = query.eq('severity', severity);
      }

      const { data: alerts, error, count } = await query;

      if (error) {
        this.logger.error('Database error getting fraud alerts', error);
        throw new HttpException('Failed to get fraud alerts', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        items: alerts || [],
        total: count || 0
      };

    } catch (error) {
      this.logger.error('Error getting fraud alerts', error);
      throw error;
    }
  }

  // ==============================
  // ACKNOWLEDGE FRAUD ALERT
  // ==============================
  async acknowledgeFraudAlert(alertId: string, userId: string) {
    try {
      const { data: alert, error } = await this.supabase
        .from('fraud_alerts')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        this.logger.error('Database error acknowledging fraud alert', error);
        throw new HttpException('Failed to acknowledge fraud alert', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log acknowledgment
      await this.logSecurityEvent(userId, 'fraud_alert_acknowledged', { alertId });

      return alert;

    } catch (error) {
      this.logger.error('Error acknowledging fraud alert', error);
      throw error;
    }
  }

  // ==============================
  // GET TRUSTED DEVICES
  // ==============================
  async getTrustedDevices(userId: string) {
    try {
      const { data: devices, error } = await this.supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        throw new HttpException('Failed to get trusted devices', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return devices || [];

    } catch (error) {
      this.logger.error('Error getting trusted devices', error);
      throw error;
    }
  }

  // ==============================
  // ADD TRUSTED DEVICE
  // ==============================
  async addTrustedDevice(userId: string, deviceName: string, deviceFingerprint: string) {
    try {
      const deviceId = crypto.randomUUID();

      const { data: device, error } = await this.supabase
        .from('trusted_devices')
        .insert({
          id: deviceId,
          user_id: userId,
          device_name: deviceName,
          device_fingerprint: deviceFingerprint,
          status: 'active',
          created_at: new Date().toISOString(),
          last_used_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new HttpException('Failed to add trusted device', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log device addition
      await this.logSecurityEvent(userId, 'trusted_device_added', {
        deviceId,
        deviceName,
        deviceFingerprint: deviceFingerprint.substring(0, 8) + '...'
      });

      return device;

    } catch (error) {
      this.logger.error('Error adding trusted device', error);
      throw error;
    }
  }

  // ==============================
  // REMOVE TRUSTED DEVICE
  // ==============================
  async removeTrustedDevice(deviceId: string, userId: string) {
    try {
      const { error } = await this.supabase
        .from('trusted_devices')
        .update({
          status: 'removed',
          removed_at: new Date().toISOString()
        })
        .eq('id', deviceId)
        .eq('user_id', userId);

      if (error) {
        throw new HttpException('Failed to remove trusted device', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Log device removal
      await this.logSecurityEvent(userId, 'trusted_device_removed', { deviceId });

    } catch (error) {
      this.logger.error('Error removing trusted device', error);
      throw error;
    }
  }

  // ==============================
  // CALCULATE SECURITY SCORE
  // ==============================
  async calculateSecurityScore(userId: string) {
    try {
      const settings = await this.getSecuritySettings(userId);
      const trustedDevices = await this.getTrustedDevices(userId);
      const recentAlerts = await this.getRecentFraudAlerts(userId, 30); // Last 30 days

      let score = 0;
      const maxScore = 100;
      const criteria = [];

      // Biometric authentication (20 points)
      if (settings.biometricEnabled) {
        score += 20;
        criteria.push({ item: 'Biometric Authentication', enabled: true, points: 20 });
      } else {
        criteria.push({ item: 'Biometric Authentication', enabled: false, points: 0 });
      }

      // PIN requirement (15 points)
      if (settings.pinRequired) {
        score += 15;
        criteria.push({ item: 'PIN Requirement', enabled: true, points: 15 });
      } else {
        criteria.push({ item: 'PIN Requirement', enabled: false, points: 0 });
      }

      // Two-factor authentication (25 points)
      if (settings.twoFactorEnabled) {
        score += 25;
        criteria.push({ item: 'Two-Factor Authentication', enabled: true, points: 25 });
      } else {
        criteria.push({ item: 'Two-Factor Authentication', enabled: false, points: 0 });
      }

      // Transaction limits (10 points)
      if (settings.transactionLimits && settings.transactionLimits.perTransaction > 0) {
        score += 10;
        criteria.push({ item: 'Transaction Limits', enabled: true, points: 10 });
      } else {
        criteria.push({ item: 'Transaction Limits', enabled: false, points: 0 });
      }

      // Trusted devices (10 points)
      if (settings.trustedDevicesEnabled && trustedDevices.length > 0) {
        score += 10;
        criteria.push({ item: 'Trusted Devices', enabled: true, points: 10 });
      } else {
        criteria.push({ item: 'Trusted Devices', enabled: false, points: 0 });
      }

      // Geofencing (10 points)
      if (settings.geofencingConfig?.enabled) {
        score += 10;
        criteria.push({ item: 'Geofencing', enabled: true, points: 10 });
      } else {
        criteria.push({ item: 'Geofencing', enabled: false, points: 0 });
      }

      // Recent fraud alerts penalty (-5 points per alert, max -20)
      const alertPenalty = Math.min(recentAlerts.length * 5, 20);
      score -= alertPenalty;
      
      if (alertPenalty > 0) {
        criteria.push({ item: 'Recent Fraud Alerts', enabled: false, points: -alertPenalty });
      }

      // Ensure score doesn't go below 0
      score = Math.max(0, score);

      const securityLevel = this.getSecurityLevel(score);

      return {
        score,
        maxScore,
        percentage: Math.round((score / maxScore) * 100),
        level: securityLevel,
        criteria,
        recommendations: this.generateScoreRecommendations(criteria)
      };

    } catch (error) {
      this.logger.error('Error calculating security score', error);
      throw error;
    }
  }

  // ==============================
  // GET SECURITY AUDIT LOG
  // ==============================
  async getSecurityAuditLog(userId: string, options: { page: number; limit: number; eventType?: string }) {
    try {
      const { page, limit, eventType } = options;
      const offset = (page - 1) * limit;

      let query = this.supabase
        .from('security_audit_log')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (eventType && eventType !== 'all') {
        query = query.eq('event_type', eventType);
      }

      const { data: auditLog, error, count } = await query;

      if (error) {
        throw new HttpException('Failed to get security audit log', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        items: auditLog || [],
        total: count || 0
      };

    } catch (error) {
      this.logger.error('Error getting security audit log', error);
      throw error;
    }
  }

  // ==============================
  // ENABLE TWO FACTOR
  // ==============================
  async enableTwoFactor(userId: string, method: 'sms' | 'email' | 'app', contact?: string) {
    try {
      const setupCode = crypto.randomBytes(16).toString('hex');
      
      const { data: twoFactor, error } = await this.supabase
        .from('user_two_factor')
        .upsert({
          user_id: userId,
          method,
          contact,
          secret: setupCode,
          enabled: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new HttpException('Failed to enable two-factor authentication', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Update security settings
      await this.updateSecuritySettings(userId, { twoFactorEnabled: true });

      // Log 2FA enablement
      await this.logSecurityEvent(userId, 'two_factor_enabled', { method, contact });

      return {
        method,
        setupCode: method === 'app' ? setupCode : undefined,
        contact,
        enabled: true
      };

    } catch (error) {
      this.logger.error('Error enabling two-factor authentication', error);
      throw error;
    }
  }

  // ==============================
  // DISABLE TWO FACTOR
  // ==============================
  async disableTwoFactor(userId: string, verificationCode: string) {
    try {
      // Verify the code first
      const isValidCode = await this.verifyTwoFactorCode(userId, verificationCode);
      
      if (!isValidCode) {
        throw new HttpException('Invalid verification code', HttpStatus.BAD_REQUEST);
      }

      // Disable 2FA
      const { error } = await this.supabase
        .from('user_two_factor')
        .update({
          enabled: false,
          disabled_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        throw new HttpException('Failed to disable two-factor authentication', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Update security settings
      await this.updateSecuritySettings(userId, { twoFactorEnabled: false });

      // Log 2FA disablement
      await this.logSecurityEvent(userId, 'two_factor_disabled', {});

    } catch (error) {
      this.logger.error('Error disabling two-factor authentication', error);
      throw error;
    }
  }

  // ==============================
  // GET SECURITY RECOMMENDATIONS
  // ==============================
  async getSecurityRecommendations(userId: string) {
    try {
      const settings = await this.getSecuritySettings(userId);
      const securityScore = await this.calculateSecurityScore(userId);
      
      const recommendations = [];

      if (!settings.biometricEnabled) {
        recommendations.push({
          priority: 'high',
          category: 'authentication',
          title: 'Enable Biometric Authentication',
          description: 'Add biometric authentication for enhanced security',
          impact: '+20 security points'
        });
      }

      if (!settings.twoFactorEnabled) {
        recommendations.push({
          priority: 'high',
          category: 'authentication',
          title: 'Enable Two-Factor Authentication',
          description: 'Add an extra layer of security with 2FA',
          impact: '+25 security points'
        });
      }

      if (!settings.pinRequired) {
        recommendations.push({
          priority: 'medium',
          category: 'authentication',
          title: 'Require PIN for Transactions',
          description: 'Require PIN verification for all transactions',
          impact: '+15 security points'
        });
      }

      if (!settings.transactionLimits || settings.transactionLimits.perTransaction === 0) {
        recommendations.push({
          priority: 'medium',
          category: 'limits',
          title: 'Set Transaction Limits',
          description: 'Set daily and per-transaction limits to prevent fraud',
          impact: '+10 security points'
        });
      }

      if (!settings.geofencingConfig?.enabled) {
        recommendations.push({
          priority: 'low',
          category: 'location',
          title: 'Enable Geofencing',
          description: 'Restrict transactions to specific locations',
          impact: '+10 security points'
        });
      }

      return {
        currentScore: securityScore.score,
        maxScore: securityScore.maxScore,
        level: securityScore.level,
        recommendations: recommendations.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
      };

    } catch (error) {
      this.logger.error('Error getting security recommendations', error);
      throw error;
    }
  }

  // ==============================
  // HELPER METHODS
  // ==============================
  private getDefaultSecuritySettings() {
    return {
      biometricEnabled: false,
      pinRequired: true,
      twoFactorEnabled: false,
      transactionLimits: {
        daily: 5000,
        weekly: 20000,
        monthly: 50000,
        perTransaction: 1000
      },
      trustedDevicesEnabled: false,
      geofencingConfig: {
        enabled: false,
        allowedCountries: [],
        allowedRegions: []
      }
    };
  }

  private mapDatabaseSettingsToInfo(settings: any) {
    return {
      biometricEnabled: settings.biometric_enabled,
      pinRequired: settings.pin_required,
      twoFactorEnabled: settings.two_factor_enabled,
      transactionLimits: settings.transaction_limits,
      trustedDevicesEnabled: settings.trusted_devices_enabled,
      geofencingConfig: settings.geofencing_config,
      createdAt: settings.created_at,
      updatedAt: settings.updated_at
    };
  }

  private async verifyPin(userId: string, pin: string): Promise<boolean> {
    // In a real implementation, this would verify against a hashed PIN
    // For now, return true if PIN is provided
    return pin && pin.length >= 4;
  }

  private async verifyBiometric(userId: string, biometricData: string): Promise<boolean> {
    // In a real implementation, this would verify biometric data
    // For now, return true if biometric data is provided
    return !!biometricData;
  }

  private async verifySMSCode(userId: string, code: string): Promise<boolean> {
    // In a real implementation, this would verify against sent SMS code
    return code && code.length === 6;
  }

  private async verifyEmailCode(userId: string, code: string): Promise<boolean> {
    // In a real implementation, this would verify against sent email code
    return code && code.length === 6;
  }

  private async verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
    // In a real implementation, this would verify against 2FA secret
    return code && code.length === 6;
  }

  private async performSecurityCheck(userId: string, deviceInfo?: any) {
    return {
      deviceTrusted: true, // Would check against trusted devices
      locationValid: true, // Would check against geofencing rules
      velocityCheck: true, // Would check transaction velocity
      riskScore: 'low'
    };
  }

  private async updateVerificationStatus(verificationId: string, status: string, details?: any) {
    await this.supabase
      .from('transaction_verifications')
      .update({
        status,
        verification_details: details,
        verified_at: status === 'verified' ? new Date().toISOString() : null
      })
      .eq('id', verificationId);
  }

  private async getRecentFraudAlerts(userId: string, days: number) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const { data: alerts } = await this.supabase
      .from('fraud_alerts')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    return alerts || [];
  }

  private getSecurityLevel(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    if (score >= 20) return 'poor';
    return 'very_poor';
  }

  private generateScoreRecommendations(criteria: any[]): string[] {
    const recommendations = [];
    
    const disabled = criteria.filter(c => !c.enabled && c.points > 0);
    
    for (const item of disabled) {
      switch (item.item) {
        case 'Biometric Authentication':
          recommendations.push('Enable biometric authentication for maximum security');
          break;
        case 'Two-Factor Authentication':
          recommendations.push('Set up two-factor authentication to protect your account');
          break;
        case 'PIN Requirement':
          recommendations.push('Require PIN verification for all transactions');
          break;
        case 'Transaction Limits':
          recommendations.push('Set appropriate transaction limits to prevent fraud');
          break;
        case 'Trusted Devices':
          recommendations.push('Register your trusted devices for better security');
          break;
        case 'Geofencing':
          recommendations.push('Enable location-based security controls');
          break;
      }
    }

    return recommendations;
  }

  private async logSecurityEvent(userId: string, eventType: string, metadata: any) {
    try {
      await this.supabase
        .from('security_audit_log')
        .insert({
          user_id: userId,
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      this.logger.warn('Failed to log security event', error);
    }
  }
}