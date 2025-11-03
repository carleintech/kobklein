# Payments Module Testing Guide

## Prerequisites

### 1. Database Setup
Ensure PostgreSQL is running and configured in `backend/api/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kobklein?schema=public"
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_RETURN_URL=http://localhost:3000/payment/success
JWT_SECRET=your_jwt_secret
```

### 2. Run Database Migration
```bash
cd backend/api
npx prisma migrate dev --name add_payment_model
npx prisma generate
```

### 3. Start the API Server
```bash
cd backend/api
npm run start:dev
```

The API should be running on `http://localhost:3000`

---

## Testing Checklist

### Phase 1: Authentication Setup

#### 1.1 Create Test User
```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "role": "CLIENT"
  }'
```

#### 1.2 Login and Get JWT Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

**Save the JWT token from the response for subsequent requests.**

---

### Phase 2: Payment Creation Tests

#### 2.1 Create Basic Payment (✅ Expected: Success)
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.00,
    "currency": "HTG",
    "method": "STRIPE",
    "description": "Test payment"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "amount": 100.00,
  "currency": "HTG",
  "method": "STRIPE",
  "status": "PENDING",
  "description": "Test payment",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### 2.2 Create Payment with Invalid Amount (❌ Expected: Validation Error)
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": -50.00,
    "currency": "HTG",
    "method": "STRIPE"
  }'
```

**Expected Response:** 400 Bad Request with validation error

#### 2.3 Create Payment without Authentication (❌ Expected: Unauthorized)
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "currency": "HTG",
    "method": "STRIPE"
  }'
```

**Expected Response:** 401 Unauthorized

---

### Phase 3: Stripe Payment Processing Tests

#### 3.1 Process Stripe Payment (Requires Stripe Test Keys)
```bash
curl -X POST http://localhost:3000/payments/stripe/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 50.00,
    "currency": "USD",
    "paymentMethodId": "pm_card_visa",
    "description": "Wallet top-up"
  }'
```

**Expected Response:**
```json
{
  "payment": {
    "id": "uuid",
    "amount": 50.00,
    "status": "PENDING",
    ...
  },
  "clientSecret": "pi_xxx_secret_xxx",
  "status": "requires_confirmation"
}
```

#### 3.2 Process Payment with Invalid Payment Method
```bash
curl -X POST http://localhost:3000/payments/stripe/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 50.00,
    "currency": "USD",
    "paymentMethodId": "invalid_pm_id",
    "description": "Test"
  }'
```

**Expected Response:** 400 Bad Request with Stripe error

---

### Phase 4: Payment Retrieval Tests

#### 4.1 Get All Payments (Paginated)
```bash
curl -X GET "http://localhost:3000/payments?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "payments": [...],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### 4.2 Get Payments with Status Filter
```bash
curl -X GET "http://localhost:3000/payments?status=COMPLETED" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4.3 Get Single Payment by ID
```bash
curl -X GET http://localhost:3000/payments/PAYMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:** Payment object with full details

#### 4.4 Get Non-existent Payment (❌ Expected: Not Found)
```bash
curl -X GET http://localhost:3000/payments/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:** 404 Not Found

---

### Phase 5: Payment Analytics Tests

#### 5.1 Get Payment Analytics
```bash
curl -X GET http://localhost:3000/payments/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "totalPayments": 10,
  "successfulPayments": 8,
  "failedPayments": 2,
  "successRate": 80.0,
  "totalVolume": 1500.00
}
```

#### 5.2 Get Analytics with Date Range
```bash
curl -X GET "http://localhost:3000/payments/analytics?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Phase 6: Payment Update Tests

#### 6.1 Update Payment Status
```bash
curl -X PATCH http://localhost:3000/payments/PAYMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "COMPLETED",
    "description": "Updated description"
  }'
```

**Expected Response:** Updated payment object

#### 6.2 Update Another User's Payment (❌ Expected: Forbidden)
```bash
# Login as different user and try to update first user's payment
curl -X PATCH http://localhost:3000/payments/OTHER_USER_PAYMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DIFFERENT_USER_JWT_TOKEN" \
  -d '{
    "status": "COMPLETED"
  }'
```

**Expected Response:** 403 Forbidden

---

### Phase 7: Payment Confirmation Tests

#### 7.1 Confirm Payment
```bash
curl -X POST http://localhost:3000/payments/PAYMENT_ID/confirm \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
- Payment status updated to COMPLETED
- Wallet balance increased
- Transaction record created

#### 7.2 Verify Wallet Balance Updated
```bash
curl -X GET http://localhost:3000/wallets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Verify:** Balance increased by payment amount

#### 7.3 Verify Transaction Created
```bash
curl -X GET http://localhost:3000/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Verify:** New DEPOSIT transaction exists with payment reference

---

### Phase 8: Admin Operations Tests

#### 8.1 Admin Get All Users' Payments
```bash
# Login as admin user
curl -X GET http://localhost:3000/payments \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Expected Response:** All payments from all users

#### 8.2 Admin Get Specific User's Payments
```bash
curl -X GET http://localhost:3000/payments/user/USER_ID \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### 8.3 Admin Delete Payment
```bash
curl -X DELETE http://localhost:3000/payments/PAYMENT_ID \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Expected Response:** 200 OK

#### 8.4 Non-Admin Delete Payment (❌ Expected: Forbidden)
```bash
curl -X DELETE http://localhost:3000/payments/PAYMENT_ID \
  -H "Authorization: Bearer CLIENT_JWT_TOKEN"
```

**Expected Response:** 403 Forbidden

---

### Phase 9: Stripe Webhook Tests

#### 9.1 Simulate Successful Payment Webhook
```bash
# This requires Stripe CLI or webhook testing tool
stripe trigger payment_intent.succeeded
```

**Verify:**
- Payment status updated to COMPLETED
- Wallet balance updated
- Transaction created

#### 9.2 Simulate Failed Payment Webhook
```bash
stripe trigger payment_intent.payment_failed
```

**Verify:**
- Payment status updated to FAILED
- No wallet balance change
- No transaction created

---

### Phase 10: Edge Cases & Error Handling

#### 10.1 Concurrent Payment Processing
Create multiple payments simultaneously and verify:
- No race conditions
- All payments processed correctly
- Wallet balances accurate

#### 10.2 Large Amount Payment
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 999999.99,
    "currency": "HTG",
    "method": "STRIPE"
  }'
```

**Verify:** Handles large decimal values correctly

#### 10.3 Multi-Currency Payments
```bash
# Create payment in USD
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "method": "STRIPE"
  }'

# Create payment in EUR
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.00,
    "currency": "EUR",
    "method": "STRIPE"
  }'
```

**Verify:** Creates separate wallets for each currency

#### 10.4 Rate Limiting Test
Send 20+ requests rapidly:
```bash
for i in {1..20}; do
  curl -X GET http://localhost:3000/payments \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" &
done
```

**Expected:** Some requests throttled (429 Too Many Requests)

---

## Integration Testing

### Test 1: Complete Payment Flow
1. Create user
2. Create payment
3. Process with Stripe
4. Confirm payment
5. Verify wallet balance
6. Verify transaction record
7. Check analytics

### Test 2: Failed Payment Flow
1. Create payment
2. Process with invalid Stripe method
3. Verify payment status = FAILED
4. Verify no wallet update
5. Verify no transaction created

### Test 3: Refund Flow (Future)
1. Create and complete payment
2. Request refund
3. Verify wallet balance decreased
4. Verify refund transaction created

---

## Performance Testing

### Load Test: 100 Concurrent Payments
```bash
# Using Apache Bench or similar tool
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -p payment.json -T application/json \
  http://localhost:3000/payments
```

**Metrics to Monitor:**
- Response time (should be < 500ms)
- Success rate (should be > 99%)
- Database connection pool usage
- Memory usage

---

## Security Testing

### Test 1: SQL Injection
Try injecting SQL in payment description:
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.00,
    "currency": "HTG",
    "method": "STRIPE",
    "description": "Test'; DROP TABLE payments;--"
  }'
```

**Expected:** Input sanitized, no SQL injection

### Test 2: XSS Prevention
Try injecting script in description:
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.00,
    "currency": "HTG",
    "method": "STRIPE",
    "description": "<script>alert('XSS')</script>"
  }'
```

**Expected:** Script tags escaped or removed

### Test 3: JWT Token Expiration
Use an expired token:
```bash
curl -X GET http://localhost:3000/payments \
  -H "Authorization: Bearer EXPIRED_JWT_TOKEN"
```

**Expected:** 401 Unauthorized

---

## Test Results Template

| Test Case | Status | Notes |
|-----------|--------|-------|
| Create Payment | ⬜ | |
| Process Stripe Payment | ⬜ | |
| Get All Payments | ⬜ | |
| Get Single Payment | ⬜ | |
| Update Payment | ⬜ | |
| Confirm Payment | ⬜ | |
| Payment Analytics | ⬜ | |
| Wallet Integration | ⬜ | |
| Transaction Creation | ⬜ | |
| Admin Operations | ⬜ | |
| Stripe Webhooks | ⬜ | |
| Rate Limiting | ⬜ | |
| Error Handling | ⬜ | |
| Security Tests | ⬜ | |

---

## Known Issues & Limitations

1. **Database Connection**: Requires PostgreSQL setup
2. **Stripe Keys**: Requires valid Stripe test keys
3. **Webhook Testing**: Requires Stripe CLI or webhook forwarding
4. **Multi-Currency**: Exchange rates not yet implemented

---

## Next Steps After Testing

1. ✅ Fix any bugs found during testing
2. ✅ Optimize slow queries
3. ✅ Add missing error handling
4. ✅ Implement additional payment methods
5. ✅ Add comprehensive logging
6. ✅ Set up monitoring and alerts
7. ✅ Create API documentation (Swagger/OpenAPI)
8. ✅ Write unit tests
9. ✅ Set up CI/CD pipeline
10. ✅ Deploy to staging environment

---

**Testing Status**: Ready for execution once database is configured
**Last Updated**: December 2024
