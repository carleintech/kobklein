-- AI-Powered Fraud Detection Database Schema
-- This schema supports comprehensive fraud detection with ML models, behavioral analysis, and real-time monitoring

-- Device Fingerprinting Table
CREATE TABLE IF NOT EXISTS device_fingerprints (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    browser_fingerprint VARCHAR(255) NOT NULL,
    screen_resolution VARCHAR(50),
    timezone VARCHAR(100),
    language VARCHAR(10),
    user_agent TEXT,
    ip_address INET,
    geolocation JSONB, -- {latitude, longitude, accuracy}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),

    UNIQUE(user_id, device_id)
);

-- Create index for device fingerprints
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_user_id ON device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_trust_score ON device_fingerprints(trust_score);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_last_seen ON device_fingerprints(last_seen);

-- Transaction Risk Profiles Table
CREATE TABLE IF NOT EXISTS transaction_risk_profiles (
    transaction_id VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'HTG',
    merchant_id UUID REFERENCES merchants(id),
    recipient_id UUID REFERENCES auth.users(id),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('payment', 'transfer', 'cash_out', 'top_up', 'remittance')),
    location JSONB, -- {latitude, longitude, ip_country, ip_region}
    device_fingerprint_id VARCHAR(255) REFERENCES device_fingerprints(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_factors TEXT[] DEFAULT '{}',
    ml_predictions JSONB NOT NULL DEFAULT '{}', -- {fraud_probability, anomaly_score, behavioral_score}
    status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'flagged', 'blocked', 'under_review'))
);

-- Create indexes for transaction risk profiles
CREATE INDEX IF NOT EXISTS idx_transaction_risk_profiles_user_id ON transaction_risk_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_risk_profiles_risk_score ON transaction_risk_profiles(risk_score);
CREATE INDEX IF NOT EXISTS idx_transaction_risk_profiles_status ON transaction_risk_profiles(status);
CREATE INDEX IF NOT EXISTS idx_transaction_risk_profiles_timestamp ON transaction_risk_profiles(timestamp);
CREATE INDEX IF NOT EXISTS idx_transaction_risk_profiles_merchant_id ON transaction_risk_profiles(merchant_id);

-- Behavioral Patterns Table
CREATE TABLE IF NOT EXISTS behavioral_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pattern_type VARCHAR(50) NOT NULL CHECK (pattern_type IN ('transaction_timing', 'amount_patterns', 'location_behavior', 'device_usage')),
    baseline_metrics JSONB NOT NULL DEFAULT '{}',
    current_metrics JSONB NOT NULL DEFAULT '{}',
    deviation_score DECIMAL(5,4) DEFAULT 0 CHECK (deviation_score >= 0 AND deviation_score <= 1),
    confidence DECIMAL(5,4) DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 1),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, pattern_type)
);

-- Create indexes for behavioral patterns
CREATE INDEX IF NOT EXISTS idx_behavioral_patterns_user_id ON behavioral_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_behavioral_patterns_pattern_type ON behavioral_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_behavioral_patterns_deviation_score ON behavioral_patterns(deviation_score);

-- Fraud Alerts Table
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id VARCHAR(255) PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('high_risk_transaction', 'suspicious_pattern', 'device_anomaly', 'location_mismatch')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) REFERENCES transaction_risk_profiles(transaction_id),
    description TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    evidence JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES auth.users(id)
);

-- Create indexes for fraud alerts
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user_id ON fraud_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_severity ON fraud_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_created_at ON fraud_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_assigned_to ON fraud_alerts(assigned_to);

-- Merchant Risk Profiles Table
CREATE TABLE IF NOT EXISTS merchant_risk_profiles (
    merchant_id UUID PRIMARY KEY REFERENCES merchants(id) ON DELETE CASCADE,
    risk_score INTEGER DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
    transaction_success_rate DECIMAL(5,4) DEFAULT 1.0,
    dispute_rate DECIMAL(5,4) DEFAULT 0.0,
    chargeback_rate DECIMAL(5,4) DEFAULT 0.0,
    average_transaction_amount DECIMAL(15,2),
    total_transaction_volume DECIMAL(20,2) DEFAULT 0,
    fraud_incidents INTEGER DEFAULT 0,
    compliance_score INTEGER DEFAULT 100 CHECK (compliance_score >= 0 AND compliance_score <= 100),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for merchant risk profiles
CREATE INDEX IF NOT EXISTS idx_merchant_risk_profiles_risk_score ON merchant_risk_profiles(risk_score);
CREATE INDEX IF NOT EXISTS idx_merchant_risk_profiles_compliance_score ON merchant_risk_profiles(compliance_score);

-- User Location History Table
CREATE TABLE IF NOT EXISTS user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    accuracy INTEGER, -- GPS accuracy in meters
    ip_address INET,
    source VARCHAR(20) NOT NULL CHECK (source IN ('gps', 'ip', 'manual')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user locations
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_timestamp ON user_locations(timestamp);

-- ML Model Predictions History Table
CREATE TABLE IF NOT EXISTS ml_predictions_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(255) REFERENCES transaction_risk_profiles(transaction_id),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    input_features JSONB NOT NULL,
    prediction_result JSONB NOT NULL,
    confidence_score DECIMAL(5,4),
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for ML predictions history
CREATE INDEX IF NOT EXISTS idx_ml_predictions_history_transaction_id ON ml_predictions_history(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_history_model_name ON ml_predictions_history(model_name);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_history_created_at ON ml_predictions_history(created_at);

-- Risk Score Calculation Functions
CREATE OR REPLACE FUNCTION calculate_user_risk_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    avg_transaction_risk DECIMAL;
    device_trust_avg DECIMAL;
    alert_count INTEGER;
    final_risk_score INTEGER;
BEGIN
    -- Calculate average transaction risk score for the user
    SELECT COALESCE(AVG(risk_score), 50)
    INTO avg_transaction_risk
    FROM transaction_risk_profiles
    WHERE user_id = user_uuid
    AND timestamp > NOW() - INTERVAL '30 days';

    -- Calculate average device trust score
    SELECT COALESCE(AVG(trust_score), 50)
    INTO device_trust_avg
    FROM device_fingerprints
    WHERE user_id = user_uuid;

    -- Count active high-severity fraud alerts
    SELECT COUNT(*)
    INTO alert_count
    FROM fraud_alerts
    WHERE user_id = user_uuid
    AND status = 'active'
    AND severity IN ('high', 'critical');

    -- Calculate final risk score
    final_risk_score := GREATEST(0, LEAST(100,
        (avg_transaction_risk * 0.6) +
        ((100 - device_trust_avg) * 0.3) +
        (alert_count * 10 * 0.1)
    ));

    RETURN final_risk_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update merchant risk profiles
CREATE OR REPLACE FUNCTION update_merchant_risk_profile(merchant_uuid UUID)
RETURNS VOID AS $$
DECLARE
    success_rate DECIMAL;
    avg_amount DECIMAL;
    total_volume DECIMAL;
    fraud_count INTEGER;
    new_risk_score INTEGER;
BEGIN
    -- Calculate transaction success rate
    SELECT
        CASE
            WHEN COUNT(*) = 0 THEN 1.0
            ELSE COUNT(*) FILTER (WHERE status = 'approved') / COUNT(*)::DECIMAL
        END
    INTO success_rate
    FROM transaction_risk_profiles
    WHERE merchant_id = merchant_uuid
    AND timestamp > NOW() - INTERVAL '90 days';

    -- Calculate average transaction amount and total volume
    SELECT
        COALESCE(AVG(amount), 0),
        COALESCE(SUM(amount), 0)
    INTO avg_amount, total_volume
    FROM transaction_risk_profiles
    WHERE merchant_id = merchant_uuid
    AND timestamp > NOW() - INTERVAL '90 days';

    -- Count fraud incidents
    SELECT COUNT(*)
    INTO fraud_count
    FROM fraud_alerts fa
    JOIN transaction_risk_profiles trp ON fa.transaction_id = trp.transaction_id
    WHERE trp.merchant_id = merchant_uuid
    AND fa.severity IN ('high', 'critical')
    AND fa.created_at > NOW() - INTERVAL '90 days';

    -- Calculate new risk score
    new_risk_score := GREATEST(0, LEAST(100,
        50 + -- Base score
        (CASE WHEN success_rate < 0.95 THEN 20 ELSE 0 END) +
        (fraud_count * 5) +
        (CASE WHEN avg_amount > 10000 THEN 10 ELSE 0 END)
    ));

    -- Update merchant risk profile
    INSERT INTO merchant_risk_profiles (
        merchant_id, risk_score, transaction_success_rate,
        average_transaction_amount, total_transaction_volume,
        fraud_incidents, last_updated
    )
    VALUES (
        merchant_uuid, new_risk_score, success_rate,
        avg_amount, total_volume, fraud_count, NOW()
    )
    ON CONFLICT (merchant_id) DO UPDATE SET
        risk_score = EXCLUDED.risk_score,
        transaction_success_rate = EXCLUDED.transaction_success_rate,
        average_transaction_amount = EXCLUDED.average_transaction_amount,
        total_transaction_volume = EXCLUDED.total_transaction_volume,
        fraud_incidents = EXCLUDED.fraud_incidents,
        last_updated = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update merchant risk profiles automatically
CREATE OR REPLACE FUNCTION trigger_update_merchant_risk()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.merchant_id IS NOT NULL THEN
        PERFORM update_merchant_risk_profile(NEW.merchant_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_merchant_risk_on_transaction
    AFTER INSERT OR UPDATE ON transaction_risk_profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_merchant_risk();

-- Views for Analytics and Reporting

-- Real-time Fraud Dashboard View
CREATE OR REPLACE VIEW fraud_dashboard_summary AS
SELECT
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as alerts_last_hour,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as alerts_last_24h,
    COUNT(*) FILTER (WHERE severity = 'critical' AND status = 'active') as critical_active,
    COUNT(*) FILTER (WHERE severity = 'high' AND status = 'active') as high_active,
    AVG(risk_score) as avg_risk_score,
    COUNT(DISTINCT user_id) as users_affected
FROM fraud_alerts
WHERE created_at > NOW() - INTERVAL '7 days';

-- High-Risk Transactions View
CREATE OR REPLACE VIEW high_risk_transactions AS
SELECT
    trp.*,
    u.email as user_email,
    fa.severity as alert_severity,
    fa.status as alert_status
FROM transaction_risk_profiles trp
LEFT JOIN auth.users u ON trp.user_id = u.id
LEFT JOIN fraud_alerts fa ON trp.transaction_id = fa.transaction_id
WHERE trp.risk_score >= 70
ORDER BY trp.timestamp DESC;

-- User Risk Summary View
CREATE OR REPLACE VIEW user_risk_summary AS
SELECT
    u.id as user_id,
    u.email,
    calculate_user_risk_score(u.id) as current_risk_score,
    COUNT(trp.transaction_id) as total_transactions,
    AVG(trp.risk_score) as avg_transaction_risk,
    COUNT(fa.id) as total_alerts,
    MAX(fa.created_at) as last_alert_date,
    COUNT(df.id) as registered_devices,
    AVG(df.trust_score) as avg_device_trust
FROM auth.users u
LEFT JOIN transaction_risk_profiles trp ON u.id = trp.user_id
LEFT JOIN fraud_alerts fa ON u.id = fa.user_id
LEFT JOIN device_fingerprints df ON u.id = df.user_id
GROUP BY u.id, u.email;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_predictions_history ENABLE ROW LEVEL SECURITY;

-- Device Fingerprints RLS
CREATE POLICY "Users can view their own device fingerprints"
ON device_fingerprints FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own device fingerprints"
ON device_fingerprints FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Fraud analysts can view all device fingerprints"
ON device_fingerprints FOR SELECT
USING (
    auth.jwt() ->> 'role' IN ('fraud_analyst', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('fraud_analyst', 'admin')
);

-- Transaction Risk Profiles RLS
CREATE POLICY "Users can view their own transaction risk profiles"
ON transaction_risk_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert transaction risk profiles"
ON transaction_risk_profiles FOR INSERT
WITH CHECK (true); -- Allow system to insert for all users

CREATE POLICY "Fraud analysts can view all transaction risk profiles"
ON transaction_risk_profiles FOR ALL
USING (
    auth.jwt() ->> 'role' IN ('fraud_analyst', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('fraud_analyst', 'admin')
);

-- Behavioral Patterns RLS
CREATE POLICY "Users can view their own behavioral patterns"
ON behavioral_patterns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage behavioral patterns"
ON behavioral_patterns FOR ALL
WITH CHECK (true);

CREATE POLICY "Fraud analysts can view all behavioral patterns"
ON behavioral_patterns FOR SELECT
USING (
    auth.jwt() ->> 'role' IN ('fraud_analyst', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('fraud_analyst', 'admin')
);

-- Fraud Alerts RLS
CREATE POLICY "Users can view their own fraud alerts"
ON fraud_alerts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Fraud analysts can manage all fraud alerts"
ON fraud_alerts FOR ALL
USING (
    auth.jwt() ->> 'role' IN ('fraud_analyst', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('fraud_analyst', 'admin')
);

-- Merchant Risk Profiles RLS
CREATE POLICY "Merchants can view their own risk profiles"
ON merchant_risk_profiles FOR SELECT
USING (
    merchant_id IN (
        SELECT id FROM merchants WHERE owner_id = auth.uid()
    )
);

CREATE POLICY "Fraud analysts can view all merchant risk profiles"
ON merchant_risk_profiles FOR ALL
USING (
    auth.jwt() ->> 'role' IN ('fraud_analyst', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('fraud_analyst', 'admin')
);

-- User Locations RLS
CREATE POLICY "Users can manage their own locations"
ON user_locations FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Fraud analysts can view all user locations"
ON user_locations FOR SELECT
USING (
    auth.jwt() ->> 'role' IN ('fraud_analyst', 'admin') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('fraud_analyst', 'admin')
);

-- ML Predictions History RLS
CREATE POLICY "System can manage ML predictions"
ON ml_predictions_history FOR ALL
WITH CHECK (true);

CREATE POLICY "Fraud analysts can view ML predictions"
ON ml_predictions_history FOR SELECT
USING (
    auth.jwt() ->> 'role' IN ('fraud_analyst', 'admin', 'data_scientist') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('fraud_analyst', 'admin', 'data_scientist')
);

-- Performance Optimization: Partial Indexes for Active Data
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_active_high_severity
ON fraud_alerts(created_at, user_id)
WHERE status = 'active' AND severity IN ('high', 'critical');

CREATE INDEX IF NOT EXISTS idx_transaction_risk_recent_high_risk
ON transaction_risk_profiles(timestamp, user_id)
WHERE risk_score >= 70 AND timestamp > NOW() - INTERVAL '30 days';

-- Automated Cleanup Jobs (to be run via cron or scheduled jobs)

-- Function to archive old fraud data
CREATE OR REPLACE FUNCTION archive_old_fraud_data()
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER := 0;
BEGIN
    -- Archive resolved fraud alerts older than 1 year
    WITH archived AS (
        DELETE FROM fraud_alerts
        WHERE status IN ('resolved', 'false_positive')
        AND resolved_at < NOW() - INTERVAL '1 year'
        RETURNING id
    )
    SELECT COUNT(*) INTO archived_count FROM archived;

    -- Archive old ML predictions (keep only last 6 months)
    DELETE FROM ml_predictions_history
    WHERE created_at < NOW() - INTERVAL '6 months';

    -- Archive old user locations (keep only last 3 months)
    DELETE FROM user_locations
    WHERE timestamp < NOW() - INTERVAL '3 months';

    RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE device_fingerprints IS 'Stores device fingerprints for fraud detection and device trust scoring';
COMMENT ON TABLE transaction_risk_profiles IS 'Comprehensive risk analysis results for each transaction';
COMMENT ON TABLE behavioral_patterns IS 'User behavioral patterns for anomaly detection';
COMMENT ON TABLE fraud_alerts IS 'Active fraud alerts requiring investigation';
COMMENT ON TABLE merchant_risk_profiles IS 'Risk assessment profiles for merchants';
COMMENT ON TABLE user_locations IS 'Location history for location-based fraud detection';
COMMENT ON TABLE ml_predictions_history IS 'Historical ML model predictions for analysis and model improvement';

COMMENT ON FUNCTION calculate_user_risk_score IS 'Calculates comprehensive risk score for a user based on multiple factors';
COMMENT ON FUNCTION update_merchant_risk_profile IS 'Updates merchant risk profile based on recent transaction history';
COMMENT ON FUNCTION archive_old_fraud_data IS 'Archives old fraud detection data to maintain performance';