-- ==============================================================================
-- KobKlein Core Database Schema Migration
-- ==============================================================================
-- Version: 1.0.0
-- Date: November 1, 2025
-- Author: GitHub Copilot (Senior Full-Stack Engineer)
-- Authority: /docs/AUTHORIZATION.md
-- Reference: /docs/ARCHITECTURE.md

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ==============================================================================
-- ENUMS & CUSTOM TYPES
-- ==============================================================================

-- User and role related enums
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'banned');
CREATE TYPE role_type AS ENUM ('user', 'merchant', 'agent', 'admin', 'super_admin');
CREATE TYPE kyc_status AS ENUM ('pending', 'in_progress', 'approved', 'rejected', 'expired');
CREATE TYPE kyc_tier AS ENUM ('tier_0', 'tier_1', 'tier_2', 'tier_3');

-- Wallet and transaction enums
CREATE TYPE currency_code AS ENUM ('HTG', 'USD', 'EUR');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment', 'refund', 'fee', 'remittance');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'expired');

-- Card and payment method enums
CREATE TYPE card_type AS ENUM ('virtual', 'physical');
CREATE TYPE card_status AS ENUM ('inactive', 'active', 'blocked', 'expired');

-- Merchant and business enums
CREATE TYPE merchant_status AS ENUM ('pending', 'active', 'suspended', 'closed');
CREATE TYPE business_type AS ENUM ('individual', 'small_business', 'corporation', 'ngo', 'government');

-- Notification enums
CREATE TYPE notification_type AS ENUM ('transaction', 'security', 'marketing', 'system');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push', 'in_app');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'delivered', 'read', 'failed');

-- ==============================================================================
-- CORE USER MANAGEMENT TABLES
-- ==============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Authentication fields
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Profile information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(150),
    avatar_url TEXT,
    date_of_birth DATE,
    
    -- Address information
    street_address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'HT', -- ISO 3166-1 alpha-2
    
    -- KYC and compliance
    kyc_status kyc_status DEFAULT 'pending',
    kyc_tier kyc_tier DEFAULT 'tier_0',
    kyc_data JSONB DEFAULT '{}'::jsonb,
    kyc_verified_at TIMESTAMPTZ,
    
    -- Account settings
    status user_status DEFAULT 'pending',
    preferred_currency currency_code DEFAULT 'HTG',
    preferred_language VARCHAR(5) DEFAULT 'ht',
    timezone VARCHAR(50) DEFAULT 'America/Port-au-Prince',
    
    -- Security and preferences
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    security_questions JSONB DEFAULT '{}'::jsonb,
    notification_preferences JSONB DEFAULT '{
        "email": {"transaction": true, "security": true, "marketing": false, "system": true},
        "sms": {"transaction": true, "security": true, "marketing": false, "system": false},
        "push": {"transaction": true, "security": true, "marketing": false, "system": true},
        "in_app": {"transaction": true, "security": true, "marketing": true, "system": true}
    }'::jsonb,
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table for RBAC
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role role_type NOT NULL DEFAULT 'user',
    granted_by UUID REFERENCES public.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- ==============================================================================
-- WALLET AND FINANCIAL TABLES
-- ==============================================================================

-- Wallets table - each user can have multiple currency wallets
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    currency currency_code NOT NULL,
    
    -- Balance information
    available_balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    pending_balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    reserved_balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    total_balance DECIMAL(15,2) GENERATED ALWAYS AS (available_balance + pending_balance + reserved_balance) STORED,
    
    -- Limits and controls
    daily_limit DECIMAL(15,2) DEFAULT 10000.00,
    monthly_limit DECIMAL(15,2) DEFAULT 100000.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_frozen BOOLEAN DEFAULT FALSE,
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, currency),
    CONSTRAINT positive_balances CHECK (
        available_balance >= 0 AND 
        pending_balance >= 0 AND 
        reserved_balance >= 0
    )
);

-- Transactions table - comprehensive transaction log
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core transaction data
    type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    amount DECIMAL(15,2) NOT NULL,
    currency currency_code NOT NULL,
    
    -- Wallet relationships
    from_wallet_id UUID REFERENCES public.wallets(id),
    to_wallet_id UUID REFERENCES public.wallets(id),
    
    -- Additional transaction details
    description TEXT,
    reference VARCHAR(100), -- External reference (Stripe, etc.)
    batch_id UUID, -- For bulk operations
    
    -- Fees and exchange
    fee_amount DECIMAL(15,2) DEFAULT 0.00,
    exchange_rate DECIMAL(10,6),
    original_amount DECIMAL(15,2),
    original_currency currency_code,
    
    -- Processing information
    processor VARCHAR(50), -- 'stripe', 'manual', 'system'
    processor_transaction_id VARCHAR(255),
    processed_at TIMESTAMPTZ,
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_fee CHECK (fee_amount >= 0),
    CONSTRAINT valid_wallets CHECK (
        (type IN ('deposit', 'withdrawal') AND from_wallet_id IS NULL) OR
        (type IN ('transfer', 'payment', 'remittance') AND from_wallet_id IS NOT NULL AND to_wallet_id IS NOT NULL) OR
        (type IN ('refund', 'fee') AND (from_wallet_id IS NOT NULL OR to_wallet_id IS NOT NULL))
    )
);

-- ==============================================================================
-- PAYMENT METHODS AND CARDS
-- ==============================================================================

-- Cards table - NFC and virtual cards
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    
    -- Card information
    card_type card_type NOT NULL,
    status card_status DEFAULT 'inactive',
    card_number VARCHAR(20) UNIQUE, -- Masked for security
    card_name VARCHAR(100),
    
    -- Physical card details (if applicable)
    nfc_uid VARCHAR(32) UNIQUE, -- NFC unique identifier
    production_batch VARCHAR(50),
    shipping_address JSONB,
    shipped_at TIMESTAMPTZ,
    
    -- Security and limits
    pin_hash VARCHAR(255), -- Bcrypt hash of PIN
    daily_limit DECIMAL(15,2) DEFAULT 5000.00,
    is_contactless_enabled BOOLEAN DEFAULT TRUE,
    
    -- Lifecycle
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    activated_at TIMESTAMPTZ,
    blocked_at TIMESTAMPTZ,
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- MERCHANT AND BUSINESS TABLES
-- ==============================================================================

-- Merchants table - business accounts
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Business information
    business_name VARCHAR(200) NOT NULL,
    business_type business_type NOT NULL,
    business_registration VARCHAR(100),
    tax_id VARCHAR(50),
    
    -- Contact and location
    business_email VARCHAR(255),
    business_phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Address
    street_address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'HT',
    
    -- Business details
    industry VARCHAR(100),
    description TEXT,
    logo_url TEXT,
    
    -- Account status and verification
    status merchant_status DEFAULT 'pending',
    verification_documents JSONB DEFAULT '[]'::jsonb,
    verified_at TIMESTAMPTZ,
    
    -- Settlement preferences
    settlement_currency currency_code DEFAULT 'HTG',
    settlement_frequency VARCHAR(20) DEFAULT 'daily', -- daily, weekly, monthly
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merchant settlements table
CREATE TABLE IF NOT EXISTS public.settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    
    -- Settlement details
    amount DECIMAL(15,2) NOT NULL,
    currency currency_code NOT NULL,
    fee_amount DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount - fee_amount) STORED,
    
    -- Processing
    status transaction_status DEFAULT 'pending',
    payout_reference VARCHAR(255),
    processed_at TIMESTAMPTZ,
    
    -- Period covered
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT positive_amounts CHECK (amount > 0 AND fee_amount >= 0),
    CONSTRAINT valid_period CHECK (period_end > period_start)
);

-- ==============================================================================
-- REMITTANCE SYSTEM TABLES
-- ==============================================================================

-- Remittances table - cross-border transfers
CREATE TABLE IF NOT EXISTS public.remittances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Participants
    sender_user_id UUID NOT NULL REFERENCES public.users(id),
    recipient_user_id UUID REFERENCES public.users(id), -- Nullable for unregistered recipients
    
    -- Transfer details
    send_amount DECIMAL(15,2) NOT NULL,
    send_currency currency_code NOT NULL,
    receive_amount DECIMAL(15,2) NOT NULL,
    receive_currency currency_code NOT NULL,
    exchange_rate DECIMAL(10,6) NOT NULL,
    
    -- Fees breakdown
    service_fee DECIMAL(15,2) DEFAULT 0.00,
    exchange_fee DECIMAL(15,2) DEFAULT 0.00,
    total_fees DECIMAL(15,2) GENERATED ALWAYS AS (service_fee + exchange_fee) STORED,
    
    -- Recipient information (for unregistered recipients)
    recipient_name VARCHAR(200),
    recipient_phone VARCHAR(20),
    recipient_email VARCHAR(255),
    pickup_location VARCHAR(500),
    
    -- Processing
    status transaction_status DEFAULT 'pending',
    confirmation_code VARCHAR(20) UNIQUE,
    pickup_code VARCHAR(10),
    
    -- Timeline
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    delivered_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    
    -- Related transaction
    transaction_id UUID REFERENCES public.transactions(id),
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT positive_amounts CHECK (
        send_amount > 0 AND 
        receive_amount > 0 AND 
        exchange_rate > 0 AND
        service_fee >= 0 AND 
        exchange_fee >= 0
    )
);

-- ==============================================================================
-- NOTIFICATION SYSTEM TABLES
-- ==============================================================================

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Notification content
    type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    status notification_status DEFAULT 'pending',
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10), -- 1=highest, 10=lowest
    
    -- Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    
    -- Delivery information
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_reason TEXT,
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- AUDIT AND COMPLIANCE TABLES
-- ==============================================================================

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Actor information
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    actor_type VARCHAR(50) DEFAULT 'user', -- user, system, api, admin
    
    -- Action details
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    
    -- Change information
    old_values JSONB,
    new_values JSONB,
    changes JSONB,
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    
    -- Additional context
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC documents table
CREATE TABLE IF NOT EXISTS public.kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Document information
    document_type VARCHAR(50) NOT NULL, -- passport, drivers_license, national_id, utility_bill
    document_number VARCHAR(100),
    document_country VARCHAR(2),
    
    -- File information
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    file_hash VARCHAR(64), -- SHA-256 hash for integrity
    
    -- Processing status
    status kyc_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    
    -- Expiration
    expires_at DATE,
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================

-- Users table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_kyc_status ON public.users(kyc_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_country ON public.users(country);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- User roles indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active) WHERE is_active = TRUE;

-- Wallets table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallets_currency ON public.wallets(currency);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallets_active ON public.wallets(is_active) WHERE is_active = TRUE;

-- Transactions table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_from_wallet ON public.transactions(from_wallet_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_to_wallet ON public.transactions(to_wallet_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_reference ON public.transactions(reference);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_processor_id ON public.transactions(processor_transaction_id);

-- Cards table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cards_wallet_id ON public.cards(wallet_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cards_status ON public.cards(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cards_nfc_uid ON public.cards(nfc_uid);

-- Merchants table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_merchants_owner_id ON public.merchants(owner_user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_merchants_status ON public.merchants(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_merchants_business_type ON public.merchants(business_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_merchants_country ON public.merchants(country);

-- Settlements table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_settlements_merchant_id ON public.settlements(merchant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_settlements_status ON public.settlements(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_settlements_period ON public.settlements(period_start, period_end);

-- Remittances table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remittances_sender ON public.remittances(sender_user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remittances_recipient ON public.remittances(recipient_user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remittances_status ON public.remittances(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remittances_confirmation_code ON public.remittances(confirmation_code);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_remittances_expires_at ON public.remittances(expires_at);

-- Notifications table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_channel ON public.notifications(channel);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_for);

-- Audit logs indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- KYC documents indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kyc_documents_type ON public.kyc_documents(document_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kyc_documents_status ON public.kyc_documents(status);

-- ==============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ==============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables that have the column
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_wallets_updated_at
    BEFORE UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_cards_updated_at
    BEFORE UPDATE ON public.cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_merchants_updated_at
    BEFORE UPDATE ON public.merchants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_settlements_updated_at
    BEFORE UPDATE ON public.settlements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_remittances_updated_at
    BEFORE UPDATE ON public.remittances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_kyc_documents_updated_at
    BEFORE UPDATE ON public.kyc_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();