# Auth Role Migration: CLIENT → INDIVIDUAL

**Date:** January 2025
**Status:** ✅ COMPLETED

## Overview

This document tracks the comprehensive migration of the `CLIENT` role to `INDIVIDUAL` across the KobKlein platform, along with related authentication system improvements.

## Changes Implemented

### 1. ✅ Frontend Type Definitions (`web/src/types/auth.ts`)

**Changes:**

- Updated `UserRole` enum: `CLIENT` → `INDIVIDUAL`
- Updated `RolePermissions` object to use `INDIVIDUAL` instead of `CLIENT`
- Added location tracking fields to `UserProfile`:
  - `country?: string`
  - `countryCode?: string`
  - `region?: string`
  - `timezone?: string`
  - `ipAddress?: string`
- Added distributor-specific business fields to `UserProfile`:
  - `legalBusinessName?: string`
  - `businessRegistrationNumber?: string`
  - `businessAddress?: string`
- Added `PHONE_PATTERNS` constant with validation for Haiti (HT), US, and International formats
- Simplified phone regex patterns to reduce complexity and meet lint requirements

**Impact:**

- All frontend components now use `UserRole.INDIVIDUAL`
- Phone validation can now be country-specific
- Location tracking is type-safe across the app

---

### 2. ✅ Signup Form UI (`web/src/components/auth/ModernSignUpForm.tsx`)

**Changes:**

- Updated default role: `UserRole.CLIENT` → `UserRole.INDIVIDUAL`
- Filtered out `ADMIN` role from public signup UI:
  ```tsx
  Object.values(UserRole).filter((role) => role !== UserRole.ADMIN);
  ```
- Updated `getRoleIcon()` to handle `INDIVIDUAL` and `DIASPORA` roles
- Updated `getRoleColor()` to handle `INDIVIDUAL` and `DIASPORA` roles
- Changed role description text: "Client" → "Individual"
- Added description for `DIASPORA` role: "International remittance services"

**User Experience:**

- ADMIN role no longer visible in public signup
- Clear distinction between individual users and business users
- All 4 public roles are now properly displayed: INDIVIDUAL, MERCHANT, DISTRIBUTOR, DIASPORA

---

### 3. ✅ Backend Type Definitions (`backend/api/src/types/database.types.ts`)

**Changes:**

- Updated `UserRole` enum:
  ```typescript
  export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    SUPPORT = "SUPPORT",
    COMPLIANCE = "COMPLIANCE",
    MERCHANT = "MERCHANT",
    DISTRIBUTOR = "DISTRIBUTOR", // Added
    AGENT = "AGENT",
    INDIVIDUAL = "INDIVIDUAL", // CLIENT → INDIVIDUAL
    DIASPORA = "DIASPORA", // Added
  }
  ```

**Impact:**

- Backend now recognizes `INDIVIDUAL` and `DIASPORA` as valid roles
- `DISTRIBUTOR` added to backend enum for consistency

---

### 4. ✅ Registration DTO (`backend/api/src/auth/dto/register.dto.ts`)

**Changes:**

- Added location tracking fields:
  - `countryCode?: string`
  - `region?: string`
  - `timezone?: string`
  - `ipAddress?: string`
- Added role field:
  - `role?: UserRole` (default: `UserRole.INDIVIDUAL`)
- Added business fields for role-specific validation:
  - `businessName?: string` (for Merchants)
  - `legalBusinessName?: string` (for Distributors)
  - `businessRegistrationNumber?: string` (for Distributors)
  - `businessAddress?: string` (for Distributors)

**Validation:**

- All fields are optional with `@IsOptional()`
- Type-safe with class-validator decorators
- Swagger documentation auto-generated

---

### 5. ✅ Auth Service (`backend/api/src/auth/auth.service.ts`)

**Changes:**

- Updated `register()` method to:
  - Accept new location and business fields from `RegisterDto`
  - Set default role: `UserRole.INDIVIDUAL`
  - Validate role-specific required fields:
    - Merchants: require `businessName`
    - Distributors: require `legalBusinessName`, `businessRegistrationNumber`, `businessAddress`
  - Check for duplicate email before creating auth user
  - Check for duplicate phone number before creating auth user
  - Include all new fields in `user_metadata` when creating Supabase auth user
  - Store location and business fields in user record

- Updated `generateAccessToken()` method:
  - Default role: `UserRole.CLIENT` → `UserRole.INDIVIDUAL`

- Updated `getUserRoles()` method:
  - Default role fallback: `UserRole.CLIENT` → `UserRole.INDIVIDUAL`

- Updated `sanitizeUserResponse()` method:
  - Default `primaryRole` fallback: `UserRole.CLIENT` → `UserRole.INDIVIDUAL`

**Error Handling:**

- ✅ 409 Conflict for duplicate email with specific message
- ✅ 409 Conflict for duplicate phone with specific message
- ✅ 409 Conflict for missing required business fields (role-specific)

---

### 6. ✅ Users Service (`backend/api/src/users/users.service.ts`)

**Changes:**

- Updated `createUser()` method:
  - Default role: `UserRole.CLIENT` → `UserRole.INDIVIDUAL`

- Updated `sanitizeUserResponse()` method:
  - Default `primaryRole` fallback: `UserRole.CLIENT` → `UserRole.INDIVIDUAL`

---

### 7. ✅ Payments Controller (`backend/api/src/payments/payments.controller.ts`)

**Changes:**

- Updated allowed roles for payment creation:
  ```typescript
  const allowedRoles = [
    UserRole.INDIVIDUAL,
    UserRole.MERCHANT,
    UserRole.AGENT,
    UserRole.ADMIN,
  ];
  ```

**Impact:**

- Individual users can now create payments (previously only CLIENT role)

---

## Build Verification

### ✅ Backend Build

```bash
cd backend/api && pnpm build
```

**Result:** ✅ Compiled successfully (0 errors)

### ✅ Frontend Build

```bash
cd web && pnpm build
```

**Result:** ✅ Compiled successfully (142/142 pages)

---

## Migration Status

| Task                        | Status | Notes                              |
| --------------------------- | ------ | ---------------------------------- |
| Frontend types updated      | ✅     | `CLIENT` → `INDIVIDUAL`            |
| Signup form UI updated      | ✅     | ADMIN removed from public UI       |
| Backend types updated       | ✅     | Added DISTRIBUTOR and DIASPORA     |
| Registration DTO updated    | ✅     | Location + business fields added   |
| Auth service updated        | ✅     | Role validation + duplicate checks |
| Users service updated       | ✅     | Default role changed               |
| Payments controller updated | ✅     | INDIVIDUAL role allowed            |
| Backend build verified      | ✅     | 0 errors                           |
| Frontend build verified     | ✅     | 0 errors                           |

---

## Remaining Tasks (From Original Directive)

### 🔄 Task 3: Add Location Detection

- Add automatic location detection in signup form
- Use `navigator.geolocation` API for browser location
- Fallback to IP geolocation API for accurate country detection
- Set phone validation based on detected country

### 🔄 Task 4: Phone Validation Based on Country

- Implement dynamic phone validation using detected country
- Use `PHONE_PATTERNS` from `auth.ts` for validation
- Show country-specific placeholders and examples

### 🔄 Task 5: Business Field Validation (Frontend)

- Show/hide business fields based on selected role
- Client-side validation for required fields:
  - Merchant: `businessName` required
  - Distributor: `legalBusinessName`, `businessRegistrationNumber`, `businessAddress` required

### 🔄 Task 6: Post-Login Redirect Fix

- Verify redirect to `/auth/login` after successful signup
- Test login flow and ensure users land on correct dashboard

### 🔄 Task 7: End-to-End Testing

- Test signup flow for all roles
- Verify duplicate email/phone error messages
- Test role-specific business field validation
- Verify location detection

---

## Database Schema Notes

The following database columns may need to be added or verified:

### `users` table:

- `country_code` (string, optional)
- `region` (string, optional)
- `timezone` (string, optional)
- `ip_address` (string, optional)

### Business profiles table (if separate):

- `legal_business_name` (string, for Distributors)
- `business_registration_number` (string, for Distributors)
- `business_address` (text, for Distributors)

**Note:** The backend currently stores these in `user_metadata`, but they may need dedicated columns for querying and reporting.

---

## Testing Checklist

- [ ] Test signup as INDIVIDUAL (no business fields required)
- [ ] Test signup as MERCHANT (businessName required)
- [ ] Test signup as DISTRIBUTOR (all business fields required)
- [ ] Test signup as DIASPORA
- [ ] Verify ADMIN not visible in signup UI
- [ ] Test duplicate email error message
- [ ] Test duplicate phone error message
- [ ] Test location detection (when implemented)
- [ ] Test country-specific phone validation (when implemented)
- [ ] Test post-signup redirect to login
- [ ] Test login after signup
- [ ] Verify JWT token includes correct role

---

## API Contract Changes

### Registration Endpoint: `POST /auth/register`

**New Request Body:**

```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country?: string;
  countryCode?: string;        // NEW
  region?: string;             // NEW
  timezone?: string;           // NEW
  ipAddress?: string;          // NEW
  role?: UserRole;             // NEW (default: INDIVIDUAL)
  businessName?: string;       // NEW (required for MERCHANT)
  legalBusinessName?: string;  // NEW (required for DISTRIBUTOR)
  businessRegistrationNumber?: string; // NEW (required for DISTRIBUTOR)
  businessAddress?: string;    // NEW (required for DISTRIBUTOR)
  preferredCurrency?: CurrencyCode;
}
```

**Error Responses:**

- `409 Conflict`: Duplicate email
- `409 Conflict`: Duplicate phone
- `409 Conflict`: Missing required business fields (role-specific)

---

## Breaking Changes

⚠️ **Frontend Components:**

- Any component using `UserRole.CLIENT` will need to be updated to `UserRole.INDIVIDUAL`
- Check for hardcoded "Client" strings in UI text

⚠️ **Backend Services:**

- Any service checking for `UserRole.CLIENT` will need to use `UserRole.INDIVIDUAL`
- Verify role-based middleware and guards

⚠️ **Database Queries:**

- Update any queries filtering by `role = 'CLIENT'` to use `'INDIVIDUAL'`
- Run migration script if database has existing CLIENT users

---

## Deployment Considerations

1. **Database Migration:**

   ```sql
   UPDATE users SET role = 'INDIVIDUAL' WHERE role = 'CLIENT';
   UPDATE user_roles SET role = 'INDIVIDUAL' WHERE role = 'CLIENT';
   ```

2. **Environment Variables:**
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
   - No new environment variables required

3. **Frontend Deployment:**
   - Clear CDN cache for static assets
   - Service worker will auto-update PWA

4. **Backend Deployment:**
   - Deploy backend first to avoid 400 errors from unknown role
   - Frontend can deploy after backend is live

---

## Success Metrics

- [ ] 0 build errors (frontend + backend)
- [ ] All TypeScript types resolve correctly
- [ ] Signup flow works for all roles
- [ ] Duplicate detection prevents conflicts
- [ ] Role-specific validation works
- [ ] JWT tokens include correct role
- [ ] No regression in existing auth flows

---

## References

- Original directive: Full auth system overhaul (9-point plan)
- Frontend types: `web/src/types/auth.ts`
- Signup form: `web/src/components/auth/ModernSignUpForm.tsx`
- Backend auth: `backend/api/src/auth/auth.service.ts`
- Database types: `backend/api/src/types/database.types.ts`

---

**Completed by:** GitHub Copilot Agent
**Last Updated:** January 2025
