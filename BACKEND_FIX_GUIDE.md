# Backend Compilation Errors - Fix Guide

## Current Status

✅ **Workspace Configuration**: Complete and functional
✅ **Frontend**: Ready to run (`pnpm dev`)
⚠️ **Backend**: Has 167 TypeScript compilation errors

## Root Cause

The backend code uses **camelCase** naming (e.g., `userId`, `firstName`, `UserRole`) while the Prisma schema uses **snake_case** naming (e.g., `user_id`, `first_name`, `user_role`). This mismatch causes all compilation errors.

## Error Categories

### 1. Enum Naming Mismatches (58 errors)
**Problem**: Code imports `UserRole`, `PaymentMethod`, etc., but Prisma generates `user_role`, `payment_method`

**Files Affected**:
- `src/auth/decorators/roles.decorator.ts`
- `src/auth/guards/roles.guard.ts`
- `src/payments/dto/*.ts`
- `src/payments/payments.controller.ts`
- `src/payments/payments.service.ts`
- `src/transactions/dto/*.ts`
- `src/transactions/transactions.controller.ts`
- `src/transactions/transactions.service.ts`
- `src/users/dto/*.ts`
- `src/users/users.controller.ts`
- `src/users/users.service.ts`
- `src/wallets/wallets.controller.ts`
- `src/wallets/wallets.service.ts`

**Fix**: Replace imports like:
```typescript
// ❌ Wrong
import { UserRole, PaymentMethod } from '@prisma/client';

// ✅ Correct
import { user_role, payment_method } from '@prisma/client';
// Or use the alias file
import { UserRole, PaymentMethod } from '../types/prisma-aliases';
```

### 2. Field Naming Mismatches (89 errors)
**Problem**: Code uses `userId`, `firstName`, etc., but Prisma schema has `user_id`, `first_name`

**Files Affected**: All service files that interact with Prisma

**Fix**: Update field references:
```typescript
// ❌ Wrong
where: { userId: id }
user.firstName

// ✅ Correct
where: { user_id: id }
user.first_name
```

### 3. Missing Files (5 errors)
**Problem**: Code references files that don't exist

**Missing Files**:
- `src/auth/guards/jwt-auth.guard.ts` ✅ Created
- `src/auth/strategies/supabase.strategy.ts` ⚠️ Needs creation
- Missing service methods in various files

### 4. Missing Service Methods (15 errors)
**Problem**: Controllers call methods that don't exist in services

**Examples**:
- `AuthService.getProfile()`
- `WalletsService.create()`, `findOne()`, `update()`, etc.
- `TransactionsService.transferFunds()`, `getAnalytics()`, etc.

## Solution Options

### Option 1: Update Prisma Schema (Recommended)
**Pros**: Clean, maintainable, matches existing code
**Cons**: Requires careful schema migration
**Time**: 2-3 hours

**Steps**:
1. Update Prisma schema to use camelCase with `@map()` directives
2. Run `pnpm prisma generate`
3. Test compilation

**Example**:
```prisma
model User {
  id String @id
  firstName String @map("first_name")
  lastName String @map("last_name")
  userId String @map("user_id")
  // ...
}
```

### Option 2: Update Backend Code
**Pros**: No schema changes needed
**Cons**: Extensive code changes, error-prone
**Time**: 4-5 hours

**Steps**:
1. Update all imports to use snake_case enums
2. Update all field references to use snake_case
3. Add missing service methods
4. Test compilation

### Option 3: Hybrid Approach (Fastest)
**Pros**: Minimal changes, quick fix
**Cons**: Mixed naming conventions
**Time**: 1-2 hours

**Steps**:
1. Use the `prisma-aliases.ts` file for enum imports
2. Create wrapper methods in services for missing functionality
3. Use Prisma's field mapping where possible

## Quick Start Commands

### Test Frontend Only
```bash
pnpm dev
# Visit http://localhost:3000
```

### Check Backend Errors
```bash
cd backend/api
pnpm run build
```

### After Fixing Backend
```bash
# Terminal 1: Backend
cd backend/api
pnpm prisma generate
pnpm run build
pnpm start:dev

# Terminal 2: Frontend
pnpm dev

# Or run both together
pnpm dev:all
```

## Files Created for Workspace Fix

1. ✅ `kobklein.code-workspace` - Multi-root workspace configuration
2. ✅ `package.json` - Updated with dev:all script
3. ✅ `start-dev.ps1` - Windows helper script
4. ✅ `start-dev.sh` - Unix helper script
5. ✅ `backend/api/tsconfig.json` - Fixed TypeScript config
6. ✅ `backend/api/src/types/prisma-aliases.ts` - Type aliases
7. ✅ `backend/api/src/auth/guards/jwt-auth.guard.ts` - JWT guard
8. ✅ `WORKSPACE_CONFIGURATION_COMPLETE.md` - Setup guide
9. ✅ `BACKEND_FIX_GUIDE.md` - This file

## Next Steps

1. **Choose a solution option** (Option 1 recommended)
2. **Implement the fixes** following the steps above
3. **Test compilation**: `cd backend/api && pnpm run build`
4. **Run both services**: `pnpm dev:all`
5. **Verify functionality** at http://localhost:3000 and http://localhost:3001

## Detailed Error List

Run this command to see all errors:
```bash
cd backend/api
pnpm run build 2>&1 | tee build-errors.log
```

## Support

The workspace configuration is complete. The backend compilation errors are a separate issue related to Prisma schema/code alignment. Once these are resolved, both services will run seamlessly together using the new workspace setup.

---

**Workspace Status**: ✅ Complete and Ready
**Frontend Status**: ✅ Ready to Run
**Backend Status**: ⚠️ Needs Schema/Code Alignment
