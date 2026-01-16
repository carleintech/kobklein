-- Payment table functionality test script

-- Test 1: Create a test payment
INSERT INTO "Payment" (user_id, amount, currency, payment_method, status, description)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 99.99, 'USD', 'stripe', 'PENDING', 'Test payment for KobKlein')
RETURNING id, status, amount;

-- Test 2: Retrieve the payment
SELECT id, user_id, amount, currency, payment_method, status, description, created_at
FROM "Payment"
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- Test 3: Update payment status
UPDATE "Payment"
SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
RETURNING id, status;

-- Test 4: Test different payment statuses (enum test)
INSERT INTO "Payment" (user_id, amount, currency, payment_method, status, description)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 25.50, 'USD', 'card', 'PROCESSING', 'Card payment test'),
  ('550e8400-e29b-41d4-a716-446655440002', 75.00, 'USD', 'paypal', 'FAILED', 'PayPal payment test'),
  ('550e8400-e29b-41d4-a716-446655440003', 150.00, 'USD', 'bank', 'REFUNDED', 'Bank transfer test');

-- Test 5: List all test payments
SELECT id, user_id, amount, currency, payment_method, status, created_at
FROM "Payment"
WHERE user_id LIKE '550e8400-e29b-41d4-a716-44665544%'
ORDER BY created_at DESC;

-- Test 6: Test payment aggregation
SELECT
  status,
  COUNT(*) as count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount
FROM "Payment"
WHERE user_id LIKE '550e8400-e29b-41d4-a716-44665544%'
GROUP BY status
ORDER BY status;

-- Test 7: Check enum values
SELECT unnest(enum_range(NULL::payment_status)) as available_status;

-- Cleanup: Delete test payments
DELETE FROM "Payment" WHERE user_id LIKE '550e8400-e29b-41d4-a716-44665544%'
RETURNING id, status;
