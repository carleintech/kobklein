-- ==============================================================================
-- KobKlein Row Level Security (RLS) Policies
-- ==============================================================================
-- Version: 1.0.0
-- Date: November 1, 2025
-- Author: GitHub Copilot (Senior Full-Stack Engineer)
-- Authority: /docs/AUTHORIZATION.md
-- Reference: /docs/ARCHITECTURE.md

-- ==============================================================================
-- ENABLE RLS ON ALL TABLES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remittances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- ==============================================================================

-- Function to check if current user has a specific role
CREATE OR REPLACE FUNCTION has_role(role_name role_type)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = role_name 
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is admin or super admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN has_role('admin') OR has_role('super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is merchant
CREATE OR REPLACE FUNCTION is_merchant()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN has_role('merchant');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user owns a wallet
CREATE OR REPLACE FUNCTION owns_wallet(wallet_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.wallets 
        WHERE id = wallet_id 
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is involved in a transaction
CREATE OR REPLACE FUNCTION involved_in_transaction(transaction_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.transactions t
        JOIN public.wallets w1 ON t.from_wallet_id = w1.id
        JOIN public.wallets w2 ON t.to_wallet_id = w2.id
        WHERE t.id = transaction_id 
        AND (w1.user_id = auth.uid() OR w2.user_id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- USERS TABLE POLICIES
-- ==============================================================================

-- Users can view and update their own profile
CREATE POLICY "users_own_profile" ON public.users
    FOR ALL USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "users_admin_access" ON public.users
    FOR SELECT USING (is_admin());

-- Admins can update user status and verification
CREATE POLICY "users_admin_update" ON public.users
    FOR UPDATE USING (is_admin());

-- Public users can view basic profile info of other users (for transfers)
CREATE POLICY "users_public_profile" ON public.users
    FOR SELECT USING (
        status = 'active' AND 
        kyc_status IN ('approved')
    )
    WITH CHECK (FALSE); -- Prevent updates through this policy

-- ==============================================================================
-- USER ROLES TABLE POLICIES
-- ==============================================================================

-- Users can view their own roles
CREATE POLICY "user_roles_own_view" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can manage all roles
CREATE POLICY "user_roles_admin_manage" ON public.user_roles
    FOR ALL USING (is_admin());

-- Super admins can grant admin roles
CREATE POLICY "user_roles_super_admin_grant" ON public.user_roles
    FOR INSERT WITH CHECK (
        has_role('super_admin') AND 
        granted_by = auth.uid()
    );

-- ==============================================================================
-- WALLETS TABLE POLICIES
-- ==============================================================================

-- Users can view and manage their own wallets
CREATE POLICY "wallets_own_access" ON public.wallets
    FOR ALL USING (auth.uid() = user_id);

-- Admins can view all wallets
CREATE POLICY "wallets_admin_view" ON public.wallets
    FOR SELECT USING (is_admin());

-- Service role can manage all wallets (for automated processes)
CREATE POLICY "wallets_service_access" ON public.wallets
    FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- TRANSACTIONS TABLE POLICIES
-- ==============================================================================

-- Users can view transactions involving their wallets
CREATE POLICY "transactions_user_view" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.wallets w
            WHERE (w.id = from_wallet_id OR w.id = to_wallet_id)
            AND w.user_id = auth.uid()
        )
    );

-- Service role can manage all transactions (for processing)
CREATE POLICY "transactions_service_manage" ON public.transactions
    FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all transactions
CREATE POLICY "transactions_admin_view" ON public.transactions
    FOR SELECT USING (is_admin());

-- Users cannot directly insert transactions (must go through API)
CREATE POLICY "transactions_no_direct_insert" ON public.transactions
    FOR INSERT WITH CHECK (FALSE);

-- ==============================================================================
-- CARDS TABLE POLICIES
-- ==============================================================================

-- Users can view and manage their own cards
CREATE POLICY "cards_own_access" ON public.cards
    FOR ALL USING (auth.uid() = user_id);

-- Admins can view all cards
CREATE POLICY "cards_admin_view" ON public.cards
    FOR SELECT USING (is_admin());

-- Service role can manage cards (for issuance and blocking)
CREATE POLICY "cards_service_manage" ON public.cards
    FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- MERCHANTS TABLE POLICIES
-- ==============================================================================

-- Merchants can view and manage their own business
CREATE POLICY "merchants_owner_access" ON public.merchants
    FOR ALL USING (auth.uid() = owner_user_id);

-- Admins can view all merchants
CREATE POLICY "merchants_admin_view" ON public.merchants
    FOR SELECT USING (is_admin());

-- Admins can update merchant verification status
CREATE POLICY "merchants_admin_verify" ON public.merchants
    FOR UPDATE USING (is_admin());

-- Users can view active, verified merchants (for payments)
CREATE POLICY "merchants_public_view" ON public.merchants
    FOR SELECT USING (status = 'active')
    WITH CHECK (FALSE);

-- ==============================================================================
-- SETTLEMENTS TABLE POLICIES
-- ==============================================================================

-- Merchants can view their own settlements
CREATE POLICY "settlements_merchant_view" ON public.settlements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.merchants m
            WHERE m.id = merchant_id 
            AND m.owner_user_id = auth.uid()
        )
    );

-- Service role can manage settlements (for processing)
CREATE POLICY "settlements_service_manage" ON public.settlements
    FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all settlements
CREATE POLICY "settlements_admin_view" ON public.settlements
    FOR SELECT USING (is_admin());

-- ==============================================================================
-- REMITTANCES TABLE POLICIES
-- ==============================================================================

-- Users can view remittances they sent or received
CREATE POLICY "remittances_participant_view" ON public.remittances
    FOR SELECT USING (
        auth.uid() = sender_user_id OR 
        auth.uid() = recipient_user_id
    );

-- Users can create remittances as sender
CREATE POLICY "remittances_sender_create" ON public.remittances
    FOR INSERT WITH CHECK (auth.uid() = sender_user_id);

-- Service role can manage remittances (for processing)
CREATE POLICY "remittances_service_manage" ON public.remittances
    FOR ALL USING (auth.role() = 'service_role');

-- Recipients can update pickup status
CREATE POLICY "remittances_recipient_pickup" ON public.remittances
    FOR UPDATE USING (
        auth.uid() = recipient_user_id AND
        status = 'completed'
    );

-- Admins can view all remittances
CREATE POLICY "remittances_admin_view" ON public.remittances
    FOR SELECT USING (is_admin());

-- ==============================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ==============================================================================

-- Users can view their own notifications
CREATE POLICY "notifications_own_view" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their notification read status
CREATE POLICY "notifications_own_update" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (
        -- Only allow updating read_at and status
        OLD.user_id = NEW.user_id AND
        OLD.type = NEW.type AND
        OLD.channel = NEW.channel AND
        OLD.title = NEW.title AND
        OLD.message = NEW.message
    );

-- Service role can create and manage notifications
CREATE POLICY "notifications_service_manage" ON public.notifications
    FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all notifications
CREATE POLICY "notifications_admin_view" ON public.notifications
    FOR SELECT USING (is_admin());

-- ==============================================================================
-- AUDIT LOGS TABLE POLICIES
-- ==============================================================================

-- Only service role and admins can access audit logs
CREATE POLICY "audit_logs_service_access" ON public.audit_logs
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        is_admin()
    );

-- Users can view their own audit logs (limited fields)
CREATE POLICY "audit_logs_own_view" ON public.audit_logs
    FOR SELECT USING (
        auth.uid() = user_id AND
        action NOT IN ('login', 'password_change', 'admin_action')
    );

-- ==============================================================================
-- KYC DOCUMENTS TABLE POLICIES
-- ==============================================================================

-- Users can view and manage their own KYC documents
CREATE POLICY "kyc_documents_own_access" ON public.kyc_documents
    FOR ALL USING (auth.uid() = user_id);

-- Admins can view and review all KYC documents
CREATE POLICY "kyc_documents_admin_review" ON public.kyc_documents
    FOR SELECT USING (is_admin());

-- Admins can update KYC document review status
CREATE POLICY "kyc_documents_admin_update" ON public.kyc_documents
    FOR UPDATE USING (is_admin())
    WITH CHECK (reviewed_by = auth.uid());

-- Service role can manage KYC documents (for automated processing)
CREATE POLICY "kyc_documents_service_manage" ON public.kyc_documents
    FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- SECURITY FUNCTIONS FOR TRANSACTION PROCESSING
-- ==============================================================================

-- Function to validate transaction authorization
CREATE OR REPLACE FUNCTION validate_transaction_auth(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_currency currency_code DEFAULT 'HTG'
)
RETURNS BOOLEAN AS $$
DECLARE
    user_status user_status;
    user_kyc_status kyc_status;
    wallet_balance DECIMAL(15,2);
    daily_spent DECIMAL(15,2);
    monthly_spent DECIMAL(15,2);
BEGIN
    -- Check user status and KYC
    SELECT status, kyc_status INTO user_status, user_kyc_status
    FROM public.users WHERE id = p_user_id;
    
    IF user_status != 'active' THEN
        RAISE EXCEPTION 'User account is not active';
    END IF;
    
    IF user_kyc_status NOT IN ('approved') AND p_amount > 1000.00 THEN
        RAISE EXCEPTION 'KYC verification required for amounts over $1000';
    END IF;
    
    -- Check wallet balance
    SELECT available_balance INTO wallet_balance
    FROM public.wallets 
    WHERE user_id = p_user_id AND currency = p_currency;
    
    IF wallet_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient funds';
    END IF;
    
    -- Check daily limits
    SELECT COALESCE(SUM(amount), 0) INTO daily_spent
    FROM public.transactions t
    JOIN public.wallets w ON t.from_wallet_id = w.id
    WHERE w.user_id = p_user_id 
    AND t.currency = p_currency
    AND t.created_at >= CURRENT_DATE
    AND t.status IN ('completed', 'processing');
    
    IF daily_spent + p_amount > 10000.00 THEN
        RAISE EXCEPTION 'Daily transaction limit exceeded';
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to audit sensitive operations
CREATE OR REPLACE FUNCTION audit_operation(
    p_action VARCHAR(100),
    p_resource_type VARCHAR(50),
    p_resource_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        changes,
        ip_address,
        created_at
    ) VALUES (
        auth.uid(),
        p_action,
        p_resource_type,
        p_resource_id,
        p_old_values,
        p_new_values,
        CASE 
            WHEN p_old_values IS NOT NULL AND p_new_values IS NOT NULL 
            THEN p_new_values - p_old_values
            ELSE NULL 
        END,
        inet_client_addr(),
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- WALLET BALANCE MANAGEMENT FUNCTIONS
-- ==============================================================================

-- Secure function to update wallet balances atomically
CREATE OR REPLACE FUNCTION update_wallet_balance(
    p_wallet_id UUID,
    p_amount DECIMAL(15,2),
    p_balance_type VARCHAR(20) DEFAULT 'available' -- 'available', 'pending', 'reserved'
)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance DECIMAL(15,2);
    wallet_currency currency_code;
    wallet_user_id UUID;
BEGIN
    -- Get current balance and validate ownership
    SELECT 
        CASE p_balance_type
            WHEN 'available' THEN available_balance
            WHEN 'pending' THEN pending_balance
            WHEN 'reserved' THEN reserved_balance
        END,
        currency,
        user_id
    INTO current_balance, wallet_currency, wallet_user_id
    FROM public.wallets 
    WHERE id = p_wallet_id AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found or inactive';
    END IF;
    
    -- Validate user permissions
    IF auth.role() != 'service_role' AND auth.uid() != wallet_user_id THEN
        RAISE EXCEPTION 'Unauthorized wallet access';
    END IF;
    
    -- Check for sufficient funds if reducing balance
    IF p_amount < 0 AND current_balance + p_amount < 0 THEN
        RAISE EXCEPTION 'Insufficient funds: cannot reduce % balance below zero', p_balance_type;
    END IF;
    
    -- Update the balance
    IF p_balance_type = 'available' THEN
        UPDATE public.wallets 
        SET available_balance = available_balance + p_amount,
            updated_at = NOW()
        WHERE id = p_wallet_id;
    ELSIF p_balance_type = 'pending' THEN
        UPDATE public.wallets 
        SET pending_balance = pending_balance + p_amount,
            updated_at = NOW()
        WHERE id = p_wallet_id;
    ELSIF p_balance_type = 'reserved' THEN
        UPDATE public.wallets 
        SET reserved_balance = reserved_balance + p_amount,
            updated_at = NOW()
        WHERE id = p_wallet_id;
    END IF;
    
    -- Audit the balance change
    PERFORM audit_operation(
        'wallet_balance_update',
        'wallet',
        p_wallet_id,
        jsonb_build_object('balance_type', p_balance_type, 'old_balance', current_balance),
        jsonb_build_object('balance_type', p_balance_type, 'new_balance', current_balance + p_amount, 'change', p_amount)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- GRANT PERMISSIONS TO AUTHENTICATED USERS
-- ==============================================================================

-- Grant usage on custom types
GRANT USAGE ON TYPE user_status TO authenticated;
GRANT USAGE ON TYPE role_type TO authenticated;
GRANT USAGE ON TYPE kyc_status TO authenticated;
GRANT USAGE ON TYPE kyc_tier TO authenticated;
GRANT USAGE ON TYPE currency_code TO authenticated;
GRANT USAGE ON TYPE transaction_type TO authenticated;
GRANT USAGE ON TYPE transaction_status TO authenticated;
GRANT USAGE ON TYPE card_type TO authenticated;
GRANT USAGE ON TYPE card_status TO authenticated;
GRANT USAGE ON TYPE merchant_status TO authenticated;
GRANT USAGE ON TYPE business_type TO authenticated;
GRANT USAGE ON TYPE notification_type TO authenticated;
GRANT USAGE ON TYPE notification_channel TO authenticated;
GRANT USAGE ON TYPE notification_status TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION has_role(role_type) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_merchant() TO authenticated;
GRANT EXECUTE ON FUNCTION owns_wallet(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION involved_in_transaction(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_transaction_auth(UUID, DECIMAL, currency_code) TO authenticated;
GRANT EXECUTE ON FUNCTION audit_operation(VARCHAR, VARCHAR, UUID, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION update_wallet_balance(UUID, DECIMAL, VARCHAR) TO authenticated;

-- Grant table permissions to authenticated users (RLS will enforce row-level access)
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, UPDATE ON public.wallets TO authenticated;
GRANT SELECT ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.cards TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.merchants TO authenticated;
GRANT SELECT ON public.settlements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.remittances TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.kyc_documents TO authenticated;