"use client";

import { createClient } from '@supabase/supabase-js';

// Fraud Detection Interfaces
export interface DeviceFingerprint {
  id: string;
  user_id: string;
  device_id: string;
  browser_fingerprint: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  user_agent: string;
  ip_address: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  created_at: Date;
  last_seen: Date;
  trust_score: number; // 0-100
}

export interface TransactionRiskProfile {
  transaction_id: string;
  user_id: string;
  amount: number;
  currency: string;
  merchant_id?: string;
  recipient_id?: string;
  transaction_type: 'payment' | 'transfer' | 'cash_out' | 'top_up' | 'remittance';
  location: {
    latitude?: number;
    longitude?: number;
    ip_country: string;
    ip_region: string;
  };
  device_fingerprint_id: string;
  timestamp: Date;
  risk_score: number; // 0-100
  risk_factors: string[];
  ml_predictions: {
    fraud_probability: number;
    anomaly_score: number;
    behavioral_score: number;
  };
  status: 'approved' | 'flagged' | 'blocked' | 'under_review';
}

export interface BehavioralPattern {
  user_id: string;
  pattern_type: 'transaction_timing' | 'amount_patterns' | 'location_behavior' | 'device_usage';
  baseline_metrics: Record<string, number>;
  current_metrics: Record<string, number>;
  deviation_score: number; // How much current behavior deviates from normal
  confidence: number;
  last_updated: Date;
}

export interface FraudAlert {
  id: string;
  alert_type: 'high_risk_transaction' | 'suspicious_pattern' | 'device_anomaly' | 'location_mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id: string;
  transaction_id?: string;
  description: string;
  risk_score: number;
  evidence: Record<string, any>;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  created_at: Date;
  resolved_at?: Date;
  assigned_to?: string;
}

class FraudDetectionEngine {
  private supabase: any;
  private mlModels: Map<string, any> = new Map();
  private riskThresholds = {
    low: 30,
    medium: 60,
    high: 80,
    critical: 95
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      this.initializeMLModels();
    }
  }

  private async initializeMLModels() {
    // Initialize lightweight ML models for real-time fraud detection
    // In production, these would be pre-trained models loaded from a model registry

    // Transaction Anomaly Detection Model
    this.mlModels.set('transaction_anomaly', {
      type: 'isolation_forest',
      features: ['amount', 'hour_of_day', 'day_of_week', 'location_distance', 'merchant_risk'],
      thresholds: { anomaly: 0.1, suspicious: 0.05 }
    });

    // Behavioral Analysis Model
    this.mlModels.set('behavioral_analysis', {
      type: 'lstm_autoencoder',
      features: ['transaction_frequency', 'amount_variance', 'time_patterns', 'location_patterns'],
      lookback_window: 30 // days
    });

    // Device Trust Model
    this.mlModels.set('device_trust', {
      type: 'gradient_boosting',
      features: ['device_age', 'usage_patterns', 'location_consistency', 'browser_consistency'],
      update_frequency: 3600000 // 1 hour
    });
  }

  // Real-time Transaction Screening
  public async screenTransaction(transaction: {
    user_id: string;
    amount: number;
    currency: string;
    merchant_id?: string;
    recipient_id?: string;
    type: string;
    device_info: any;
    location?: { latitude: number; longitude: number };
    ip_address: string;
  }): Promise<TransactionRiskProfile> {

    // 1. Generate/Update Device Fingerprint
    const deviceFingerprint = await this.generateDeviceFingerprint(transaction.user_id, transaction.device_info, transaction.ip_address);

    // 2. Analyze Transaction Patterns
    const transactionRisk = await this.analyzeTransactionRisk(transaction);

    // 3. Check Behavioral Patterns
    const behavioralRisk = await this.analyzeBehavioralPatterns(transaction.user_id, transaction);

    // 4. Device Trust Assessment
    const deviceRisk = await this.assessDeviceTrust(deviceFingerprint);

    // 5. Location Risk Analysis
    const locationRisk = await this.analyzeLocationRisk(transaction.user_id, transaction.location, transaction.ip_address);

    // 6. ML Model Predictions
    const mlPredictions = await this.runMLPredictions(transaction, deviceFingerprint);

    // 7. Calculate Combined Risk Score
    const combinedRiskScore = this.calculateRiskScore({
      transaction: transactionRisk,
      behavioral: behavioralRisk,
      device: deviceRisk,
      location: locationRisk,
      ml: mlPredictions
    });

    // 8. Generate Risk Factors
    const riskFactors = this.generateRiskFactors({
      transactionRisk,
      behavioralRisk,
      deviceRisk,
      locationRisk,
      mlPredictions
    });

    // 9. Determine Transaction Status
    const status = this.determineTransactionStatus(combinedRiskScore.total);

    const riskProfile: TransactionRiskProfile = {
      transaction_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: transaction.user_id,
      amount: transaction.amount,
      currency: transaction.currency,
      merchant_id: transaction.merchant_id,
      recipient_id: transaction.recipient_id,
      transaction_type: transaction.type as any,
      location: {
        latitude: transaction.location?.latitude,
        longitude: transaction.location?.longitude,
        ip_country: await this.getCountryFromIP(transaction.ip_address),
        ip_region: await this.getRegionFromIP(transaction.ip_address)
      },
      device_fingerprint_id: deviceFingerprint.id,
      timestamp: new Date(),
      risk_score: combinedRiskScore.total,
      risk_factors: riskFactors,
      ml_predictions: mlPredictions,
      status
    };

    // 10. Store Risk Profile
    await this.supabase
      .from('transaction_risk_profiles')
      .insert(riskProfile);

    // 11. Generate Alerts if Necessary
    if (combinedRiskScore.total >= this.riskThresholds.medium) {
      await this.generateFraudAlert(riskProfile);
    }

    // 12. Update User Behavioral Patterns
    await this.updateBehavioralPatterns(transaction.user_id, transaction);

    return riskProfile;
  }

  private async generateDeviceFingerprint(userId: string, deviceInfo: any, ipAddress: string): Promise<DeviceFingerprint> {
    const fingerprint = this.createBrowserFingerprint(deviceInfo);

    // Check if this device exists
    const existingDevice = await this.supabase
      .from('device_fingerprints')
      .select('*')
      .eq('user_id', userId)
      .eq('device_id', deviceInfo.deviceId)
      .single();

    if (existingDevice.data) {
      // Update existing device
      const updatedTrustScore = this.calculateDeviceTrustScore(existingDevice.data, deviceInfo);

      await this.supabase
        .from('device_fingerprints')
        .update({
          browser_fingerprint: fingerprint,
          last_seen: new Date().toISOString(),
          trust_score: updatedTrustScore,
          ip_address: ipAddress
        })
        .eq('id', existingDevice.data.id);

      return { ...existingDevice.data, trust_score: updatedTrustScore };
    } else {
      // Create new device fingerprint
      const newFingerprint: DeviceFingerprint = {
        id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        device_id: deviceInfo.deviceId,
        browser_fingerprint: fingerprint,
        screen_resolution: `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`,
        timezone: deviceInfo.timezone,
        language: deviceInfo.language,
        user_agent: deviceInfo.userAgent,
        ip_address: ipAddress,
        geolocation: deviceInfo.geolocation,
        created_at: new Date(),
        last_seen: new Date(),
        trust_score: 50 // Default trust score for new devices
      };

      await this.supabase
        .from('device_fingerprints')
        .insert(newFingerprint);

      return newFingerprint;
    }
  }

  private createBrowserFingerprint(deviceInfo: any): string {
    // Create a unique browser fingerprint
    const components = [
      deviceInfo.userAgent,
      deviceInfo.screenWidth,
      deviceInfo.screenHeight,
      deviceInfo.timezone,
      deviceInfo.language,
      deviceInfo.cookieEnabled ? '1' : '0',
      deviceInfo.doNotTrack || 'unknown'
    ];

    return this.hashString(components.join('|'));
  }

  private hashString(str: string): string {
    // Simple hash function (use crypto.subtle.digest in production)
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private async analyzeTransactionRisk(transaction: any): Promise<number> {
    // 1. Amount Risk Analysis
    const userHistory = await this.getUserTransactionHistory(transaction.user_id, 30);
    const amountRisk = this.calculateAmountRisk(transaction.amount, userHistory);

    // 2. Frequency Risk Analysis
    const recentTransactions = await this.getRecentTransactions(transaction.user_id, 24); // Last 24 hours
    const frequencyRisk = this.calculateFrequencyRisk(recentTransactions);

    // 3. Merchant Risk Analysis
    const merchantRisk = transaction.merchant_id
      ? await this.getMerchantRiskScore(transaction.merchant_id)
      : 0;

    // 4. Time-based Risk Analysis
    const timeRisk = this.calculateTimeRisk(new Date());

    return Math.min(100, (amountRisk * 0.3) + (frequencyRisk * 0.25) + (merchantRisk * 0.25) + (timeRisk * 0.2));
  }

  private calculateAmountRisk(amount: number, userHistory: any[]): number {
    if (userHistory.length === 0) return 70; // High risk for new users

    const amounts = userHistory.map(t => t.amount);
    const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const maxAmount = Math.max(...amounts);

    // Risk increases exponentially if amount is much larger than usual
    if (amount > maxAmount * 5) return 95;
    if (amount > maxAmount * 3) return 85;
    if (amount > maxAmount * 2) return 70;
    if (amount > avgAmount * 3) return 60;
    if (amount > avgAmount * 2) return 40;

    return 20; // Normal amount pattern
  }

  private calculateFrequencyRisk(recentTransactions: any[]): number {
    const transactionCount = recentTransactions.length;

    // Risk based on transaction frequency
    if (transactionCount > 20) return 90; // Very high frequency
    if (transactionCount > 15) return 70;
    if (transactionCount > 10) return 50;
    if (transactionCount > 5) return 30;

    return 10; // Normal frequency
  }

  private async getMerchantRiskScore(merchantId: string): Promise<number> {
    const merchantProfile = await this.supabase
      .from('merchant_risk_profiles')
      .select('risk_score, transaction_success_rate, dispute_rate')
      .eq('merchant_id', merchantId)
      .single();

    if (!merchantProfile.data) return 50; // Default risk for unknown merchants

    const data = merchantProfile.data;
    let risk = data.risk_score || 50;

    // Adjust risk based on performance metrics
    if (data.transaction_success_rate < 0.95) risk += 20;
    if (data.dispute_rate > 0.05) risk += 25;

    return Math.min(100, risk);
  }

  private calculateTimeRisk(timestamp: Date): number {
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();

    // Higher risk during unusual hours
    let risk = 0;

    // Night hours (11 PM - 6 AM) are higher risk
    if (hour >= 23 || hour <= 6) risk += 40;

    // Very early morning (2 AM - 5 AM) is highest risk
    if (hour >= 2 && hour <= 5) risk += 30;

    // Weekend nights are higher risk
    if ((dayOfWeek === 5 || dayOfWeek === 6) && (hour >= 22 || hour <= 3)) risk += 20;

    return Math.min(100, risk);
  }

  private async analyzeBehavioralPatterns(userId: string, transaction: any): Promise<number> {
    // Get user's behavioral patterns
    const patterns = await this.supabase
      .from('behavioral_patterns')
      .select('*')
      .eq('user_id', userId);

    if (!patterns.data || patterns.data.length === 0) {
      return 60; // Medium risk for users with no behavioral history
    }

    let totalDeviationScore = 0;
    let patternCount = 0;

    for (const pattern of patterns.data) {
      const deviation = this.calculatePatternDeviation(pattern, transaction);
      totalDeviationScore += deviation * pattern.confidence;
      patternCount++;
    }

    return patternCount > 0 ? Math.min(100, (totalDeviationScore / patternCount) * 100) : 60;
  }

  private calculatePatternDeviation(pattern: BehavioralPattern, transaction: any): number {
    switch (pattern.pattern_type) {
      case 'transaction_timing':
        return this.analyzeTimingDeviation(pattern, transaction);
      case 'amount_patterns':
        return this.analyzeAmountDeviation(pattern, transaction);
      case 'location_behavior':
        return this.analyzeLocationDeviation(pattern, transaction);
      default:
        return 0;
    }
  }

  private analyzeTimingDeviation(pattern: BehavioralPattern, transaction: any): number {
    const currentHour = new Date(transaction.timestamp || Date.now()).getHours();
    const baselineHours = pattern.baseline_metrics.preferred_hours || [];

    if (baselineHours.length === 0) return 0.5; // Medium deviation for unknown patterns

    const isTypicalTime = baselineHours.some((hour: number) => Math.abs(hour - currentHour) <= 2);
    return isTypicalTime ? 0.1 : 0.8; // High deviation if outside typical hours
  }

  private analyzeAmountDeviation(pattern: BehavioralPattern, transaction: any): number {
    const amount = transaction.amount;
    const baseline = pattern.baseline_metrics;

    const avgAmount = baseline.average_amount || 0;
    const stdDev = baseline.standard_deviation || avgAmount * 0.5;

    if (avgAmount === 0) return 0.5;

    const zScore = Math.abs((amount - avgAmount) / stdDev);

    // Convert z-score to deviation score (0-1)
    return Math.min(1, zScore / 3); // 3+ standard deviations = max deviation
  }

  private analyzeLocationDeviation(pattern: BehavioralPattern, transaction: any): number {
    if (!transaction.location) return 0.3; // Medium risk if no location data

    const baseline = pattern.baseline_metrics;
    const typicalLocations = baseline.typical_locations || [];

    if (typicalLocations.length === 0) return 0.4;

    // Check if current location is within typical range
    const currentLoc = transaction.location;
    const isTypicalLocation = typicalLocations.some((loc: any) => {
      const distance = this.calculateDistance(
        currentLoc.latitude, currentLoc.longitude,
        loc.latitude, loc.longitude
      );
      return distance < 50; // Within 50km of typical location
    });

    return isTypicalLocation ? 0.1 : 0.9;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private async assessDeviceTrust(deviceFingerprint: DeviceFingerprint): Promise<number> {
    const trustScore = deviceFingerprint.trust_score;
    const deviceAge = Date.now() - deviceFingerprint.created_at.getTime();
    const daysSinceCreation = deviceAge / (1000 * 60 * 60 * 24);

    // New devices are riskier
    let risk = 100 - trustScore;

    if (daysSinceCreation < 1) risk += 30; // Very new device
    else if (daysSinceCreation < 7) risk += 20; // New device
    else if (daysSinceCreation < 30) risk += 10; // Relatively new device

    return Math.min(100, risk);
  }

  private async analyzeLocationRisk(userId: string, currentLocation: any, ipAddress: string): Promise<number> {
    // Get user's location history
    const locationHistory = await this.getUserLocationHistory(userId, 30);

    // Get IP geolocation
    const ipLocation = await this.getLocationFromIP(ipAddress);

    let risk = 0;

    // Check if IP location matches GPS location (if available)
    if (currentLocation && ipLocation) {
      const distance = this.calculateDistance(
        currentLocation.latitude, currentLocation.longitude,
        ipLocation.latitude, ipLocation.longitude
      );

      if (distance > 1000) risk += 60; // Very distant IP vs GPS
      else if (distance > 500) risk += 40;
      else if (distance > 100) risk += 20;
    }

    // Check against historical locations
    if (locationHistory.length > 0) {
      const isTypicalLocation = locationHistory.some(loc => {
        const distance = currentLocation ? this.calculateDistance(
          currentLocation.latitude, currentLocation.longitude,
          loc.latitude, loc.longitude
        ) : this.calculateDistance(
          ipLocation.latitude, ipLocation.longitude,
          loc.latitude, loc.longitude
        );
        return distance < 100; // Within 100km
      });

      if (!isTypicalLocation) risk += 50;
    } else {
      risk += 30; // No location history
    }

    return Math.min(100, risk);
  }

  private async runMLPredictions(transaction: any, deviceFingerprint: DeviceFingerprint): Promise<{
    fraud_probability: number;
    anomaly_score: number;
    behavioral_score: number;
  }> {
    // In production, these would call actual ML models
    // For now, we'll simulate ML predictions based on our risk factors

    const features = await this.extractMLFeatures(transaction, deviceFingerprint);

    // Simulate ML model predictions
    const fraudProbability = this.simulateFraudModel(features);
    const anomalyScore = this.simulateAnomalyModel(features);
    const behavioralScore = this.simulateBehavioralModel(features);

    return {
      fraud_probability: fraudProbability,
      anomaly_score: anomalyScore,
      behavioral_score: behavioralScore
    };
  }

  private async extractMLFeatures(transaction: any, deviceFingerprint: DeviceFingerprint): Promise<Record<string, number>> {
    const userHistory = await this.getUserTransactionHistory(transaction.user_id, 30);
    const recentTransactions = await this.getRecentTransactions(transaction.user_id, 24);

    return {
      amount_normalized: transaction.amount / (userHistory.reduce((sum, t) => sum + t.amount, 0) / userHistory.length || 1),
      transaction_frequency: recentTransactions.length,
      device_age_days: (Date.now() - deviceFingerprint.created_at.getTime()) / (1000 * 60 * 60 * 24),
      device_trust: deviceFingerprint.trust_score / 100,
      hour_of_day: new Date().getHours(),
      day_of_week: new Date().getDay(),
      amount_log: Math.log(transaction.amount + 1),
      user_age_days: userHistory.length > 0 ?
        (Date.now() - new Date(userHistory[0].created_at).getTime()) / (1000 * 60 * 60 * 24) : 0
    };
  }

  private simulateFraudModel(features: Record<string, number>): number {
    // Simulate a fraud detection model
    let score = 0;

    if (features.amount_normalized > 5) score += 0.4;
    if (features.transaction_frequency > 15) score += 0.3;
    if (features.device_age_days < 1) score += 0.3;
    if (features.device_trust < 0.5) score += 0.2;
    if (features.hour_of_day < 6 || features.hour_of_day > 22) score += 0.2;

    return Math.min(1, score);
  }

  private simulateAnomalyModel(features: Record<string, number>): number {
    // Simulate anomaly detection
    const normalizedFeatures = Object.values(features);
    const mean = normalizedFeatures.reduce((sum, val) => sum + val, 0) / normalizedFeatures.length;
    const variance = normalizedFeatures.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / normalizedFeatures.length;

    return Math.min(1, variance / 10); // Normalize variance to 0-1 range
  }

  private simulateBehavioralModel(features: Record<string, number>): number {
    // Simulate behavioral analysis
    let score = 0.5; // Base score

    if (features.user_age_days < 7) score += 0.3; // New user
    if (features.amount_normalized > 3) score += 0.2; // Unusual amount

    return Math.min(1, score);
  }

  private calculateRiskScore(risks: {
    transaction: number;
    behavioral: number;
    device: number;
    location: number;
    ml: { fraud_probability: number; anomaly_score: number; behavioral_score: number };
  }): { total: number; components: Record<string, number> } {

    const weights = {
      transaction: 0.25,
      behavioral: 0.20,
      device: 0.15,
      location: 0.15,
      ml_fraud: 0.15,
      ml_anomaly: 0.05,
      ml_behavioral: 0.05
    };

    const components = {
      transaction: risks.transaction,
      behavioral: risks.behavioral,
      device: risks.device,
      location: risks.location,
      ml_fraud: risks.ml.fraud_probability * 100,
      ml_anomaly: risks.ml.anomaly_score * 100,
      ml_behavioral: risks.ml.behavioral_score * 100
    };

    const total = Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (components[key] * weight);
    }, 0);

    return {
      total: Math.min(100, Math.max(0, total)),
      components
    };
  }

  private generateRiskFactors(analysis: any): string[] {
    const factors: string[] = [];

    if (analysis.transactionRisk > 70) factors.push('Unusual transaction amount');
    if (analysis.behavioralRisk > 60) factors.push('Deviates from normal behavior patterns');
    if (analysis.deviceRisk > 50) factors.push('Untrusted or new device');
    if (analysis.locationRisk > 60) factors.push('Unusual location or IP mismatch');
    if (analysis.mlPredictions.fraud_probability > 0.7) factors.push('High fraud probability (ML)');
    if (analysis.mlPredictions.anomaly_score > 0.6) factors.push('Transaction anomaly detected');

    return factors;
  }

  private determineTransactionStatus(riskScore: number): 'approved' | 'flagged' | 'blocked' | 'under_review' {
    if (riskScore >= this.riskThresholds.critical) return 'blocked';
    if (riskScore >= this.riskThresholds.high) return 'under_review';
    if (riskScore >= this.riskThresholds.medium) return 'flagged';
    return 'approved';
  }

  private async generateFraudAlert(riskProfile: TransactionRiskProfile): Promise<void> {
    const alertType = this.determineAlertType(riskProfile);
    const severity = this.determineSeverity(riskProfile.risk_score);

    const alert: FraudAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      alert_type: alertType,
      severity,
      user_id: riskProfile.user_id,
      transaction_id: riskProfile.transaction_id,
      description: this.generateAlertDescription(riskProfile),
      risk_score: riskProfile.risk_score,
      evidence: {
        risk_factors: riskProfile.risk_factors,
        ml_predictions: riskProfile.ml_predictions,
        amount: riskProfile.amount,
        location: riskProfile.location
      },
      status: 'active',
      created_at: new Date()
    };

    await this.supabase
      .from('fraud_alerts')
      .insert(alert);
  }

  private determineAlertType(riskProfile: TransactionRiskProfile): FraudAlert['alert_type'] {
    if (riskProfile.risk_factors.includes('Unusual location or IP mismatch')) {
      return 'location_mismatch';
    }
    if (riskProfile.risk_factors.includes('Untrusted or new device')) {
      return 'device_anomaly';
    }
    if (riskProfile.risk_factors.includes('Deviates from normal behavior patterns')) {
      return 'suspicious_pattern';
    }
    return 'high_risk_transaction';
  }

  private determineSeverity(riskScore: number): FraudAlert['severity'] {
    if (riskScore >= this.riskThresholds.critical) return 'critical';
    if (riskScore >= this.riskThresholds.high) return 'high';
    if (riskScore >= this.riskThresholds.medium) return 'medium';
    return 'low';
  }

  private generateAlertDescription(riskProfile: TransactionRiskProfile): string {
    const amount = riskProfile.amount;
    const currency = riskProfile.currency;
    const factors = riskProfile.risk_factors.join(', ');

    return `High-risk ${riskProfile.transaction_type} transaction of ${amount} ${currency}. Risk factors: ${factors}`;
  }

  // Helper methods for data retrieval
  private async getUserTransactionHistory(userId: string, days: number): Promise<any[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    const result = await this.supabase
      .from('transactions')
      .select('amount, created_at, type')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    return result.data || [];
  }

  private async getRecentTransactions(userId: string, hours: number): Promise<any[]> {
    const startTime = new Date(Date.now() - (hours * 60 * 60 * 1000));

    const result = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startTime.toISOString());

    return result.data || [];
  }

  private async getUserLocationHistory(userId: string, days: number): Promise<any[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    const result = await this.supabase
      .from('user_locations')
      .select('latitude, longitude, timestamp')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    return result.data || [];
  }

  private calculateDeviceTrustScore(existingDevice: any, currentInfo: any): number {
    let trustScore = existingDevice.trust_score;

    // Increase trust over time with consistent usage
    const daysSinceCreation = (Date.now() - new Date(existingDevice.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > 30) trustScore += 5;
    if (daysSinceCreation > 90) trustScore += 10;

    // Check for consistency in device characteristics
    if (existingDevice.browser_fingerprint === this.createBrowserFingerprint(currentInfo)) {
      trustScore += 2; // Consistent fingerprint
    }

    return Math.min(100, trustScore);
  }

  private async getCountryFromIP(ipAddress: string): Promise<string> {
    // In production, use a GeoIP service
    // For demo, return Haiti as default
    return 'HT';
  }

  private async getRegionFromIP(ipAddress: string): Promise<string> {
    // In production, use a GeoIP service
    return 'Ouest';
  }

  private async getLocationFromIP(ipAddress: string): Promise<{ latitude: number; longitude: number }> {
    // In production, use a GeoIP service
    // Default to Port-au-Prince coordinates
    return { latitude: 18.5944, longitude: -72.3074 };
  }

  private async updateBehavioralPatterns(userId: string, transaction: any): Promise<void> {
    // Update user's behavioral patterns based on this transaction
    // This would typically involve updating ML model features and retraining

    const patterns = ['transaction_timing', 'amount_patterns', 'location_behavior'];

    for (const patternType of patterns) {
      await this.updateSpecificPattern(userId, patternType, transaction);
    }
  }

  private async updateSpecificPattern(userId: string, patternType: string, transaction: any): Promise<void> {
    const existingPattern = await this.supabase
      .from('behavioral_patterns')
      .select('*')
      .eq('user_id', userId)
      .eq('pattern_type', patternType)
      .single();

    const newMetrics = this.calculatePatternMetrics(patternType, transaction);

    if (existingPattern.data) {
      // Update existing pattern
      const updated = this.mergePatternMetrics(existingPattern.data.baseline_metrics, newMetrics);

      await this.supabase
        .from('behavioral_patterns')
        .update({
          baseline_metrics: updated,
          current_metrics: newMetrics,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingPattern.data.id);
    } else {
      // Create new pattern
      await this.supabase
        .from('behavioral_patterns')
        .insert({
          user_id: userId,
          pattern_type: patternType,
          baseline_metrics: newMetrics,
          current_metrics: newMetrics,
          deviation_score: 0,
          confidence: 0.1, // Low confidence for new patterns
          last_updated: new Date().toISOString()
        });
    }
  }

  private calculatePatternMetrics(patternType: string, transaction: any): Record<string, any> {
    const now = new Date(transaction.timestamp || Date.now());

    switch (patternType) {
      case 'transaction_timing':
        return {
          preferred_hours: [now.getHours()],
          preferred_days: [now.getDay()],
          frequency_per_day: 1
        };

      case 'amount_patterns':
        return {
          average_amount: transaction.amount,
          typical_ranges: [`${Math.floor(transaction.amount / 10) * 10}-${Math.ceil(transaction.amount / 10) * 10}`],
          standard_deviation: 0
        };

      case 'location_behavior':
        return transaction.location ? {
          typical_locations: [{
            latitude: transaction.location.latitude,
            longitude: transaction.location.longitude,
            frequency: 1
          }]
        } : {};

      default:
        return {};
    }
  }

  private mergePatternMetrics(existing: Record<string, any>, newData: Record<string, any>): Record<string, any> {
    // Simple merge logic - in production, this would be more sophisticated
    return {
      ...existing,
      ...newData,
      last_transaction: new Date().toISOString()
    };
  }

  // Public API methods
  public async getFraudAlerts(userId?: string): Promise<FraudAlert[]> {
    let query = this.supabase
      .from('fraud_alerts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const result = await query.limit(50);
    return result.data || [];
  }

  public async getTransactionRiskProfile(transactionId: string): Promise<TransactionRiskProfile | null> {
    const result = await this.supabase
      .from('transaction_risk_profiles')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    return result.data || null;
  }

  public async updateAlertStatus(alertId: string, status: FraudAlert['status'], assignedTo?: string): Promise<void> {
    const updateData: any = { status };

    if (status === 'resolved' || status === 'false_positive') {
      updateData.resolved_at = new Date().toISOString();
    }

    if (assignedTo) {
      updateData.assigned_to = assignedTo;
    }

    await this.supabase
      .from('fraud_alerts')
      .update(updateData)
      .eq('id', alertId);
  }
}

// Singleton instance
export const fraudDetection = new FraudDetectionEngine();

// React hook for using fraud detection
export function useFraudDetection() {
  const [alerts, setAlerts] = React.useState<FraudAlert[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const loadAlerts = async () => {
      setLoading(true);
      try {
        const fraudAlerts = await fraudDetection.getFraudAlerts();
        setAlerts(fraudAlerts);
      } catch (error) {
        console.error('Failed to load fraud alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  return {
    alerts,
    loading,
    screenTransaction: fraudDetection.screenTransaction.bind(fraudDetection),
    getTransactionRiskProfile: fraudDetection.getTransactionRiskProfile.bind(fraudDetection),
    updateAlertStatus: fraudDetection.updateAlertStatus.bind(fraudDetection)
  };
}

// Import React for the hook
import React from 'react';