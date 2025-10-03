-- KobKlein Market Intelligence Database Schema
-- This schema supports real-time market data, AI insights, and predictive analytics

-- Exchange Rates Table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(15,6) NOT NULL,
  spread DECIMAL(8,4) DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(50) NOT NULL,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast rate lookups
CREATE INDEX idx_exchange_rates_currency_time ON exchange_rates(from_currency, to_currency, timestamp DESC);
CREATE INDEX idx_exchange_rates_source ON exchange_rates(source, timestamp DESC);

-- Economic Indicators Table
CREATE TABLE IF NOT EXISTS economic_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  indicator_type VARCHAR(50) NOT NULL,
  value DECIMAL(15,6) NOT NULL,
  period VARCHAR(20) NOT NULL, -- YYYY-MM or YYYY-Q1 etc
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(50) NOT NULL,
  region VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_economic_indicators_type_period ON economic_indicators(indicator_type, period DESC);

-- Merchant Activities Table
CREATE TABLE IF NOT EXISTS merchant_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID REFERENCES merchants(id),
  location JSONB NOT NULL, -- {latitude, longitude, department, commune}
  transaction_volume DECIMAL(15,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  average_amount DECIMAL(10,2) DEFAULT 0,
  peak_hours INTEGER[] DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'inactive', -- active, inactive, busy
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_merchant_activities_merchant_time ON merchant_activities(merchant_id, timestamp DESC);
CREATE INDEX idx_merchant_activities_status ON merchant_activities(status, timestamp DESC);

-- Remittance Flows Table
CREATE TABLE IF NOT EXISTS remittance_flows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_country VARCHAR(3) NOT NULL,
  destination_region VARCHAR(100) NOT NULL,
  volume_usd DECIMAL(15,2) NOT NULL,
  transaction_count INTEGER NOT NULL,
  average_amount DECIMAL(10,2) NOT NULL,
  popular_corridors TEXT[] DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  seasonal_factor DECIMAL(5,3) DEFAULT 1.0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_remittance_flows_source_dest ON remittance_flows(source_country, destination_region, timestamp DESC);

-- Market Insights Table (AI-Generated)
CREATE TABLE IF NOT EXISTS market_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type VARCHAR(20) NOT NULL, -- trend, alert, opportunity, risk
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  impact_score DECIMAL(4,2) NOT NULL,
  affected_regions TEXT[] DEFAULT '{}',
  recommended_actions TEXT[] DEFAULT '{}',
  data_sources TEXT[] DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_market_insights_type_impact ON market_insights(insight_type, impact_score DESC, timestamp DESC);
CREATE INDEX idx_market_insights_active ON market_insights(is_active, expires_at) WHERE is_active = true;

-- User Reported Rates (Crowdsourced Street Rates)
CREATE TABLE IF NOT EXISTS user_reported_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(15,6) NOT NULL,
  location JSONB, -- {latitude, longitude, address}
  source_type VARCHAR(50) DEFAULT 'street', -- street, bank, cambio, money_transfer
  confidence INTEGER DEFAULT 5, -- 1-10 scale
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_reported_rates_currency_time ON user_reported_rates(from_currency, to_currency, timestamp DESC);

-- AI Model Predictions Table
CREATE TABLE IF NOT EXISTS ai_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_type VARCHAR(50) NOT NULL, -- exchange_rate, cash_demand, fraud_risk, etc
  target_entity_id UUID, -- merchant_id, user_id, etc
  target_time TIMESTAMPTZ NOT NULL,
  predicted_value JSONB NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  model_version VARCHAR(20) NOT NULL,
  input_features JSONB NOT NULL,
  actual_value JSONB, -- populated after the event occurs
  accuracy_score DECIMAL(3,2), -- calculated after verification
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_predictions_type_target ON ai_predictions(prediction_type, target_time);

-- Real-time Analytics Views

-- Current Exchange Rate View (Latest aggregated rate)
CREATE OR REPLACE VIEW current_exchange_rate AS
SELECT
  rate,
  spread,
  confidence_score,
  timestamp,
  source
FROM exchange_rates
WHERE source = 'kobklein_aggregated'
  AND timestamp >= NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC
LIMIT 1;

-- Active Market Insights View
CREATE OR REPLACE VIEW active_market_insights AS
SELECT
  insight_type,
  title,
  description,
  confidence,
  impact_score,
  affected_regions,
  recommended_actions,
  timestamp
FROM market_insights
WHERE is_active = true
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY impact_score DESC, timestamp DESC;

-- Merchant Activity Heatmap View
CREATE OR REPLACE VIEW merchant_heatmap AS
SELECT
  ma.merchant_id,
  m.business_name,
  ma.location,
  ma.transaction_volume,
  ma.transaction_count,
  ma.status,
  ma.timestamp
FROM merchant_activities ma
JOIN merchants m ON ma.merchant_id = m.id
WHERE ma.timestamp >= NOW() - INTERVAL '1 hour'
ORDER BY ma.transaction_volume DESC;

-- Remittance Flow Summary View
CREATE OR REPLACE VIEW remittance_summary AS
SELECT
  source_country,
  destination_region,
  SUM(volume_usd) as total_volume,
  SUM(transaction_count) as total_transactions,
  AVG(average_amount) as avg_amount,
  AVG(seasonal_factor) as seasonal_factor
FROM remittance_flows
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY source_country, destination_region
ORDER BY total_volume DESC;

-- Functions for Data Analysis

-- Calculate Exchange Rate Volatility
CREATE OR REPLACE FUNCTION calculate_rate_volatility(
  p_from_currency VARCHAR(3),
  p_to_currency VARCHAR(3),
  p_hours INTEGER DEFAULT 24
)
RETURNS DECIMAL(8,6) AS $$
DECLARE
  volatility DECIMAL(8,6);
BEGIN
  WITH rate_changes AS (
    SELECT
      rate,
      LAG(rate) OVER (ORDER BY timestamp) as prev_rate
    FROM exchange_rates
    WHERE from_currency = p_from_currency
      AND to_currency = p_to_currency
      AND timestamp >= NOW() - (p_hours || ' hours')::INTERVAL
    ORDER BY timestamp
  ),
  returns AS (
    SELECT
      CASE
        WHEN prev_rate IS NOT NULL AND prev_rate > 0
        THEN (rate - prev_rate) / prev_rate
        ELSE 0
      END as return_rate
    FROM rate_changes
    WHERE prev_rate IS NOT NULL
  )
  SELECT
    COALESCE(SQRT(AVG(return_rate * return_rate)), 0)
  INTO volatility
  FROM returns;

  RETURN COALESCE(volatility, 0);
END;
$$ LANGUAGE plpgsql;

-- Predict Merchant Cash Needs
CREATE OR REPLACE FUNCTION predict_merchant_cash_needs(
  p_merchant_id UUID,
  p_hours_ahead INTEGER DEFAULT 24
)
RETURNS JSONB AS $$
DECLARE
  prediction JSONB;
  avg_hourly_volume DECIMAL(15,2);
  trend_factor DECIMAL(5,3);
  seasonal_factor DECIMAL(5,3);
  predicted_volume DECIMAL(15,2);
BEGIN
  -- Calculate average hourly volume for the merchant
  SELECT AVG(transaction_volume)
  INTO avg_hourly_volume
  FROM merchant_activities
  WHERE merchant_id = p_merchant_id
    AND timestamp >= NOW() - INTERVAL '7 days';

  -- Simple trend analysis (last 24h vs previous 24h)
  WITH recent_volume AS (
    SELECT SUM(transaction_volume) as recent
    FROM merchant_activities
    WHERE merchant_id = p_merchant_id
      AND timestamp >= NOW() - INTERVAL '24 hours'
  ),
  previous_volume AS (
    SELECT SUM(transaction_volume) as previous
    FROM merchant_activities
    WHERE merchant_id = p_merchant_id
      AND timestamp >= NOW() - INTERVAL '48 hours'
      AND timestamp < NOW() - INTERVAL '24 hours'
  )
  SELECT
    CASE
      WHEN p.previous > 0 THEN r.recent / p.previous
      ELSE 1.0
    END
  INTO trend_factor
  FROM recent_volume r, previous_volume p;

  -- Get seasonal factor from current time
  SELECT COALESCE(AVG(seasonal_factor), 1.0)
  INTO seasonal_factor
  FROM remittance_flows
  WHERE timestamp >= NOW() - INTERVAL '1 hour';

  -- Calculate prediction
  predicted_volume := COALESCE(avg_hourly_volume, 0) * p_hours_ahead * COALESCE(trend_factor, 1.0) * COALESCE(seasonal_factor, 1.0);

  -- Build prediction object
  prediction := jsonb_build_object(
    'merchant_id', p_merchant_id,
    'predicted_volume', predicted_volume,
    'confidence', CASE
      WHEN avg_hourly_volume IS NOT NULL THEN 0.75
      ELSE 0.30
    END,
    'factors', jsonb_build_object(
      'average_hourly', COALESCE(avg_hourly_volume, 0),
      'trend_factor', COALESCE(trend_factor, 1.0),
      'seasonal_factor', COALESCE(seasonal_factor, 1.0)
    ),
    'prediction_time', NOW(),
    'target_time', NOW() + (p_hours_ahead || ' hours')::INTERVAL
  );

  RETURN prediction;
END;
$$ LANGUAGE plpgsql;

-- Create Real-time Triggers and Notifications

-- Trigger to auto-expire old insights
CREATE OR REPLACE FUNCTION expire_old_insights()
RETURNS TRIGGER AS $$
BEGIN
  -- Deactivate insights that have expired
  UPDATE market_insights
  SET is_active = false
  WHERE expires_at IS NOT NULL
    AND expires_at <= NOW()
    AND is_active = true;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_expire_insights
  AFTER INSERT ON market_insights
  EXECUTE FUNCTION expire_old_insights();

-- Trigger to generate alerts on high volatility
CREATE OR REPLACE FUNCTION check_rate_volatility()
RETURNS TRIGGER AS $$
DECLARE
  current_volatility DECIMAL(8,6);
BEGIN
  -- Calculate current volatility
  SELECT calculate_rate_volatility(NEW.from_currency, NEW.to_currency, 6)
  INTO current_volatility;

  -- Generate alert if volatility is high
  IF current_volatility > 0.02 THEN -- 2% volatility threshold
    INSERT INTO market_insights (
      insight_type,
      title,
      description,
      confidence,
      impact_score,
      affected_regions,
      recommended_actions,
      data_sources,
      expires_at
    ) VALUES (
      'alert',
      'High Exchange Rate Volatility Alert',
      format('Exchange rate volatility reached %s%% in the last 6 hours', (current_volatility * 100)::DECIMAL(5,2)),
      0.90,
      8.5,
      ARRAY['All'],
      ARRAY['Enable rate alerts', 'Consider hedging', 'Increase cash reserves'],
      ARRAY['exchange_rates', 'volatility_analysis'],
      NOW() + INTERVAL '2 hours'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_volatility_alert
  AFTER INSERT ON exchange_rates
  WHERE NEW.source = 'kobklein_aggregated'
  EXECUTE FUNCTION check_rate_volatility();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE economic_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE remittance_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reported_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;

-- Public read access for aggregated market data
CREATE POLICY select_exchange_rates ON exchange_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY select_economic_indicators ON economic_indicators FOR SELECT TO authenticated USING (true);
CREATE POLICY select_market_insights ON market_insights FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY select_remittance_flows ON remittance_flows FOR SELECT TO authenticated USING (true);

-- Merchant-specific access for merchant activities
CREATE POLICY select_merchant_activities ON merchant_activities
FOR SELECT TO authenticated
USING (
  merchant_id = (SELECT merchant_id FROM merchants WHERE user_id = auth.uid())
  OR auth.role() = 'admin'
);

-- Users can only insert their own rate reports
CREATE POLICY insert_user_rates ON user_reported_rates
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY select_user_rates ON user_reported_rates
FOR SELECT TO authenticated
USING (true); -- All users can see aggregated rates

-- Admin-only access for AI predictions
CREATE POLICY admin_ai_predictions ON ai_predictions
FOR ALL TO authenticated
USING (auth.role() = 'admin');

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exchange_rates_timestamp ON exchange_rates(timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_merchant_activities_timestamp ON merchant_activities(timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remittance_flows_timestamp ON remittance_flows(timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_market_insights_timestamp ON market_insights(timestamp DESC);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE exchange_rates;
ALTER PUBLICATION supabase_realtime ADD TABLE merchant_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE market_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE remittance_flows;