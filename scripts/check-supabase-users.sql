-- Run this in Supabase SQL Editor to see all registered users
-- https://supabase.com/dashboard/project/lwkqfvadgcdiawmyazdi/sql/new

-- 1. Check all users in Supabase Auth
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Check all users in your public.users table
SELECT 
  id,
  email,
  first_name,
  last_name,
  status,
  created_at
FROM public.users
ORDER BY created_at DESC;

-- 3. Find orphaned users (in auth.users but not in public.users)
SELECT 
  au.id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 4. DELETE ORPHANED USERS (Run this after verifying above)
-- Uncomment the line below to delete orphaned users:
-- DELETE FROM auth.users WHERE id IN (
--   SELECT au.id FROM auth.users au
--   LEFT JOIN public.users pu ON au.id = pu.id
--   WHERE pu.id IS NULL
-- );

-- 5. Or delete specific test users by email
-- DELETE FROM auth.users WHERE email IN (
--   'carleintech@hotmail.com',
--   'mitchelabegin@gmail.com',
--   'carlitechnology@hotmail.com'
-- );
