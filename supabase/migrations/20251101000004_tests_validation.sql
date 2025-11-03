-- ==============================================================================
-- KobKlein Database Tests and Validation
-- ==============================================================================
-- Version: 1.0.0
-- Date: November 1, 2025
-- Author: GitHub Copilot (Senior Full-Stack Engineer)
-- Authority: /docs/AUTHORIZATION.md
-- Reference: /docs/ARCHITECTURE.md

-- ==============================================================================
-- TEST DATA SETUP (Development/Staging Only)
-- ==============================================================================

-- Function to create test data (only in development)
CREATE OR REPLACE FUNCTION create_test_data()
RETURNS VOID AS $$
DECLARE
    test_user_1 UUID;
    test_user_2 UUID;
    test_user_3 UUID;
    test_merchant UUID;
    wallet_1_htg UUID;
    wallet_1_usd UUID;
    wallet_2_htg UUID;
    wallet_3_htg UUID;
    merchant_id UUID;
    card_id UUID;
BEGIN
    -- Only create test data in development environment
    IF current_setting('app.environment', true) NOT IN ('development', 'staging') THEN
        RAISE NOTICE 'Test data creation skipped - not in development/staging environment';
        RETURN;
    END IF;

    -- Create test users
    test_user_1 := gen_random_uuid();
    test_user_2 := gen_random_uuid();
    test_user_3 := gen_random_uuid();
    test_merchant := gen_random_uuid();

    -- Test User 1: Fully verified user
    INSERT INTO public.users (
        id, email, phone, first_name, last_name,
        status, kyc_status, kyc_tier,
        preferred_currency, country,
        created_at, updated_at
    ) VALUES (
        test_user_1, 'user1@test.com', '+50912345678', 'Jean', 'Baptiste',
        'active', 'approved', 'tier_2',
        'HTG', 'HT',
        NOW(), NOW()
    );

    -- Test User 2: Pending verification
    INSERT INTO public.users (
        id, email, phone, first_name, last_name,
        status, kyc_status, kyc_tier,
        preferred_currency, country,
        created_at, updated_at
    ) VALUES (
        test_user_2, 'user2@test.com', '+50987654321', 'Marie', 'Pierre',
        'active', 'pending', 'tier_0',
        'HTG', 'HT',
        NOW(), NOW()
    );

    -- Test User 3: Diaspora user (USD)
    INSERT INTO public.users (
        id, email, phone, first_name, last_name,
        status, kyc_status, kyc_tier,
        preferred_currency, country,
        created_at, updated_at
    ) VALUES (
        test_user_3, 'diaspora@test.com', '+13055551234', 'Pierre', 'Joseph',
        'active', 'approved', 'tier_2',
        'USD', 'US',
        NOW(), NOW()
    );

    -- Test Merchant User
    INSERT INTO public.users (
        id, email, phone, first_name, last_name,
        status, kyc_status, kyc_tier,
        preferred_currency, country,
        created_at, updated_at
    ) VALUES (
        test_merchant, 'merchant@test.com', '+50911111111', 'Claude', 'Moïse',
        'active', 'approved', 'tier_3',
        'HTG', 'HT',
        NOW(), NOW()
    );

    -- Create user roles
    INSERT INTO public.user_roles (user_id, role, granted_by, is_active) VALUES
        (test_user_1, 'user', test_user_1, TRUE),
        (test_user_2, 'user', test_user_2, TRUE),
        (test_user_3, 'user', test_user_3, TRUE),
        (test_merchant, 'user', test_merchant, TRUE),
        (test_merchant, 'merchant', test_merchant, TRUE);

    -- Create wallets
    INSERT INTO public.wallets (id, user_id, currency, available_balance, is_active)
    VALUES 
        (gen_random_uuid(), test_user_1, 'HTG', 5000.00, TRUE),
        (gen_random_uuid(), test_user_1, 'USD', 100.00, TRUE),
        (gen_random_uuid(), test_user_2, 'HTG', 1500.00, TRUE),
        (gen_random_uuid(), test_user_3, 'USD', 500.00, TRUE),
        (gen_random_uuid(), test_user_3, 'HTG', 0.00, TRUE),
        (gen_random_uuid(), test_merchant, 'HTG', 10000.00, TRUE),
        (gen_random_uuid(), test_merchant, 'USD', 200.00, TRUE);

    -- Get wallet IDs for transactions
    SELECT id INTO wallet_1_htg FROM public.wallets WHERE user_id = test_user_1 AND currency = 'HTG';
    SELECT id INTO wallet_1_usd FROM public.wallets WHERE user_id = test_user_1 AND currency = 'USD';
    SELECT id INTO wallet_2_htg FROM public.wallets WHERE user_id = test_user_2 AND currency = 'HTG';
    SELECT id INTO wallet_3_htg FROM public.wallets WHERE user_id = test_user_3 AND currency = 'HTG';

    -- Create test merchant
    INSERT INTO public.merchants (
        id, owner_user_id, business_name, business_type,
        business_email, business_phone,
        street_address, city, country,
        industry, status, verified_at
    ) VALUES (
        gen_random_uuid(), test_merchant, 'Ti Kominote Market', 'small_business',
        'market@tikominote.ht', '+50911111111',
        '123 Rue Delmas, Port-au-Prince', 'Port-au-Prince', 'HT',
        'retail', 'active', NOW()
    ) RETURNING id INTO merchant_id;

    -- Create sample transactions
    INSERT INTO public.transactions (
        type, status, amount, currency,
        from_wallet_id, to_wallet_id,
        description, processed_at
    ) VALUES
        ('transfer', 'completed', 500.00, 'HTG', wallet_1_htg, wallet_2_htg, 'Test transfer', NOW() - INTERVAL '2 days'),
        ('deposit', 'completed', 1000.00, 'HTG', NULL, wallet_1_htg, 'Test deposit via Stripe', NOW() - INTERVAL '1 day'),
        ('payment', 'completed', 250.00, 'HTG', wallet_2_htg, wallet_1_htg, 'Payment for services', NOW() - INTERVAL '1 hour');

    -- Create test cards
    INSERT INTO public.cards (
        user_id, wallet_id, card_type, status,
        card_number, card_name, daily_limit,
        issued_at, activated_at
    ) VALUES
        (test_user_1, wallet_1_htg, 'virtual', 'active', '**** **** **** 1234', 'Jean Baptiste', 2000.00, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
        (test_merchant, (SELECT id FROM public.wallets WHERE user_id = test_merchant AND currency = 'HTG'), 'physical', 'active', '**** **** **** 5678', 'Ti Kominote Market', 5000.00, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '10 days');

    -- Create test remittance
    INSERT INTO public.remittances (
        sender_user_id, recipient_user_id,
        send_amount, send_currency,
        receive_amount, receive_currency,
        exchange_rate, service_fee, exchange_fee,
        confirmation_code, pickup_code,
        status, delivered_at
    ) VALUES (
        test_user_3, test_user_1,
        100.00, 'USD',
        11350.00, 'HTG',
        113.50, 1.50, 0.50,
        'ABC123DEF456', '789012',
        'completed', NOW() - INTERVAL '3 hours'
    );

    -- Create test notifications
    INSERT INTO public.notifications (
        user_id, type, channel, title, message,
        status, priority, sent_at, delivered_at
    ) VALUES
        (test_user_1, 'transaction', 'push', 'Transfer Completed', 'Your transfer of 500 HTG has been completed successfully.', 'delivered', 3, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
        (test_user_2, 'security', 'email', 'Login from New Device', 'We detected a login from a new device. If this wasn''t you, please contact support.', 'read', 2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
        (test_merchant, 'system', 'in_app', 'Settlement Processed', 'Your daily settlement of 1,250 HTG has been processed.', 'read', 4, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours');

    -- Create audit logs
    INSERT INTO public.audit_logs (
        user_id, action, resource_type, resource_id,
        old_values, new_values, ip_address
    ) VALUES
        (test_user_1, 'wallet_transfer', 'transaction', (SELECT id FROM public.transactions WHERE description = 'Test transfer'), NULL, '{"amount": 500.00, "currency": "HTG"}'::jsonb, '192.168.1.100'::inet),
        (test_merchant, 'merchant_created', 'merchant', merchant_id, NULL, '{"business_name": "Ti Kominote Market"}'::jsonb, '10.0.0.1'::inet);

    RAISE NOTICE 'Test data created successfully';
    RAISE NOTICE 'Test User IDs: %, %, %, %', test_user_1, test_user_2, test_user_3, test_merchant;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- DATABASE VALIDATION FUNCTIONS
-- ==============================================================================

-- Function to validate database schema integrity
CREATE OR REPLACE FUNCTION validate_database_schema()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    message TEXT
) AS $$
BEGIN
    -- Check if all required tables exist
    RETURN QUERY
    SELECT 
        'tables_exist'::TEXT,
        CASE 
            WHEN COUNT(*) = 11 THEN 'PASS'
            ELSE 'FAIL'
        END::TEXT,
        CASE 
            WHEN COUNT(*) = 11 THEN 'All required tables exist'
            ELSE 'Missing tables: ' || (11 - COUNT(*))::TEXT
        END::TEXT
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'users', 'user_roles', 'wallets', 'transactions',
        'cards', 'merchants', 'settlements', 'remittances',
        'notifications', 'audit_logs', 'kyc_documents'
    );

    -- Check if RLS is enabled on all tables
    RETURN QUERY
    WITH rls_check AS (
        SELECT 
            schemaname,
            tablename,
            rowsecurity
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename IN (
            'users', 'user_roles', 'wallets', 'transactions',
            'cards', 'merchants', 'settlements', 'remittances',
            'notifications', 'audit_logs', 'kyc_documents'
        )
    )
    SELECT 
        'rls_enabled'::TEXT,
        CASE 
            WHEN COUNT(*) FILTER (WHERE rowsecurity = false) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END::TEXT,
        CASE 
            WHEN COUNT(*) FILTER (WHERE rowsecurity = false) = 0 THEN 'RLS enabled on all tables'
            ELSE 'RLS not enabled on: ' || string_agg(tablename, ', ') FILTER (WHERE rowsecurity = false)
        END::TEXT
    FROM rls_check;

    -- Check if required indexes exist
    RETURN QUERY
    SELECT 
        'indexes_exist'::TEXT,
        CASE 
            WHEN COUNT(*) >= 20 THEN 'PASS'
            ELSE 'WARN'
        END::TEXT,
        'Found ' || COUNT(*) || ' indexes on core tables'::TEXT
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename IN (
        'users', 'user_roles', 'wallets', 'transactions',
        'cards', 'merchants', 'settlements', 'remittances',
        'notifications', 'audit_logs', 'kyc_documents'
    );

    -- Check if required functions exist
    RETURN QUERY
    WITH required_functions AS (
        SELECT unnest(ARRAY[
            'has_role', 'is_admin', 'is_merchant',
            'create_user_with_wallet', 'update_user_kyc',
            'process_wallet_transfer', 'process_deposit',
            'create_merchant_account', 'create_remittance',
            'create_notification', 'validate_transaction_auth',
            'update_wallet_balance', 'audit_operation'
        ]) as func_name
    ),
    existing_functions AS (
        SELECT routine_name
        FROM information_schema.routines
        WHERE routine_schema = 'public'
        AND routine_type = 'FUNCTION'
    )
    SELECT 
        'functions_exist'::TEXT,
        CASE 
            WHEN COUNT(*) FILTER (WHERE ef.routine_name IS NULL) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END::TEXT,
        CASE 
            WHEN COUNT(*) FILTER (WHERE ef.routine_name IS NULL) = 0 THEN 'All required functions exist'
            ELSE 'Missing functions: ' || string_agg(rf.func_name, ', ') FILTER (WHERE ef.routine_name IS NULL)
        END::TEXT
    FROM required_functions rf
    LEFT JOIN existing_functions ef ON rf.func_name = ef.routine_name;
END;
$$ LANGUAGE plpgsql;

-- Function to validate RLS policies
CREATE OR REPLACE FUNCTION validate_rls_policies()
RETURNS TABLE(
    table_name TEXT,
    policy_count INTEGER,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.tablename::TEXT,
        COALESCE(p.policy_count, 0)::INTEGER,
        CASE 
            WHEN COALESCE(p.policy_count, 0) >= 2 THEN 'PASS'
            WHEN COALESCE(p.policy_count, 0) = 1 THEN 'WARN'
            ELSE 'FAIL'
        END::TEXT
    FROM (
        SELECT tablename
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename IN (
            'users', 'user_roles', 'wallets', 'transactions',
            'cards', 'merchants', 'settlements', 'remittances',
            'notifications', 'audit_logs', 'kyc_documents'
        )
    ) t
    LEFT JOIN (
        SELECT 
            schemaname,
            tablename,
            COUNT(*) as policy_count
        FROM pg_policies 
        WHERE schemaname = 'public'
        GROUP BY schemaname, tablename
    ) p ON t.tablename = p.tablename
    ORDER BY t.tablename;
END;
$$ LANGUAGE plpgsql;

-- Function to validate data integrity
CREATE OR REPLACE FUNCTION validate_data_integrity()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    message TEXT
) AS $$
BEGIN
    -- Check for orphaned wallets
    RETURN QUERY
    SELECT 
        'orphaned_wallets'::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'No orphaned wallets found'
            ELSE COUNT(*) || ' wallets without valid users'
        END::TEXT
    FROM public.wallets w
    LEFT JOIN public.users u ON w.user_id = u.id
    WHERE u.id IS NULL;

    -- Check for invalid transactions
    RETURN QUERY
    SELECT 
        'invalid_transactions'::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'No invalid transactions found'
            ELSE COUNT(*) || ' transactions with invalid wallet references'
        END::TEXT
    FROM public.transactions t
    LEFT JOIN public.wallets wf ON t.from_wallet_id = wf.id
    LEFT JOIN public.wallets wt ON t.to_wallet_id = wt.id
    WHERE (t.from_wallet_id IS NOT NULL AND wf.id IS NULL)
       OR (t.to_wallet_id IS NOT NULL AND wt.id IS NULL);

    -- Check for negative balances
    RETURN QUERY
    SELECT 
        'negative_balances'::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'No negative balances found'
            ELSE COUNT(*) || ' wallets with negative balances'
        END::TEXT
    FROM public.wallets
    WHERE available_balance < 0 OR pending_balance < 0 OR reserved_balance < 0;

    -- Check for users without wallets
    RETURN QUERY
    SELECT 
        'users_without_wallets'::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'
            ELSE 'WARN'
        END::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'All users have wallets'
            ELSE COUNT(*) || ' users without wallets'
        END::TEXT
    FROM public.users u
    LEFT JOIN public.wallets w ON u.id = w.user_id
    WHERE w.id IS NULL AND u.status = 'active';

    -- Check for duplicate roles
    RETURN QUERY
    SELECT 
        'duplicate_roles'::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'
            ELSE 'WARN'
        END::TEXT,
        CASE 
            WHEN COUNT(*) = 0 THEN 'No duplicate active roles found'
            ELSE COUNT(*) || ' users with duplicate active roles'
        END::TEXT
    FROM (
        SELECT user_id, role, COUNT(*)
        FROM public.user_roles
        WHERE is_active = TRUE
        GROUP BY user_id, role
        HAVING COUNT(*) > 1
    ) duplicates;
END;
$$ LANGUAGE plpgsql;

-- Function to run all validation checks
CREATE OR REPLACE FUNCTION run_database_health_check()
RETURNS TABLE(
    category TEXT,
    check_name TEXT,
    status TEXT,
    message TEXT
) AS $$
BEGIN
    -- Schema validation
    RETURN QUERY
    SELECT 
        'Schema'::TEXT as category,
        v.check_name,
        v.status,
        v.message
    FROM validate_database_schema() v;

    -- Data integrity validation
    RETURN QUERY
    SELECT 
        'Data Integrity'::TEXT as category,
        v.check_name,
        v.status,
        v.message
    FROM validate_data_integrity() v;

    -- RLS policies validation
    RETURN QUERY
    SELECT 
        'RLS Policies'::TEXT as category,
        v.table_name as check_name,
        v.status,
        'Policies: ' || v.policy_count::TEXT as message
    FROM validate_rls_policies() v;

    -- Performance check (basic)
    RETURN QUERY
    SELECT 
        'Performance'::TEXT as category,
        'table_sizes'::TEXT as check_name,
        'INFO'::TEXT as status,
        'Users: ' || (SELECT COUNT(*) FROM public.users)::TEXT || 
        ', Wallets: ' || (SELECT COUNT(*) FROM public.wallets)::TEXT ||
        ', Transactions: ' || (SELECT COUNT(*) FROM public.transactions)::TEXT as message;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- MAINTENANCE FUNCTIONS
-- ==============================================================================

-- Function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.audit_logs 
    WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to archive old notifications
CREATE OR REPLACE FUNCTION archive_old_notifications(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- In a real implementation, you might move to an archive table
    -- For now, we'll just delete old read notifications
    DELETE FROM public.notifications 
    WHERE read_at IS NOT NULL 
    AND read_at < NOW() - (days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update exchange rates (placeholder)
CREATE OR REPLACE FUNCTION update_exchange_rates()
RETURNS VOID AS $$
BEGIN
    -- In production, this would fetch real exchange rates from an API
    -- For now, just log that the function was called
    INSERT INTO public.audit_logs (
        action, resource_type, metadata
    ) VALUES (
        'exchange_rates_updated', 'system',
        jsonb_build_object('timestamp', NOW(), 'source', 'manual')
    );
    
    RAISE NOTICE 'Exchange rates update function called at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- GRANT PERMISSIONS
-- ==============================================================================

-- Grant execute permissions on validation functions
GRANT EXECUTE ON FUNCTION validate_database_schema() TO authenticated;
GRANT EXECUTE ON FUNCTION validate_rls_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION validate_data_integrity() TO authenticated;
GRANT EXECUTE ON FUNCTION run_database_health_check() TO authenticated;

-- Grant execute permissions on utility functions (admin only)
GRANT EXECUTE ON FUNCTION create_test_data() TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_audit_logs(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION archive_old_notifications(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION update_exchange_rates() TO service_role;