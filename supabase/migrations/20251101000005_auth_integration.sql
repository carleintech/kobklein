-- ==============================================================================
-- KobKlein Supabase Auth Integration
-- ==============================================================================
-- Version: 1.0.0
-- Date: November 1, 2025
-- Author: GitHub Copilot (Senior Full-Stack Engineer)
-- Authority: /docs/AUTHORIZATION.md
-- Reference: /docs/ARCHITECTURE.md

-- ==============================================================================
-- AUTH SCHEMA INTEGRATION
-- ==============================================================================

-- Function to handle new user signup via auth trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    default_wallet_id UUID;
BEGIN
    -- Create user profile in public.users
    INSERT INTO public.users (
        id,
        email,
        phone,
        email_verified,
        phone_verified,
        status,
        kyc_status,
        kyc_tier,
        preferred_currency,
        country,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        NEW.phone,
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
        COALESCE(NEW.phone_confirmed_at IS NOT NULL, FALSE),
        'pending',
        'pending',
        'tier_0',
        'HTG', -- Default currency for Haiti
        'HT',   -- Default country
        NEW.created_at,
        NEW.updated_at
    );

    -- Create default HTG wallet for new user
    INSERT INTO public.wallets (
        user_id,
        currency,
        available_balance,
        is_active,
        created_at
    ) VALUES (
        NEW.id,
        'HTG',
        0.00,
        TRUE,
        NOW()
    ) RETURNING id INTO default_wallet_id;

    -- Assign default user role
    INSERT INTO public.user_roles (
        user_id,
        role,
        granted_by,
        is_active,
        created_at
    ) VALUES (
        NEW.id,
        'user',
        NEW.id,
        TRUE,
        NOW()
    );

    -- Create welcome notification
    INSERT INTO public.notifications (
        user_id,
        type,
        channel,
        title,
        message,
        data,
        priority,
        status
    ) VALUES (
        NEW.id,
        'system',
        'in_app',
        'Welcome to KobKlein!',
        'Your account has been created successfully. Complete your profile to start using all features.',
        jsonb_build_object(
            'wallet_id', default_wallet_id,
            'currency', 'HTG',
            'next_steps', ARRAY['verify_phone', 'complete_profile', 'upload_kyc']
        ),
        5,
        'pending'
    );

    -- Audit user creation
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        new_values,
        metadata
    ) VALUES (
        NEW.id,
        'user_registered',
        'user',
        NEW.id,
        jsonb_build_object(
            'email', NEW.email,
            'phone', NEW.phone,
            'provider', NEW.app_metadata->>'provider'
        ),
        jsonb_build_object(
            'signup_method', NEW.app_metadata->>'provider',
            'wallet_created', default_wallet_id
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for new signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to sync user updates from auth
CREATE OR REPLACE FUNCTION public.handle_user_update() 
RETURNS TRIGGER AS $$
BEGIN
    -- Update email verification status
    IF OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at THEN
        UPDATE public.users 
        SET 
            email_verified = (NEW.email_confirmed_at IS NOT NULL),
            updated_at = NOW()
        WHERE id = NEW.id;
        
        -- Audit email verification
        IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
            INSERT INTO public.audit_logs (
                user_id, action, resource_type, resource_id,
                old_values, new_values
            ) VALUES (
                NEW.id, 'email_verified', 'user', NEW.id,
                jsonb_build_object('email_verified', FALSE),
                jsonb_build_object('email_verified', TRUE, 'verified_at', NEW.email_confirmed_at)
            );
        END IF;
    END IF;

    -- Update phone verification status
    IF OLD.phone_confirmed_at IS DISTINCT FROM NEW.phone_confirmed_at THEN
        UPDATE public.users 
        SET 
            phone_verified = (NEW.phone_confirmed_at IS NOT NULL),
            updated_at = NOW()
        WHERE id = NEW.id;
        
        -- Audit phone verification
        IF NEW.phone_confirmed_at IS NOT NULL AND OLD.phone_confirmed_at IS NULL THEN
            INSERT INTO public.audit_logs (
                user_id, action, resource_type, resource_id,
                old_values, new_values
            ) VALUES (
                NEW.id, 'phone_verified', 'user', NEW.id,
                jsonb_build_object('phone_verified', FALSE),
                jsonb_build_object('phone_verified', TRUE, 'verified_at', NEW.phone_confirmed_at)
            );
        END IF;
    END IF;

    -- Update email if changed
    IF OLD.email IS DISTINCT FROM NEW.email THEN
        UPDATE public.users 
        SET 
            email = NEW.email,
            email_verified = (NEW.email_confirmed_at IS NOT NULL),
            updated_at = NOW()
        WHERE id = NEW.id;
    END IF;

    -- Update phone if changed
    IF OLD.phone IS DISTINCT FROM NEW.phone THEN
        UPDATE public.users 
        SET 
            phone = NEW.phone,
            phone_verified = (NEW.phone_confirmed_at IS NOT NULL),
            updated_at = NOW()
        WHERE id = NEW.id;
    END IF;

    -- Update last seen
    UPDATE public.users 
    SET 
        last_seen_at = NEW.last_sign_in_at,
        updated_at = NOW()
    WHERE id = NEW.id AND OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- ==============================================================================
-- JWT CLAIMS AND CUSTOM ROLES
-- ==============================================================================

-- Function to add custom claims to JWT
CREATE OR REPLACE FUNCTION public.get_user_claims(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    user_record public.users%ROWTYPE;
    user_roles_array TEXT[];
    claims JSONB;
BEGIN
    -- Get user information
    SELECT * INTO user_record FROM public.users WHERE id = user_id;
    
    IF NOT FOUND THEN
        RETURN '{}'::JSONB;
    END IF;
    
    -- Get user roles
    SELECT ARRAY_AGG(role::TEXT) INTO user_roles_array
    FROM public.user_roles 
    WHERE user_roles.user_id = get_user_claims.user_id 
    AND is_active = TRUE 
    AND (expires_at IS NULL OR expires_at > NOW());
    
    -- Build claims object
    claims := jsonb_build_object(
        'user_id', user_record.id,
        'email', user_record.email,
        'phone', user_record.phone,
        'status', user_record.status,
        'kyc_status', user_record.kyc_status,
        'kyc_tier', user_record.kyc_tier,
        'roles', COALESCE(user_roles_array, ARRAY[]::TEXT[]),
        'preferred_currency', user_record.preferred_currency,
        'country', user_record.country,
        'email_verified', user_record.email_verified,
        'phone_verified', user_record.phone_verified
    );
    
    RETURN claims;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- SECURITY FUNCTIONS
-- ==============================================================================

-- Function to validate session and extract user info
CREATE OR REPLACE FUNCTION public.get_current_user_info()
RETURNS JSONB AS $$
DECLARE
    current_user_id UUID;
    user_info JSONB;
BEGIN
    -- Get current user ID from auth context
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'authenticated', FALSE,
            'error', 'No authenticated user'
        );
    END IF;
    
    -- Get user claims
    user_info := get_user_claims(current_user_id);
    
    -- Add authentication status
    user_info := user_info || jsonb_build_object('authenticated', TRUE);
    
    RETURN user_info;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has permission for action
CREATE OR REPLACE FUNCTION public.user_has_permission(
    action_name TEXT,
    resource_type TEXT DEFAULT NULL,
    resource_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_id UUID;
    user_status user_status;
    user_roles TEXT[];
BEGIN
    -- Get current user
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get user status and roles
    SELECT status INTO user_status FROM public.users WHERE id = current_user_id;
    
    SELECT ARRAY_AGG(role::TEXT) INTO user_roles
    FROM public.user_roles 
    WHERE user_id = current_user_id 
    AND is_active = TRUE 
    AND (expires_at IS NULL OR expires_at > NOW());
    
    -- Check if user is active
    IF user_status != 'active' THEN
        RETURN FALSE;
    END IF;
    
    -- Admin and super_admin can do anything
    IF 'admin' = ANY(user_roles) OR 'super_admin' = ANY(user_roles) THEN
        RETURN TRUE;
    END IF;
    
    -- Check specific permissions based on action
    CASE action_name
        WHEN 'create_transaction' THEN
            RETURN 'user' = ANY(user_roles);
        WHEN 'create_merchant' THEN
            RETURN 'user' = ANY(user_roles);
        WHEN 'manage_users' THEN
            RETURN 'admin' = ANY(user_roles) OR 'super_admin' = ANY(user_roles);
        WHEN 'process_settlements' THEN
            RETURN 'merchant' = ANY(user_roles) OR 'admin' = ANY(user_roles);
        ELSE
            -- Default: basic user actions
            RETURN 'user' = ANY(user_roles);
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- SESSION MANAGEMENT
-- ==============================================================================

-- Function to log user sessions
CREATE OR REPLACE FUNCTION public.log_user_session(
    session_action TEXT, -- 'login', 'logout', 'refresh'
    session_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Log the session event
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        ip_address,
        metadata
    ) VALUES (
        current_user_id,
        'session_' || session_action,
        'session',
        inet_client_addr(),
        COALESCE(session_metadata, '{}'::JSONB)
    );
    
    -- Update last seen timestamp
    UPDATE public.users 
    SET last_seen_at = NOW()
    WHERE id = current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- PASSWORD SECURITY
-- ==============================================================================

-- Function to validate password strength
CREATE OR REPLACE FUNCTION public.validate_password_strength(password TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    score INTEGER := 0;
    feedback TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Length check
    IF LENGTH(password) >= 8 THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must be at least 8 characters long');
    END IF;
    
    -- Uppercase check
    IF password ~ '[A-Z]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one uppercase letter');
    END IF;
    
    -- Lowercase check
    IF password ~ '[a-z]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one lowercase letter');
    END IF;
    
    -- Number check
    IF password ~ '[0-9]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one number');
    END IF;
    
    -- Special character check
    IF password ~ '[^A-Za-z0-9]' THEN
        score := score + 1;
    ELSE
        feedback := array_append(feedback, 'Password must contain at least one special character');
    END IF;
    
    -- Common patterns check (basic)
    IF password ~* '(password|123456|qwerty|admin)' THEN
        score := score - 2;
        feedback := array_append(feedback, 'Password contains common patterns');
    END IF;
    
    result := jsonb_build_object(
        'score', GREATEST(0, score),
        'max_score', 5,
        'strength', CASE 
            WHEN score >= 4 THEN 'strong'
            WHEN score >= 3 THEN 'medium'
            WHEN score >= 2 THEN 'weak'
            ELSE 'very_weak'
        END,
        'is_valid', score >= 3,
        'feedback', feedback
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- INITIAL SETUP AND CONFIGURATIONS
-- ==============================================================================

-- Create admin user function (for initial setup)
CREATE OR REPLACE FUNCTION public.create_admin_user(
    admin_email TEXT,
    admin_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- This function should only be called during initial setup
    -- In production, use with caution and proper authorization
    
    -- Insert or update user with admin privileges
    INSERT INTO public.users (
        id, email, status, kyc_status, kyc_tier,
        first_name, last_name, country, preferred_currency
    ) VALUES (
        admin_user_id, admin_email, 'active', 'approved', 'tier_3',
        'System', 'Administrator', 'HT', 'HTG'
    )
    ON CONFLICT (id) DO UPDATE SET
        status = 'active',
        kyc_status = 'approved',
        kyc_tier = 'tier_3',
        updated_at = NOW();
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role, granted_by, is_active)
    VALUES (admin_user_id, 'admin', admin_user_id, TRUE)
    ON CONFLICT (user_id, role) DO UPDATE SET 
        is_active = TRUE,
        granted_by = admin_user_id;
    
    -- Create admin wallet if not exists
    INSERT INTO public.wallets (user_id, currency, is_active)
    VALUES (admin_user_id, 'HTG', TRUE)
    ON CONFLICT (user_id, currency) DO NOTHING;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- GRANT PERMISSIONS
-- ==============================================================================

-- Grant execute permissions on auth functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_user_update() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_claims(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_current_user_info() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_permission(TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_session(TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_password_strength(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user(TEXT, UUID) TO service_role;

-- ==============================================================================
-- ENVIRONMENT-SPECIFIC SETTINGS
-- ==============================================================================

-- Set application environment (this would be set via environment variable)
-- ALTER DATABASE SET app.environment = 'development';

-- Create application settings table for runtime configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.app_settings (key, value, description) VALUES
    ('exchange_rates', '{"USD_HTG": 113.50, "EUR_HTG": 120.25, "HTG_USD": 0.0088}', 'Current exchange rates'),
    ('transaction_limits', '{"daily_limit": 10000, "monthly_limit": 100000, "single_transaction_limit": 5000}', 'Default transaction limits'),
    ('kyc_requirements', '{"tier_1_limit": 1000, "tier_2_limit": 10000, "tier_3_limit": 100000}', 'KYC tier requirements'),
    ('fee_structure', '{"transfer_fee": 0.01, "merchant_fee": 0.03, "remittance_fee": 0.015, "exchange_fee": 0.005}', 'Fee structure percentages'),
    ('notification_settings', '{"batch_size": 100, "retry_attempts": 3, "retry_delay_minutes": 5}', 'Notification system settings')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS on settings table
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for settings (admin read/write, others read-only)
CREATE POLICY "settings_admin_manage" ON public.app_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
            AND is_active = TRUE
        )
    );

CREATE POLICY "settings_public_read" ON public.app_settings
    FOR SELECT USING (TRUE);

-- Grant permissions on settings
GRANT SELECT ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;