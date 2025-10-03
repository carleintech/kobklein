-- Offline-First AI Assistant Database Schema
-- This schema supports privacy-preserving financial guidance, offline transaction processing, and local ML model management

-- User Financial Profiles Table (Enhanced for AI assistance)
CREATE TABLE IF NOT EXISTS user_financial_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    spending_patterns JSONB NOT NULL DEFAULT '{"categories": {}, "monthly_income": 0, "monthly_expenses": 0, "savings_rate": 0, "transaction_frequency": {}}',
    financial_goals JSONB[] DEFAULT '{}',
    risk_profile JSONB NOT NULL DEFAULT '{"risk_tolerance": "moderate", "investment_experience": "beginner", "financial_stability_score": 50}',
    preferences JSONB NOT NULL DEFAULT '{"language": "en", "currency": "HTG", "notification_frequency": "daily", "advice_style": "conversational"}',
    ai_personalization JSONB DEFAULT '{"interaction_style": "friendly", "complexity_level": "intermediate", "focus_areas": []}',
    privacy_settings JSONB DEFAULT '{"data_sharing": false, "offline_processing": true, "analytics_consent": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_ai_interaction TIMESTAMP WITH TIME ZONE,
    profile_completeness DECIMAL(3,2) GENERATED ALWAYS AS (
        CASE
            WHEN (spending_patterns->>'monthly_income')::DECIMAL > 0
                AND jsonb_array_length(financial_goals) > 0
                AND preferences->>'language' IS NOT NULL
            THEN 1.0
            ELSE 0.5
        END
    ) STORED
);

-- Create indexes for user financial profiles
CREATE INDEX IF NOT EXISTS idx_user_financial_profiles_completeness ON user_financial_profiles(profile_completeness);
CREATE INDEX IF NOT EXISTS idx_user_financial_profiles_last_interaction ON user_financial_profiles(last_ai_interaction);
CREATE INDEX IF NOT EXISTS idx_user_financial_profiles_updated_at ON user_financial_profiles(updated_at);

-- Financial Advice Table
CREATE TABLE IF NOT EXISTS financial_advice (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    advice_type VARCHAR(50) NOT NULL CHECK (advice_type IN ('spending', 'saving', 'budgeting', 'investment', 'debt', 'remittance', 'emergency')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    action_items TEXT[] DEFAULT '{}',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    personalization_factors TEXT[] DEFAULT '{}',
    estimated_impact JSONB DEFAULT '{"financial": 0, "timeline": "1 month"}',
    ai_model_used VARCHAR(100),
    generation_context JSONB DEFAULT '{}', -- Context used to generate advice
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT false,
    user_feedback JSONB, -- {rating: 1-5, helpful: boolean, implemented: boolean, comments: string}
    effectiveness_score DECIMAL(3,2), -- Calculated based on user feedback and outcomes

    -- Partitioning hint for large datasets
    PARTITION BY RANGE (created_at)
);

-- Create indexes for financial advice
CREATE INDEX IF NOT EXISTS idx_financial_advice_user_id ON financial_advice(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_advice_type ON financial_advice(advice_type);
CREATE INDEX IF NOT EXISTS idx_financial_advice_priority ON financial_advice(priority);
CREATE INDEX IF NOT EXISTS idx_financial_advice_created_at ON financial_advice(created_at);
CREATE INDEX IF NOT EXISTS idx_financial_advice_is_read ON financial_advice(is_read);

-- Offline Transactions Table
CREATE TABLE IF NOT EXISTS offline_transactions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('payment', 'transfer', 'top_up', 'cash_out', 'remittance')),
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'HTG',
    recipient_info JSONB,
    merchant_info JSONB,
    location_info JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'failed', 'cancelled', 'synced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sync_attempts INTEGER DEFAULT 0,
    last_sync_attempt TIMESTAMP WITH TIME ZONE,
    synced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    ai_validation JSONB NOT NULL DEFAULT '{"fraud_score": 0, "validation_passed": true, "offline_checks_performed": []}',
    offline_metadata JSONB DEFAULT '{}', -- Device info, network state, etc.

    -- Automatic cleanup for old failed transactions
    CONSTRAINT valid_sync_attempts CHECK (sync_attempts >= 0 AND sync_attempts <= 10)
);

-- Create indexes for offline transactions
CREATE INDEX IF NOT EXISTS idx_offline_transactions_user_id ON offline_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_transactions_status ON offline_transactions(status);
CREATE INDEX IF NOT EXISTS idx_offline_transactions_created_at ON offline_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_offline_transactions_sync_attempts ON offline_transactions(sync_attempts);

-- Conversation Contexts Table
CREATE TABLE IF NOT EXISTS conversation_contexts (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_history JSONB NOT NULL DEFAULT '[]',
    current_topic VARCHAR(100) DEFAULT 'general',
    intent_history TEXT[] DEFAULT '{}',
    user_preferences JSONB DEFAULT '{}',
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    interaction_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    session_summary TEXT, -- AI-generated summary of the conversation
    extracted_insights JSONB DEFAULT '{}', -- Insights extracted from conversation

    -- Auto-expire old conversations
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes for conversation contexts
CREATE INDEX IF NOT EXISTS idx_conversation_contexts_user_id ON conversation_contexts(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_contexts_active ON conversation_contexts(is_active);
CREATE INDEX IF NOT EXISTS idx_conversation_contexts_last_interaction ON conversation_contexts(last_interaction);

-- Local ML Models Table
CREATE TABLE IF NOT EXISTS local_ml_models (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL CHECK (model_type IN ('local_llm', 'decision_tree', 'ml_classifier', 'rule_based')),
    capabilities TEXT[] NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{"size_mb": 0, "accuracy": 0, "training_date": null, "feature_count": 0, "supported_languages": []}',
    model_hash VARCHAR(64), -- For integrity checking
    download_url TEXT,
    is_essential BOOLEAN DEFAULT false, -- Must be available offline
    load_priority INTEGER DEFAULT 5 CHECK (load_priority >= 1 AND load_priority <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(name, version)
);

-- Create indexes for local ML models
CREATE INDEX IF NOT EXISTS idx_local_ml_models_type ON local_ml_models(model_type);
CREATE INDEX IF NOT EXISTS idx_local_ml_models_essential ON local_ml_models(is_essential);
CREATE INDEX IF NOT EXISTS idx_local_ml_models_priority ON local_ml_models(load_priority);

-- Offline Capabilities Table
CREATE TABLE IF NOT EXISTS offline_capabilities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    model_type VARCHAR(50) NOT NULL,
    model_size_mb DECIMAL(8,2) NOT NULL,
    accuracy_score DECIMAL(3,2) NOT NULL CHECK (accuracy_score >= 0 AND accuracy_score <= 1),
    offline_priority INTEGER NOT NULL CHECK (offline_priority >= 1 AND offline_priority <= 10),
    requires_sync BOOLEAN DEFAULT false,
    supported_features TEXT[] DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_available BOOLEAN DEFAULT true
);

-- Create indexes for offline capabilities
CREATE INDEX IF NOT EXISTS idx_offline_capabilities_priority ON offline_capabilities(offline_priority);
CREATE INDEX IF NOT EXISTS idx_offline_capabilities_available ON offline_capabilities(is_available);

-- AI Interaction Logs Table (For improving AI responses)
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id VARCHAR(255) REFERENCES conversation_contexts(id),
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('query', 'advice_request', 'transaction_help', 'feedback')),
    user_input TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    intent_detected VARCHAR(100),
    confidence_score DECIMAL(3,2),
    response_time_ms INTEGER,
    model_used VARCHAR(100),
    context_factors JSONB DEFAULT '{}',
    user_satisfaction DECIMAL(3,2), -- Based on immediate feedback
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Partition by month for performance
    PARTITION BY RANGE (created_at)
);

-- Create indexes for AI interaction logs
CREATE INDEX IF NOT EXISTS idx_ai_interaction_logs_user_id ON ai_interaction_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interaction_logs_type ON ai_interaction_logs(interaction_type);
CREATE INDEX IF NOT EXISTS idx_ai_interaction_logs_created_at ON ai_interaction_logs(created_at);

-- User Device Information Table (For offline optimization)
CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) NOT NULL,
    device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop'
    os_info VARCHAR(100),
    browser_info VARCHAR(100),
    screen_resolution VARCHAR(20),
    storage_capacity JSONB DEFAULT '{"available_mb": 0, "total_mb": 0}',
    network_capabilities JSONB DEFAULT '{"supports_offline": true, "typical_bandwidth": "unknown"}',
    offline_preferences JSONB DEFAULT '{"auto_sync": true, "model_quality": "balanced", "storage_limit_mb": 100}',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,

    UNIQUE(user_id, device_fingerprint)
);

-- Create indexes for user devices
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_type ON user_devices(device_type);
CREATE INDEX IF NOT EXISTS idx_user_devices_active ON user_devices(is_active);

-- Spending Categories Reference Table (For consistent categorization)
CREATE TABLE IF NOT EXISTS spending_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id VARCHAR(50) REFERENCES spending_categories(id),
    color_hex VARCHAR(7), -- For UI display
    icon_name VARCHAR(50),
    typical_keywords TEXT[] DEFAULT '{}',
    ai_classification_rules JSONB DEFAULT '{}',
    is_essential BOOLEAN DEFAULT false, -- For budget prioritization
    sort_order INTEGER DEFAULT 0
);

-- Insert default spending categories
INSERT INTO spending_categories (id, name, description, color_hex, icon_name, typical_keywords, is_essential, sort_order) VALUES
('food', 'Food & Dining', 'Groceries, restaurants, food delivery', '#FF6B6B', 'utensils', '{"grocery", "restaurant", "food", "dining", "meal"}', true, 1),
('transport', 'Transportation', 'Public transport, fuel, vehicle maintenance', '#4ECDC4', 'car', '{"transport", "bus", "fuel", "gas", "taxi", "uber"}', true, 2),
('utilities', 'Utilities', 'Electricity, water, internet, phone bills', '#45B7D1', 'plug', '{"electricity", "water", "internet", "phone", "utility"}', true, 3),
('housing', 'Housing & Rent', 'Rent, mortgage, home maintenance', '#96CEB4', 'home', '{"rent", "mortgage", "housing", "maintenance"}', true, 4),
('healthcare', 'Healthcare', 'Medical expenses, pharmacy, insurance', '#FFEAA7', 'heart-pulse', '{"medical", "doctor", "pharmacy", "health", "medicine"}', true, 5),
('education', 'Education', 'School fees, books, courses', '#DDA0DD', 'graduation-cap', '{"school", "education", "book", "course", "tuition"}', true, 6),
('entertainment', 'Entertainment', 'Movies, games, hobbies, subscriptions', '#FFB6C1', 'tv', '{"movie", "game", "entertainment", "subscription", "hobby"}', false, 7),
('shopping', 'Shopping', 'Clothing, electronics, general shopping', '#87CEEB', 'shopping-bag', '{"clothes", "shopping", "electronics", "fashion"}', false, 8),
('remittance', 'Remittances', 'Money sent to family and friends', '#F0E68C', 'paper-plane', '{"remittance", "family", "send money", "transfer"}', false, 9),
('savings', 'Savings & Investment', 'Savings accounts, investments, retirement', '#90EE90', 'piggy-bank', '{"savings", "investment", "retirement", "deposit"}', true, 10),
('other', 'Other', 'Miscellaneous expenses', '#D3D3D3', 'question', '{}', false, 11);

-- Functions for AI Assistant Operations

-- Function to calculate financial health score
CREATE OR REPLACE FUNCTION calculate_financial_health_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    profile_data RECORD;
    health_score INTEGER := 0;
    savings_ratio DECIMAL;
    expense_ratio DECIMAL;
    goal_progress DECIMAL;
BEGIN
    -- Get user financial profile
    SELECT
        spending_patterns,
        financial_goals,
        risk_profile
    INTO profile_data
    FROM user_financial_profiles
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN 50; -- Default score for users without profiles
    END IF;

    -- Calculate savings ratio (30% weight)
    savings_ratio := COALESCE((profile_data.spending_patterns->>'savings_rate')::DECIMAL, 0);
    health_score := health_score + LEAST(30, savings_ratio * 100 * 0.3);

    -- Calculate expense to income ratio (25% weight)
    IF (profile_data.spending_patterns->>'monthly_income')::DECIMAL > 0 THEN
        expense_ratio := (profile_data.spending_patterns->>'monthly_expenses')::DECIMAL /
                        (profile_data.spending_patterns->>'monthly_income')::DECIMAL;
        health_score := health_score + GREATEST(0, (1 - expense_ratio) * 25);
    END IF;

    -- Financial stability score (20% weight)
    health_score := health_score + (profile_data.risk_profile->>'financial_stability_score')::INTEGER * 0.2;

    -- Goal progress (15% weight)
    IF jsonb_array_length(profile_data.financial_goals) > 0 THEN
        SELECT AVG((goal->>'progress')::DECIMAL)
        INTO goal_progress
        FROM jsonb_array_elements(profile_data.financial_goals) AS goal;

        health_score := health_score + COALESCE(goal_progress * 15, 0);
    END IF;

    -- Profile completeness (10% weight)
    health_score := health_score + 10; -- Bonus for having a profile

    RETURN GREATEST(0, LEAST(100, health_score));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate personalized spending insights
CREATE OR REPLACE FUNCTION generate_spending_insights(p_user_id UUID, p_months INTEGER DEFAULT 3)
RETURNS JSONB AS $$
DECLARE
    spending_data JSONB;
    insights JSONB := '{}';
    total_spending DECIMAL := 0;
    top_category VARCHAR(100);
    top_amount DECIMAL;
    unusual_patterns JSONB := '[]';
BEGIN
    -- Get spending patterns from recent transactions
    SELECT jsonb_object_agg(
        COALESCE(category, 'other'),
        sum(amount)
    )
    INTO spending_data
    FROM transactions
    WHERE user_id = p_user_id
    AND created_at > NOW() - (p_months || ' months')::INTERVAL
    AND type IN ('payment', 'transfer')
    GROUP BY category;

    IF spending_data IS NULL THEN
        RETURN '{"error": "No spending data available"}';
    END IF;

    -- Calculate total spending
    SELECT sum((value::TEXT)::DECIMAL)
    INTO total_spending
    FROM jsonb_each(spending_data);

    -- Find top spending category
    SELECT key, (value::TEXT)::DECIMAL
    INTO top_category, top_amount
    FROM jsonb_each(spending_data)
    ORDER BY (value::TEXT)::DECIMAL DESC
    LIMIT 1;

    -- Build insights
    insights := jsonb_build_object(
        'total_spending', total_spending,
        'top_category', top_category,
        'top_category_amount', top_amount,
        'top_category_percentage', ROUND((top_amount / total_spending * 100)::NUMERIC, 1),
        'spending_distribution', spending_data,
        'analysis_period_months', p_months,
        'generated_at', NOW()
    );

    RETURN insights;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to detect spending anomalies
CREATE OR REPLACE FUNCTION detect_spending_anomalies(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    avg_daily_spending DECIMAL;
    recent_daily_spending DECIMAL;
    anomaly_threshold DECIMAL := 2.0; -- 2x normal spending
    anomalies JSONB := '[]';
    anomaly_found BOOLEAN := false;
BEGIN
    -- Calculate average daily spending (last 30 days)
    SELECT COALESCE(AVG(daily_total), 0)
    INTO avg_daily_spending
    FROM (
        SELECT DATE(created_at) as spend_date, SUM(amount) as daily_total
        FROM transactions
        WHERE user_id = p_user_id
        AND created_at > NOW() - INTERVAL '30 days'
        AND type IN ('payment', 'transfer')
        GROUP BY DATE(created_at)
    ) daily_totals;

    -- Check recent spending (last 3 days)
    SELECT COALESCE(AVG(daily_total), 0)
    INTO recent_daily_spending
    FROM (
        SELECT DATE(created_at) as spend_date, SUM(amount) as daily_total
        FROM transactions
        WHERE user_id = p_user_id
        AND created_at > NOW() - INTERVAL '3 days'
        AND type IN ('payment', 'transfer')
        GROUP BY DATE(created_at)
    ) recent_totals;

    -- Detect anomaly
    IF avg_daily_spending > 0 AND recent_daily_spending > avg_daily_spending * anomaly_threshold THEN
        anomalies := jsonb_build_array(
            jsonb_build_object(
                'type', 'high_spending',
                'description', 'Recent spending is significantly higher than usual',
                'severity', 'medium',
                'avg_daily_spending', avg_daily_spending,
                'recent_daily_spending', recent_daily_spending,
                'increase_factor', ROUND((recent_daily_spending / avg_daily_spending)::NUMERIC, 2)
            )
        );
        anomaly_found := true;
    END IF;

    RETURN jsonb_build_object(
        'anomalies_detected', anomaly_found,
        'anomalies', anomalies,
        'analysis_date', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update conversation context
CREATE OR REPLACE FUNCTION update_conversation_context(
    p_conversation_id VARCHAR(255),
    p_user_message TEXT,
    p_ai_response TEXT,
    p_intent VARCHAR(100) DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    new_entry JSONB;
BEGIN
    -- Create conversation entry
    new_entry := jsonb_build_array(
        jsonb_build_object(
            'role', 'user',
            'content', p_user_message,
            'timestamp', NOW()
        ),
        jsonb_build_object(
            'role', 'assistant',
            'content', p_ai_response,
            'timestamp', NOW(),
            'intent', COALESCE(p_intent, 'unknown')
        )
    );

    -- Update conversation context
    UPDATE conversation_contexts
    SET
        conversation_history = conversation_history || new_entry,
        last_interaction = NOW(),
        interaction_count = interaction_count + 1,
        current_topic = COALESCE(p_intent, current_topic)
    WHERE id = p_conversation_id;

    -- Create new context if doesn't exist
    IF NOT FOUND THEN
        INSERT INTO conversation_contexts (
            id, user_id, conversation_history, current_topic, last_interaction, interaction_count
        )
        SELECT
            p_conversation_id,
            auth.uid(),
            new_entry,
            COALESCE(p_intent, 'general'),
            NOW(),
            1;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old offline transactions
CREATE OR REPLACE FUNCTION cleanup_old_offline_transactions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete old failed transactions (older than 7 days)
    WITH deleted AS (
        DELETE FROM offline_transactions
        WHERE status IN ('failed', 'cancelled')
        AND created_at < NOW() - INTERVAL '7 days'
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;

    -- Delete old synced transactions (older than 30 days)
    DELETE FROM offline_transactions
    WHERE status = 'synced'
    AND synced_at < NOW() - INTERVAL '30 days';

    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to update user profile timestamp
CREATE OR REPLACE FUNCTION update_user_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    NEW.last_ai_interaction := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-expire old conversations
CREATE OR REPLACE FUNCTION expire_old_conversations()
RETURNS TRIGGER AS $$
BEGIN
    -- Mark conversations as inactive after 24 hours of inactivity
    UPDATE conversation_contexts
    SET is_active = false
    WHERE last_interaction < NOW() - INTERVAL '24 hours'
    AND is_active = true;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_profile_timestamp
    BEFORE UPDATE ON user_financial_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_timestamp();

CREATE TRIGGER expire_conversations_trigger
    AFTER INSERT OR UPDATE ON conversation_contexts
    FOR EACH STATEMENT
    EXECUTE FUNCTION expire_old_conversations();

-- Views for AI Analytics and Insights

-- User Engagement Summary View
CREATE OR REPLACE VIEW user_ai_engagement_summary AS
SELECT
    ufp.user_id,
    ufp.profile_completeness,
    calculate_financial_health_score(ufp.user_id) as financial_health_score,
    COUNT(DISTINCT cc.id) as total_conversations,
    COUNT(fa.id) as total_advice_received,
    AVG((fa.user_feedback->>'rating')::INTEGER) as avg_advice_rating,
    COUNT(fa.id) FILTER (WHERE fa.user_feedback->>'implemented' = 'true') as advice_implemented_count,
    MAX(ufp.last_ai_interaction) as last_ai_interaction,
    MAX(cc.last_interaction) as last_conversation
FROM user_financial_profiles ufp
LEFT JOIN conversation_contexts cc ON ufp.user_id = cc.user_id
LEFT JOIN financial_advice fa ON ufp.user_id = fa.user_id
GROUP BY ufp.user_id, ufp.profile_completeness;

-- Advice Effectiveness View
CREATE OR REPLACE VIEW advice_effectiveness_summary AS
SELECT
    advice_type,
    COUNT(*) as total_advice_given,
    AVG(confidence_score) as avg_confidence,
    COUNT(*) FILTER (WHERE user_feedback IS NOT NULL) as feedback_count,
    AVG((user_feedback->>'rating')::INTEGER) as avg_rating,
    COUNT(*) FILTER (WHERE user_feedback->>'helpful' = 'true') as helpful_count,
    COUNT(*) FILTER (WHERE user_feedback->>'implemented' = 'true') as implemented_count,
    AVG(effectiveness_score) as avg_effectiveness
FROM financial_advice
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY advice_type;

-- Offline Usage Statistics View
CREATE OR REPLACE VIEW offline_usage_statistics AS
SELECT
    DATE(ot.created_at) as usage_date,
    COUNT(*) as total_offline_transactions,
    COUNT(*) FILTER (WHERE ot.status = 'synced') as successfully_synced,
    COUNT(*) FILTER (WHERE ot.status = 'failed') as failed_syncs,
    AVG(ot.sync_attempts) as avg_sync_attempts,
    SUM(ot.amount) as total_offline_volume,
    COUNT(DISTINCT ot.user_id) as unique_users
FROM offline_transactions ot
WHERE ot.created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(ot.created_at)
ORDER BY usage_date DESC;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- User Financial Profiles RLS
CREATE POLICY "Users can manage their own financial profiles"
ON user_financial_profiles FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "AI system can read profiles for assistance"
ON user_financial_profiles FOR SELECT
USING (
    auth.jwt() ->> 'role' IN ('ai_assistant', 'system') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('ai_assistant', 'system')
);

-- Financial Advice RLS
CREATE POLICY "Users can view their own financial advice"
ON financial_advice FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own advice feedback"
ON financial_advice FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "AI system can create advice"
ON financial_advice FOR INSERT
WITH CHECK (
    auth.jwt() ->> 'role' IN ('ai_assistant', 'system') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('ai_assistant', 'system')
);

-- Offline Transactions RLS
CREATE POLICY "Users can manage their own offline transactions"
ON offline_transactions FOR ALL
USING (auth.uid() = user_id);

-- Conversation Contexts RLS
CREATE POLICY "Users can manage their own conversations"
ON conversation_contexts FOR ALL
USING (auth.uid() = user_id);

-- Local ML Models RLS (Public read for available models)
CREATE POLICY "Public can view available ML models"
ON local_ml_models FOR SELECT
USING (true);

CREATE POLICY "Admins can manage ML models"
ON local_ml_models FOR ALL
USING (
    auth.jwt() ->> 'role' IN ('admin', 'ai_engineer') OR
    auth.jwt() ->> 'user_metadata' ->> 'role' IN ('admin', 'ai_engineer')
);

-- AI Interaction Logs RLS
CREATE POLICY "Users can view their own interaction logs"
ON ai_interaction_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create interaction logs"
ON ai_interaction_logs FOR INSERT
WITH CHECK (true);

-- User Devices RLS
CREATE POLICY "Users can manage their own devices"
ON user_devices FOR ALL
USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE user_financial_profiles IS 'Enhanced user financial profiles for AI-powered personalized assistance';
COMMENT ON TABLE financial_advice IS 'AI-generated financial advice with user feedback and effectiveness tracking';
COMMENT ON TABLE offline_transactions IS 'Transactions processed offline with AI validation and sync capabilities';
COMMENT ON TABLE conversation_contexts IS 'Conversation history and context for natural language AI interactions';
COMMENT ON TABLE local_ml_models IS 'Registry of ML models available for offline AI processing';
COMMENT ON TABLE offline_capabilities IS 'Catalog of AI capabilities available in offline mode';
COMMENT ON TABLE ai_interaction_logs IS 'Detailed logs of AI interactions for model improvement';
COMMENT ON TABLE user_devices IS 'Device information for offline optimization and model deployment';
COMMENT ON TABLE spending_categories IS 'Standardized spending categories for AI-powered expense classification';

COMMENT ON FUNCTION calculate_financial_health_score IS 'Calculates comprehensive financial health score based on multiple factors';
COMMENT ON FUNCTION generate_spending_insights IS 'Generates AI-powered insights from user spending patterns';
COMMENT ON FUNCTION detect_spending_anomalies IS 'Detects unusual spending patterns that may require user attention';
COMMENT ON FUNCTION cleanup_old_offline_transactions IS 'Maintains database performance by cleaning up old offline transaction records';
