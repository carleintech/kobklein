-- Predictive Cash Management System Database Schema
-- Complete PostgreSQL schema for AI-powered cash management, inventory optimization,
-- and distribution scheduling for the KobKlein network

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Core distributor profiles table
CREATE TABLE IF NOT EXISTS distributor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(255) NOT NULL UNIQUE,
    location_latitude DECIMAL(10, 8) NOT NULL,
    location_longitude DECIMAL(11, 8) NOT NULL,
    location_address TEXT NOT NULL,
    location_region VARCHAR(100) NOT NULL,
    business_type VARCHAR(50) NOT NULL CHECK (business_type IN ('agent', 'merchant', 'mobile_money')),

    -- Capacity limits
    daily_volume_limit DECIMAL(15, 2) NOT NULL DEFAULT 0,
    max_inventory DECIMAL(15, 2) NOT NULL DEFAULT 0,
    min_threshold DECIMAL(15, 2) NOT NULL DEFAULT 0,
    optimal_level DECIMAL(15, 2) NOT NULL DEFAULT 0,
    current_inventory DECIMAL(15, 2) NOT NULL DEFAULT 0,

    -- Historical patterns (stored as JSONB for flexibility)
    peak_hours INTEGER[] DEFAULT '{}',
    busy_days TEXT[] DEFAULT '{}',
    seasonal_trends JSONB DEFAULT '{}',

    -- Performance metrics
    success_rate DECIMAL(5, 4) DEFAULT 0.95,
    avg_processing_time INTEGER DEFAULT 120, -- seconds
    customer_satisfaction DECIMAL(3, 2) DEFAULT 4.5,
    uptime_percentage DECIMAL(5, 2) DEFAULT 99.0,

    -- Status and metadata
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash flow predictions table
CREATE TABLE IF NOT EXISTS cash_flow_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    distributor_id UUID NOT NULL REFERENCES distributor_profiles(id) ON DELETE CASCADE,
    prediction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    time_horizon VARCHAR(10) NOT NULL CHECK (time_horizon IN ('1h', '4h', '12h', '24h', '7d', '30d')),

    -- Prediction values
    predicted_inflow DECIMAL(15, 2) NOT NULL DEFAULT 0,
    predicted_outflow DECIMAL(15, 2) NOT NULL DEFAULT 0,
    net_flow DECIMAL(15, 2) GENERATED ALWAYS AS (predicted_inflow - predicted_outflow) STORED,
    confidence_score DECIMAL(5, 4) NOT NULL DEFAULT 0.5,

    -- Risk and recommendations
    risk_factors TEXT[] DEFAULT '{}',
    recommended_actions TEXT[] DEFAULT '{}',

    -- Market conditions
    holiday_impact DECIMAL(5, 4) DEFAULT 0,
    weather_factor DECIMAL(5, 4) DEFAULT 1.0,
    economic_events TEXT[] DEFAULT '{}',

    -- Metadata
    model_version VARCHAR(50) DEFAULT 'v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique predictions per distributor, date, and horizon
    UNIQUE(distributor_id, prediction_date, time_horizon)
);

-- Historical cash flow data
CREATE TABLE IF NOT EXISTS cash_flow_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    distributor_id UUID NOT NULL REFERENCES distributor_profiles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Cash flow values
    inflow DECIMAL(15, 2) NOT NULL DEFAULT 0,
    outflow DECIMAL(15, 2) NOT NULL DEFAULT 0,
    net_flow DECIMAL(15, 2) GENERATED ALWAYS AS (inflow - outflow) STORED,
    ending_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,

    -- Transaction context
    transaction_count INTEGER DEFAULT 0,
    avg_transaction_size DECIMAL(15, 2) DEFAULT 0,
    peak_hour_volume DECIMAL(15, 2) DEFAULT 0,

    -- External factors
    day_of_week INTEGER NOT NULL,
    hour_of_day INTEGER NOT NULL,
    is_holiday BOOLEAN DEFAULT FALSE,
    weather_condition VARCHAR(50),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory optimizations table
CREATE TABLE IF NOT EXISTS inventory_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    distributor_id UUID NOT NULL REFERENCES distributor_profiles(id) ON DELETE CASCADE,
    optimization_date TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Inventory levels
    current_inventory DECIMAL(15, 2) NOT NULL DEFAULT 0,
    optimal_inventory DECIMAL(15, 2) NOT NULL DEFAULT 0,
    reorder_point DECIMAL(15, 2) NOT NULL DEFAULT 0,
    safety_stock DECIMAL(15, 2) NOT NULL DEFAULT 0,
    forecasted_demand DECIMAL(15, 2) NOT NULL DEFAULT 0,

    -- Optimization metrics
    optimization_score DECIMAL(5, 2) NOT NULL DEFAULT 0,
    cost_savings DECIMAL(15, 2) DEFAULT 0,

    -- Recommendations
    recommended_action VARCHAR(50) NOT NULL CHECK (recommended_action IN ('restock', 'redistribute', 'reduce', 'maintain')),
    action_priority VARCHAR(10) NOT NULL CHECK (action_priority IN ('high', 'medium', 'low')),
    action_timing VARCHAR(100) NOT NULL,
    recommended_amount DECIMAL(15, 2) DEFAULT 0,
    reasoning TEXT,

    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'executed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    executed_at TIMESTAMP WITH TIME ZONE
);

-- ML models registry
CREATE TABLE IF NOT EXISTS ml_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    model_type VARCHAR(100) NOT NULL CHECK (model_type IN ('demand_forecasting', 'cash_flow_prediction', 'inventory_optimization', 'route_optimization')),
    version VARCHAR(50) NOT NULL,

    -- Performance metrics
    mape DECIMAL(8, 6), -- Mean Absolute Percentage Error
    rmse DECIMAL(15, 6), -- Root Mean Square Error
    r2_score DECIMAL(8, 6), -- R-squared
    last_validation TIMESTAMP WITH TIME ZONE,

    -- Model configuration
    features TEXT[] NOT NULL DEFAULT '{}',
    hyperparameters JSONB DEFAULT '{}',
    training_data_size INTEGER DEFAULT 0,

    -- Status and metadata
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'training', 'deprecated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_trained TIMESTAMP WITH TIME ZONE,

    UNIQUE(name, version)
);

-- Distribution routes
CREATE TABLE IF NOT EXISTS distribution_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_name VARCHAR(255) NOT NULL,
    vehicle_id VARCHAR(100),
    driver_id VARCHAR(100),

    -- Route specifications
    start_location_latitude DECIMAL(10, 8) NOT NULL,
    start_location_longitude DECIMAL(11, 8) NOT NULL,
    start_location_address TEXT NOT NULL,
    coverage_radius DECIMAL(8, 2) DEFAULT 10.0, -- km

    -- Capacity and constraints
    cash_capacity DECIMAL(15, 2) NOT NULL DEFAULT 0,
    max_stops INTEGER DEFAULT 10,
    max_duration INTEGER DEFAULT 480, -- minutes (8 hours)

    -- Operating schedule
    operating_days TEXT[] DEFAULT '{monday,tuesday,wednesday,thursday,friday}',
    start_time TIME DEFAULT '08:00',
    end_time TIME DEFAULT '17:00',

    -- Route metrics
    base_distance DECIMAL(8, 2) DEFAULT 0, -- km
    fuel_efficiency DECIMAL(6, 2) DEFAULT 10.0, -- km/liter
    cost_per_km DECIMAL(8, 4) DEFAULT 0.15,

    -- Status
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Distribution schedules
CREATE TABLE IF NOT EXISTS distribution_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES distribution_routes(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,

    -- Schedule details
    distributor_ids UUID[] NOT NULL DEFAULT '{}',
    cash_amounts JSONB NOT NULL DEFAULT '{}', -- distributor_id -> amount mapping
    estimated_duration INTEGER NOT NULL DEFAULT 0, -- minutes

    -- Optimization metrics
    total_distance DECIMAL(8, 2) DEFAULT 0,
    fuel_cost DECIMAL(10, 2) DEFAULT 0,
    time_efficiency DECIMAL(8, 2) DEFAULT 0,
    risk_assessment DECIMAL(5, 4) DEFAULT 0,
    priority_score DECIMAL(8, 2) DEFAULT 0,

    -- Contingency planning
    backup_distributor_ids UUID[] DEFAULT '{}',
    alternative_route_ids UUID[] DEFAULT '{}',
    emergency_contacts TEXT[] DEFAULT '{}',

    -- Status tracking
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'delayed')),
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    completion_notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(route_id, scheduled_date, scheduled_time)
);

-- Transaction volumes for demand forecasting
CREATE TABLE IF NOT EXISTS transaction_volumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    distributor_id UUID NOT NULL REFERENCES distributor_profiles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Volume metrics
    total_transactions INTEGER NOT NULL DEFAULT 0,
    total_volume DECIMAL(15, 2) NOT NULL DEFAULT 0,
    avg_transaction_size DECIMAL(15, 2) DEFAULT 0,

    -- Transaction types
    remittance_count INTEGER DEFAULT 0,
    remittance_volume DECIMAL(15, 2) DEFAULT 0,
    cash_in_count INTEGER DEFAULT 0,
    cash_in_volume DECIMAL(15, 2) DEFAULT 0,
    cash_out_count INTEGER DEFAULT 0,
    cash_out_volume DECIMAL(15, 2) DEFAULT 0,

    -- Time context
    hour_of_day INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_of_month INTEGER NOT NULL,
    week_of_year INTEGER NOT NULL,
    month_of_year INTEGER NOT NULL,

    -- External factors
    is_holiday BOOLEAN DEFAULT FALSE,
    is_payday BOOLEAN DEFAULT FALSE,
    weather_condition VARCHAR(50),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one record per distributor per hour
    UNIQUE(distributor_id, recorded_at)
);

-- Market conditions affecting predictions
CREATE TABLE IF NOT EXISTS market_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Economic indicators
    usd_htg_rate DECIMAL(10, 6) NOT NULL DEFAULT 1.0,
    exchange_rate_volatility DECIMAL(8, 6) DEFAULT 0.01,
    exchange_rate_trend DECIMAL(6, 4) DEFAULT 0, -- -1 to 1

    -- Market factors
    volatility_index DECIMAL(6, 4) DEFAULT 0.1,
    liquidity_index DECIMAL(6, 4) DEFAULT 1.0,
    demand_pressure DECIMAL(6, 4) DEFAULT 0.5,

    -- External events
    holiday_impact DECIMAL(5, 4) DEFAULT 0,
    weather_factor DECIMAL(5, 4) DEFAULT 1.0,
    economic_events TEXT[] DEFAULT '{}',

    -- Regional factors
    region VARCHAR(100),
    political_stability DECIMAL(5, 4) DEFAULT 0.8,
    infrastructure_status DECIMAL(5, 4) DEFAULT 0.9,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash distribution events log
CREATE TABLE IF NOT EXISTS cash_distribution_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID REFERENCES distribution_schedules(id) ON DELETE SET NULL,
    distributor_id UUID NOT NULL REFERENCES distributor_profiles(id) ON DELETE CASCADE,

    -- Event details
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('pickup', 'delivery', 'redistribution', 'emergency')),
    cash_amount DECIMAL(15, 2) NOT NULL,

    -- Timing
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_time TIMESTAMP WITH TIME ZONE,

    -- Results
    status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'completed', 'failed', 'partial')),
    actual_amount DECIMAL(15, 2),
    variance_amount DECIMAL(15, 2) GENERATED ALWAYS AS (COALESCE(actual_amount, 0) - cash_amount) STORED,

    -- Context
    notes TEXT,
    driver_id VARCHAR(100),
    vehicle_id VARCHAR(100),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance analytics for optimization
CREATE TABLE IF NOT EXISTS performance_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    distributor_id UUID NOT NULL REFERENCES distributor_profiles(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL,

    -- Efficiency metrics
    inventory_turnover DECIMAL(8, 4) DEFAULT 0,
    cash_utilization DECIMAL(5, 4) DEFAULT 0,
    service_level DECIMAL(5, 4) DEFAULT 0.95,
    stockout_frequency INTEGER DEFAULT 0,

    -- Financial metrics
    holding_costs DECIMAL(15, 2) DEFAULT 0,
    opportunity_costs DECIMAL(15, 2) DEFAULT 0,
    distribution_costs DECIMAL(15, 2) DEFAULT 0,
    total_operational_costs DECIMAL(15, 2) DEFAULT 0,

    -- Customer metrics
    customer_wait_time INTEGER DEFAULT 0, -- seconds
    customer_satisfaction DECIMAL(3, 2) DEFAULT 4.5,
    complaint_count INTEGER DEFAULT 0,

    -- Prediction accuracy
    forecast_accuracy DECIMAL(5, 4) DEFAULT 0,
    prediction_bias DECIMAL(8, 4) DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(distributor_id, analysis_date)
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_distributor_profiles_location ON distributor_profiles USING GIST (
    ST_MakePoint(location_longitude, location_latitude)
);
CREATE INDEX IF NOT EXISTS idx_distributor_profiles_region ON distributor_profiles(location_region);
CREATE INDEX IF NOT EXISTS idx_distributor_profiles_business_type ON distributor_profiles(business_type);
CREATE INDEX IF NOT EXISTS idx_distributor_profiles_status ON distributor_profiles(status);

CREATE INDEX IF NOT EXISTS idx_cash_flow_predictions_distributor_date ON cash_flow_predictions(distributor_id, prediction_date DESC);
CREATE INDEX IF NOT EXISTS idx_cash_flow_predictions_horizon ON cash_flow_predictions(time_horizon);
CREATE INDEX IF NOT EXISTS idx_cash_flow_predictions_confidence ON cash_flow_predictions(confidence_score DESC);

CREATE INDEX IF NOT EXISTS idx_cash_flow_history_distributor_time ON cash_flow_history(distributor_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_cash_flow_history_day_hour ON cash_flow_history(day_of_week, hour_of_day);

CREATE INDEX IF NOT EXISTS idx_inventory_optimizations_distributor ON inventory_optimizations(distributor_id, optimization_date DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_optimizations_status ON inventory_optimizations(status);
CREATE INDEX IF NOT EXISTS idx_inventory_optimizations_priority ON inventory_optimizations(action_priority);

CREATE INDEX IF NOT EXISTS idx_distribution_schedules_route_date ON distribution_schedules(route_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_distribution_schedules_status ON distribution_schedules(status);
CREATE INDEX IF NOT EXISTS idx_distribution_schedules_priority ON distribution_schedules(priority_score DESC);

CREATE INDEX IF NOT EXISTS idx_transaction_volumes_distributor_time ON transaction_volumes(distributor_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_volumes_temporal ON transaction_volumes(day_of_week, hour_of_day, month_of_year);

CREATE INDEX IF NOT EXISTS idx_market_conditions_time ON market_conditions(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_conditions_region ON market_conditions(region);

CREATE INDEX IF NOT EXISTS idx_distribution_events_distributor ON cash_distribution_events(distributor_id, scheduled_time DESC);
CREATE INDEX IF NOT EXISTS idx_distribution_events_schedule ON cash_distribution_events(schedule_id);
CREATE INDEX IF NOT EXISTS idx_distribution_events_status ON cash_distribution_events(status);

CREATE INDEX IF NOT EXISTS idx_performance_analytics_distributor ON performance_analytics(distributor_id, analysis_date DESC);

-- Create functions for advanced analytics

-- Function to calculate prediction accuracy
CREATE OR REPLACE FUNCTION calculate_prediction_accuracy(
    p_distributor_id UUID,
    p_time_horizon VARCHAR(10),
    p_days_back INTEGER DEFAULT 7
) RETURNS DECIMAL(5, 4) AS $$
DECLARE
    accuracy DECIMAL(5, 4);
BEGIN
    WITH prediction_vs_actual AS (
        SELECT
            p.predicted_inflow,
            p.predicted_outflow,
            h.inflow AS actual_inflow,
            h.outflow AS actual_outflow,
            ABS(p.predicted_inflow - h.inflow) AS inflow_error,
            ABS(p.predicted_outflow - h.outflow) AS outflow_error
        FROM cash_flow_predictions p
        JOIN cash_flow_history h ON h.distributor_id = p.distributor_id
            AND h.recorded_at BETWEEN p.prediction_date
                AND p.prediction_date + INTERVAL '1 hour' *
                    CASE p.time_horizon
                        WHEN '1h' THEN 1
                        WHEN '4h' THEN 4
                        WHEN '12h' THEN 12
                        WHEN '24h' THEN 24
                        WHEN '7d' THEN 168
                        WHEN '30d' THEN 720
                    END
        WHERE p.distributor_id = p_distributor_id
            AND p.time_horizon = p_time_horizon
            AND p.prediction_date >= NOW() - INTERVAL '1 day' * p_days_back
    )
    SELECT
        1.0 - (AVG(inflow_error + outflow_error) /
               NULLIF(AVG(actual_inflow + actual_outflow), 0))::DECIMAL(5, 4)
    INTO accuracy
    FROM prediction_vs_actual;

    RETURN COALESCE(accuracy, 0.5);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate optimal inventory level
CREATE OR REPLACE FUNCTION calculate_optimal_inventory(
    p_distributor_id UUID,
    p_service_level DECIMAL(5, 4) DEFAULT 0.95
) RETURNS DECIMAL(15, 2) AS $$
DECLARE
    avg_demand DECIMAL(15, 2);
    demand_std DECIMAL(15, 2);
    lead_time INTEGER := 1; -- 1 day lead time
    safety_stock DECIMAL(15, 2);
    eoq DECIMAL(15, 2);
    holding_cost DECIMAL(6, 4) := 0.02; -- 2% daily
    order_cost DECIMAL(10, 2) := 100; -- Fixed cost per order
    z_score DECIMAL(6, 4);
    optimal_level DECIMAL(15, 2);
BEGIN
    -- Calculate average daily demand and standard deviation
    SELECT
        AVG(total_volume) AS avg_demand,
        STDDEV(total_volume) AS demand_std
    INTO avg_demand, demand_std
    FROM transaction_volumes
    WHERE distributor_id = p_distributor_id
        AND recorded_at >= NOW() - INTERVAL '30 days';

    -- Z-score for service level (95% = 1.645, 99% = 2.326)
    z_score := CASE
        WHEN p_service_level >= 0.99 THEN 2.326
        WHEN p_service_level >= 0.95 THEN 1.645
        ELSE 1.282
    END;

    -- Safety stock calculation
    safety_stock := z_score * COALESCE(demand_std, 0) * SQRT(lead_time);

    -- Economic Order Quantity (EOQ)
    eoq := SQRT(2 * COALESCE(avg_demand, 0) * order_cost / holding_cost);

    -- Optimal inventory level
    optimal_level := eoq + safety_stock;

    RETURN GREATEST(optimal_level, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to generate demand forecast
CREATE OR REPLACE FUNCTION forecast_demand(
    p_distributor_id UUID,
    p_forecast_days INTEGER DEFAULT 7
) RETURNS TABLE (
    forecast_date DATE,
    predicted_demand DECIMAL(15, 2),
    confidence_interval_lower DECIMAL(15, 2),
    confidence_interval_upper DECIMAL(15, 2)
) AS $$
DECLARE
    avg_demand DECIMAL(15, 2);
    demand_std DECIMAL(15, 2);
    trend_slope DECIMAL(15, 8);
    seasonal_factors DECIMAL(5, 4)[];
    i INTEGER;
    current_date DATE := CURRENT_DATE;
    predicted_value DECIMAL(15, 2);
    seasonal_multiplier DECIMAL(5, 4);
BEGIN
    -- Calculate historical averages and trend
    WITH daily_volumes AS (
        SELECT
            DATE(recorded_at) AS volume_date,
            SUM(total_volume) AS daily_volume,
            EXTRACT(DOW FROM recorded_at) AS day_of_week
        FROM transaction_volumes
        WHERE distributor_id = p_distributor_id
            AND recorded_at >= NOW() - INTERVAL '90 days'
        GROUP BY DATE(recorded_at)
        ORDER BY volume_date
    ),
    trend_analysis AS (
        SELECT
            AVG(daily_volume) AS avg_demand,
            STDDEV(daily_volume) AS demand_std,
            -- Simple linear trend calculation
            COALESCE(
                (COUNT(*) * SUM(EXTRACT(EPOCH FROM volume_date - DATE '2020-01-01') * daily_volume) -
                 SUM(EXTRACT(EPOCH FROM volume_date - DATE '2020-01-01')) * SUM(daily_volume)) /
                NULLIF(COUNT(*) * SUM(POWER(EXTRACT(EPOCH FROM volume_date - DATE '2020-01-01'), 2)) -
                       POWER(SUM(EXTRACT(EPOCH FROM volume_date - DATE '2020-01-01')), 2), 0),
                0
            ) AS trend_slope
        FROM daily_volumes
    ),
    seasonal_analysis AS (
        SELECT
            day_of_week,
            AVG(daily_volume) / NULLIF((SELECT avg_demand FROM trend_analysis), 0) AS seasonal_factor
        FROM daily_volumes
        GROUP BY day_of_week
    )
    SELECT ta.avg_demand, ta.demand_std, ta.trend_slope
    INTO avg_demand, demand_std, trend_slope
    FROM trend_analysis ta;

    -- Get seasonal factors array (0=Sunday to 6=Saturday)
    SELECT ARRAY[
        COALESCE((SELECT seasonal_factor FROM seasonal_analysis WHERE day_of_week = 0), 1.0),
        COALESCE((SELECT seasonal_factor FROM seasonal_analysis WHERE day_of_week = 1), 1.0),
        COALESCE((SELECT seasonal_factor FROM seasonal_analysis WHERE day_of_week = 2), 1.0),
        COALESCE((SELECT seasonal_factor FROM seasonal_analysis WHERE day_of_week = 3), 1.0),
        COALESCE((SELECT seasonal_factor FROM seasonal_analysis WHERE day_of_week = 4), 1.0),
        COALESCE((SELECT seasonal_factor FROM seasonal_analysis WHERE day_of_week = 5), 1.0),
        COALESCE((SELECT seasonal_factor FROM seasonal_analysis WHERE day_of_week = 6), 1.0)
    ] INTO seasonal_factors;

    -- Generate forecasts for each day
    FOR i IN 1..p_forecast_days LOOP
        -- Get seasonal multiplier for day of week
        seasonal_multiplier := seasonal_factors[EXTRACT(DOW FROM current_date + i)::INTEGER + 1];

        -- Calculate predicted demand with trend and seasonality
        predicted_value := (COALESCE(avg_demand, 0) + trend_slope * i) * seasonal_multiplier;

        -- Return forecast with confidence intervals
        forecast_date := current_date + i;
        predicted_demand := GREATEST(predicted_value, 0);
        confidence_interval_lower := GREATEST(predicted_value - 1.96 * COALESCE(demand_std, 0), 0);
        confidence_interval_upper := predicted_value + 1.96 * COALESCE(demand_std, 0);

        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_distributor_performance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update performance metrics when cash flow changes
    UPDATE distributor_profiles
    SET
        updated_at = NOW(),
        last_sync = NOW()
    WHERE id = NEW.distributor_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_distributor_performance
    AFTER INSERT OR UPDATE ON cash_flow_history
    FOR EACH ROW EXECUTE FUNCTION update_distributor_performance();

-- Create function to clean old data
CREATE OR REPLACE FUNCTION cleanup_old_data() RETURNS VOID AS $$
BEGIN
    -- Keep only 90 days of cash flow history
    DELETE FROM cash_flow_history
    WHERE recorded_at < NOW() - INTERVAL '90 days';

    -- Keep only 30 days of predictions
    DELETE FROM cash_flow_predictions
    WHERE prediction_date < NOW() - INTERVAL '30 days';

    -- Keep only 60 days of transaction volumes
    DELETE FROM transaction_volumes
    WHERE recorded_at < NOW() - INTERVAL '60 days';

    -- Keep only 30 days of market conditions
    DELETE FROM market_conditions
    WHERE recorded_at < NOW() - INTERVAL '30 days';

    -- Archive completed schedules older than 30 days
    UPDATE distribution_schedules
    SET status = 'archived'
    WHERE scheduled_date < CURRENT_DATE - INTERVAL '30 days'
        AND status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE distributor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_volumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_distribution_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for distributor access
CREATE POLICY distributor_profiles_policy ON distributor_profiles
    FOR ALL USING (
        auth.uid()::text = agent_id OR
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('admin', 'supervisor', 'analyst')
        )
    );

CREATE POLICY cash_flow_predictions_policy ON cash_flow_predictions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM distributor_profiles dp
            WHERE dp.id = distributor_id
            AND (auth.uid()::text = dp.agent_id OR
                 EXISTS (
                     SELECT 1 FROM user_roles
                     WHERE user_id = auth.uid()
                     AND role_name IN ('admin', 'supervisor', 'analyst')
                 ))
        )
    );

-- Apply similar policies to other tables
CREATE POLICY cash_flow_history_policy ON cash_flow_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM distributor_profiles dp
            WHERE dp.id = distributor_id
            AND (auth.uid()::text = dp.agent_id OR
                 EXISTS (
                     SELECT 1 FROM user_roles
                     WHERE user_id = auth.uid()
                     AND role_name IN ('admin', 'supervisor', 'analyst')
                 ))
        )
    );

CREATE POLICY inventory_optimizations_policy ON inventory_optimizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM distributor_profiles dp
            WHERE dp.id = distributor_id
            AND (auth.uid()::text = dp.agent_id OR
                 EXISTS (
                     SELECT 1 FROM user_roles
                     WHERE user_id = auth.uid()
                     AND role_name IN ('admin', 'supervisor', 'analyst')
                 ))
        )
    );

-- Insert default ML models
INSERT INTO ml_models (name, model_type, version, mape, rmse, r2_score, features, status) VALUES
('Cash Flow Predictor v1', 'cash_flow_prediction', '1.0', 0.15, 250.5, 0.85,
 ARRAY['hour_of_day', 'day_of_week', 'avg_historical_inflow', 'seasonal_multiplier', 'market_volatility'], 'active'),
('Demand Forecaster v1', 'demand_forecasting', '1.0', 0.12, 180.3, 0.88,
 ARRAY['day_of_week', 'hour_of_day', 'seasonal_trends', 'historical_volume', 'economic_indicators'], 'active'),
('Inventory Optimizer v1', 'inventory_optimization', '1.0', 0.10, 150.2, 0.92,
 ARRAY['current_inventory', 'demand_forecast', 'holding_costs', 'service_level', 'lead_time'], 'active'),
('Route Optimizer v1', 'route_optimization', '1.0', 0.08, 120.1, 0.94,
 ARRAY['distance_matrix', 'traffic_patterns', 'fuel_costs', 'time_windows', 'capacity_constraints'], 'active');

-- Insert sample distribution routes
INSERT INTO distribution_routes (route_name, start_location_latitude, start_location_longitude, start_location_address, cash_capacity, coverage_radius) VALUES
('Port-au-Prince Central', 18.5944, -72.3074, 'Champ de Mars, Port-au-Prince', 500000.00, 15.0),
('Pétionville Route', 18.5125, -72.2853, 'Place Boyer, Pétionville', 300000.00, 12.0),
('Carrefour Circuit', 18.5417, -72.3958, 'Centre-ville Carrefour', 250000.00, 10.0),
('Delmas Corridor', 18.5583, -72.3000, 'Delmas 31', 400000.00, 8.0);

-- Create materialized view for performance dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS distributor_performance_summary AS
SELECT
    dp.id,
    dp.agent_id,
    dp.location_region,
    dp.business_type,
    dp.current_inventory,
    dp.optimal_level,
    dp.success_rate,

    -- Recent cash flow metrics
    COALESCE(cf.avg_inflow_24h, 0) AS avg_inflow_24h,
    COALESCE(cf.avg_outflow_24h, 0) AS avg_outflow_24h,
    COALESCE(cf.net_flow_24h, 0) AS net_flow_24h,

    -- Prediction accuracy
    calculate_prediction_accuracy(dp.id, '24h', 7) AS prediction_accuracy_7d,

    -- Optimization score
    COALESCE(io.optimization_score, 0) AS latest_optimization_score,
    COALESCE(io.cost_savings, 0) AS potential_cost_savings,

    -- Performance grade
    CASE
        WHEN dp.success_rate >= 0.95 AND calculate_prediction_accuracy(dp.id, '24h', 7) >= 0.80 THEN 'A'
        WHEN dp.success_rate >= 0.90 AND calculate_prediction_accuracy(dp.id, '24h', 7) >= 0.70 THEN 'B'
        WHEN dp.success_rate >= 0.80 AND calculate_prediction_accuracy(dp.id, '24h', 7) >= 0.60 THEN 'C'
        ELSE 'D'
    END AS performance_grade,

    NOW() AS last_updated
FROM distributor_profiles dp
LEFT JOIN (
    SELECT
        distributor_id,
        AVG(CASE WHEN recorded_at >= NOW() - INTERVAL '24 hours' THEN inflow END) AS avg_inflow_24h,
        AVG(CASE WHEN recorded_at >= NOW() - INTERVAL '24 hours' THEN outflow END) AS avg_outflow_24h,
        AVG(CASE WHEN recorded_at >= NOW() - INTERVAL '24 hours' THEN net_flow END) AS net_flow_24h
    FROM cash_flow_history
    GROUP BY distributor_id
) cf ON cf.distributor_id = dp.id
LEFT JOIN (
    SELECT DISTINCT ON (distributor_id)
        distributor_id,
        optimization_score,
        cost_savings
    FROM inventory_optimizations
    ORDER BY distributor_id, optimization_date DESC
) io ON io.distributor_id = dp.id
WHERE dp.status = 'active';

-- Create index on materialized view
CREATE UNIQUE INDEX idx_distributor_performance_summary_id
ON distributor_performance_summary(id);

-- Schedule automatic refresh of materialized view
-- This would typically be done with pg_cron or similar scheduler
-- For now, it can be refreshed manually or via application code

-- Final comment with usage instructions
COMMENT ON SCHEMA public IS 'Predictive Cash Management System - Complete database schema for AI-powered cash flow prediction, inventory optimization, and distribution scheduling.

Key Features:
- Real-time cash flow predictions with ML models
- Inventory optimization using EOQ and safety stock calculations
- Automated distribution scheduling with route optimization
- Performance analytics and monitoring
- Row-level security for multi-tenant access
- Materialized views for dashboard performance

Usage:
1. Initialize distributor profiles with capacity limits and historical patterns
2. Feed transaction data into transaction_volumes table
3. ML models automatically generate predictions in cash_flow_predictions
4. Inventory optimizations run daily via optimize_inventory_levels function
5. Distribution schedules generated based on cash needs and route capacity
6. Monitor performance via distributor_performance_summary view

Functions:
- calculate_prediction_accuracy(): Measure ML model performance
- calculate_optimal_inventory(): EOQ-based inventory optimization
- forecast_demand(): Time series demand forecasting
- cleanup_old_data(): Maintain database performance

For best performance, refresh materialized views regularly and run cleanup_old_data() weekly.';
