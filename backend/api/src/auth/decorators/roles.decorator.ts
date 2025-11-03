import { SetMetadata } from '@nestjs/common';
import { UserRole, KycTier } from '../../types/database.types';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route or controller
 * @param roles - Array of roles that can access the route
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Decorator for admin-only routes
 */
export const AdminOnly = () => Roles(
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER
);

/**
 * Decorator for super admin-only routes
 */
export const SuperAdminOnly = () => Roles(UserRole.SUPER_ADMIN);

/**
 * Decorator for merchant-accessible routes
 */
export const MerchantAccess = () => Roles(
  UserRole.MERCHANT,
  UserRole.AGENT,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN
);

/**
 * Decorator for support and compliance routes
 */
export const SupportAccess = () => Roles(
  UserRole.SUPPORT,
  UserRole.COMPLIANCE,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN
);

/**
 * Decorator to specify minimum KYC tier requirement
 */
export const RequireKycTier = (tier: KycTier) => SetMetadata('minKycTier', tier);

/**
 * Decorator for routes requiring KYC verification
 */
export const RequireKyc = () => SetMetadata('requireKyc', true);

/**
 * Decorator for routes requiring financial access
 */
export const RequireFinancialAccess = () => SetMetadata('requireFinancialAccess', true);

/**
 * Decorator for public routes that don't require authentication
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * Decorator for internal system routes
 */
export const Internal = () => SetMetadata('isInternal', true);

/**
 * Combined decorator for high-security financial operations
 */
export const SecureFinancial = () => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    RequireKyc()(target, propertyKey, descriptor);
    RequireKycTier(KycTier.TIER_2)(target, propertyKey, descriptor);
    RequireFinancialAccess()(target, propertyKey, descriptor);
  };
};

/**
 * Decorator for routes accessible by authenticated users
 */
export const AuthenticatedOnly = () => SetMetadata('requireAuth', true);
