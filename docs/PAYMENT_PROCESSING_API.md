# Enhanced Payment Processing System - API Documentation

## 🚀 Overview

The KobKlein Enhanced Payment Processing System provides comprehensive payment handling for the Haitian diaspora and local markets. This system supports multiple payment methods, processors, and includes advanced features like fraud detection, webhook handling, and comprehensive analytics.

## 🏗 Architecture

### Core Components

- **PaymentsService**: Core business logic with Supabase integration
- **PaymentsController**: RESTful API endpoints with RBAC security  
- **Payment Processors**: Multi-processor support (Stripe, PayPal, Mobile Money)
- **Webhook System**: Real-time payment status updates
- **Fraud Detection**: Risk assessment and prevention
- **Audit System**: Complete payment trail logging

### Database Schema

The system uses enhanced PostgreSQL tables via Supabase:

- `payments`: Core payment records
- `payment_webhooks`: Webhook event logs  
- `payment_audit`: Complete audit trail
- `fraud_checks`: Fraud detection records

## 📊 Payment Methods & Processors

### Supported Payment Methods

#### Haiti (HT)
- **Digicel Money** (`DIGICEL_MONEY`) → Digicel Processor
- **Natcom Money** (`NATCOM_MONEY`) → Natcom Processor  
- **MonCash** (`MONCASH`) → MonCash Processor
- **Bank Transfer** (`BANK_TRANSFER`) → Bank Transfer Processor
- **Credit/Debit Cards** (`CREDIT_CARD`, `DEBIT_CARD`) → Stripe
- **Cash** (`CASH`) → Internal Processing

#### United States (US)
- **Credit/Debit Cards** → Stripe
- **Bank Transfer** (`BANK_TRANSFER`) → Stripe/Bank Processor
- **ACH Transfer** (`ACH_TRANSFER`) → Bank Processor
- **PayPal** (`PAYPAL`) → PayPal Processor
- **Apple Pay** (`APPLE_PAY`) → Stripe
- **Google Pay** (`GOOGLE_PAY`) → Stripe

#### Canada (CA)  
- **Credit/Debit Cards** → Stripe
- **Bank Transfer** → Stripe/Bank Processor
- **PayPal** → PayPal Processor

## 🔐 Security & Authentication

### Role-Based Access Control

#### Payment Creation
- **Allowed Roles**: `CLIENT`, `MERCHANT`, `AGENT`, `ADMIN`
- **Restrictions**: Users can only create payments for themselves

#### Payment Management  
- **View Own Payments**: All authenticated users
- **View All Payments**: `SUPER_ADMIN`, `ADMIN`, `MANAGER`
- **Update Payment Status**: `SUPER_ADMIN`, `ADMIN`, `MANAGER`
- **Access Analytics**: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `COMPLIANCE`

### Security Features

- **Fraud Detection**: Real-time risk assessment
- **Webhook Validation**: Signature verification for all processors
- **Audit Logging**: Complete trail of all payment actions
- **Data Encryption**: Sensitive payment data encrypted at rest
- **IP/User-Agent Tracking**: Enhanced security monitoring

## 📡 API Endpoints

### Base URL
```
/api/payments
```

### Core Endpoints

#### 1. Create Payment
```http
POST /payments/create
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "amount": 1000.00,
  "currency": "HTG",
  "paymentMethod": "DIGICEL_MONEY",
  "processor": "DIGICEL",
  "description": "Mobile top-up payment",
  "merchantReference": "ORDER-123",
  "returnUrl": "https://app.kobklein.com/payments/success",
  "cancelUrl": "https://app.kobklein.com/payments/cancel",
  "metadata": {
    "orderId": "ORDER-123",
    "productType": "mobile_credit"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pay_abc123",
    "userId": "user_456", 
    "processor": "DIGICEL",
    "amount": 1000.00,
    "currency": "HTG",
    "status": "INITIATED",
    "paymentMethod": "DIGICEL_MONEY",
    "referenceId": "PAY-1698765432-A1B2C3",
    "fraudScore": 15,
    "riskLevel": "LOW",
    "expiresAt": "2025-11-01T15:30:00Z",
    "createdAt": "2025-11-01T15:00:00Z"
  },
  "message": "Payment created successfully"
}
```

#### 2. Search Payments
```http
GET /payments/search?userId=user_456&status=COMPLETED&page=1&limit=20
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pay_abc123",
      "userId": "user_456",
      "processor": "STRIPE",
      "amount": 500.00,
      "currency": "USD", 
      "status": "COMPLETED",
      "paymentMethod": "CREDIT_CARD",
      "referenceId": "PAY-1698765432-A1B2C3",
      "completedAt": "2025-11-01T14:45:00Z",
      "createdAt": "2025-11-01T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "total": 97
  }
}
```

#### 3. Payment Analytics
```http
GET /payments/analytics?startDate=2025-10-01&endDate=2025-11-01&groupBy=day
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAmount": 125000.00,
    "totalCount": 342,
    "successRate": 96.5,
    "averageAmount": 365.50,
    "byStatus": {
      "COMPLETED": { "count": 330, "amount": 120750.00 },
      "FAILED": { "count": 12, "amount": 4250.00 }
    },
    "byMethod": {
      "CREDIT_CARD": { "count": 180, "amount": 85000.00 },
      "DIGICEL_MONEY": { "count": 120, "amount": 35000.00 },
      "PAYPAL": { "count": 42, "amount": 5000.00 }
    },
    "fraudStats": {
      "totalChecked": 342,
      "blocked": 5,
      "riskDistribution": {
        "LOW": 320,
        "MEDIUM": 17,
        "HIGH": 5,
        "CRITICAL": 0
      }
    }
  }
}
```

#### 4. Webhook Handler
```http
POST /payments/webhook/stripe
Content-Type: application/json
Stripe-Signature: t=1635724800,v1=abc123...

{
  "id": "evt_1ABC123",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1ABC123",
      "status": "succeeded",
      "amount": 2000,
      "currency": "usd"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

#### 5. Get Payment Details
```http
GET /payments/pay_abc123
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pay_abc123",
    "userId": "user_456",
    "processor": "STRIPE",
    "processorPaymentId": "pi_1ABC123",
    "amount": 1000.00,
    "currency": "USD",
    "status": "COMPLETED",
    "paymentMethod": "CREDIT_CARD",
    "description": "Mobile top-up payment",
    "referenceId": "PAY-1698765432-A1B2C3",
    "fraudScore": 25,
    "riskLevel": "LOW",
    "completedAt": "2025-11-01T14:45:00Z",
    "processorResponse": {
      "stripe_payment_intent": "pi_1ABC123",
      "last4": "4242",
      "brand": "visa"
    },
    "metadata": {
      "orderId": "ORDER-123",
      "productType": "mobile_credit"
    },
    "createdAt": "2025-11-01T14:30:00Z",
    "updatedAt": "2025-11-01T14:45:00Z"
  }
}
```

#### 6. Update Payment Status (Admin Only)
```http
PATCH /payments/pay_abc123/status
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "status": "FAILED",
  "reason": "Insufficient funds in source account"
}
```

#### 7. Available Payment Methods
```http
GET /payments/methods/available
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "country": "HT",
    "methods": [
      "DIGICEL_MONEY",
      "NATCOM_MONEY", 
      "MONCASH",
      "BANK_TRANSFER",
      "CREDIT_CARD",
      "DEBIT_CARD",
      "CASH"
    ],
    "processors": [
      "STRIPE",
      "PAYPAL", 
      "DIGICEL",
      "NATCOM",
      "MONCASH",
      "BANK_TRANSFER",
      "INTERNAL"
    ]
  }
}
```

#### 8. User Payment History
```http
GET /payments/user/history?page=1&limit=10&status=COMPLETED
Authorization: Bearer {jwt_token}
```

## 🔄 Payment Status Flow

### Status Transitions

```
INITIATED → PENDING → PROCESSING → AUTHORIZED → CAPTURED → COMPLETED
                                              ↓
                                           FAILED
```

### Status Descriptions

- **INITIATED**: Payment record created, awaiting processor
- **PENDING**: Submitted to payment processor
- **PROCESSING**: Processor is handling the payment
- **AUTHORIZED**: Payment authorized but not yet captured
- **CAPTURED**: Funds captured from payment method
- **COMPLETED**: Payment successfully completed
- **FAILED**: Payment failed at any stage
- **CANCELLED**: Payment cancelled by user or system
- **EXPIRED**: Payment expired before completion
- **REFUNDED**: Payment was refunded
- **DISPUTED**: Payment is under dispute/chargeback

## 🛡 Fraud Detection

### Risk Assessment Factors

1. **Transaction Amount**: Large amounts increase risk score
2. **Payment Method**: Some methods have higher risk profiles  
3. **User History**: Previous payment patterns
4. **Geographic**: Unusual location patterns
5. **Device**: Device fingerprinting
6. **Velocity**: High-frequency transactions

### Risk Levels

- **LOW** (0-29): Normal processing
- **MEDIUM** (30-49): Additional verification may be required  
- **HIGH** (50-69): Manual review required
- **CRITICAL** (70+): Automatic blocking

### Fraud Prevention Actions

- Risk scoring on all payments
- Automatic blocking of critical risk payments
- Manual review workflows for high-risk transactions
- Real-time fraud rule evaluation
- Machine learning enhancement (future)

## 🔌 Webhook Integration

### Supported Processors

#### Stripe
```http
POST /payments/webhook/stripe
Stripe-Signature: t=timestamp,v1=signature
```

**Events Handled:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`  
- `payment_intent.canceled`
- `charge.dispute.created`

#### PayPal
```http
POST /payments/webhook/paypal  
PayPal-Transmission-Sig: signature
```

**Events Handled:**
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.DENIED`
- `PAYMENT.CAPTURE.REFUNDED`

### Webhook Security

- Signature verification for all processors
- Idempotency handling to prevent duplicate processing
- Retry mechanism with exponential backoff
- Complete audit logging of all webhook events

## 📈 Analytics & Reporting

### Available Metrics

- **Transaction Volume**: Total amounts by period
- **Success Rates**: Completion rates by method/processor
- **Payment Methods**: Distribution and performance
- **Fraud Statistics**: Risk levels and blocked transactions
- **Geographic Distribution**: Payments by region
- **Time Series Data**: Trends over time

### Analytics Endpoints

- `/payments/analytics` - Comprehensive analytics
- `/payments/analytics?groupBy=day` - Daily breakdown
- `/payments/analytics?processor=STRIPE` - Processor-specific
- `/payments/analytics?paymentMethod=CREDIT_CARD` - Method-specific

## 🚨 Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "PAYMENT_FAILED",
  "message": "Payment could not be processed",
  "details": {
    "code": "INSUFFICIENT_FUNDS",
    "processor": "STRIPE",
    "processorMessage": "Your card was declined."
  },
  "timestamp": "2025-11-01T15:00:00Z"
}
```

### Common Error Codes

- `PAYMENT_FAILED` - General payment failure
- `INSUFFICIENT_FUNDS` - Not enough balance/credit
- `CARD_DECLINED` - Card payment declined
- `EXPIRED_PAYMENT_METHOD` - Payment method expired
- `FRAUD_DETECTED` - Blocked by fraud detection
- `PROCESSOR_ERROR` - External processor error
- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication/authorization error
- `NOT_FOUND` - Payment not found
- `RATE_LIMIT_EXCEEDED` - Too many requests

## 🧪 Testing

### Test Payment Methods

#### Stripe Test Cards
```
Success: 4242424242424242
Decline: 4000000000000002  
Insufficient Funds: 4000000000009995
```

#### Test Webhooks
Use processor-provided webhook testing tools to simulate events.

### Test Environment

- All test payments use sandbox/test mode processors
- No real money is processed in test environment
- Test data is clearly marked in all responses

## 🔧 Configuration

### Environment Variables

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Stripe Configuration  
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_WEBHOOK_ID=your_webhook_id

# Mobile Money Configuration (Haiti)
DIGICEL_API_URL=https://api.digicelgroup.com
DIGICEL_API_KEY=your_digicel_key
NATCOM_API_URL=https://api.natcom.ht  
NATCOM_API_KEY=your_natcom_key
```

## 📚 Integration Examples

### Frontend Integration (React/TypeScript)

```typescript
// Create Payment
const createPayment = async (paymentData: CreatePaymentRequest) => {
  const response = await fetch('/api/payments/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify(paymentData)
  });
  
  const result = await response.json();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.message);
};

// Monitor Payment Status
const monitorPayment = (paymentId: string) => {
  const interval = setInterval(async () => {
    const payment = await getPayment(paymentId);
    
    if (payment.status === 'COMPLETED') {
      clearInterval(interval);
      handlePaymentSuccess(payment);
    } else if (payment.status === 'FAILED') {
      clearInterval(interval);  
      handlePaymentFailure(payment);
    }
  }, 2000);
};
```

### Mobile Integration (React Native)

```javascript
// Digicel Money Integration
const processDigicelPayment = async (amount, phone) => {
  try {
    const payment = await createPayment({
      amount,
      currency: 'HTG',
      paymentMethod: 'DIGICEL_MONEY',
      processor: 'DIGICEL',
      metadata: {
        phoneNumber: phone,
        channel: 'mobile_app'
      }
    });
    
    // Redirect to Digicel payment flow
    openDigicelPayment(payment.processorResponse.redirectUrl);
  } catch (error) {
    handlePaymentError(error);
  }
};
```

## 🔮 Future Enhancements

### Planned Features

1. **Advanced Fraud Detection**: Machine learning models
2. **Cryptocurrency Support**: Bitcoin, Ethereum integration
3. **Recurring Payments**: Subscription billing support
4. **Multi-party Payments**: Split payments between parties
5. **Advanced Analytics**: Real-time dashboards
6. **Mobile SDKs**: Native mobile payment libraries
7. **White-label Solutions**: Partner integration APIs

### Roadmap

- **Phase 1**: Core payment processing (✅ Completed)
- **Phase 2**: Advanced fraud detection (Q1 2026)
- **Phase 3**: Cryptocurrency integration (Q2 2026) 
- **Phase 4**: Recurring payments (Q3 2026)
- **Phase 5**: AI-powered analytics (Q4 2026)

---

## 📞 Support

For technical support and integration assistance:

- **Documentation**: [https://docs.kobklein.com/payments](https://docs.kobklein.com/payments)
- **API Support**: api-support@kobklein.com
- **Developer Portal**: [https://developers.kobklein.com](https://developers.kobklein.com)
- **Status Page**: [https://status.kobklein.com](https://status.kobklein.com)

---

**KobKlein Enhanced Payment Processing System v2.0**  
*Empowering financial inclusion for Haiti and the diaspora community*