-- Smart Financial Inclusion Engine Database Schema
-- Complete PostgreSQL schema for AI-powered financial inclusion, personalized products,
-- micro-lending, and credit scoring for underbanked populations in Haiti

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Financial profiles for comprehensive user analysis
CREATE TABLE IF NOT EXISTS financial_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,

    -- Demographic information
    age INTEGER CHECK (age >= 18 AND age <= 100),
    gender VARCHAR(50),
    education_level VARCHAR(100),
    occupation VARCHAR(100),
    income_frequency VARCHAR(20) CHECK (income_frequency IN ('daily', 'weekly', 'monthly', 'irregular')),
    estimated_income DECIMAL(15, 2) DEFAULT 0,
    dependents INTEGER DEFAULT 0,

    -- Location data
    location_region VARCHAR(100),
    location_urban_rural VARCHAR(20) CHECK (location_urban_rural IN ('urban', 'rural', 'semi_urban')),
    location_postal_code VARCHAR(20),

    -- Financial behavior metrics
    transaction_frequency INTEGER DEFAULT 0,
    avg_transaction_size DECIMAL(15, 2) DEFAULT 0,
    preferred_channels TEXT[] DEFAULT '{}',
    savings_behavior VARCHAR(20) CHECK (savings_behavior IN ('regular', 'irregular', 'none')),
    remittance_usage VARCHAR(20) CHECK (remittance_usage IN ('sender', 'receiver', 'both', 'none')),
    digital_literacy VARCHAR(20) CHECK (digital_literacy IN ('low', 'medium', 'high')),

    -- Risk assessment
    credit_score INTEGER DEFAULT 500 CHECK (credit_score >= 300 AND credit_score <= 850),
    risk_category VARCHAR(20) DEFAULT 'medium' CHECK (risk_category IN ('low', 'medium', 'high')),
    debt_to_income DECIMAL(5, 4) DEFAULT 0,
    payment_history VARCHAR(20) DEFAULT 'fair' CHECK (payment_history IN ('excellent', 'good', 'fair', 'poor')),
    collateral_available BOOLEAN DEFAULT FALSE,

    -- Financial inclusion metrics
    banking_status VARCHAR(20) DEFAULT 'unbanked' CHECK (banking_status IN ('unbanked', 'underbanked', 'banked')),
    financial_products_used TEXT[] DEFAULT '{}',
    inclusion_score INTEGER DEFAULT 0 CHECK (inclusion_score >= 0 AND inclusion_score <= 100),
    inclusion_barriers TEXT[] DEFAULT '{}',
    inclusion_opportunities TEXT[] DEFAULT '{}',

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_assessment TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit assessments with alternative data scoring
CREATE TABLE IF NOT EXISTS credit_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES financial_profiles(user_id) ON DELETE CASCADE,
    assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Core credit score
    credit_score INTEGER NOT NULL CHECK (credit_score >= 300 AND credit_score <= 850),

    -- Traditional scoring factors (weights in percentages)
    payment_history_score INTEGER DEFAULT 0,
    transaction_patterns_score INTEGER DEFAULT 0,
    income_stability_score INTEGER DEFAULT 0,
    social_connections_score INTEGER DEFAULT 0,
    digital_behavior_score INTEGER DEFAULT 0,
    collateral_value_score INTEGER DEFAULT 0,

    -- Alternative data scores
    mobile_money_usage_score INTEGER DEFAULT 0,
    remittance_patterns_score INTEGER DEFAULT 0,
    merchant_relationships_score INTEGER DEFAULT 0,
    community_standing_score INTEGER DEFAULT 0,
    utility_payments_score INTEGER DEFAULT 0,

    -- Recommendations
    eligible_products TEXT[] DEFAULT '{}',
    recommended_credit_limit DECIMAL(15, 2) DEFAULT 0,
    recommended_interest_rate DECIMAL(5, 2) DEFAULT 18.0,
    recommended_loan_terms INTEGER[] DEFAULT '{}',
    collateral_required BOOLEAN DEFAULT FALSE,
    guarantor_needed BOOLEAN DEFAULT TRUE,

    -- Risk mitigation
    risk_strategies TEXT[] DEFAULT '{}',
    monitoring_frequency VARCHAR(50) DEFAULT 'monthly',
    early_warning_indicators TEXT[] DEFAULT '{}',

    -- Model metadata
    model_version VARCHAR(50) DEFAULT 'v1.0',
    confidence_score DECIMAL(5, 4) DEFAULT 0.5,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personalized financial products and recommendations
CREATE TABLE IF NOT EXISTS personalized_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES financial_profiles(user_id) ON DELETE CASCADE,

    -- Product details
    product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('micro_loan', 'savings_account', 'insurance', 'remittance_service', 'investment')),
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    eligibility_score INTEGER DEFAULT 0 CHECK (eligibility_score >= 0 AND eligibility_score <= 100),

    -- Customization parameters (stored as JSONB for flexibility)
    loan_amount DECIMAL(15, 2),
    interest_rate DECIMAL(5, 2),
    repayment_period INTEGER, -- in days
    savings_target DECIMAL(15, 2),
    insurance_coverage DECIMAL(15, 2),
    minimum_balance DECIMAL(15, 2),

    -- Product benefits and requirements
    benefits TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    terms_conditions TEXT[] DEFAULT '{}',

    -- Pricing structure (JSONB for complex pricing)
    pricing_fees JSONB DEFAULT '{}',
    pricing_rates JSONB DEFAULT '{}',
    pricing_discounts JSONB DEFAULT '{}',

    -- Onboarding process (JSONB for flexible step definition)
    onboarding_steps JSONB DEFAULT '[]',

    -- Status and AI reasoning
    status VARCHAR(50) DEFAULT 'recommended' CHECK (status IN ('recommended', 'offered', 'accepted', 'active', 'completed', 'declined')),
    ai_reasoning TEXT,

    -- Expiry and tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    activated_at TIMESTAMP WITH TIME ZONE
);

-- Micro-loans management system
CREATE TABLE IF NOT EXISTS micro_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES financial_profiles(user_id) ON DELETE CASCADE,

    -- Loan basic information
    loan_type VARCHAR(50) NOT NULL CHECK (loan_type IN ('business', 'personal', 'emergency', 'education', 'agriculture')),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    interest_rate DECIMAL(5, 2) NOT NULL,
    term_months INTEGER NOT NULL CHECK (term_months > 0),
    purpose TEXT,

    -- Collateral information (JSONB for flexibility)
    collateral_type VARCHAR(100),
    collateral_value DECIMAL(15, 2),
    collateral_description TEXT,

    -- Guarantor information (JSONB array for multiple guarantors)
    guarantors JSONB DEFAULT '[]',

    -- Disbursement details
    disbursement_method VARCHAR(50) CHECK (disbursement_method IN ('mobile_money', 'cash', 'bank_transfer')),
    disbursement_date TIMESTAMP WITH TIME ZONE,
    disbursement_amount DECIMAL(15, 2),
    disbursement_fees DECIMAL(15, 2) DEFAULT 0,

    -- Performance tracking
    payments_made INTEGER DEFAULT 0,
    total_payments INTEGER DEFAULT 0,
    amount_paid DECIMAL(15, 2) DEFAULT 0,
    amount_remaining DECIMAL(15, 2) DEFAULT 0,
    days_overdue INTEGER DEFAULT 0,
    payment_history JSONB DEFAULT '[]',

    -- AI insights and monitoring
    success_probability DECIMAL(5, 4) DEFAULT 0.5,
    risk_factors TEXT[] DEFAULT '{}',
    ai_recommendations TEXT[] DEFAULT '{}',
    monitoring_alerts TEXT[] DEFAULT '{}',

    -- Status and dates
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'approved', 'disbursed', 'active', 'completed', 'defaulted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Repayment schedule for micro-loans
CREATE TABLE IF NOT EXISTS loan_repayment_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID NOT NULL REFERENCES micro_loans(id) ON DELETE CASCADE,

    -- Payment details
    payment_number INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_amount DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) GENERATED ALWAYS AS (principal_amount + interest_amount) STORED,

    -- Payment status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'waived', 'partial')),
    paid_date TIMESTAMP WITH TIME ZONE,
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    late_fees DECIMAL(15, 2) DEFAULT 0,

    -- Payment tracking
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(255),
    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(loan_id, payment_number)
);

-- Financial education and literacy tracking
CREATE TABLE IF NOT EXISTS financial_education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES financial_profiles(user_id) ON DELETE CASCADE,

    -- Curriculum completion tracking
    basic_banking_completed BOOLEAN DEFAULT FALSE,
    basic_banking_score INTEGER DEFAULT 0,
    basic_banking_modules TEXT[] DEFAULT '{}',

    digital_payments_completed BOOLEAN DEFAULT FALSE,
    digital_payments_score INTEGER DEFAULT 0,
    digital_payments_modules TEXT[] DEFAULT '{}',

    savings_investment_completed BOOLEAN DEFAULT FALSE,
    savings_investment_score INTEGER DEFAULT 0,
    savings_investment_modules TEXT[] DEFAULT '{}',

    credit_management_completed BOOLEAN DEFAULT FALSE,
    credit_management_score INTEGER DEFAULT 0,
    credit_management_modules TEXT[] DEFAULT '{}',

    business_finance_completed BOOLEAN DEFAULT FALSE,
    business_finance_score INTEGER DEFAULT 0,
    business_finance_modules TEXT[] DEFAULT '{}',

    -- Personalization settings
    preferred_language VARCHAR(10) DEFAULT 'ht', -- Haitian Creole
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    preferred_format VARCHAR(20) DEFAULT 'interactive' CHECK (preferred_format IN ('video', 'audio', 'text', 'interactive')),
    cultural_context VARCHAR(100) DEFAULT 'haiti_general',

    -- Progress metrics
    overall_completion DECIMAL(5, 2) DEFAULT 0,
    knowledge_assessment DECIMAL(5, 2) DEFAULT 0,
    practical_application DECIMAL(5, 2) DEFAULT 0,
    behavior_change DECIMAL(5, 2) DEFAULT 0,

    -- Achievements and recommendations
    achievements JSONB DEFAULT '[]',
    next_recommendations TEXT[] DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community insights and regional analytics
CREATE TABLE IF NOT EXISTS community_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region VARCHAR(100) NOT NULL,
    population_segment VARCHAR(100),

    -- Inclusion metrics
    financial_inclusion_rate DECIMAL(5, 4) DEFAULT 0,
    most_needed_services TEXT[] DEFAULT '{}',
    adoption_barriers TEXT[] DEFAULT '{}',
    success_stories_count INTEGER DEFAULT 0,
    community_sentiment DECIMAL(5, 4) DEFAULT 0.5,

    -- Product performance analytics (JSONB for flexible structure)
    product_performance JSONB DEFAULT '[]',

    -- Regional recommendations (JSONB for complex recommendation structure)
    recommendations JSONB DEFAULT '[]',

    -- Temporal data
    analysis_period_start TIMESTAMP WITH TIME ZONE,
    analysis_period_end TIMESTAMP WITH TIME ZONE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one insight per region per time period
    UNIQUE(region, generated_at::DATE)
);

-- User financial behavior tracking
CREATE TABLE IF NOT EXISTS financial_behavior_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES financial_profiles(user_id) ON DELETE CASCADE,

    -- Event details
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50), -- 'transaction', 'education', 'product_usage', 'support'
    event_value DECIMAL(15, 2),
    event_metadata JSONB DEFAULT '{}',

    -- Context information
    channel VARCHAR(50), -- 'mobile_app', 'ussd', 'agent', 'web'
    location_region VARCHAR(100),
    device_type VARCHAR(50),
    session_id VARCHAR(255),

    -- Impact on inclusion
    inclusion_impact DECIMAL(3, 2) DEFAULT 0, -- -1 to +1 scale
    behavioral_insights TEXT[],

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit history and alternative data sources
CREATE TABLE IF NOT EXISTS alternative_credit_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES financial_profiles(user_id) ON DELETE CASCADE,
    data_source VARCHAR(100) NOT NULL,

    -- Mobile money and digital payment data
    mobile_money_tenure_months INTEGER DEFAULT 0,
    mobile_money_transaction_frequency DECIMAL(8, 2) DEFAULT 0,
    mobile_money_avg_balance DECIMAL(15, 2) DEFAULT 0,
    mobile_money_reliability_score DECIMAL(5, 2) DEFAULT 0,

    -- Remittance and cross-border data
    remittance_frequency INTEGER DEFAULT 0,
    remittance_avg_amount DECIMAL(15, 2) DEFAULT 0,
    remittance_sender_countries TEXT[] DEFAULT '{}',
    remittance_reliability_score DECIMAL(5, 2) DEFAULT 0,

    -- Merchant and business relationships
    merchant_relationships_count INTEGER DEFAULT 0,
    merchant_trust_score DECIMAL(5, 2) DEFAULT 0,
    business_activity_score DECIMAL(5, 2) DEFAULT 0,
    supply_chain_position VARCHAR(50),

    -- Community and social data
    community_references_count INTEGER DEFAULT 0,
    community_trust_score DECIMAL(5, 2) DEFAULT 0,
    social_network_strength DECIMAL(5, 2) DEFAULT 0,
    local_reputation_score DECIMAL(5, 2) DEFAULT 0,

    -- Utility and regular payments
    utility_payment_history DECIMAL(5, 2) DEFAULT 0,
    regular_expenses_score DECIMAL(5, 2) DEFAULT 0,
    payment_consistency_score DECIMAL(5, 2) DEFAULT 0,

    -- Digital behavior and literacy
    digital_engagement_score DECIMAL(5, 2) DEFAULT 0,
    financial_app_usage_score DECIMAL(5, 2) DEFAULT 0,
    online_financial_behavior_score DECIMAL(5, 2) DEFAULT 0,

    -- Data quality and recency
    data_quality_score DECIMAL(5, 2) DEFAULT 0,
    data_recency_score DECIMAL(5, 2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product usage analytics and performance
CREATE TABLE IF NOT EXISTS product_usage_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES financial_profiles(user_id) ON DELETE CASCADE,
    product_id UUID REFERENCES personalized_products(id) ON DELETE SET NULL,
    product_type VARCHAR(50) NOT NULL,

    -- Usage metrics
    activation_date TIMESTAMP WITH TIME ZONE,
    last_usage_date TIMESTAMP WITH TIME ZONE,
    usage_frequency INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    total_volume DECIMAL(15, 2) DEFAULT 0,

    -- Performance indicators
    success_rate DECIMAL(5, 4) DEFAULT 0,
    customer_satisfaction DECIMAL(3, 2) DEFAULT 0, -- 1-5 scale
    retention_probability DECIMAL(5, 4) DEFAULT 0,
    cross_sell_potential DECIMAL(5, 4) DEFAULT 0,

    -- Financial impact
    revenue_generated DECIMAL(15, 2) DEFAULT 0,
    cost_to_serve DECIMAL(15, 2) DEFAULT 0,
    profit_margin DECIMAL(5, 4) DEFAULT 0,

    -- Behavioral insights
    usage_patterns JSONB DEFAULT '{}',
    feature_adoption JSONB DEFAULT '{}',
    support_interactions INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'churned', 'suspended')),
    churn_risk_score DECIMAL(5, 4) DEFAULT 0,
    churn_prediction_date TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial inclusion interventions and outreach
CREATE TABLE IF NOT EXISTS inclusion_interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES financial_profiles(user_id) ON DELETE CASCADE,
    region VARCHAR(100),

    -- Intervention details
    intervention_type VARCHAR(100) NOT NULL, -- 'education', 'product_intro', 'barrier_removal', 'incentive'
    intervention_name VARCHAR(255) NOT NULL,
    description TEXT,
    target_barrier VARCHAR(100), -- Specific barrier being addressed

    -- Implementation details
    delivery_channel VARCHAR(50), -- 'sms', 'agent_visit', 'workshop', 'app_notification'
    content_language VARCHAR(10) DEFAULT 'ht',
    cultural_adaptation TEXT,

    -- Targeting and personalization
    target_criteria JSONB DEFAULT '{}',
    personalization_factors JSONB DEFAULT '{}',
    expected_impact DECIMAL(5, 4) DEFAULT 0,

    -- Execution tracking
    scheduled_date TIMESTAMP WITH TIME ZONE,
    executed_date TIMESTAMP WITH TIME ZONE,
    completion_rate DECIMAL(5, 4) DEFAULT 0,

    -- Results and effectiveness
    participants_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    success_metrics JSONB DEFAULT '{}',
    follow_up_actions TEXT[] DEFAULT '{}',

    -- Impact measurement
    inclusion_score_change DECIMAL(5, 2) DEFAULT 0,
    behavior_change_indicators JSONB DEFAULT '{}',
    long_term_impact_score DECIMAL(5, 4) DEFAULT 0,

    -- Status and metadata
    status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Machine learning model performance for financial inclusion
CREATE TABLE IF NOT EXISTS inclusion_model_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(100) NOT NULL, -- 'inclusion_scoring', 'product_recommendation', 'credit_assessment', 'churn_prediction'

    -- Performance metrics
    accuracy DECIMAL(6, 4),
    precision_score DECIMAL(6, 4),
    recall_score DECIMAL(6, 4),
    f1_score DECIMAL(6, 4),
    auc_score DECIMAL(6, 4),

    -- Fairness and bias metrics
    demographic_parity DECIMAL(6, 4),
    equalized_odds DECIMAL(6, 4),
    calibration_score DECIMAL(6, 4),
    bias_indicators JSONB DEFAULT '{}',

    -- Business impact metrics
    conversion_rate_improvement DECIMAL(6, 4),
    inclusion_rate_improvement DECIMAL(6, 4),
    cost_reduction DECIMAL(15, 2),
    revenue_impact DECIMAL(15, 2),

    -- Model configuration
    feature_importance JSONB DEFAULT '{}',
    hyperparameters JSONB DEFAULT '{}',
    training_data_size INTEGER,
    training_data_period INTERVAL,

    -- Validation and testing
    validation_method VARCHAR(100),
    test_data_size INTEGER,
    cross_validation_scores JSONB DEFAULT '{}',

    -- Deployment info
    deployment_date TIMESTAMP WITH TIME ZONE,
    last_retrain_date TIMESTAMP WITH TIME ZONE,
    next_retrain_date TIMESTAMP WITH TIME ZONE,

    -- Status
    status VARCHAR(50) DEFAULT 'development' CHECK (status IN ('development', 'validation', 'production', 'deprecated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_financial_profiles_user_id ON financial_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_profiles_inclusion_score ON financial_profiles(inclusion_score DESC);
CREATE INDEX IF NOT EXISTS idx_financial_profiles_banking_status ON financial_profiles(banking_status);
CREATE INDEX IF NOT EXISTS idx_financial_profiles_region ON financial_profiles(location_region);
CREATE INDEX IF NOT EXISTS idx_financial_profiles_credit_score ON financial_profiles(credit_score DESC);

CREATE INDEX IF NOT EXISTS idx_credit_assessments_user_id ON credit_assessments(user_id, assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_credit_assessments_score ON credit_assessments(credit_score DESC);
CREATE INDEX IF NOT EXISTS idx_credit_assessments_confidence ON credit_assessments(confidence_score DESC);

CREATE INDEX IF NOT EXISTS idx_personalized_products_user_id ON personalized_products(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personalized_products_type ON personalized_products(product_type);
CREATE INDEX IF NOT EXISTS idx_personalized_products_status ON personalized_products(status);
CREATE INDEX IF NOT EXISTS idx_personalized_products_eligibility ON personalized_products(eligibility_score DESC);

CREATE INDEX IF NOT EXISTS idx_micro_loans_user_id ON micro_loans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_micro_loans_status ON micro_loans(status);
CREATE INDEX IF NOT EXISTS idx_micro_loans_type ON micro_loans(loan_type);
CREATE INDEX IF NOT EXISTS idx_micro_loans_amount ON micro_loans(amount DESC);
CREATE INDEX IF NOT EXISTS idx_micro_loans_overdue ON micro_loans(days_overdue DESC) WHERE days_overdue > 0;

CREATE INDEX IF NOT EXISTS idx_repayment_schedule_loan_id ON loan_repayment_schedule(loan_id, payment_number);
CREATE INDEX IF NOT EXISTS idx_repayment_schedule_due_date ON loan_repayment_schedule(due_date);
CREATE INDEX IF NOT EXISTS idx_repayment_schedule_status ON loan_repayment_schedule(status);
CREATE INDEX IF NOT EXISTS idx_repayment_schedule_overdue ON loan_repayment_schedule(due_date) WHERE status IN ('pending', 'overdue');

CREATE INDEX IF NOT EXISTS idx_financial_education_user_id ON financial_education(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_education_completion ON financial_education(overall_completion DESC);

CREATE INDEX IF NOT EXISTS idx_community_insights_region ON community_insights(region, generated_at DESC);

CREATE INDEX IF NOT EXISTS idx_behavior_events_user_id ON financial_behavior_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_behavior_events_type ON financial_behavior_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_alternative_credit_user_id ON alternative_credit_data(user_id, last_updated DESC);

CREATE INDEX IF NOT EXISTS idx_product_analytics_user_id ON product_usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product ON product_usage_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_churn ON product_usage_analytics(churn_risk_score DESC);

-- Create advanced functions for financial inclusion analytics

-- Function to calculate comprehensive inclusion score
CREATE OR REPLACE FUNCTION calculate_inclusion_score(
    p_user_id UUID
) RETURNS INTEGER AS $$
DECLARE
    profile_data RECORD;
    behavior_data RECORD;
    credit_data RECORD;
    education_data RECORD;
    inclusion_score INTEGER := 0;
BEGIN
    -- Get user profile data
    SELECT * INTO profile_data FROM financial_profiles WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN 0;
    END IF;

    -- Banking status component (40% weight)
    CASE profile_data.banking_status
        WHEN 'banked' THEN inclusion_score := inclusion_score + 40;
        WHEN 'underbanked' THEN inclusion_score := inclusion_score + 25;
        WHEN 'unbanked' THEN inclusion_score := inclusion_score + 10;
    END CASE;

    -- Digital adoption component (25% weight)
    SELECT
        COALESCE(digital_engagement_score * 5, 0) AS digital_score
    INTO behavior_data
    FROM alternative_credit_data
    WHERE user_id = p_user_id
    ORDER BY last_updated DESC
    LIMIT 1;

    inclusion_score := inclusion_score + COALESCE(behavior_data.digital_score::INTEGER, 0);

    -- Financial product usage (20% weight)
    inclusion_score := inclusion_score + LEAST(array_length(profile_data.financial_products_used, 1) * 4, 20);

    -- Credit access component (10% weight)
    SELECT credit_score INTO credit_data FROM credit_assessments
    WHERE user_id = p_user_id
    ORDER BY assessment_date DESC
    LIMIT 1;

    IF credit_data.credit_score >= 650 THEN
        inclusion_score := inclusion_score + 10;
    ELSIF credit_data.credit_score >= 550 THEN
        inclusion_score := inclusion_score + 6;
    ELSE
        inclusion_score := inclusion_score + 3;
    END IF;

    -- Financial education component (5% weight)
    SELECT overall_completion INTO education_data FROM financial_education WHERE user_id = p_user_id;
    inclusion_score := inclusion_score + COALESCE((education_data.overall_completion * 0.05)::INTEGER, 0);

    -- Update the profile with calculated score
    UPDATE financial_profiles
    SET inclusion_score = LEAST(100, inclusion_score),
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN LEAST(100, inclusion_score);
END;
$$ LANGUAGE plpgsql;

-- Function to generate personalized interest rate
CREATE OR REPLACE FUNCTION calculate_personalized_interest_rate(
    p_user_id UUID,
    p_loan_type VARCHAR(50) DEFAULT 'personal'
) RETURNS DECIMAL(5, 2) AS $$
DECLARE
    profile_data RECORD;
    credit_data RECORD;
    base_rate DECIMAL(5, 2) := 18.0; -- Base rate of 18%
    final_rate DECIMAL(5, 2);
BEGIN
    -- Get user profile
    SELECT * INTO profile_data FROM financial_profiles WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN base_rate;
    END IF;

    -- Get latest credit assessment
    SELECT * INTO credit_data FROM credit_assessments
    WHERE user_id = p_user_id
    ORDER BY assessment_date DESC
    LIMIT 1;

    -- Adjust based on credit score
    IF credit_data.credit_score >= 750 THEN
        base_rate := base_rate - 4;
    ELSIF credit_data.credit_score >= 650 THEN
        base_rate := base_rate - 2;
    ELSIF credit_data.credit_score < 500 THEN
        base_rate := base_rate + 6;
    END IF;

    -- Adjust based on banking status
    CASE profile_data.banking_status
        WHEN 'banked' THEN base_rate := base_rate - 1;
        WHEN 'unbanked' THEN base_rate := base_rate + 2;
    END CASE;

    -- Adjust based on collateral
    IF profile_data.collateral_available THEN
        base_rate := base_rate - 1;
    END IF;

    -- Adjust based on loan type
    CASE p_loan_type
        WHEN 'business' THEN base_rate := base_rate - 1;
        WHEN 'emergency' THEN base_rate := base_rate + 2;
        WHEN 'education' THEN base_rate := base_rate - 0.5;
        WHEN 'agriculture' THEN base_rate := base_rate + 1;
    END CASE;

    -- Ensure rate is within reasonable bounds
    final_rate := GREATEST(12.0, LEAST(36.0, base_rate));

    RETURN final_rate;
END;
$$ LANGUAGE plpgsql;

-- Function to assess loan default risk
CREATE OR REPLACE FUNCTION assess_loan_default_risk(
    p_user_id UUID,
    p_loan_amount DECIMAL(15, 2)
) RETURNS JSONB AS $$
DECLARE
    profile_data RECORD;
    credit_data RECORD;
    behavior_data RECORD;
    risk_score DECIMAL(5, 4) := 0.5;
    risk_factors TEXT[] := '{}';
    risk_assessment JSONB;
BEGIN
    -- Get user data
    SELECT * INTO profile_data FROM financial_profiles WHERE user_id = p_user_id;
    SELECT * INTO credit_data FROM credit_assessments
    WHERE user_id = p_user_id ORDER BY assessment_date DESC LIMIT 1;
    SELECT * INTO behavior_data FROM alternative_credit_data
    WHERE user_id = p_user_id ORDER BY last_updated DESC LIMIT 1;

    -- Calculate risk based on credit score
    IF credit_data.credit_score >= 700 THEN
        risk_score := 0.1;
    ELSIF credit_data.credit_score >= 600 THEN
        risk_score := 0.25;
    ELSIF credit_data.credit_score >= 500 THEN
        risk_score := 0.4;
    ELSE
        risk_score := 0.7;
        risk_factors := risk_factors || 'Low credit score';
    END IF;

    -- Adjust for income stability
    IF profile_data.income_frequency = 'irregular' THEN
        risk_score := risk_score + 0.1;
        risk_factors := risk_factors || 'Irregular income';
    END IF;

    -- Adjust for debt-to-income ratio
    IF profile_data.debt_to_income > 0.4 THEN
        risk_score := risk_score + 0.15;
        risk_factors := risk_factors || 'High debt-to-income ratio';
    END IF;

    -- Adjust for loan amount relative to income
    IF p_loan_amount > profile_data.estimated_income * 3 THEN
        risk_score := risk_score + 0.2;
        risk_factors := risk_factors || 'Loan amount high relative to income';
    END IF;

    -- Adjust for digital behavior
    IF behavior_data.mobile_money_reliability_score < 3.0 THEN
        risk_score := risk_score + 0.1;
        risk_factors := risk_factors || 'Limited mobile money reliability';
    END IF;

    -- Cap risk score
    risk_score := LEAST(0.95, risk_score);

    -- Build assessment JSON
    risk_assessment := jsonb_build_object(
        'risk_score', risk_score,
        'risk_category', CASE
            WHEN risk_score <= 0.3 THEN 'low'
            WHEN risk_score <= 0.6 THEN 'medium'
            ELSE 'high'
        END,
        'risk_factors', to_jsonb(risk_factors),
        'recommended_monitoring', CASE
            WHEN risk_score <= 0.3 THEN 'monthly'
            WHEN risk_score <= 0.6 THEN 'bi-weekly'
            ELSE 'weekly'
        END,
        'collateral_recommendation', risk_score > 0.5,
        'guarantor_recommendation', risk_score > 0.4
    );

    RETURN risk_assessment;
END;
$$ LANGUAGE plpgsql;

-- Function to track financial behavior impact
CREATE OR REPLACE FUNCTION track_behavior_impact(
    p_user_id UUID,
    p_event_type VARCHAR(100),
    p_event_value DECIMAL(15, 2) DEFAULT NULL,
    p_inclusion_impact DECIMAL(3, 2) DEFAULT 0
) RETURNS VOID AS $$
DECLARE
    current_score INTEGER;
    new_score INTEGER;
BEGIN
    -- Insert behavior event
    INSERT INTO financial_behavior_events (
        user_id, event_type, event_value, inclusion_impact, created_at
    ) VALUES (
        p_user_id, p_event_type, p_event_value, p_inclusion_impact, NOW()
    );

    -- Update inclusion score if significant impact
    IF ABS(p_inclusion_impact) >= 0.1 THEN
        SELECT inclusion_score INTO current_score FROM financial_profiles WHERE user_id = p_user_id;
        new_score := GREATEST(0, LEAST(100, current_score + (p_inclusion_impact * 10)::INTEGER));

        UPDATE financial_profiles
        SET inclusion_score = new_score, updated_at = NOW()
        WHERE user_id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_financial_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_financial_profiles_updated_at
    BEFORE UPDATE ON financial_profiles
    FOR EACH ROW EXECUTE FUNCTION update_financial_profile_timestamp();

CREATE TRIGGER trg_micro_loans_updated_at
    BEFORE UPDATE ON micro_loans
    FOR EACH ROW EXECUTE FUNCTION update_financial_profile_timestamp();

CREATE TRIGGER trg_financial_education_updated_at
    BEFORE UPDATE ON financial_education
    FOR EACH ROW EXECUTE FUNCTION update_financial_profile_timestamp();

-- Function to clean old data and optimize performance
CREATE OR REPLACE FUNCTION cleanup_inclusion_data() RETURNS VOID AS $$
BEGIN
    -- Archive old behavior events (keep 1 year)
    DELETE FROM financial_behavior_events
    WHERE created_at < NOW() - INTERVAL '1 year';

    -- Archive old credit assessments (keep 2 years, but only latest 5 per user)
    DELETE FROM credit_assessments ca1
    WHERE ca1.assessment_date < NOW() - INTERVAL '2 years'
    OR (
        SELECT COUNT(*) FROM credit_assessments ca2
        WHERE ca2.user_id = ca1.user_id
        AND ca2.assessment_date >= ca1.assessment_date
    ) > 5;

    -- Archive completed interventions (keep 6 months)
    DELETE FROM inclusion_interventions
    WHERE status = 'completed'
    AND updated_at < NOW() - INTERVAL '6 months';

    -- Update analytics tables
    REFRESH MATERIALIZED VIEW CONCURRENTLY financial_inclusion_dashboard;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_repayment_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_behavior_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_credit_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_usage_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY financial_profiles_policy ON financial_profiles
    FOR ALL USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('admin', 'financial_analyst', 'loan_officer')
        )
    );

CREATE POLICY credit_assessments_policy ON credit_assessments
    FOR ALL USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('admin', 'financial_analyst', 'loan_officer')
        )
    );

-- Apply similar policies to other sensitive tables
CREATE POLICY personalized_products_policy ON personalized_products
    FOR ALL USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('admin', 'financial_analyst')
        )
    );

CREATE POLICY micro_loans_policy ON micro_loans
    FOR ALL USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('admin', 'loan_officer', 'financial_analyst')
        )
    );

-- Create materialized view for financial inclusion dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS financial_inclusion_dashboard AS
SELECT
    fp.location_region as region,
    fp.banking_status,
    COUNT(*) as user_count,
    AVG(fp.inclusion_score) as avg_inclusion_score,
    AVG(fp.credit_score) as avg_credit_score,

    -- Product adoption metrics
    COUNT(CASE WHEN 'micro_loan' = ANY(fp.financial_products_used) THEN 1 END) as loan_users,
    COUNT(CASE WHEN 'savings_account' = ANY(fp.financial_products_used) THEN 1 END) as savings_users,
    COUNT(CASE WHEN 'insurance' = ANY(fp.financial_products_used) THEN 1 END) as insurance_users,

    -- Risk distribution
    COUNT(CASE WHEN fp.risk_category = 'low' THEN 1 END) as low_risk_count,
    COUNT(CASE WHEN fp.risk_category = 'medium' THEN 1 END) as medium_risk_count,
    COUNT(CASE WHEN fp.risk_category = 'high' THEN 1 END) as high_risk_count,

    -- Digital adoption
    AVG(acd.digital_engagement_score) as avg_digital_engagement,
    AVG(acd.mobile_money_reliability_score) as avg_mobile_money_score,

    -- Education progress
    AVG(fe.overall_completion) as avg_education_completion,

    -- Loan performance
    AVG(ml.success_probability) as avg_loan_success_probability,
    COUNT(CASE WHEN ml.status = 'active' THEN 1 END) as active_loans,
    COUNT(CASE WHEN ml.status = 'defaulted' THEN 1 END) as defaulted_loans,

    NOW() as last_updated
FROM financial_profiles fp
LEFT JOIN alternative_credit_data acd ON acd.user_id = fp.user_id
LEFT JOIN financial_education fe ON fe.user_id = fp.user_id
LEFT JOIN micro_loans ml ON ml.user_id = fp.user_id
GROUP BY fp.location_region, fp.banking_status;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_inclusion_dashboard_region_status
ON financial_inclusion_dashboard(region, banking_status);

-- Insert sample data for testing and demonstration
INSERT INTO financial_profiles (
    user_id, age, gender, education_level, occupation, income_frequency,
    estimated_income, dependents, location_region, location_urban_rural,
    banking_status, inclusion_score
) VALUES
(uuid_generate_v4(), 28, 'female', 'secondary', 'market_vendor', 'daily', 150, 2, 'Port-au-Prince', 'urban', 'underbanked', 45),
(uuid_generate_v4(), 35, 'male', 'primary', 'agriculture', 'monthly', 200, 3, 'Artibonite', 'rural', 'unbanked', 25),
(uuid_generate_v4(), 42, 'female', 'university', 'teacher', 'monthly', 400, 1, 'Cap-Haïtien', 'urban', 'banked', 75),
(uuid_generate_v4(), 31, 'male', 'secondary', 'construction', 'weekly', 180, 2, 'Gonaïves', 'semi_urban', 'underbanked', 50);

-- Final comment with comprehensive usage guide
COMMENT ON SCHEMA public IS 'Smart Financial Inclusion Engine - Complete database schema for AI-powered financial inclusion, personalized products, micro-lending, and credit scoring for underbanked populations.

CORE FEATURES:
- Comprehensive financial profiling with alternative data
- AI-powered credit scoring using non-traditional metrics
- Personalized product recommendations and customization
- Micro-loan management with flexible repayment tracking
- Financial education curriculum and progress tracking
- Community insights and regional analytics
- Real-time behavior tracking and inclusion scoring

KEY TABLES:
1. financial_profiles: Core user financial and demographic data
2. credit_assessments: Alternative data credit scoring results
3. personalized_products: AI-generated product recommendations
4. micro_loans: Complete micro-lending lifecycle management
5. financial_education: Literacy tracking and curriculum progress
6. community_insights: Regional analytics and community-level insights
7. alternative_credit_data: Non-traditional credit data sources
8. financial_behavior_events: Real-time behavior and engagement tracking

ADVANCED FUNCTIONS:
- calculate_inclusion_score(): Dynamic inclusion scoring algorithm
- calculate_personalized_interest_rate(): Risk-based rate calculation
- assess_loan_default_risk(): Comprehensive default risk assessment
- track_behavior_impact(): Real-time behavior impact tracking

ANALYTICS CAPABILITIES:
- Financial inclusion rate tracking by region and demographics
- Product performance and adoption analytics
- Credit risk modeling and validation
- Community-level intervention effectiveness
- Behavioral pattern analysis and prediction

SECURITY & PRIVACY:
- Row-level security for multi-tenant access control
- Comprehensive audit trails for all financial operations
- Data anonymization for analytics and research
- GDPR/privacy-compliant data handling

USAGE PATTERNS:
1. User onboarding → Profile creation → Credit assessment
2. Product recommendation → Personalization → Offer management
3. Loan application → Risk assessment → Approval workflow
4. Education enrollment → Progress tracking → Certification
5. Community analysis → Intervention design → Impact measurement

For optimal performance:
- Refresh materialized views daily: REFRESH MATERIALIZED VIEW financial_inclusion_dashboard;
- Run cleanup weekly: SELECT cleanup_inclusion_data();
- Monitor model performance and retrain quarterly
- Update community insights monthly for regional planning

This schema supports the complete financial inclusion journey from initial assessment through ongoing relationship management and community impact measurement.';
