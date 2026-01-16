
-- Authentication schema test

-- Check users table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check user roles enum (robust)
DO $$
BEGIN
	PERFORM enum_range(NULL::user_role);
	RAISE NOTICE 'User role enum exists.';
END $$;
-- If above fails, enum does not exist
-- SELECT unnest(enum_range(NULL::user_role)) as available_roles;

-- Check user status enum (robust)
DO $$
BEGIN
	PERFORM enum_range(NULL::user_status);
	RAISE NOTICE 'User status enum exists.';
END $$;
-- If above fails, enum does not exist
-- SELECT unnest(enum_range(NULL::user_status)) as available_statuses;

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Show sample user (if any)
SELECT id, email, role, status, created_at FROM users LIMIT 3;

-- Check auth-related tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
	AND (table_name LIKE '%user%' OR table_name LIKE '%auth%' OR table_name LIKE '%session%')
ORDER BY table_name;
