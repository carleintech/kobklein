// Predictive Cash Management System
// AI-powered system for optimizing distributor cash management, inventory forecasting,
// and automated distribution scheduling for the KobKlein network

import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

// Core interfaces for the cash management system
export interface DistributorProfile {
  id: string;
  agent_id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    region: string;
  };
  business_type: "agent" | "merchant" | "mobile_money";
  capacity_limits: {
    daily_volume: number;
    max_inventory: number;
    min_threshold: number;
    optimal_level: number;
  };
  historical_patterns: {
    peak_hours: number[];
    busy_days: string[];
    seasonal_trends: Record<string, number>;
  };
  performance_metrics: {
    success_rate: number;
    average_processing_time: number;
    customer_satisfaction: number;
    uptime_percentage: number;
  };
  last_updated: string;
}

export interface CashFlowPrediction {
  distributor_id: string;
  prediction_date: string;
  time_horizon: "1h" | "4h" | "12h" | "24h" | "7d" | "30d";
  predicted_inflow: number;
  predicted_outflow: number;
  net_flow: number;
  confidence_score: number;
  risk_factors: string[];
  recommended_actions: string[];
  market_conditions: {
    holiday_impact: number;
    weather_factor: number;
    economic_events: string[];
  };
}

export interface InventoryOptimization {
  distributor_id: string;
  current_inventory: number;
  optimal_inventory: number;
  reorder_point: number;
  safety_stock: number;
  forecasted_demand: number;
  optimization_score: number;
  cost_savings: number;
  recommendations: {
    action: "restock" | "redistribute" | "reduce" | "maintain";
    priority: "high" | "medium" | "low";
    timing: string;
    amount: number;
    reasoning: string;
  };
}

export interface DistributionSchedule {
  id: string;
  route_id: string;
  scheduled_time: string;
  estimated_duration: number;
  distributors: string[];
  cash_amounts: Record<string, number>;
  priority_score: number;
  route_optimization: {
    total_distance: number;
    fuel_cost: number;
    time_efficiency: number;
    risk_assessment: number;
  };
  contingency_plan: {
    backup_distributors: string[];
    alternative_routes: string[];
    emergency_contacts: string[];
  };
}

export interface MLModel {
  id: string;
  name: string;
  type:
    | "demand_forecasting"
    | "cash_flow_prediction"
    | "inventory_optimization"
    | "route_optimization";
  version: string;
  accuracy_metrics: {
    mape: number; // Mean Absolute Percentage Error
    rmse: number; // Root Mean Square Error
    r2_score: number;
    last_validation: string;
  };
  features: string[];
  hyperparameters: Record<string, any>;
  training_data_size: number;
  last_trained: string;
  status: "active" | "training" | "deprecated";
}

// Main Predictive Cash Management Engine
export class PredictiveCashManagementEngine {
  private supabase: SupabaseClient;
  private realTimeChannel: RealtimeChannel | null = null;
  private models: Map<string, MLModel> = new Map();
  private predictionCache: Map<string, CashFlowPrediction[]> = new Map();
  private optimizationScheduler: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
    this.initializeSystem();
  }

  private async initializeSystem(): Promise<void> {
    try {
      console.log("Initializing Predictive Cash Management Engine...");

      // Load ML models
      await this.loadMLModels();

      // Initialize real-time subscriptions
      await this.setupRealtimeSubscriptions();

      // Start optimization scheduler
      this.startOptimizationScheduler();

      // Warm up prediction cache
      await this.warmupPredictionCache();

      this.isInitialized = true;
      console.log("Predictive Cash Management Engine initialized successfully");
    } catch (error) {
      console.error(
        "Failed to initialize Predictive Cash Management Engine:",
        error
      );
      throw error;
    }
  }

  private async loadMLModels(): Promise<void> {
    const { data: models, error } = await this.supabase
      .from("ml_models")
      .select("*")
      .eq("status", "active");

    if (error) {
      console.error("Error loading ML models:", error);
      return;
    }

    models?.forEach((model) => {
      this.models.set(model.id, model);
    });

    console.log(`Loaded ${this.models.size} ML models`);
  }

  private async setupRealtimeSubscriptions(): Promise<void> {
    this.realTimeChannel = this.supabase
      .channel("cash-management-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "distributor_cash_levels",
        },
        (payload) => {
          this.handleCashLevelUpdate(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transaction_volumes",
        },
        (payload) => {
          this.handleVolumeUpdate(payload);
        }
      )
      .subscribe();
  }

  private handleCashLevelUpdate(payload: any): void {
    console.log("Cash level updated:", payload);
    // Trigger immediate re-prediction for affected distributor
    if (payload.new?.distributor_id) {
      this.invalidatePredictionCache(payload.new.distributor_id);
      this.generateRealTimePredictions(payload.new.distributor_id);
    }
  }

  private handleVolumeUpdate(payload: any): void {
    console.log("Transaction volume updated:", payload);
    // Update demand forecasting models
    this.updateDemandForecasts();
  }

  private startOptimizationScheduler(): void {
    // Run optimization every 15 minutes
    this.optimizationScheduler = setInterval(() => {
      this.performScheduledOptimization();
    }, 15 * 60 * 1000);
  }

  private async warmupPredictionCache(): Promise<void> {
    const { data: distributors } = await this.supabase
      .from("distributor_profiles")
      .select("id")
      .limit(20); // Warm up top 20 distributors

    if (distributors) {
      const promises = distributors.map((dist) =>
        this.generateCashFlowPredictions(dist.id, ["1h", "4h", "24h"])
      );
      await Promise.all(promises);
    }
  }

  // Core prediction methods
  async generateCashFlowPredictions(
    distributorId: string,
    timeHorizons: string[] = ["1h", "4h", "12h", "24h", "7d"]
  ): Promise<CashFlowPrediction[]> {
    try {
      // Get distributor profile and historical data
      const distributorData = await this.getDistributorData(distributorId);
      const historicalData = await this.getHistoricalCashFlow(distributorId);
      const marketData = await this.getCurrentMarketConditions();

      const predictions: CashFlowPrediction[] = [];

      for (const horizon of timeHorizons) {
        const prediction = await this.predictCashFlow(
          distributorData,
          historicalData,
          marketData,
          horizon
        );
        predictions.push(prediction);
      }

      // Cache predictions
      this.predictionCache.set(distributorId, predictions);

      // Store in database
      await this.storePredictions(predictions);

      return predictions;
    } catch (error) {
      console.error(
        `Error generating predictions for distributor ${distributorId}:`,
        error
      );
      throw error;
    }
  }

  private async predictCashFlow(
    distributorData: any,
    historicalData: any[],
    marketData: any,
    timeHorizon: string
  ): Promise<CashFlowPrediction> {
    // Get the appropriate ML model
    const model = Array.from(this.models.values()).find(
      (m) => m.type === "cash_flow_prediction"
    );

    if (!model) {
      throw new Error("Cash flow prediction model not found");
    }

    // Feature engineering
    const features = this.extractPredictionFeatures(
      distributorData,
      historicalData,
      marketData,
      timeHorizon
    );

    // Run ML prediction (simplified - in production would use actual ML service)
    const { inflow, outflow, confidence } = await this.runMLPrediction(
      model,
      features
    );

    // Risk assessment
    const riskFactors = this.assessRiskFactors(distributorData, marketData);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      inflow,
      outflow,
      distributorData
    );

    return {
      distributor_id: distributorData.id,
      prediction_date: new Date().toISOString(),
      time_horizon: timeHorizon as any,
      predicted_inflow: inflow,
      predicted_outflow: outflow,
      net_flow: inflow - outflow,
      confidence_score: confidence,
      risk_factors: riskFactors,
      recommended_actions: recommendations,
      market_conditions: {
        holiday_impact: marketData.holidayImpact || 0,
        weather_factor: marketData.weatherFactor || 1,
        economic_events: marketData.economicEvents || [],
      },
    };
  }

  private extractPredictionFeatures(
    distributorData: any,
    historicalData: any[],
    marketData: any,
    timeHorizon: string
  ): Record<string, number> {
    const now = new Date();
    const hourOfDay = now.getHours();
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();

    // Calculate historical averages
    const avgInflow =
      historicalData.reduce((sum, d) => sum + d.inflow, 0) /
      historicalData.length;
    const avgOutflow =
      historicalData.reduce((sum, d) => sum + d.outflow, 0) /
      historicalData.length;

    // Volatility measures
    const inflowVariance = this.calculateVariance(
      historicalData.map((d) => d.inflow)
    );
    const outflowVariance = this.calculateVariance(
      historicalData.map((d) => d.outflow)
    );

    // Seasonal factors
    const seasonalMultiplier = this.getSeasonalMultiplier(distributorData, now);

    return {
      hour_of_day: hourOfDay,
      day_of_week: dayOfWeek,
      day_of_month: dayOfMonth,
      avg_historical_inflow: avgInflow,
      avg_historical_outflow: avgOutflow,
      inflow_volatility: Math.sqrt(inflowVariance),
      outflow_volatility: Math.sqrt(outflowVariance),
      seasonal_multiplier: seasonalMultiplier,
      current_inventory: distributorData.current_inventory || 0,
      capacity_utilization:
        (distributorData.current_inventory || 0) /
        distributorData.capacity_limits.max_inventory,
      success_rate: distributorData.performance_metrics.success_rate,
      market_volatility: marketData.volatilityIndex || 0.1,
      exchange_rate_trend: marketData.exchangeRateTrend || 0,
      time_horizon_hours: this.timeHorizonToHours(timeHorizon),
    };
  }

  private async runMLPrediction(
    model: MLModel,
    features: Record<string, number>
  ): Promise<{
    inflow: number;
    outflow: number;
    confidence: number;
  }> {
    // Simplified ML prediction - in production this would call actual ML service
    // Using feature-based heuristics for demonstration

    const baseInflow =
      features.avg_historical_inflow * features.seasonal_multiplier;
    const baseOutflow =
      features.avg_historical_outflow * features.seasonal_multiplier;

    // Time-of-day adjustments
    const timeMultiplier = this.getTimeOfDayMultiplier(features.hour_of_day);

    // Capacity constraints
    const capacityFactor = Math.max(0.1, 1 - features.capacity_utilization);

    // Market conditions impact
    const marketImpact = 1 + features.market_volatility * 0.1;

    const inflow = baseInflow * timeMultiplier * capacityFactor * marketImpact;
    const outflow = baseOutflow * timeMultiplier * marketImpact;

    // Confidence based on model accuracy and data quality
    const confidence = Math.min(
      0.95,
      model.accuracy_metrics.r2_score *
        (1 - features.inflow_volatility * 0.1) *
        (1 - features.outflow_volatility * 0.1)
    );

    return { inflow, outflow, confidence };
  }

  // Inventory optimization methods
  async optimizeInventoryLevels(
    distributorId: string
  ): Promise<InventoryOptimization> {
    try {
      const distributorData = await this.getDistributorData(distributorId);
      const predictions = await this.generateCashFlowPredictions(
        distributorId,
        ["24h", "7d"]
      );
      const demandForecast = await this.forecastDemand(distributorId, 7); // 7 days

      // Calculate optimal inventory levels
      const optimalInventory = this.calculateOptimalInventory(
        distributorData,
        predictions,
        demandForecast
      );

      const currentInventory = distributorData.current_inventory || 0;
      const reorderPoint = optimalInventory * 0.3; // 30% of optimal as reorder point
      const safetyStock = optimalInventory * 0.15; // 15% as safety stock

      // Calculate optimization score and cost savings
      const optimizationScore = this.calculateOptimizationScore(
        currentInventory,
        optimalInventory,
        distributorData.capacity_limits
      );

      const costSavings = this.calculateCostSavings(
        currentInventory,
        optimalInventory,
        distributorData
      );

      // Generate recommendations
      const recommendations = this.generateInventoryRecommendations(
        currentInventory,
        optimalInventory,
        reorderPoint,
        predictions
      );

      const optimization: InventoryOptimization = {
        distributor_id: distributorId,
        current_inventory: currentInventory,
        optimal_inventory: optimalInventory,
        reorder_point: reorderPoint,
        safety_stock: safetyStock,
        forecasted_demand: demandForecast.totalDemand,
        optimization_score: optimizationScore,
        cost_savings: costSavings,
        recommendations,
      };

      // Store optimization results
      await this.storeInventoryOptimization(optimization);

      return optimization;
    } catch (error) {
      console.error(
        `Error optimizing inventory for distributor ${distributorId}:`,
        error
      );
      throw error;
    }
  }

  private calculateOptimalInventory(
    distributorData: any,
    predictions: CashFlowPrediction[],
    demandForecast: any
  ): number {
    // Wilson's EOQ model adapted for cash distribution
    const demandRate = demandForecast.dailyAverage || 0;
    const holdingCost = 0.02; // 2% daily holding cost
    const orderCost = 100; // Fixed cost per replenishment
    const maxCapacity = distributorData.capacity_limits.max_inventory;

    // Economic Order Quantity
    const eoq = Math.sqrt((2 * demandRate * orderCost) / holdingCost);

    // Service level adjustments based on predictions
    const serviceLevel = 0.95; // 95% service level target
    const demandVariability = demandForecast.standardDeviation || 0;
    const leadTime = 1; // 1 day lead time

    const safetyStock = this.calculateSafetyStock(
      demandVariability,
      leadTime,
      serviceLevel
    );

    // Optimal inventory considering constraints
    const optimalInventory = Math.min(
      eoq + safetyStock,
      maxCapacity * 0.85 // Don't exceed 85% of capacity
    );

    return Math.max(
      optimalInventory,
      distributorData.capacity_limits.min_threshold
    );
  }

  private generateInventoryRecommendations(
    current: number,
    optimal: number,
    reorderPoint: number,
    predictions: CashFlowPrediction[]
  ): InventoryOptimization["recommendations"] {
    const difference = current - optimal;
    const percentageDiff = Math.abs(difference) / optimal;

    // Determine action based on current vs optimal
    let action: "restock" | "redistribute" | "reduce" | "maintain";
    let priority: "high" | "medium" | "low";
    let timing: string;
    let amount: number;
    let reasoning: string;

    if (current < reorderPoint) {
      action = "restock";
      priority = "high";
      timing = "immediate";
      amount = optimal - current;
      reasoning = "Below reorder point - immediate restocking required";
    } else if (difference < -optimal * 0.2) {
      // 20% below optimal
      action = "restock";
      priority = "medium";
      timing = "within 24 hours";
      amount = optimal - current;
      reasoning = "Inventory significantly below optimal level";
    } else if (difference > optimal * 0.3) {
      // 30% above optimal
      action = "redistribute";
      priority = "medium";
      timing = "within 48 hours";
      amount = current - optimal;
      reasoning = "Excess inventory - redistribute to optimize capital";
    } else if (percentageDiff < 0.1) {
      // Within 10% of optimal
      action = "maintain";
      priority = "low";
      timing = "routine monitoring";
      amount = 0;
      reasoning = "Inventory levels are optimal";
    } else {
      action = "restock";
      priority = "low";
      timing = "within 7 days";
      amount = optimal - current;
      reasoning = "Minor adjustment needed during routine restocking";
    }

    return {
      action,
      priority,
      timing,
      amount,
      reasoning,
    };
  }

  // Distribution scheduling methods
  async generateOptimalDistributionSchedule(
    date: string
  ): Promise<DistributionSchedule[]> {
    try {
      // Get all distributors needing cash
      const distributorsNeedingCash = await this.getDistributorsNeedingCash(
        date
      );

      // Get available distribution vehicles/routes
      const availableRoutes = await this.getAvailableRoutes(date);

      // Generate optimized schedules
      const schedules: DistributionSchedule[] = [];

      for (const route of availableRoutes) {
        const schedule = await this.optimizeRoute(
          route,
          distributorsNeedingCash,
          date
        );
        if (schedule) {
          schedules.push(schedule);
        }
      }

      // Sort by priority score
      schedules.sort((a, b) => b.priority_score - a.priority_score);

      // Store schedules
      await this.storeDistributionSchedules(schedules);

      return schedules;
    } catch (error) {
      console.error("Error generating distribution schedules:", error);
      throw error;
    }
  }

  private async optimizeRoute(
    route: any,
    distributors: any[],
    date: string
  ): Promise<DistributionSchedule | null> {
    // Filter distributors by geographic proximity to route
    const routeDistributors = distributors.filter((dist) =>
      this.isDistributorOnRoute(dist, route)
    );

    if (routeDistributors.length === 0) {
      return null;
    }

    // Calculate cash amounts needed
    const cashAmounts: Record<string, number> = {};
    let totalCashNeeded = 0;

    for (const dist of routeDistributors) {
      const predictions = await this.generateCashFlowPredictions(dist.id, [
        "24h",
      ]);
      const needed = Math.max(0, -predictions[0].net_flow);
      cashAmounts[dist.id] = needed;
      totalCashNeeded += needed;
    }

    // Check if route can handle the cash volume
    if (totalCashNeeded > route.capacity) {
      // Prioritize distributors by urgency
      const prioritizedDistributors =
        this.prioritizeDistributorsByUrgency(routeDistributors);
      let allocatedCash = 0;
      const finalDistributors: string[] = [];

      for (const dist of prioritizedDistributors) {
        if (allocatedCash + cashAmounts[dist.id] <= route.capacity) {
          finalDistributors.push(dist.id);
          allocatedCash += cashAmounts[dist.id];
        } else {
          delete cashAmounts[dist.id];
        }
      }
    }

    // Calculate route optimization metrics
    const routeOptimization = this.calculateRouteOptimization(
      Object.keys(cashAmounts),
      route
    );

    // Calculate priority score
    const priorityScore = this.calculateSchedulePriority(
      Object.keys(cashAmounts),
      routeOptimization,
      totalCashNeeded
    );

    // Generate contingency plan
    const contingencyPlan = await this.generateContingencyPlan(
      Object.keys(cashAmounts),
      route
    );

    return {
      id: `schedule_${Date.now()}_${route.id}`,
      route_id: route.id,
      scheduled_time: this.calculateOptimalScheduleTime(
        date,
        routeOptimization
      ),
      estimated_duration: routeOptimization.time_efficiency,
      distributors: Object.keys(cashAmounts),
      cash_amounts: cashAmounts,
      priority_score: priorityScore,
      route_optimization: routeOptimization,
      contingency_plan: contingencyPlan,
    };
  }

  // Utility and helper methods
  private async getDistributorData(distributorId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from("distributor_profiles")
      .select("*")
      .eq("id", distributorId)
      .single();

    if (error) throw error;
    return data;
  }

  private async getHistoricalCashFlow(distributorId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from("cash_flow_history")
      .select("*")
      .eq("distributor_id", distributorId)
      .order("created_at", { ascending: false })
      .limit(168); // Last week of hourly data

    if (error) throw error;
    return data || [];
  }

  private async getCurrentMarketConditions(): Promise<any> {
    const { data, error } = await this.supabase
      .from("market_conditions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return (
      data || {
        holidayImpact: 0,
        weatherFactor: 1,
        economicEvents: [],
        volatilityIndex: 0.1,
        exchangeRateTrend: 0,
      }
    );
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    return variance;
  }

  private getSeasonalMultiplier(distributorData: any, date: Date): number {
    const month = date.getMonth();
    const seasonalTrends =
      distributorData.historical_patterns?.seasonal_trends || {};
    return seasonalTrends[month.toString()] || 1.0;
  }

  private timeHorizonToHours(horizon: string): number {
    const mapping: Record<string, number> = {
      "1h": 1,
      "4h": 4,
      "12h": 12,
      "24h": 24,
      "7d": 168,
      "30d": 720,
    };
    return mapping[horizon] || 24;
  }

  private getTimeOfDayMultiplier(hour: number): number {
    // Peak hours: 8-10 AM, 12-2 PM, 5-7 PM
    const peakHours = [8, 9, 12, 13, 17, 18];
    return peakHours.includes(hour) ? 1.3 : 0.8;
  }

  private assessRiskFactors(distributorData: any, marketData: any): string[] {
    const risks: string[] = [];

    if (distributorData.performance_metrics.success_rate < 0.9) {
      risks.push("Low historical success rate");
    }

    if (
      distributorData.current_inventory /
        distributorData.capacity_limits.max_inventory <
      0.1
    ) {
      risks.push("Very low current inventory");
    }

    if (marketData.volatilityIndex > 0.3) {
      risks.push("High market volatility");
    }

    if (marketData.holidayImpact > 0.2) {
      risks.push("Holiday period - increased demand expected");
    }

    return risks;
  }

  private generateRecommendations(
    inflow: number,
    outflow: number,
    distributorData: any
  ): string[] {
    const recommendations: string[] = [];
    const netFlow = inflow - outflow;
    const currentInventory = distributorData.current_inventory || 0;

    if (
      netFlow < 0 &&
      currentInventory + netFlow < distributorData.capacity_limits.min_threshold
    ) {
      recommendations.push("Schedule immediate cash replenishment");
    }

    if (
      netFlow > 0 &&
      currentInventory + netFlow >
        distributorData.capacity_limits.max_inventory * 0.9
    ) {
      recommendations.push(
        "Consider redistributing excess cash to nearby distributors"
      );
    }

    if (Math.abs(netFlow) > currentInventory * 0.5) {
      recommendations.push(
        "Monitor cash flow closely - high volatility detected"
      );
    }

    return recommendations;
  }

  private calculateSafetyStock(
    variance: number,
    leadTime: number,
    serviceLevel: number
  ): number {
    // Z-score for service level (95% = 1.645)
    const zScore = serviceLevel === 0.95 ? 1.645 : 1.96;
    return zScore * Math.sqrt(variance * leadTime);
  }

  private calculateOptimizationScore(
    current: number,
    optimal: number,
    limits: any
  ): number {
    const efficiency = Math.min(current, optimal) / Math.max(current, optimal);
    const utilization = current / limits.max_inventory;
    const coverage =
      current >= limits.min_threshold ? 1 : current / limits.min_threshold;

    return (efficiency * 0.4 + utilization * 0.3 + coverage * 0.3) * 100;
  }

  private calculateCostSavings(
    current: number,
    optimal: number,
    distributorData: any
  ): number {
    const holdingCostRate = 0.02; // 2% daily
    const opportunityCostRate = 0.05; // 5% annual / 365

    const excessCash = Math.max(0, current - optimal);
    const shortfallCost = Math.max(0, optimal - current) * opportunityCostRate;

    const holdingSavings = excessCash * holdingCostRate;
    const opportunitySavings = shortfallCost;

    return holdingSavings + opportunitySavings;
  }

  private async forecastDemand(
    distributorId: string,
    days: number
  ): Promise<any> {
    const historicalData = await this.getHistoricalCashFlow(distributorId);

    const dailyDemands = this.aggregateByDay(historicalData);
    const avgDemand =
      dailyDemands.reduce((sum, d) => sum + d.demand, 0) / dailyDemands.length;
    const stdDev = Math.sqrt(
      this.calculateVariance(dailyDemands.map((d) => d.demand))
    );

    return {
      totalDemand: avgDemand * days,
      dailyAverage: avgDemand,
      standardDeviation: stdDev,
      forecastPeriod: days,
    };
  }

  private aggregateByDay(hourlyData: any[]): any[] {
    const dayMap = new Map<string, number>();

    hourlyData.forEach((item) => {
      const day = item.created_at.split("T")[0];
      const demand = (item.outflow || 0) - (item.inflow || 0);
      dayMap.set(day, (dayMap.get(day) || 0) + demand);
    });

    return Array.from(dayMap.entries()).map(([date, demand]) => ({
      date,
      demand,
    }));
  }

  private invalidatePredictionCache(distributorId: string): void {
    this.predictionCache.delete(distributorId);
  }

  private async generateRealTimePredictions(
    distributorId: string
  ): Promise<void> {
    await this.generateCashFlowPredictions(distributorId, ["1h", "4h"]);
  }

  private async updateDemandForecasts(): Promise<void> {
    console.log("Updating demand forecasts based on new transaction data...");
    // Trigger ML model retraining or update
  }

  private async performScheduledOptimization(): Promise<void> {
    console.log("Performing scheduled optimization...");

    // Get all active distributors
    const { data: distributors } = await this.supabase
      .from("distributor_profiles")
      .select("id")
      .eq("status", "active");

    if (distributors) {
      // Run optimization for each distributor
      const optimizationPromises = distributors.map((dist) =>
        this.optimizeInventoryLevels(dist.id).catch((error) =>
          console.error(`Optimization failed for ${dist.id}:`, error)
        )
      );

      await Promise.all(optimizationPromises);
    }

    // Generate tomorrow's distribution schedule
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await this.generateOptimalDistributionSchedule(
      tomorrow.toISOString().split("T")[0]
    );
  }

  private async storePredictions(
    predictions: CashFlowPrediction[]
  ): Promise<void> {
    const { error } = await this.supabase
      .from("cash_flow_predictions")
      .upsert(predictions);

    if (error) {
      console.error("Error storing predictions:", error);
    }
  }

  private async storeInventoryOptimization(
    optimization: InventoryOptimization
  ): Promise<void> {
    const { error } = await this.supabase
      .from("inventory_optimizations")
      .upsert(optimization);

    if (error) {
      console.error("Error storing inventory optimization:", error);
    }
  }

  private async storeDistributionSchedules(
    schedules: DistributionSchedule[]
  ): Promise<void> {
    const { error } = await this.supabase
      .from("distribution_schedules")
      .upsert(schedules);

    if (error) {
      console.error("Error storing distribution schedules:", error);
    }
  }

  // Additional helper methods for route optimization
  private async getDistributorsNeedingCash(date: string): Promise<any[]> {
    // Get distributors with predicted negative cash flow or below minimum threshold
    const { data } = await this.supabase
      .from("distributor_profiles")
      .select(
        `
        *,
        cash_flow_predictions!inner(*)
      `
      )
      .eq("cash_flow_predictions.prediction_date", date)
      .lt("cash_flow_predictions.net_flow", 0);

    return data || [];
  }

  private async getAvailableRoutes(date: string): Promise<any[]> {
    const { data } = await this.supabase
      .from("distribution_routes")
      .select("*")
      .eq("available_date", date)
      .eq("status", "available");

    return data || [];
  }

  private isDistributorOnRoute(distributor: any, route: any): boolean {
    // Simple distance-based check - in production would use proper routing algorithms
    const maxDistance = route.coverage_radius || 10; // 10km default
    return (
      this.calculateDistance(
        distributor.location.latitude,
        distributor.location.longitude,
        route.start_location.latitude,
        route.start_location.longitude
      ) <= maxDistance
    );
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private prioritizeDistributorsByUrgency(distributors: any[]): any[] {
    return distributors.sort((a, b) => {
      // Priority factors: cash level, success rate, customer demand
      const urgencyA =
        (1 - a.current_inventory / a.capacity_limits.max_inventory) *
        a.performance_metrics.success_rate;
      const urgencyB =
        (1 - b.current_inventory / b.capacity_limits.max_inventory) *
        b.performance_metrics.success_rate;
      return urgencyB - urgencyA;
    });
  }

  private calculateRouteOptimization(
    distributorIds: string[],
    route: any
  ): any {
    // Simplified route optimization - in production would use proper algorithms
    const numDistributors = distributorIds.length;
    const baseDistance = route.base_distance || 50;
    const totalDistance = baseDistance + numDistributors * 5; // 5km per distributor
    const fuelCost = totalDistance * 0.15; // $0.15 per km
    const timeEfficiency = 120 + numDistributors * 15; // 2 hours base + 15 min per stop
    const riskAssessment = Math.min(0.9, 0.1 + numDistributors * 0.05); // Risk increases with stops

    return {
      total_distance: totalDistance,
      fuel_cost: fuelCost,
      time_efficiency: timeEfficiency,
      risk_assessment: riskAssessment,
    };
  }

  private calculateSchedulePriority(
    distributorIds: string[],
    routeOptimization: any,
    totalCash: number
  ): number {
    // Higher priority for: more distributors, more cash, better efficiency, lower risk
    const distributorScore = distributorIds.length * 10;
    const cashScore = Math.min(100, totalCash / 10000); // Normalize to 100 max
    const efficiencyScore = 100 - routeOptimization.time_efficiency / 10;
    const riskScore = (1 - routeOptimization.risk_assessment) * 50;

    return distributorScore + cashScore + efficiencyScore + riskScore;
  }

  private calculateOptimalScheduleTime(
    date: string,
    routeOptimization: any
  ): string {
    // Schedule during optimal hours (avoid peak traffic, ensure distributor availability)
    const scheduledDate = new Date(date + "T08:00:00"); // Start at 8 AM
    const duration = routeOptimization.time_efficiency;

    // Adjust start time based on route duration to avoid peak hours
    if (duration > 180) {
      // More than 3 hours
      scheduledDate.setHours(6); // Start earlier
    }

    return scheduledDate.toISOString();
  }

  private async generateContingencyPlan(
    distributorIds: string[],
    route: any
  ): Promise<DistributionSchedule["contingency_plan"]> {
    // Get backup distributors in the area
    const { data: backupDistributors } = await this.supabase
      .from("distributor_profiles")
      .select("id")
      .not("id", "in", `(${distributorIds.join(",")})`)
      .limit(3);

    // Get alternative routes
    const { data: altRoutes } = await this.supabase
      .from("distribution_routes")
      .select("id")
      .neq("id", route.id)
      .eq("status", "available")
      .limit(2);

    // Emergency contacts
    const emergencyContacts = [
      "dispatch_center",
      "route_supervisor",
      "regional_manager",
    ];

    return {
      backup_distributors: backupDistributors?.map((d) => d.id) || [],
      alternative_routes: altRoutes?.map((r) => r.id) || [],
      emergency_contacts: emergencyContacts,
    };
  }

  // Public API methods
  async getPredictions(distributorId: string): Promise<CashFlowPrediction[]> {
    if (!this.isInitialized) {
      await this.initializeSystem();
    }

    // Check cache first
    const cached = this.predictionCache.get(distributorId);
    if (cached && this.isCacheValid(cached)) {
      return cached;
    }

    // Generate new predictions
    return await this.generateCashFlowPredictions(distributorId);
  }

  async getInventoryOptimization(
    distributorId: string
  ): Promise<InventoryOptimization> {
    if (!this.isInitialized) {
      await this.initializeSystem();
    }

    return await this.optimizeInventoryLevels(distributorId);
  }

  async getDistributionSchedules(
    date: string
  ): Promise<DistributionSchedule[]> {
    if (!this.isInitialized) {
      await this.initializeSystem();
    }

    return await this.generateOptimalDistributionSchedule(date);
  }

  private isCacheValid(predictions: CashFlowPrediction[]): boolean {
    if (!predictions.length) return false;
    const latestPrediction = predictions[0];
    const cacheAge =
      Date.now() - new Date(latestPrediction.prediction_date).getTime();
    return cacheAge < 15 * 60 * 1000; // 15 minutes cache validity
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    if (this.realTimeChannel) {
      await this.supabase.removeChannel(this.realTimeChannel);
    }

    if (this.optimizationScheduler) {
      clearInterval(this.optimizationScheduler);
    }

    this.predictionCache.clear();
    this.models.clear();
    this.isInitialized = false;

    console.log("Predictive Cash Management Engine cleaned up");
  }
}

// Export singleton instance
let cashManagementEngine: PredictiveCashManagementEngine | null = null;

export const initializeCashManagement = (
  supabaseClient: SupabaseClient
): PredictiveCashManagementEngine => {
  if (!cashManagementEngine) {
    cashManagementEngine = new PredictiveCashManagementEngine(supabaseClient);
  }
  return cashManagementEngine;
};

export const getCashManagementEngine =
  (): PredictiveCashManagementEngine | null => {
    return cashManagementEngine;
  };
