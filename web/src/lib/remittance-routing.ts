"use client";

import { createClient } from '@supabase/supabase-js';

// Remittance Routing Interfaces
export interface RemittanceCorridor {
  id: string;
  origin_country: string;
  destination_country: string;
  currency_from: string;
  currency_to: string;
  is_active: boolean;
  regulatory_requirements: string[];
  compliance_level: 'basic' | 'enhanced' | 'strict';
  average_delivery_time: number; // in hours
  volume_limits: {
    min_amount: number;
    max_amount: number;
    daily_limit: number;
  };
  created_at: Date;
  updated_at: Date;
}

export interface RemittanceProvider {
  id: string;
  name: string;
  provider_type: 'bank' | 'mto' | 'fintech' | 'crypto' | 'mobile_money';
  supported_corridors: string[];
  fee_structure: {
    base_fee: number;
    percentage_fee: number;
    minimum_fee: number;
    maximum_fee: number;
    currency: string;
  };
  exchange_rate_margin: number; // percentage margin on mid-market rate
  delivery_methods: string[]; // ['cash_pickup', 'bank_deposit', 'mobile_wallet', 'home_delivery']
  average_delivery_time: number;
  success_rate: number;
  compliance_rating: number; // 0-100
  api_integration: {
    has_api: boolean;
    real_time_rates: boolean;
    real_time_tracking: boolean;
    webhook_support: boolean;
  };
  is_active: boolean;
  created_at: Date;
}

export interface RemittanceRoute {
  id: string;
  corridor_id: string;
  provider_id: string;
  origin_agent?: string;
  destination_agent?: string;
  total_cost: number;
  exchange_rate: number;
  fees: {
    provider_fee: number;
    agent_fee: number;
    regulatory_fee: number;
    total_fee: number;
  };
  estimated_delivery_time: number; // in hours
  delivery_method: string;
  confidence_score: number; // 0-100, route reliability
  capacity_available: boolean;
  regulatory_compliant: boolean;
  created_at: Date;
  expires_at: Date;
}

export interface RemittanceQuote {
  id: string;
  user_id: string;
  send_amount: number;
  send_currency: string;
  receive_amount: number;
  receive_currency: string;
  corridor_id: string;
  recommended_routes: RemittanceRoute[];
  best_rate_route: RemittanceRoute;
  fastest_route: RemittanceRoute;
  cheapest_route: RemittanceRoute;
  ai_recommended_route: RemittanceRoute;
  recipient_info: {
    name: string;
    phone?: string;
    email?: string;
    location: string;
    preferred_delivery: string;
  };
  quote_expires_at: Date;
  created_at: Date;
}

export interface CashFlowPrediction {
  distributor_id: string;
  corridor_id: string;
  currency: string;
  predicted_inflow: number;
  predicted_outflow: number;
  net_flow: number;
  confidence: number;
  prediction_date: Date;
  factors: {
    seasonal_trend: number;
    market_events: string[];
    historical_pattern: number;
    external_factors: Record<string, number>;
  };
  recommended_actions: string[];
}

class IntelligentRemittanceRouter {
  private supabase: any;
  private aiModels: Map<string, any> = new Map();
  private corridorCache: Map<string, RemittanceCorridor> = new Map();
  private providerCache: Map<string, RemittanceProvider> = new Map();
  private ratesCache: Map<string, any> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      this.initializeAIModels();
      this.startRealTimeUpdates();
    }
  }

  private async initializeAIModels() {
    // Initialize AI models for remittance optimization

    // Route Optimization Model
    this.aiModels.set('route_optimizer', {
      type: 'multi_objective_optimization',
      objectives: ['cost', 'speed', 'reliability', 'compliance'],
      weights: { cost: 0.35, speed: 0.25, reliability: 0.25, compliance: 0.15 },
      constraints: ['regulatory_limits', 'capacity_limits', 'user_preferences']
    });

    // Cash Flow Prediction Model
    this.aiModels.set('cash_flow_predictor', {
      type: 'lstm_ensemble',
      features: ['historical_flows', 'seasonal_patterns', 'market_events', 'economic_indicators'],
      prediction_horizons: [1, 7, 30], // days
      update_frequency: 3600000 // 1 hour
    });

    // Dynamic Pricing Model
    this.aiModels.set('dynamic_pricing', {
      type: 'reinforcement_learning',
      features: ['demand', 'competition', 'capacity', 'market_conditions'],
      objectives: ['profit_maximization', 'market_share', 'customer_satisfaction']
    });

    // Risk Assessment Model
    this.aiModels.set('corridor_risk_assessment', {
      type: 'gradient_boosting',
      features: ['regulatory_changes', 'political_stability', 'economic_volatility', 'operational_risk'],
      risk_categories: ['low', 'medium', 'high', 'critical']
    });
  }

  private startRealTimeUpdates() {
    // Subscribe to real-time exchange rate updates
    this.supabase
      .channel('exchange_rates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'exchange_rates'
      }, (payload: any) => {
        this.handleExchangeRateUpdate(payload);
      })
      .subscribe();

    // Subscribe to provider capacity updates
    this.supabase
      .channel('provider_capacity')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'remittance_providers'
      }, (payload: any) => {
        this.handleProviderUpdate(payload);
      })
      .subscribe();

    // Subscribe to corridor regulatory updates
    this.supabase
      .channel('corridor_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'remittance_corridors'
      }, (payload: any) => {
        this.handleCorridorUpdate(payload);
      })
      .subscribe();
  }

  // Main Route Optimization Function
  public async findOptimalRoutes(request: {
    send_amount: number;
    send_currency: string;
    receive_currency: string;
    origin_country: string;
    destination_country: string;
    delivery_preference?: string;
    speed_preference?: 'fastest' | 'balanced' | 'cheapest';
    user_profile?: {
      user_id: string;
      risk_tolerance: number;
      previous_transactions: any[];
      compliance_level: string;
    };
    recipient_info: {
      name: string;
      location: string;
      phone?: string;
      email?: string;
      preferred_delivery?: string;
    };
  }): Promise<RemittanceQuote> {

    // 1. Find Available Corridors
    const corridor = await this.findCorridor(
      request.origin_country,
      request.destination_country,
      request.send_currency,
      request.receive_currency
    );

    if (!corridor) {
      throw new Error('No available corridor for this route');
    }

    // 2. Get Available Providers and Routes
    const availableRoutes = await this.getAvailableRoutes(corridor.id, request.send_amount);

    // 3. Calculate Real-time Costs and Delivery Times
    const enrichedRoutes = await this.enrichRoutesWithRealTimeData(availableRoutes, request);

    // 4. Apply AI-based Route Optimization
    const optimizedRoutes = await this.optimizeRoutes(enrichedRoutes, request);

    // 5. Generate Personalized Recommendations
    const personalizedRoutes = await this.personalizeRecommendations(optimizedRoutes, request);

    // 6. Create Quote with Multiple Options
    const quote = await this.generateQuote({
      ...request,
      corridor_id: corridor.id,
      routes: personalizedRoutes
    });

    // 7. Store Quote for Analytics
    await this.storeQuote(quote);

    // 8. Update Cash Flow Predictions
    await this.updateCashFlowPredictions(corridor.id, request.send_amount);

    return quote;
  }

  private async findCorridor(
    originCountry: string,
    destinationCountry: string,
    sendCurrency: string,
    receiveCurrency: string
  ): Promise<RemittanceCorridor | null> {

    const cacheKey = `${originCountry}-${destinationCountry}-${sendCurrency}-${receiveCurrency}`;

    if (this.corridorCache.has(cacheKey)) {
      return this.corridorCache.get(cacheKey)!;
    }

    const result = await this.supabase
      .from('remittance_corridors')
      .select('*')
      .eq('origin_country', originCountry)
      .eq('destination_country', destinationCountry)
      .eq('currency_from', sendCurrency)
      .eq('currency_to', receiveCurrency)
      .eq('is_active', true)
      .single();

    if (result.data) {
      this.corridorCache.set(cacheKey, result.data);
      return result.data;
    }

    return null;
  }

  private async getAvailableRoutes(corridorId: string, amount: number): Promise<RemittanceRoute[]> {
    // Get all active providers for this corridor
    const providers = await this.supabase
      .from('remittance_providers')
      .select('*')
      .contains('supported_corridors', [corridorId])
      .eq('is_active', true);

    if (!providers.data) return [];

    const routes: RemittanceRoute[] = [];

    for (const provider of providers.data) {
      // Check if amount is within provider limits
      if (amount >= provider.fee_structure.minimum_fee &&
          (provider.fee_structure.maximum_fee === 0 || amount <= provider.fee_structure.maximum_fee)) {

        // Calculate base costs
        const providerFee = Math.max(
          provider.fee_structure.minimum_fee,
          Math.min(
            provider.fee_structure.maximum_fee || Infinity,
            provider.fee_structure.base_fee + (amount * provider.fee_structure.percentage_fee / 100)
          )
        );

        const route: RemittanceRoute = {
          id: `route_${corridorId}_${provider.id}_${Date.now()}`,
          corridor_id: corridorId,
          provider_id: provider.id,
          total_cost: providerFee, // Will be enriched with real-time data
          exchange_rate: 0, // Will be fetched in real-time
          fees: {
            provider_fee: providerFee,
            agent_fee: 0,
            regulatory_fee: 0,
            total_fee: providerFee
          },
          estimated_delivery_time: provider.average_delivery_time,
          delivery_method: provider.delivery_methods[0], // Default to first available
          confidence_score: provider.success_rate,
          capacity_available: true, // Will be checked in real-time
          regulatory_compliant: provider.compliance_rating >= 80,
          created_at: new Date(),
          expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        };

        routes.push(route);
      }
    }

    return routes;
  }

  private async enrichRoutesWithRealTimeData(
    routes: RemittanceRoute[],
    request: any
  ): Promise<RemittanceRoute[]> {

    const enrichedRoutes = await Promise.all(
      routes.map(async (route) => {
        // Get real-time exchange rate
        const exchangeRate = await this.getRealTimeExchangeRate(
          request.send_currency,
          request.receive_currency,
          route.provider_id
        );

        // Get real-time capacity
        const capacity = await this.checkProviderCapacity(route.provider_id, request.send_amount);

        // Calculate regulatory fees
        const regulatoryFees = await this.calculateRegulatoryFees(route.corridor_id, request.send_amount);

        // Get agent fees if applicable
        const agentFees = await this.getAgentFees(route, request.recipient_info.location);

        // Update route with enriched data
        const enrichedRoute: RemittanceRoute = {
          ...route,
          exchange_rate: exchangeRate.rate,
          fees: {
            ...route.fees,
            agent_fee: agentFees,
            regulatory_fee: regulatoryFees,
            total_fee: route.fees.provider_fee + agentFees + regulatoryFees
          },
          total_cost: route.fees.provider_fee + agentFees + regulatoryFees,
          capacity_available: capacity.available,
          confidence_score: this.calculateRouteConfidence(route, capacity, exchangeRate)
        };

        return enrichedRoute;
      })
    );

    return enrichedRoutes.filter(route => route.capacity_available);
  }

  private async getRealTimeExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    providerId: string
  ): Promise<{ rate: number; timestamp: Date }> {

    const cacheKey = `${fromCurrency}-${toCurrency}-${providerId}`;

    if (this.ratesCache.has(cacheKey)) {
      const cached = this.ratesCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 60000) { // 1 minute cache
        return cached;
      }
    }

    // Get mid-market rate
    const midMarketRate = await this.supabase
      .from('exchange_rates')
      .select('rate, updated_at')
      .eq('from_currency', fromCurrency)
      .eq('to_currency', toCurrency)
      .eq('provider', 'mid_market')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (!midMarketRate.data) {
      throw new Error(`No exchange rate found for ${fromCurrency}/${toCurrency}`);
    }

    // Get provider's margin
    const provider = await this.getProvider(providerId);
    const providerRate = midMarketRate.data.rate * (1 - provider.exchange_rate_margin / 100);

    const result = {
      rate: providerRate,
      timestamp: new Date()
    };

    this.ratesCache.set(cacheKey, result);
    return result;
  }

  private async checkProviderCapacity(providerId: string, amount: number): Promise<{ available: boolean; remaining: number }> {
    // Check real-time provider capacity
    const capacityCheck = await this.supabase
      .from('provider_capacity')
      .select('available_amount, last_updated')
      .eq('provider_id', providerId)
      .single();

    if (!capacityCheck.data) {
      return { available: true, remaining: Infinity }; // Assume unlimited if no data
    }

    const available = capacityCheck.data.available_amount >= amount;
    return {
      available,
      remaining: capacityCheck.data.available_amount
    };
  }

  private async calculateRegulatoryFees(corridorId: string, amount: number): Promise<number> {
    // Calculate regulatory and compliance fees
    const corridor = await this.getCorridor(corridorId);

    let regulatoryFee = 0;

    // Base regulatory fee based on compliance level
    switch (corridor.compliance_level) {
      case 'strict':
        regulatoryFee += amount * 0.005; // 0.5%
        break;
      case 'enhanced':
        regulatoryFee += amount * 0.003; // 0.3%
        break;
      case 'basic':
        regulatoryFee += amount * 0.001; // 0.1%
        break;
    }

    // Additional fees for large amounts (AML reporting)
    if (amount > 10000) {
      regulatoryFee += 25; // Fixed AML reporting fee
    }

    return regulatoryFee;
  }

  private async getAgentFees(route: RemittanceRoute, destinationLocation: string): Promise<number> {
    // Calculate agent fees based on delivery location
    const agentFees = await this.supabase
      .from('agent_fees')
      .select('fee_amount, fee_percentage')
      .eq('corridor_id', route.corridor_id)
      .eq('location', destinationLocation)
      .single();

    if (!agentFees.data) {
      return 5; // Default agent fee
    }

    return agentFees.data.fee_amount || 0;
  }

  private calculateRouteConfidence(route: RemittanceRoute, capacity: any, exchangeRate: any): number {
    let confidence = route.confidence_score;

    // Adjust based on capacity
    if (capacity.remaining < route.total_cost * 2) {
      confidence -= 10; // Reduce confidence if low capacity
    }

    // Adjust based on exchange rate age
    const rateAge = Date.now() - new Date(exchangeRate.timestamp).getTime();
    if (rateAge > 300000) { // 5 minutes
      confidence -= 5;
    }

    return Math.max(0, Math.min(100, confidence));
  }

  private async optimizeRoutes(routes: RemittanceRoute[], request: any): Promise<RemittanceRoute[]> {
    // Apply AI-based multi-objective optimization
    const optimizer = this.aiModels.get('route_optimizer');

    const scoredRoutes = routes.map(route => {
      const scores = {
        cost: this.calculateCostScore(route, request.send_amount),
        speed: this.calculateSpeedScore(route),
        reliability: route.confidence_score / 100,
        compliance: route.regulatory_compliant ? 1 : 0
      };

      // Calculate weighted score
      const weightedScore = Object.entries(optimizer.weights).reduce((sum, [key, weight]) => {
        return sum + (scores[key] * weight);
      }, 0);

      return {
        ...route,
        ai_score: weightedScore,
        detailed_scores: scores
      };
    });

    // Sort by AI score and return top routes
    return scoredRoutes
      .sort((a, b) => b.ai_score - a.ai_score)
      .slice(0, 5); // Return top 5 routes
  }

  private calculateCostScore(route: RemittanceRoute, sendAmount: number): number {
    const totalCostPercentage = (route.total_cost / sendAmount) * 100;

    // Lower cost = higher score
    if (totalCostPercentage <= 2) return 1;
    if (totalCostPercentage <= 4) return 0.8;
    if (totalCostPercentage <= 6) return 0.6;
    if (totalCostPercentage <= 8) return 0.4;
    return 0.2;
  }

  private calculateSpeedScore(route: RemittanceRoute): number {
    // Faster delivery = higher score
    if (route.estimated_delivery_time <= 1) return 1; // Within 1 hour
    if (route.estimated_delivery_time <= 4) return 0.8; // Within 4 hours
    if (route.estimated_delivery_time <= 24) return 0.6; // Within 1 day
    if (route.estimated_delivery_time <= 48) return 0.4; // Within 2 days
    return 0.2; // More than 2 days
  }

  private async personalizeRecommendations(routes: RemittanceRoute[], request: any): Promise<RemittanceRoute[]> {
    if (!request.user_profile) return routes;

    // Analyze user's transaction history for preferences
    const userPreferences = await this.analyzeUserPreferences(request.user_profile.user_id);

    // Adjust scores based on user preferences
    const personalizedRoutes = routes.map(route => {
      let personalizedScore = route.ai_score;

      // Prefer providers user has used successfully before
      if (userPreferences.preferredProviders.includes(route.provider_id)) {
        personalizedScore += 0.1;
      }

      // Adjust based on user's speed vs cost preference
      if (userPreferences.prefersSpeed && route.estimated_delivery_time <= 4) {
        personalizedScore += 0.05;
      }

      if (userPreferences.prefersCost && route.total_cost <= userPreferences.averageCost) {
        personalizedScore += 0.05;
      }

      return {
        ...route,
        personalized_score: Math.min(1, personalizedScore)
      };
    });

    return personalizedRoutes.sort((a, b) => b.personalized_score - a.personalized_score);
  }

  private async analyzeUserPreferences(userId: string): Promise<{
    preferredProviders: string[];
    prefersSpeed: boolean;
    prefersCost: boolean;
    averageCost: number;
  }> {
    // Analyze user's transaction history
    const userTransactions = await this.supabase
      .from('remittance_transactions')
      .select('provider_id, total_cost, delivery_time, user_rating')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!userTransactions.data || userTransactions.data.length === 0) {
      return {
        preferredProviders: [],
        prefersSpeed: false,
        prefersCost: true, // Default to cost preference
        averageCost: 0
      };
    }

    const transactions = userTransactions.data;

    // Find preferred providers (high-rated transactions)
    const preferredProviders = transactions
      .filter(t => t.user_rating >= 4)
      .map(t => t.provider_id)
      .filter((provider, index, self) => self.indexOf(provider) === index);

    // Determine speed vs cost preference
    const fastTransactions = transactions.filter(t => t.delivery_time <= 4);
    const cheapTransactions = transactions.filter(t => t.total_cost <= transactions.reduce((sum, tx) => sum + tx.total_cost, 0) / transactions.length);

    const prefersSpeed = fastTransactions.length > cheapTransactions.length;
    const prefersCost = !prefersSpeed;

    const averageCost = transactions.reduce((sum, tx) => sum + tx.total_cost, 0) / transactions.length;

    return {
      preferredProviders,
      prefersSpeed,
      prefersCost,
      averageCost
    };
  }

  private async generateQuote(data: any): Promise<RemittanceQuote> {
    const routes = data.routes;

    // Find best routes by different criteria
    const bestRateRoute = routes.reduce((best: RemittanceRoute, current: RemittanceRoute) =>
      current.exchange_rate > best.exchange_rate ? current : best
    );

    const fastestRoute = routes.reduce((fastest: RemittanceRoute, current: RemittanceRoute) =>
      current.estimated_delivery_time < fastest.estimated_delivery_time ? current : fastest
    );

    const cheapestRoute = routes.reduce((cheapest: RemittanceRoute, current: RemittanceRoute) =>
      current.total_cost < cheapest.total_cost ? current : cheapest
    );

    const aiRecommendedRoute = routes[0]; // Highest AI score

    // Calculate receive amount using AI recommended route
    const receiveAmount = (data.send_amount - aiRecommendedRoute.total_cost) * aiRecommendedRoute.exchange_rate;

    const quote: RemittanceQuote = {
      id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: data.user_profile?.user_id || 'anonymous',
      send_amount: data.send_amount,
      send_currency: data.send_currency,
      receive_amount: receiveAmount,
      receive_currency: data.receive_currency,
      corridor_id: data.corridor_id,
      recommended_routes: routes,
      best_rate_route: bestRateRoute,
      fastest_route: fastestRoute,
      cheapest_route: cheapestRoute,
      ai_recommended_route: aiRecommendedRoute,
      recipient_info: data.recipient_info,
      quote_expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      created_at: new Date()
    };

    return quote;
  }

  private async storeQuote(quote: RemittanceQuote): Promise<void> {
    await this.supabase
      .from('remittance_quotes')
      .insert(quote);
  }

  // Cash Flow Prediction System
  public async predictCashFlow(
    distributorId: string,
    corridorId: string,
    predictionDays: number = 7
  ): Promise<CashFlowPrediction[]> {

    // Get historical cash flow data
    const historicalData = await this.getHistoricalCashFlow(distributorId, corridorId, 90);

    // Get market intelligence data
    const marketData = await this.getMarketIntelligenceData(corridorId);

    // Apply ML prediction model
    const predictions = await this.runCashFlowPrediction(
      historicalData,
      marketData,
      predictionDays
    );

    // Store predictions
    await this.storeCashFlowPredictions(predictions);

    return predictions;
  }

  private async getHistoricalCashFlow(distributorId: string, corridorId: string, days: number): Promise<any[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    const result = await this.supabase
      .from('distributor_cash_flows')
      .select('*')
      .eq('distributor_id', distributorId)
      .eq('corridor_id', corridorId)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: true });

    return result.data || [];
  }

  private async getMarketIntelligenceData(corridorId: string): Promise<any> {
    // Get relevant market data for predictions
    const marketData = await this.supabase
      .from('market_insights')
      .select('*')
      .eq('corridor_id', corridorId)
      .order('timestamp', { ascending: false })
      .limit(30);

    return marketData.data || [];
  }

  private async runCashFlowPrediction(
    historicalData: any[],
    marketData: any[],
    predictionDays: number
  ): Promise<CashFlowPrediction[]> {

    const predictions: CashFlowPrediction[] = [];

    // Simple prediction logic (in production, use actual ML models)
    for (let i = 1; i <= predictionDays; i++) {
      const predictionDate = new Date(Date.now() + (i * 24 * 60 * 60 * 1000));

      // Calculate trends from historical data
      const recentFlows = historicalData.slice(-14); // Last 14 days
      const avgInflow = recentFlows.reduce((sum, flow) => sum + flow.inflow, 0) / recentFlows.length;
      const avgOutflow = recentFlows.reduce((sum, flow) => sum + flow.outflow, 0) / recentFlows.length;

      // Apply seasonal adjustments
      const seasonalMultiplier = this.getSeasonalMultiplier(predictionDate);

      // Apply market intelligence adjustments
      const marketMultiplier = this.calculateMarketMultiplier(marketData);

      const predictedInflow = avgInflow * seasonalMultiplier * marketMultiplier;
      const predictedOutflow = avgOutflow * seasonalMultiplier;

      const prediction: CashFlowPrediction = {
        distributor_id: historicalData[0]?.distributor_id || '',
        corridor_id: historicalData[0]?.corridor_id || '',
        currency: 'HTG', // Default currency
        predicted_inflow: predictedInflow,
        predicted_outflow: predictedOutflow,
        net_flow: predictedInflow - predictedOutflow,
        confidence: this.calculatePredictionConfidence(recentFlows.length, marketData.length),
        prediction_date: predictionDate,
        factors: {
          seasonal_trend: seasonalMultiplier,
          market_events: this.extractMarketEvents(marketData),
          historical_pattern: avgInflow / avgOutflow,
          external_factors: {}
        },
        recommended_actions: this.generateRecommendedActions(predictedInflow - predictedOutflow)
      };

      predictions.push(prediction);
    }

    return predictions;
  }

  private getSeasonalMultiplier(date: Date): number {
    // Simple seasonal adjustment based on day of week and month
    const dayOfWeek = date.getDay();
    const month = date.getMonth();

    let multiplier = 1;

    // Weekend adjustments
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      multiplier *= 1.2; // Higher remittance activity on weekends
    }

    // Holiday season adjustments (November-December)
    if (month >= 10) {
      multiplier *= 1.3;
    }

    return multiplier;
  }

  private calculateMarketMultiplier(marketData: any[]): number {
    if (marketData.length === 0) return 1;

    // Analyze market trends
    const recentInsights = marketData.slice(0, 7); // Last week
    const avgSentiment = recentInsights.reduce((sum, insight) => sum + (insight.market_sentiment || 0), 0) / recentInsights.length;

    // Convert sentiment to multiplier (0.8 to 1.2 range)
    return 0.8 + (avgSentiment / 100) * 0.4;
  }

  private calculatePredictionConfidence(dataPoints: number, marketDataPoints: number): number {
    // Base confidence on available data
    let confidence = Math.min(90, dataPoints * 3); // Max 90% confidence

    // Boost confidence with market data
    if (marketDataPoints > 0) {
      confidence += Math.min(10, marketDataPoints);
    }

    return Math.min(100, confidence) / 100;
  }

  private extractMarketEvents(marketData: any[]): string[] {
    // Extract significant market events that might affect cash flow
    const events = [];

    for (const data of marketData.slice(0, 7)) {
      if (data.economic_events && data.economic_events.length > 0) {
        events.push(...data.economic_events);
      }

      if (data.exchange_rate_volatility > 0.05) {
        events.push('High exchange rate volatility');
      }
    }

    return [...new Set(events)]; // Remove duplicates
  }

  private generateRecommendedActions(netFlow: number): string[] {
    const actions = [];

    if (netFlow < -1000) {
      actions.push('Consider increasing cash reserves');
      actions.push('Contact headquarters for cash transfer');
      actions.push('Review outflow patterns for optimization');
    } else if (netFlow > 2000) {
      actions.push('Excess cash available - consider investment options');
      actions.push('Review inflow capacity for growth opportunities');
    } else {
      actions.push('Cash flow within normal range');
      actions.push('Monitor for any unusual patterns');
    }

    return actions;
  }

  private async storeCashFlowPredictions(predictions: CashFlowPrediction[]): Promise<void> {
    await this.supabase
      .from('cash_flow_predictions')
      .insert(predictions);
  }

  private async updateCashFlowPredictions(corridorId: string, transactionAmount: number): Promise<void> {
    // Update predictions based on new transaction
    // This would trigger real-time updates to cash flow models

    const updateData = {
      corridor_id: corridorId,
      transaction_amount: transactionAmount,
      timestamp: new Date().toISOString()
    };

    await this.supabase
      .from('real_time_transactions')
      .insert(updateData);
  }

  // Real-time Event Handlers
  private handleExchangeRateUpdate(payload: any): void {
    // Clear relevant rate cache entries
    for (const [key, value] of this.ratesCache.entries()) {
      if (key.includes(payload.new.from_currency) && key.includes(payload.new.to_currency)) {
        this.ratesCache.delete(key);
      }
    }

    // Notify connected clients about rate changes
    this.broadcastRateUpdate(payload.new);
  }

  private handleProviderUpdate(payload: any): void {
    // Update provider cache
    if (payload.new) {
      this.providerCache.set(payload.new.id, payload.new);
    }

    // Recalculate routes if provider capacity changed
    if (payload.eventType === 'UPDATE' && payload.new.capacity !== payload.old.capacity) {
      this.recalculateAffectedRoutes(payload.new.id);
    }
  }

  private handleCorridorUpdate(payload: any): void {
    // Update corridor cache
    if (payload.new) {
      const cacheKey = `${payload.new.origin_country}-${payload.new.destination_country}-${payload.new.currency_from}-${payload.new.currency_to}`;
      this.corridorCache.set(cacheKey, payload.new);
    }
  }

  private broadcastRateUpdate(rateData: any): void {
    // Broadcast rate updates to connected clients
    // This would typically use WebSocket or Server-Sent Events
    console.log('Broadcasting rate update:', rateData);
  }

  private async recalculateAffectedRoutes(providerId: string): Promise<void> {
    // Recalculate routes that use this provider
    // This ensures real-time accuracy of route recommendations
    console.log('Recalculating routes for provider:', providerId);
  }

  // Helper methods
  private async getProvider(providerId: string): Promise<RemittanceProvider> {
    if (this.providerCache.has(providerId)) {
      return this.providerCache.get(providerId)!;
    }

    const result = await this.supabase
      .from('remittance_providers')
      .select('*')
      .eq('id', providerId)
      .single();

    if (result.data) {
      this.providerCache.set(providerId, result.data);
      return result.data;
    }

    throw new Error(`Provider not found: ${providerId}`);
  }

  private async getCorridor(corridorId: string): Promise<RemittanceCorridor> {
    const result = await this.supabase
      .from('remittance_corridors')
      .select('*')
      .eq('id', corridorId)
      .single();

    if (result.data) {
      return result.data;
    }

    throw new Error(`Corridor not found: ${corridorId}`);
  }

  // Public API Methods
  public async getActiveCorridors(): Promise<RemittanceCorridor[]> {
    const result = await this.supabase
      .from('remittance_corridors')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    return result.data || [];
  }

  public async getQuote(quoteId: string): Promise<RemittanceQuote | null> {
    const result = await this.supabase
      .from('remittance_quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    return result.data || null;
  }

  public async executeTransaction(quoteId: string, selectedRouteId: string): Promise<{ transaction_id: string; status: string }> {
    // Execute the selected route from a quote
    const quote = await this.getQuote(quoteId);

    if (!quote) {
      throw new Error('Quote not found');
    }

    if (new Date() > quote.quote_expires_at) {
      throw new Error('Quote has expired');
    }

    const selectedRoute = quote.recommended_routes.find(r => r.id === selectedRouteId);

    if (!selectedRoute) {
      throw new Error('Selected route not found in quote');
    }

    // Create transaction record
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const transactionData = {
      id: transactionId,
      quote_id: quoteId,
      route_id: selectedRouteId,
      user_id: quote.user_id,
      status: 'processing',
      created_at: new Date().toISOString()
    };

    await this.supabase
      .from('remittance_transactions')
      .insert(transactionData);

    return {
      transaction_id: transactionId,
      status: 'processing'
    };
  }
}

// Singleton instance
export const remittanceRouter = new IntelligentRemittanceRouter();

// React hook for using remittance routing
export function useRemittanceRouter() {
  const [activeCorridors, setActiveCorridors] = React.useState<RemittanceCorridor[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadCorridors = async () => {
      setLoading(true);
      try {
        const corridors = await remittanceRouter.getActiveCorridors();
        setActiveCorridors(corridors);
      } catch (error) {
        console.error('Failed to load corridors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCorridors();
  }, []);

  return {
    activeCorridors,
    loading,
    findOptimalRoutes: remittanceRouter.findOptimalRoutes.bind(remittanceRouter),
    predictCashFlow: remittanceRouter.predictCashFlow.bind(remittanceRouter),
    executeTransaction: remittanceRouter.executeTransaction.bind(remittanceRouter),
    getQuote: remittanceRouter.getQuote.bind(remittanceRouter)
  };
}

// Import React for the hook
import React from 'react';