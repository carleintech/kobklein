-- ==============================================================================
-- KobKlein Business Logic Functions and Procedures
-- ==============================================================================
-- Version: 1.0.0
-- Date: November 1, 2025
-- Author: GitHub Copilot (Senior Full-Stack Engineer)
-- Authority: /docs/AUTHORIZATION.md
-- Reference: /docs/ARCHITECTURE.md

-- ==============================================================================
-- USER MANAGEMENT FUNCTIONS
-- ==============================================================================

-- Function to create a new user with default wallet
CREATE OR REPLACE FUNCTION create_user_with_wallet(
    p_user_id UUID,
    p_email VARCHAR(255) DEFAULT NULL,
    p_phone VARCHAR(20) DEFAULT NULL,
    p_first_name VARCHAR(100) DEFAULT NULL,
    p_last_name VARCHAR(100) DEFAULT NULL,
    p_preferred_currency currency_code DEFAULT 'HTG'
)
RETURNS UUID AS $$
DECLARE
    wallet_id UUID;
BEGIN
    -- Insert user record
    INSERT INTO public.users (
        id, email, phone, first_name, last_name, 
        preferred_currency, status, created_at
    ) VALUES (
        p_user_id, p_email, p_phone, p_first_name, p_last_name,
        p_preferred_currency, 'pending', NOW()
    );
    
    -- Create default wallet
    INSERT INTO public.wallets (user_id, currency, is_active)
    VALUES (p_user_id, p_preferred_currency, TRUE)
    RETURNING id INTO wallet_id;
    
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role, granted_by, is_active)
    VALUES (p_user_id, 'user', p_user_id, TRUE);
    
    -- Audit user creation
    PERFORM audit_operation(
        'user_created',
        'user',
        p_user_id,
        NULL,
        jsonb_build_object(
            'email', p_email,
            'phone', p_phone,
            'preferred_currency', p_preferred_currency
        )
    );
    
    RETURN wallet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade user KYC status
CREATE OR REPLACE FUNCTION update_user_kyc(
    p_user_id UUID,
    p_kyc_status kyc_status,
    p_kyc_tier kyc_tier DEFAULT NULL,
    p_reviewer_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    old_status kyc_status;
    old_tier kyc_tier;
BEGIN
    -- Get current status
    SELECT kyc_status, kyc_tier INTO old_status, old_tier
    FROM public.users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Update KYC status
    UPDATE public.users 
    SET 
        kyc_status = p_kyc_status,
        kyc_tier = COALESCE(p_kyc_tier, kyc_tier),
        kyc_verified_at = CASE WHEN p_kyc_status = 'approved' THEN NOW() ELSE kyc_verified_at END,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Audit KYC update
    PERFORM audit_operation(
        'kyc_status_updated',
        'user',
        p_user_id,
        jsonb_build_object('status', old_status, 'tier', old_tier),
        jsonb_build_object('status', p_kyc_status, 'tier', p_kyc_tier, 'reviewer', p_reviewer_id)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- WALLET AND TRANSACTION FUNCTIONS
-- ==============================================================================

-- Function to process a wallet-to-wallet transfer
CREATE OR REPLACE FUNCTION process_wallet_transfer(
    p_from_wallet_id UUID,
    p_to_wallet_id UUID,
    p_amount DECIMAL(15,2),
    p_description TEXT DEFAULT NULL,
    p_reference VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    transaction_id UUID;
    from_currency currency_code;
    to_currency currency_code;
    from_user_id UUID;
    to_user_id UUID;
BEGIN
    -- Validate wallets and get details
    SELECT currency, user_id INTO from_currency, from_user_id
    FROM public.wallets WHERE id = p_from_wallet_id AND is_active = TRUE;
    
    SELECT currency, user_id INTO to_currency, to_user_id
    FROM public.wallets WHERE id = p_to_wallet_id AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid wallet(s)';
    END IF;
    
    -- Validate same currency (for now)
    IF from_currency != to_currency THEN
        RAISE EXCEPTION 'Cross-currency transfers not supported yet';
    END IF;
    
    -- Validate authorization and limits
    PERFORM validate_transaction_auth(from_user_id, p_amount, from_currency);
    
    -- Create transaction record
    INSERT INTO public.transactions (
        type, status, amount, currency,
        from_wallet_id, to_wallet_id,
        description, reference
    ) VALUES (
        'transfer', 'processing', p_amount, from_currency,
        p_from_wallet_id, p_to_wallet_id,
        p_description, p_reference
    ) RETURNING id INTO transaction_id;
    
    -- Update wallet balances atomically
    PERFORM update_wallet_balance(p_from_wallet_id, -p_amount, 'available');
    PERFORM update_wallet_balance(p_to_wallet_id, p_amount, 'available');
    
    -- Mark transaction as completed
    UPDATE public.transactions 
    SET status = 'completed', processed_at = NOW()
    WHERE id = transaction_id;
    
    -- Audit the transfer
    PERFORM audit_operation(
        'wallet_transfer',
        'transaction',
        transaction_id,
        NULL,
        jsonb_build_object(
            'from_user', from_user_id,
            'to_user', to_user_id,
            'amount', p_amount,
            'currency', from_currency
        )
    );
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process a deposit (from external source)
CREATE OR REPLACE FUNCTION process_deposit(
    p_wallet_id UUID,
    p_amount DECIMAL(15,2),
    p_processor VARCHAR(50) DEFAULT 'stripe',
    p_processor_transaction_id VARCHAR(255) DEFAULT NULL,
    p_reference VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    transaction_id UUID;
    wallet_currency currency_code;
    wallet_user_id UUID;
BEGIN
    -- Validate wallet
    SELECT currency, user_id INTO wallet_currency, wallet_user_id
    FROM public.wallets WHERE id = p_wallet_id AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid wallet';
    END IF;
    
    -- Create transaction record
    INSERT INTO public.transactions (
        type, status, amount, currency,
        to_wallet_id, processor, processor_transaction_id, reference
    ) VALUES (
        'deposit', 'completed', p_amount, wallet_currency,
        p_wallet_id, p_processor, p_processor_transaction_id, p_reference
    ) RETURNING id INTO transaction_id;
    
    -- Update wallet balance
    PERFORM update_wallet_balance(p_wallet_id, p_amount, 'available');
    
    -- Mark transaction as processed
    UPDATE public.transactions 
    SET processed_at = NOW()
    WHERE id = transaction_id;
    
    -- Audit the deposit
    PERFORM audit_operation(
        'wallet_deposit',
        'transaction',
        transaction_id,
        NULL,
        jsonb_build_object(
            'user_id', wallet_user_id,
            'amount', p_amount,
            'currency', wallet_currency,
            'processor', p_processor
        )
    );
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- MERCHANT AND SETTLEMENT FUNCTIONS
-- ==============================================================================

-- Function to create a merchant account
CREATE OR REPLACE FUNCTION create_merchant_account(
    p_user_id UUID,
    p_business_name VARCHAR(200),
    p_business_type business_type,
    p_business_email VARCHAR(255) DEFAULT NULL,
    p_business_phone VARCHAR(20) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    merchant_id UUID;
BEGIN
    -- Validate user exists and is verified
    IF NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = p_user_id 
        AND status = 'active' 
        AND kyc_status = 'approved'
    ) THEN
        RAISE EXCEPTION 'User must be verified to create merchant account';
    END IF;
    
    -- Create merchant record
    INSERT INTO public.merchants (
        owner_user_id, business_name, business_type,
        business_email, business_phone, status
    ) VALUES (
        p_user_id, p_business_name, p_business_type,
        p_business_email, p_business_phone, 'pending'
    ) RETURNING id INTO merchant_id;
    
    -- Assign merchant role to user
    INSERT INTO public.user_roles (user_id, role, granted_by, is_active)
    VALUES (p_user_id, 'merchant', p_user_id, TRUE)
    ON CONFLICT (user_id, role) DO UPDATE SET is_active = TRUE;
    
    -- Audit merchant creation
    PERFORM audit_operation(
        'merchant_created',
        'merchant',
        merchant_id,
        NULL,
        jsonb_build_object(
            'business_name', p_business_name,
            'business_type', p_business_type,
            'owner_id', p_user_id
        )
    );
    
    RETURN merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process merchant settlement
CREATE OR REPLACE FUNCTION process_merchant_settlement(
    p_merchant_id UUID,
    p_period_start TIMESTAMPTZ,
    p_period_end TIMESTAMPTZ,
    p_currency currency_code DEFAULT 'HTG'
)
RETURNS UUID AS $$
DECLARE
    settlement_id UUID;
    total_amount DECIMAL(15,2);
    fee_amount DECIMAL(15,2);
    merchant_wallet_id UUID;
BEGIN
    -- Calculate settlement amount from completed transactions
    SELECT COALESCE(SUM(t.amount * 0.97), 0) -- 3% merchant fee
    INTO total_amount
    FROM public.transactions t
    JOIN public.wallets w ON t.to_wallet_id = w.id
    JOIN public.merchants m ON w.user_id = m.owner_user_id
    WHERE m.id = p_merchant_id
    AND t.type = 'payment'
    AND t.status = 'completed'
    AND t.currency = p_currency
    AND t.created_at BETWEEN p_period_start AND p_period_end;
    
    IF total_amount <= 0 THEN
        RAISE EXCEPTION 'No transactions to settle for this period';
    END IF;
    
    -- Calculate fee (3% of total)
    fee_amount := total_amount * 0.03;
    
    -- Get merchant's wallet
    SELECT w.id INTO merchant_wallet_id
    FROM public.wallets w
    JOIN public.merchants m ON w.user_id = m.owner_user_id
    WHERE m.id = p_merchant_id AND w.currency = p_currency;
    
    -- Create settlement record
    INSERT INTO public.settlements (
        merchant_id, amount, currency, fee_amount,
        period_start, period_end, status
    ) VALUES (
        p_merchant_id, total_amount, p_currency, fee_amount,
        p_period_start, p_period_end, 'pending'
    ) RETURNING id INTO settlement_id;
    
    -- Credit merchant wallet (net amount)
    PERFORM update_wallet_balance(merchant_wallet_id, total_amount - fee_amount, 'available');
    
    -- Mark settlement as processed
    UPDATE public.settlements 
    SET status = 'completed', processed_at = NOW()
    WHERE id = settlement_id;
    
    -- Audit settlement
    PERFORM audit_operation(
        'merchant_settlement',
        'settlement',
        settlement_id,
        NULL,
        jsonb_build_object(
            'merchant_id', p_merchant_id,
            'total_amount', total_amount,
            'fee_amount', fee_amount,
            'net_amount', total_amount - fee_amount
        )
    );
    
    RETURN settlement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- REMITTANCE FUNCTIONS
-- ==============================================================================

-- Function to create a remittance transfer
CREATE OR REPLACE FUNCTION create_remittance(
    p_sender_user_id UUID,
    p_recipient_user_id UUID DEFAULT NULL,
    p_recipient_phone VARCHAR(20) DEFAULT NULL,
    p_recipient_name VARCHAR(200) DEFAULT NULL,
    p_send_amount DECIMAL(15,2),
    p_send_currency currency_code DEFAULT 'USD',
    p_receive_currency currency_code DEFAULT 'HTG',
    p_exchange_rate DECIMAL(10,6) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    remittance_id UUID;
    sender_wallet_id UUID;
    receive_amount DECIMAL(15,2);
    service_fee DECIMAL(15,2);
    exchange_fee DECIMAL(15,2);
    confirmation_code VARCHAR(20);
    pickup_code VARCHAR(10);
BEGIN
    -- Get sender's wallet
    SELECT id INTO sender_wallet_id
    FROM public.wallets 
    WHERE user_id = p_sender_user_id AND currency = p_send_currency;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sender does not have a % wallet', p_send_currency;
    END IF;
    
    -- Set default exchange rate if not provided (simplified)
    IF p_exchange_rate IS NULL THEN
        p_exchange_rate := CASE 
            WHEN p_send_currency = 'USD' AND p_receive_currency = 'HTG' THEN 113.50
            WHEN p_send_currency = 'HTG' AND p_receive_currency = 'USD' THEN 0.0088
            ELSE 1.0
        END;
    END IF;
    
    -- Calculate amounts and fees
    service_fee := p_send_amount * 0.015; -- 1.5% service fee
    exchange_fee := p_send_amount * 0.005; -- 0.5% exchange fee
    receive_amount := (p_send_amount - service_fee - exchange_fee) * p_exchange_rate;
    
    -- Generate codes
    confirmation_code := UPPER(encode(gen_random_bytes(8), 'hex'));
    pickup_code := LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0');
    
    -- Validate sender authorization
    PERFORM validate_transaction_auth(p_sender_user_id, p_send_amount + service_fee + exchange_fee, p_send_currency);
    
    -- Create remittance record
    INSERT INTO public.remittances (
        sender_user_id, recipient_user_id, recipient_phone, recipient_name,
        send_amount, send_currency, receive_amount, receive_currency,
        exchange_rate, service_fee, exchange_fee,
        confirmation_code, pickup_code, status
    ) VALUES (
        p_sender_user_id, p_recipient_user_id, p_recipient_phone, p_recipient_name,
        p_send_amount, p_send_currency, receive_amount, p_receive_currency,
        p_exchange_rate, service_fee, exchange_fee,
        confirmation_code, pickup_code, 'pending'
    ) RETURNING id INTO remittance_id;
    
    -- Deduct from sender's wallet
    PERFORM update_wallet_balance(sender_wallet_id, -(p_send_amount + service_fee + exchange_fee), 'available');
    
    -- If recipient is registered, credit their wallet
    IF p_recipient_user_id IS NOT NULL THEN
        DECLARE
            recipient_wallet_id UUID;
        BEGIN
            SELECT id INTO recipient_wallet_id
            FROM public.wallets 
            WHERE user_id = p_recipient_user_id AND currency = p_receive_currency;
            
            IF FOUND THEN
                PERFORM update_wallet_balance(recipient_wallet_id, receive_amount, 'available');
                UPDATE public.remittances 
                SET status = 'completed', delivered_at = NOW()
                WHERE id = remittance_id;
            END IF;
        END;
    END IF;
    
    -- Audit remittance creation
    PERFORM audit_operation(
        'remittance_created',
        'remittance',
        remittance_id,
        NULL,
        jsonb_build_object(
            'sender_id', p_sender_user_id,
            'recipient_id', p_recipient_user_id,
            'send_amount', p_send_amount,
            'receive_amount', receive_amount,
            'exchange_rate', p_exchange_rate
        )
    );
    
    RETURN remittance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- NOTIFICATION FUNCTIONS
-- ==============================================================================

-- Function to create and schedule notifications
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_channel notification_channel,
    p_title VARCHAR(255),
    p_message TEXT,
    p_data JSONB DEFAULT NULL,
    p_priority INTEGER DEFAULT 5,
    p_scheduled_for TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
    user_preferences JSONB;
    channel_enabled BOOLEAN;
BEGIN
    -- Check user notification preferences
    SELECT notification_preferences INTO user_preferences
    FROM public.users WHERE id = p_user_id;
    
    -- Check if this type of notification is enabled for this channel
    channel_enabled := COALESCE(
        (user_preferences->p_channel::TEXT->>p_type::TEXT)::BOOLEAN,
        TRUE
    );
    
    IF NOT channel_enabled THEN
        -- User has disabled this type of notification for this channel
        RETURN NULL;
    END IF;
    
    -- Create notification
    INSERT INTO public.notifications (
        user_id, type, channel, title, message, data,
        priority, scheduled_for, status
    ) VALUES (
        p_user_id, p_type, p_channel, p_title, p_message, p_data,
        p_priority, p_scheduled_for, 'pending'
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- UTILITY FUNCTIONS
-- ==============================================================================

-- Function to get user's wallet balance across all currencies
CREATE OR REPLACE FUNCTION get_user_balances(p_user_id UUID)
RETURNS TABLE(
    currency currency_code,
    available_balance DECIMAL(15,2),
    pending_balance DECIMAL(15,2),
    reserved_balance DECIMAL(15,2),
    total_balance DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT w.currency, w.available_balance, w.pending_balance, w.reserved_balance, w.total_balance
    FROM public.wallets w
    WHERE w.user_id = p_user_id AND w.is_active = TRUE
    ORDER BY w.currency;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get transaction history for a user
CREATE OR REPLACE FUNCTION get_user_transactions(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
    transaction_id UUID,
    type transaction_type,
    status transaction_status,
    amount DECIMAL(15,2),
    currency currency_code,
    description TEXT,
    created_at TIMESTAMPTZ,
    is_outgoing BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.type,
        t.status,
        t.amount,
        t.currency,
        t.description,
        t.created_at,
        (wf.user_id = p_user_id) AS is_outgoing
    FROM public.transactions t
    LEFT JOIN public.wallets wf ON t.from_wallet_id = wf.id
    LEFT JOIN public.wallets wt ON t.to_wallet_id = wt.id
    WHERE wf.user_id = p_user_id OR wt.user_id = p_user_id
    ORDER BY t.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate daily transaction limits
CREATE OR REPLACE FUNCTION get_daily_transaction_summary(
    p_user_id UUID,
    p_currency currency_code DEFAULT 'HTG',
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    total_sent DECIMAL(15,2),
    total_received DECIMAL(15,2),
    transaction_count INTEGER,
    remaining_daily_limit DECIMAL(15,2)
) AS $$
DECLARE
    daily_limit DECIMAL(15,2) := 10000.00; -- Default daily limit
BEGIN
    RETURN QUERY
    WITH daily_stats AS (
        SELECT 
            COALESCE(SUM(CASE WHEN wf.user_id = p_user_id THEN t.amount ELSE 0 END), 0) as sent,
            COALESCE(SUM(CASE WHEN wt.user_id = p_user_id THEN t.amount ELSE 0 END), 0) as received,
            COUNT(*) as tx_count
        FROM public.transactions t
        LEFT JOIN public.wallets wf ON t.from_wallet_id = wf.id
        LEFT JOIN public.wallets wt ON t.to_wallet_id = wt.id
        WHERE (wf.user_id = p_user_id OR wt.user_id = p_user_id)
        AND t.currency = p_currency
        AND t.created_at >= p_date::TIMESTAMPTZ
        AND t.created_at < (p_date + INTERVAL '1 day')::TIMESTAMPTZ
        AND t.status IN ('completed', 'processing')
    )
    SELECT 
        ds.sent,
        ds.received,
        ds.tx_count::INTEGER,
        GREATEST(0, daily_limit - ds.sent) as remaining
    FROM daily_stats ds;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;