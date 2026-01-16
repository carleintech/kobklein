# KobKlein Backend Architecture

## 📁 Professional Folder Structure

This backend follows fintech industry best practices with a modular, scalable architecture.

```
backend/api/
├── src/
│   ├── modules/              # Feature modules (domain-driven)
│   │   ├── auth/            # Authentication & authorization
│   │   ├── users/           # User management
│   │   ├── wallets/         # Digital wallet operations
│   │   ├── ledger/          # Double-entry bookkeeping ledger
│   │   ├── payments/        # Payment processing
│   │   ├── advanced-payments/  # QR, NFC, payment requests
│   │   ├── transactions/    # Transaction history & analytics
│   │   ├── merchants/       # Merchant account management
│   │   ├── distributors/    # Distributor network & commissions
│   │   ├── compliance/      # KYC/AML & fraud detection
│   │   ├── notifications/   # Push & email notifications
│   │   ├── email/           # Email service integration
│   │   └── admin/           # Admin panel operations
│   │
│   ├── lib/                 # Shared libraries & utilities
│   │   ├── supabase.ts     # Supabase client configuration
│   │   ├── crypto.ts       # Encryption & security utilities
│   │   ├── audit.ts        # Audit logging
│   │   └── risk.ts         # Risk scoring & fraud detection
│   │
│   ├── routes/              # API route definitions
│   │   └── index.ts        # Main router
│   │
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper functions
│   ├── prisma/              # Prisma ORM configuration
│   ├── app.module.ts        # Main NestJS module
│   └── main.ts              # Application entry point
│
├── db/                      # Database management
│   ├── migrations/          # SQL migration scripts
│   ├── policies/            # Supabase RLS policies
│   └── seeds/               # Test & initial data
│
├── test/                    # Integration & unit tests
├── dist/                    # Compiled TypeScript output
├── prisma/                  # Prisma schema & migrations
└── supabase/               # Supabase Edge Functions

```

## 🏗️ Architecture Principles

### 1. **Modular Design**
Each module is self-contained with:
- Controllers (API endpoints)
- Services (business logic)
- DTOs (Data Transfer Objects)
- Entities (database models)
- Tests

### 2. **Separation of Concerns**
- **Modules**: Feature-specific code
- **Lib**: Shared utilities & libraries
- **Routes**: API routing configuration
- **DB**: Database schemas & migrations

### 3. **Security-First**
- Row-Level Security (RLS) policies in `db/policies/`
- Encryption utilities in `lib/crypto.ts`
- Audit logging in `lib/audit.ts`
- Risk scoring in `lib/risk.ts`

### 4. **Scalability**
- Domain-driven design (DDD)
- Microservices-ready architecture
- Event-driven patterns
- Horizontal scaling support

## 📦 Module Structure

Each module follows this standard structure:

```
module-name/
├── module-name.controller.ts    # API endpoints
├── module-name.service.ts       # Business logic
├── module-name.module.ts        # NestJS module definition
├── dto/                         # Data Transfer Objects
│   ├── create-xxx.dto.ts
│   ├── update-xxx.dto.ts
│   └── xxx-response.dto.ts
├── entities/                    # Database entities
│   └── xxx.entity.ts
└── tests/                       # Unit tests
    ├── module-name.controller.spec.ts
    └── module-name.service.spec.ts
```

## 🗄️ Database Management

### Migrations (`db/migrations/`)
SQL scripts for database schema changes. Named with timestamps:
- `20240115_create_payment_table.sql`
- `20240115_add_transaction_index.sql`

### Policies (`db/policies/`)
Supabase Row-Level Security policies:
- `wallets_rls_policy.sql`
- `transactions_rls_policy.sql`

### Seeds (`db/seeds/`)
Initial data for development:
- `test_users.sql`
- `demo_transactions.sql`

## 🔐 Security Architecture

### Authentication Flow
1. User signs in via Supabase Auth
2. JWT token issued
3. Token validated on each request
4. RLS policies enforce data access

### Authorization Levels
- **Individual**: Basic wallet operations
- **Merchant**: Accept payments, POS access
- **Distributor**: Card issuance, commissions
- **Diaspora**: International remittances
- **Admin**: System-wide access

## 🚀 Development Workflow

### 1. Create New Module
```bash
cd src/modules
nest generate module module-name
nest generate service module-name
nest generate controller module-name
```

### 2. Add Database Migration
```bash
# Create migration file in db/migrations/
touch db/migrations/$(date +%Y%m%d)_description.sql
```

### 3. Add RLS Policy
```bash
# Create policy file in db/policies/
touch db/policies/table_name_rls.sql
```

### 4. Run Tests
```bash
npm run test              # Unit tests
npm run test:e2e         # Integration tests
```

## 📊 API Structure

All APIs follow RESTful conventions:

```
/api/v1/
├── /auth               # Authentication endpoints
├── /users              # User management
├── /wallets            # Wallet operations
├── /payments           # Payment processing
├── /transactions       # Transaction history
├── /merchants          # Merchant operations
├── /distributors       # Distributor management
└── /admin              # Admin operations
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: Postgres connection string
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `JWT_SECRET`: JWT signing secret
- `ENCRYPTION_KEY`: Data encryption key

### NestJS Configuration
- Port: `3002`
- CORS: Enabled for development
- Rate limiting: Configured per endpoint
- Logging: Winston + Morgan

## 📈 Performance Optimization

### Caching Strategy
- Redis for session storage
- Query result caching
- CDN for static assets

### Database Optimization
- Indexes on frequently queried fields
- Connection pooling
- Query optimization with EXPLAIN ANALYZE

### API Optimization
- Response compression
- Pagination for large datasets
- Lazy loading for related entities

## 🧪 Testing Strategy

### Unit Tests
- Service logic testing
- Mock external dependencies
- Coverage target: 80%+

### Integration Tests
- API endpoint testing
- Database integration
- End-to-end workflows

### Load Testing
- Stress testing with Artillery
- Performance benchmarking
- Scalability validation

## 📝 Best Practices

1. **Code Organization**
   - One feature = one module
   - Keep modules focused and cohesive
   - Share code via `lib/` directory

2. **Error Handling**
   - Use custom exception filters
   - Return consistent error responses
   - Log all errors with context

3. **Documentation**
   - Document all public APIs
   - Keep README files updated
   - Use JSDoc for complex functions

4. **Version Control**
   - Feature branch workflow
   - Descriptive commit messages
   - Pull request reviews

## 🔄 Migration Path

If upgrading from old structure:

1. Move feature code to `modules/`
2. Extract shared code to `lib/`
3. Move SQL files to `db/`
4. Update import paths
5. Run tests to verify

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Last Updated**: January 15, 2026  
**Architecture Version**: 2.0  
**Maintained by**: KobKlein Engineering Team
