-- Update default value for role column from CLIENT to INDIVIDUAL
ALTER TABLE user_profiles 
ALTER COLUMN role SET DEFAULT 'INDIVIDUAL';

-- Update all existing CLIENT records to INDIVIDUAL
UPDATE user_profiles 
SET role = 'INDIVIDUAL' 
WHERE role = 'CLIENT';
