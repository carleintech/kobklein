-- Intelligent Remittance Routing Database Schema
-- This schema supports AI-powered remittance routing, cash flow prediction, and corridor optimization

-- Remittance Corridors Table
CREATE TABLE IF NOT EXISTS remittance_corridors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin_country VARCHAR(2) NOT NULL, -- ISO country code
    destination_country VARCHAR(2) NOT NULL, -- ISO country code
    currency_from VARCHAR(3) NOT NULL, -- ISO currency code
    currency_to VARCHAR(3) NOT NULL, -- ISO currency code
    is_active BOOLEAN DEFAULT true,
    regulatory_requirements TEXT[] DEFAULT '{}',
    compliance_level VARCHAR(20) NOT NULL DEFAULT 'basic' CHECK (compliance_level IN ('basic', 'enhanced', 'strict')),
    average_delivery_time INTEGER DEFAULT 24, -- in hours
    volume_limits JSONB NOT NULL DEFAULT '{"min_amount": 1, "max_amount": 50000, "daily_limit": 100000}',
    monthly_volume DECIMAL(20,2) DEFAULT 0,
    success_rate DECIMAL(5,4) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(origin_country, destination_country, currency_from, currency_to)
);

-- Create indexes for remittance corridors
CREATE INDEX IF NOT EXISTS idx_remittance_corridors_origin_dest ON remittance_corridors(origin_country, destination_country);
CREATE INDEX IF NOT EXISTS idx_remittance_corridors_currencies ON remittance_corridors(currency_from, currency_to);
CREATE INDEX IF NOT EXISTS idx_remittance_corridors_active ON remittance_corridors(is_active);
CREATE INDEX IF NOT EXISTS idx_remittance_corridors_compliance ON remittance_corridors(compliance_level);

-- Remittance Providers Table
CREATE TABLE IF NOT EXISTS remittance_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(20) NOT NULL CHECK (provider_type IN ('bank', 'mto', 'fintech', 'crypto', 'mobile_money')),
    supported_corridors UUID[] DEFAULT '{}',
    fee_structure JSONB NOT NULL DEFAULT '{"base_fee": 0, "percentage_fee": 0, "minimum_fee": 0, "maximum_fee": 0, "currency": "USD"}',
    exchange_rate_margin DECIMAL(5,4) DEFAULT 0.02, -- percentage margin on mid-market rate
    delivery_methods TEXT[] DEFAULT '{"cash_pickup"}',
    average_delivery_time INTEGER DEFAULT 24, -- in hours
    success_rate DECIMAL(5,4) DEFAULT 1.0,
    compliance_rating INTEGER DEFAULT 100 CHECK (compliance_rating >= 0 AND compliance_rating <= 100),
    api_integration JSONB NOT NULL DEFAULT '{"has_api": false, "real_time_rates": false, "real_time_tracking": false, "webhook_support": false}',
    capacity_limits JSONB DEFAULT '{"daily_limit": 1000000, "per_transaction_limit": 50000}',
    is_active BOOLEAN DEFAULT true,
    last_capacity_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for remittance providers
CREATE INDEX IF NOT EXISTS idx_remittance_providers_type ON remittance_providers(provider_type);
CREATE INDEX IF NOT EXISTS idx_remittance_providers_active ON remittance_providers(is_active);
CREATE INDEX IF NOT EXISTS idx_remittance_providers_success_rate ON remittance_providers(success_rate);
CREATE INDEX IF NOT EXISTS idx_remittance_providers_compliance ON remittance_providers(compliance_rating);

-- Provider Capacity Table (Real-time capacity tracking)
CREATE TABLE IF NOT EXISTS provider_capacity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES remittance_providers(id) ON DELETE CASCADE,
    corridor_id UUID NOT NULL REFERENCES remittance_corridors(id) ON DELETE CASCADE,
    available_amount DECIMAL(20,2) NOT NULL DEFAULT 0,
    reserved_amount DECIMAL(20,2) NOT NULL DEFAULT 0,
    total_capacity DECIMAL(20,2) NOT NULL DEFAULT 1000000,
    utilization_rate DECIMAL(5,4) GENERATED ALWAYS AS ((total_capacity - available_amount) / total_capacity) STORED,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(provider_id, corridor_id)
);

-- Create indexes for provider capacity
CREATE INDEX IF NOT EXISTS idx_provider_capacity_provider_id ON provider_capacity(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_capacity_corridor_id ON provider_capacity(corridor_id);
CREATE INDEX IF NOT EXISTS idx_provider_capacity_utilization ON provider_capacity(utilization_rate);

-- Remittance Routes Table (Cached route calculations)
CREATE TABLE IF NOT EXISTS remittance_routes (
    id VARCHAR(255) PRIMARY KEY,
    corridor_id UUID NOT NULL REFERENCES remittance_corridors(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES remittance_providers(id) ON DELETE CASCADE,
    origin_agent VARCHAR(255),
    destination_agent VARCHAR(255),
    total_cost DECIMAL(15,2) NOT NULL,
    exchange_rate DECIMAL(15,8) NOT NULL,
    fees JSONB NOT NULL DEFAULT '{"provider_fee": 0, "agent_fee": 0, "regulatory_fee": 0, "total_fee": 0}',
    estimated_delivery_time INTEGER NOT NULL, -- in hours
    delivery_method VARCHAR(50) NOT NULL,
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    capacity_available BOOLEAN DEFAULT true,
    regulatory_compliant BOOLEAN DEFAULT true,
    ai_score DECIMAL(5,4), -- AI optimization score
    detailed_scores JSONB, -- breakdown of scoring factors
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for remittance routes
CREATE INDEX IF NOT EXISTS idx_remittance_routes_corridor_id ON remittance_routes(corridor_id);
CREATE INDEX IF NOT EXISTS idx_remittance_routes_provider_id ON remittance_routes(provider_id);
CREATE INDEX IF NOT EXISTS idx_remittance_routes_expires_at ON remittance_routes(expires_at);
CREATE INDEX IF NOT EXISTS idx_remittance_routes_ai_score ON remittance_routes(ai_score DESC);

-- Remittance Quotes Table
CREATE TABLE IF NOT EXISTS remittance_quotes (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    send_amount DECIMAL(15,2) NOT NULL,
    send_currency VARCHAR(3) NOT NULL,
    receive_amount DECIMAL(15,2) NOT NULL,
    receive_currency VARCHAR(3) NOT NULL,
    corridor_id UUID NOT NULL REFERENCES remittance_corridors(id),
    recommended_routes JSONB NOT NULL DEFAULT '[]',
    best_rate_route JSONB,
    fastest_route JSONB,
    cheapest_route JSONB,
    ai_recommended_route JSONB,
    recipient_info JSONB NOT NULL,
    quote_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_executed BOOLEAN DEFAULT false,
    executed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for remittance quotes
CREATE INDEX IF NOT EXISTS idx_remittance_quotes_user_id ON remittance_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_remittance_quotes_corridor_id ON remittance_quotes(corridor_id);
CREATE INDEX IF NOT EXISTS idx_remittance_quotes_expires_at ON remittance_quotes(quote_expires_at);
CREATE INDEX IF NOT EXISTS idx_remittance_quotes_created_at ON remittance_quotes(created_at);

-- Remittance Transactions Table
CREATE TABLE IF NOT EXISTS remittance_transactions (
    id VARCHAR(255) PRIMARY KEY,
    quote_id VARCHAR(255) REFERENCES remittance_quotes(id),
    route_id VARCHAR(255),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES remittance_providers(id),
    corridor_id UUID NOT NULL REFERENCES remittance_corridors(id),
    send_amount DECIMAL(15,2) NOT NULL,
    send_currency VARCHAR(3) NOT NULL,
    receive_amount DECIMAL(15,2) NOT NULL,
    receive_currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(15,8) NOT NULL,
    total_fees DECIMAL(15,2) NOT NULL,
    delivery_method VARCHAR(50) NOT NULL,
    recipient_info JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'in_transit', 'ready_for_pickup', 'completed', 'failed', 'cancelled')),
    tracking_number VARCHAR(100),
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    provider_reference VARCHAR(255),
    compliance_checks JSONB DEFAULT '{}',
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for remittance transactions
CREATE INDEX IF NOT EXISTS idx_remittance_transactions_user_id ON remittance_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_remittance_transactions_provider_id ON remittance_transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_remittance_transactions_corridor_id ON remittance_transactions(corridor_id);
CREATE INDEX IF NOT EXISTS idx_remittance_transactions_status ON remittance_transactions(status);
CREATE INDEX IF NOT EXISTS idx_remittance_transactions_created_at ON remittance_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_remittance_transactions_tracking ON remittance_transactions(tracking_number);

-- Cash Flow Predictions Table
CREATE TABLE IF NOT EXISTS cash_flow_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distributor_id UUID NOT NULL, -- References to distributor/agent
    corridor_id UUID NOT NULL REFERENCES remittance_corridors(id),
    currency VARCHAR(3) NOT NULL,
    predicted_inflow DECIMAL(20,2) NOT NULL,
    predicted_outflow DECIMAL(20,2) NOT NULL,
    net_flow DECIMAL(20,2) GENERATED ALWAYS AS (predicted_inflow - predicted_outflow) STORED,
    confidence DECIMAL(5,4) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    prediction_date DATE NOT NULL,
    prediction_horizon INTEGER NOT NULL DEFAULT 1, -- days ahead
    factors JSONB NOT NULL DEFAULT '{}',
    recommended_actions TEXT[] DEFAULT '{}',
    model_version VARCHAR(50) DEFAULT 'v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(distributor_id, corridor_id, currency, prediction_date, prediction_horizon)
);

-- Create indexes for cash flow predictions
CREATE INDEX IF NOT EXISTS idx_cash_flow_predictions_distributor_id ON cash_flow_predictions(distributor_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_predictions_corridor_id ON cash_flow_predictions(corridor_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_predictions_date ON cash_flow_predictions(prediction_date);
CREATE INDEX IF NOT EXISTS idx_cash_flow_predictions_confidence ON cash_flow_predictions(confidence);

-- Distributor Cash Flows Table (Historical data for ML training)
CREATE TABLE IF NOT EXISTS distributor_cash_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distributor_id UUID NOT NULL,
    corridor_id UUID NOT NULL REFERENCES remittance_corridors(id),
    currency VARCHAR(3) NOT NULL,
    date DATE NOT NULL,
    inflow DECIMAL(20,2) NOT NULL DEFAULT 0,
    outflow DECIMAL(20,2) NOT NULL DEFAULT 0,
    net_flow DECIMAL(20,2) GENERATED ALWAYS AS (inflow - outflow) STORED,
    opening_balance DECIMAL(20,2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(20,2) NOT NULL DEFAULT 0,
    transaction_count INTEGER DEFAULT 0,
    average_transaction_size DECIMAL(15,2) DEFAULT 0,
    peak_hour INTEGER, -- Hour with highest activity
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(distributor_id, corridor_id, currency, date)
);

-- Create indexes for distributor cash flows
CREATE INDEX IF NOT EXISTS idx_distributor_cash_flows_distributor_id ON distributor_cash_flows(distributor_id);
CREATE INDEX IF NOT EXISTS idx_distributor_cash_flows_corridor_id ON distributor_cash_flows(corridor_id);
CREATE INDEX IF NOT EXISTS idx_distributor_cash_flows_date ON distributor_cash_flows(date);
CREATE INDEX IF NOT EXISTS idx_distributor_cash_flows_net_flow ON distributor_cash_flows(net_flow);

-- Agent Fees Table
CREATE TABLE IF NOT EXISTS agent_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corridor_id UUID NOT NULL REFERENCES remittance_corridors(id),
    agent_id UUID NOT NULL,
    location VARCHAR(255) NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- 'cash_pickup', 'bank_deposit', 'mobile_wallet'
    fee_amount DECIMAL(15,2) DEFAULT 0,
    fee_percentage DECIMAL(5,4) DEFAULT 0,
    minimum_fee DECIMAL(15,2) DEFAULT 0,
    maximum_fee DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effective_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(corridor_id, agent_id, location, service_type, effective_from)
);

-- Create indexes for agent fees
CREATE INDEX IF NOT EXISTS idx_agent_fees_corridor_id ON agent_fees(corridor_id);
CREATE INDEX IF NOT EXISTS idx_agent_fees_agent_id ON agent_fees(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_fees_location ON agent_fees(location);
CREATE INDEX IF NOT EXISTS idx_agent_fees_effective ON agent_fees(effective_from, effective_until);

-- Real-time Transactions Table (For live cash flow updates)
CREATE TABLE IF NOT EXISTS real_time_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corridor_id UUID NOT NULL REFERENCES remittance_corridors(id),
    transaction_amount DECIMAL(15,2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('inflow', 'outflow')),
    distributor_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT false,

    -- Partition by date for performance
    PARTITION BY RANGE (timestamp)
);

-- Create indexes for real-time transactions
CREATE INDEX IF NOT EXISTS idx_real_time_transactions_corridor_id ON real_time_transactions(corridor_id);
CREATE INDEX IF NOT EXISTS idx_real_time_transactions_timestamp ON real_time_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_real_time_transactions_processed ON real_time_transactions(processed);

-- Route Optimization History Table
CREATE TABLE IF NOT EXISTS route_optimization_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id VARCHAR(255) REFERENCES remittance_quotes(id),
    user_id UUID REFERENCES auth.users(id),
    request_parameters JSONB NOT NULL,
    optimization_results JSONB NOT NULL,
    selected_route_id VARCHAR(255),
    ai_model_version VARCHAR(50) DEFAULT 'v1.0',
    execution_time_ms INTEGER,
    user_satisfaction_score INTEGER CHECK (user_satisfaction_score >= 1 AND user_satisfaction_score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for route optimization history
CREATE INDEX IF NOT EXISTS idx_route_optimization_history_quote_id ON route_optimization_history(quote_id);
CREATE INDEX IF NOT EXISTS idx_route_optimization_history_user_id ON route_optimization_history(user_id);
CREATE INDEX IF NOT EXISTS idx_route_optimization_history_created_at ON route_optimization_history(created_at);

-- Functions for Route Optimization and Cash Flow Management

-- Function to calculate corridor health score
CREATE OR REPLACE FUNCTION calculate_corridor_health_score(corridor_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    success_rate DECIMAL;
    volume_trend DECIMAL;
    provider_count INTEGER;
    avg_delivery_time INTEGER;
    health_score INTEGER;
BEGIN
    -- Get corridor metrics
    SELECT
        c.success_rate,
        c.average_delivery_time,
        COUNT(DISTINCT rp.id) as provider_count
    INTO success_rate, avg_delivery_time, provider_count
    FROM remittance_corridors c
    LEFT JOIN remittance_providers rp ON corridor_uuid = ANY(rp.supported_corridors)
    WHERE c.id = corridor_uuid
    AND rp.is_active = true
    GROUP BY c.success_rate, c.average_delivery_time;

    -- Calculate volume trend (last 30 days vs previous 30 days)
    WITH recent_volume AS (
        SELECT COALESCE(SUM(send_amount), 0) as recent_total
        FROM remittance_transactions
        WHERE corridor_id = corridor_uuid
        AND created_at > NOW() - INTERVAL '30 days'
    ),
    previous_volume AS (
        SELECT COALESCE(SUM(send_amount), 0) as previous_total
        FROM remittance_transactions
        WHERE corridor_id = corridor_uuid
        AND created_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days'
    )
    SELECT
        CASE
            WHEN p.previous_total = 0 THEN 1.0
            ELSE r.recent_total / p.previous_total
        END
    INTO volume_trend
    FROM recent_volume r, previous_volume p;

    -- Calculate health score (0-100)
    health_score := GREATEST(0, LEAST(100,
        (success_rate * 100 * 0.4) + -- 40% weight on success rate
        (GREATEST(0, 100 - avg_delivery_time) * 0.3) + -- 30% weight on speed (inverted)
        (LEAST(100, provider_count * 20) * 0.2) + -- 20% weight on provider diversity
        (LEAST(100, volume_trend * 50) * 0.1) -- 10% weight on growth trend
    ));

    RETURN health_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update provider capacity in real-time
CREATE OR REPLACE FUNCTION update_provider_capacity(
    p_provider_id UUID,
    p_corridor_id UUID,
    p_amount_change DECIMAL,
    p_operation VARCHAR -- 'reserve', 'release', 'consume'
)
RETURNS BOOLEAN AS $$
DECLARE
    current_available DECIMAL;
    current_reserved DECIMAL;
    new_available DECIMAL;
    new_reserved DECIMAL;
BEGIN
    -- Get current capacity
    SELECT available_amount, reserved_amount
    INTO current_available, current_reserved
    FROM provider_capacity
    WHERE provider_id = p_provider_id AND corridor_id = p_corridor_id;

    -- If no record exists, create one
    IF NOT FOUND THEN
        INSERT INTO provider_capacity (provider_id, corridor_id, available_amount, reserved_amount, total_capacity)
        VALUES (p_provider_id, p_corridor_id, 1000000, 0, 1000000);
        current_available := 1000000;
        current_reserved := 0;
    END IF;

    -- Calculate new values based on operation
    CASE p_operation
        WHEN 'reserve' THEN
            IF current_available >= p_amount_change THEN
                new_available := current_available - p_amount_change;
                new_reserved := current_reserved + p_amount_change;
            ELSE
                RETURN FALSE; -- Insufficient capacity
            END IF;
        WHEN 'release' THEN
            new_available := current_available + p_amount_change;
            new_reserved := GREATEST(0, current_reserved - p_amount_change);
        WHEN 'consume' THEN
            new_available := current_available;
            new_reserved := GREATEST(0, current_reserved - p_amount_change);
        ELSE
            RETURN FALSE; -- Invalid operation
    END CASE;

    -- Update capacity
    UPDATE provider_capacity
    SET
        available_amount = new_available,
        reserved_amount = new_reserved,
        last_updated = NOW()
    WHERE provider_id = p_provider_id AND corridor_id = p_corridor_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get optimal route recommendations
CREATE OR REPLACE FUNCTION get_optimal_routes(
    p_corridor_id UUID,
    p_amount DECIMAL,
    p_user_preferences JSONB DEFAULT '{}'
)
RETURNS TABLE(
    route_id VARCHAR,
    provider_name VARCHAR,
    total_cost DECIMAL,
    delivery_time INTEGER,
    confidence_score INTEGER,
    recommendation_rank INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH available_routes AS (
        SELECT
            rr.id as route_id,
            rp.name as provider_name,
            rr.total_cost,
            rr.estimated_delivery_time as delivery_time,
            rr.confidence_score,
            rr.ai_score,
            -- Calculate user preference score
            CASE
                WHEN p_user_preferences->>'speed_preference' = 'fastest'
                THEN (100 - rr.estimated_delivery_time) * 0.6 + rr.ai_score * 0.4
                WHEN p_user_preferences->>'speed_preference' = 'cheapest'
                THEN (100 - (rr.total_cost / p_amount * 100)) * 0.6 + rr.ai_score * 0.4
                ELSE rr.ai_score
            END as final_score
        FROM remittance_routes rr
        JOIN remittance_providers rp ON rr.provider_id = rp.id
        WHERE rr.corridor_id = p_corridor_id
        AND rr.expires_at > NOW()
        AND rr.capacity_available = true
        AND rr.regulatory_compliant = true
        AND rp.is_active = true
    )
    SELECT
        ar.route_id,
        ar.provider_name,
        ar.total_cost,
        ar.delivery_time,
        ar.confidence_score,
        ROW_NUMBER() OVER (ORDER BY ar.final_score DESC)::INTEGER as recommendation_rank
    FROM available_routes ar
    ORDER BY ar.final_score DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to predict cash flow needs
CREATE OR REPLACE FUNCTION predict_daily_cash_needs(
    p_distributor_id UUID,
    p_corridor_id UUID,
    p_prediction_days INTEGER DEFAULT 7
)
RETURNS TABLE(
    prediction_date DATE,
    predicted_inflow DECIMAL,
    predicted_outflow DECIMAL,
    net_flow DECIMAL,
    confidence DECIMAL,
    recommended_action TEXT
) AS $$
DECLARE
    avg_inflow DECIMAL;
    avg_outflow DECIMAL;
    seasonal_factor DECIMAL;
    i INTEGER;
BEGIN
    -- Calculate historical averages (last 30 days)
    SELECT
        COALESCE(AVG(inflow), 0),
        COALESCE(AVG(outflow), 0)
    INTO avg_inflow, avg_outflow
    FROM distributor_cash_flows
    WHERE distributor_id = p_distributor_id
    AND corridor_id = p_corridor_id
    AND date > CURRENT_DATE - INTERVAL '30 days';

    -- Generate predictions for each day
    FOR i IN 1..p_prediction_days LOOP
        -- Calculate seasonal factor (simple day of week adjustment)
        seasonal_factor := CASE EXTRACT(DOW FROM CURRENT_DATE + i)
            WHEN 0 THEN 1.2  -- Sunday
            WHEN 1 THEN 0.9  -- Monday
            WHEN 6 THEN 1.1  -- Saturday
            ELSE 1.0
        END;

        prediction_date := CURRENT_DATE + i;
        predicted_inflow := avg_inflow * seasonal_factor;
        predicted_outflow := avg_outflow * seasonal_factor;
        net_flow := predicted_inflow - predicted_outflow;
        confidence := CASE
            WHEN avg_inflow > 0 AND avg_outflow > 0 THEN 0.8
            WHEN avg_inflow > 0 OR avg_outflow > 0 THEN 0.6
            ELSE 0.3
        END;

        recommended_action := CASE
            WHEN net_flow < -1000 THEN 'Consider cash replenishment'
            WHEN net_flow > 2000 THEN 'Excess cash - consider reallocation'
            ELSE 'Normal operations expected'
        END;

        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to update route expiration
CREATE OR REPLACE FUNCTION cleanup_expired_routes()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM remittance_routes WHERE expires_at < NOW();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update cash flow on transaction completion
CREATE OR REPLACE FUNCTION update_cash_flow_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Update distributor cash flow when transaction status changes to completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO distributor_cash_flows (
            distributor_id, corridor_id, currency, date, outflow, transaction_count
        )
        VALUES (
            COALESCE((NEW.recipient_info->>'agent_id')::UUID, gen_random_uuid()),
            NEW.corridor_id,
            NEW.receive_currency,
            CURRENT_DATE,
            NEW.receive_amount,
            1
        )
        ON CONFLICT (distributor_id, corridor_id, currency, date)
        DO UPDATE SET
            outflow = distributor_cash_flows.outflow + EXCLUDED.outflow,
            transaction_count = distributor_cash_flows.transaction_count + 1,
            average_transaction_size = (distributor_cash_flows.outflow + EXCLUDED.outflow) / (distributor_cash_flows.transaction_count + 1);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER cleanup_expired_routes_trigger
    AFTER INSERT OR UPDATE ON remittance_routes
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_expired_routes();

CREATE TRIGGER update_cash_flow_trigger
    AFTER UPDATE ON remittance_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_cash_flow_on_transaction();

-- Create partitions for real_time_transactions (monthly partitions)
CREATE TABLE IF NOT EXISTS real_time_transactions_2024_01 PARTITION OF real_time_transactions
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE IF NOT EXISTS real_time_transactions_2024_02 PARTITION OF real_time_transactions
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Views for Analytics and Monitoring

-- Corridor Performance View
CREATE OR REPLACE VIEW corridor_performance_summary AS
SELECT
    rc.id,
    rc.origin_country,
    rc.destination_country,
    rc.currency_from,
    rc.currency_to,
    COUNT(rt.id) as total_transactions,
    SUM(rt.send_amount) as total_volume,
    AVG(rt.total_fees) as avg_fees,
    AVG(EXTRACT(EPOCH FROM (rt.actual_delivery - rt.created_at))/3600) as avg_delivery_hours,
    AVG(rt.user_rating) as avg_user_rating,
    calculate_corridor_health_score(rc.id) as health_score,
    COUNT(DISTINCT rp.id) as active_providers
FROM remittance_corridors rc
LEFT JOIN remittance_transactions rt ON rc.id = rt.corridor_id
LEFT JOIN remittance_providers rp ON rc.id = ANY(rp.supported_corridors) AND rp.is_active = true
WHERE rc.is_active = true
GROUP BY rc.id, rc.origin_country, rc.destination_country, rc.currency_from, rc.currency_to;

-- Provider Performance View
CREATE OR REPLACE VIEW provider_performance_summary AS
SELECT
    rp.id,
    rp.name,
    rp.provider_type,
    COUNT(rt.id) as total_transactions,
    SUM(rt.send_amount) as total_volume,
    AVG(rt.user_rating) as avg_user_rating,
    AVG(EXTRACT(EPOCH FROM (rt.actual_delivery - rt.created_at))/3600) as avg_delivery_hours,
    COUNT(*) FILTER (WHERE rt.status = 'completed') / COUNT(*)::DECIMAL as success_rate,
    AVG(pc.utilization_rate) as avg_capacity_utilization
FROM remittance_providers rp
LEFT JOIN remittance_transactions rt ON rp.id = rt.provider_id
LEFT JOIN provider_capacity pc ON rp.id = pc.provider_id
WHERE rp.is_active = true
GROUP BY rp.id, rp.name, rp.provider_type;

-- Cash Flow Dashboard View
CREATE OR REPLACE VIEW cash_flow_dashboard AS
SELECT
    dcf.distributor_id,
    dcf.corridor_id,
    dcf.currency,
    dcf.date,
    dcf.inflow,
    dcf.outflow,
    dcf.net_flow,
    dcf.closing_balance,
    LAG(dcf.net_flow) OVER (PARTITION BY dcf.distributor_id, dcf.corridor_id ORDER BY dcf.date) as previous_day_flow,
    AVG(dcf.net_flow) OVER (
        PARTITION BY dcf.distributor_id, dcf.corridor_id
        ORDER BY dcf.date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as seven_day_avg_flow
FROM distributor_cash_flows dcf
ORDER BY dcf.distributor_id, dcf.corridor_id, dcf.date DESC;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE remittance_corridors ENABLE ROW LEVEL SECURITY;
ALTER TABLE remittance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE remittance_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE remittance_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE remittance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_cash_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_optimization_history ENABLE ROW LEVEL SECURITY;

-- Remittance Corridors RLS (Public read access for active corridors)
CREATE POLICY "Public can view active corridors"
ON remittance_corridors FOR SELECT
USING (is_active = true);

CREATE POLICY "Operators can manage corridors"
ON remittance_corridors FOR ALL
USING (
    auth.jwt() ->> 'role' IN ('operator', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('operator', 'admin')
);

-- Remittance Providers RLS
CREATE POLICY "Public can view active providers"
ON remittance_providers FOR SELECT
USING (is_active = true);

CREATE POLICY "Operators can manage providers"
ON remittance_providers FOR ALL
USING (
    auth.jwt() ->> 'role' IN ('operator', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('operator', 'admin')
);

-- Remittance Quotes RLS
CREATE POLICY "Users can view their own quotes"
ON remittance_quotes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create quotes"
ON remittance_quotes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Operators can view all quotes"
ON remittance_quotes FOR SELECT
USING (
    auth.jwt() ->> 'role' IN ('operator', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('operator', 'admin')
);

-- Remittance Transactions RLS
CREATE POLICY "Users can view their own transactions"
ON remittance_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
ON remittance_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Operators can manage all transactions"
ON remittance_transactions FOR ALL
USING (
    auth.jwt() ->> 'role' IN ('operator', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('operator', 'admin')
);

-- Cash Flow Predictions RLS
CREATE POLICY "Distributors can view their own predictions"
ON cash_flow_predictions FOR SELECT
USING (
    distributor_id = auth.uid() OR
    auth.jwt() ->> 'role' IN ('distributor', 'operator', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('distributor', 'operator', 'admin')
);

CREATE POLICY "System can manage predictions"
ON cash_flow_predictions FOR ALL
WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE remittance_corridors IS 'Available remittance corridors with regulatory and operational parameters';
COMMENT ON TABLE remittance_providers IS 'Remittance service providers with capabilities and fee structures';
COMMENT ON TABLE provider_capacity IS 'Real-time capacity tracking for providers by corridor';
COMMENT ON TABLE remittance_routes IS 'Cached route calculations with AI optimization scores';
COMMENT ON TABLE remittance_quotes IS 'User quotes with multiple route options and AI recommendations';
COMMENT ON TABLE remittance_transactions IS 'Completed and in-progress remittance transactions';
COMMENT ON TABLE cash_flow_predictions IS 'AI-generated cash flow predictions for distributors';
COMMENT ON TABLE distributor_cash_flows IS 'Historical cash flow data for ML training and analytics';
COMMENT ON TABLE agent_fees IS 'Location-based agent fees for different service types';

COMMENT ON FUNCTION calculate_corridor_health_score IS 'Calculates health score for remittance corridors based on multiple performance metrics';
COMMENT ON FUNCTION update_provider_capacity IS 'Updates provider capacity in real-time for capacity management';
COMMENT ON FUNCTION get_optimal_routes IS 'Returns optimal route recommendations using AI scoring and user preferences';
COMMENT ON FUNCTION predict_daily_cash_needs IS 'Predicts daily cash flow requirements for distributors';