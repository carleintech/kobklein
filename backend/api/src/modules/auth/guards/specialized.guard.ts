import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole, UserStatus, KycStatus, KycTier } from '../../../types/database.types';

/**
 * Guard to ensure only administrative users can access protected routes
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const adminRoles = [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.MANAGER,
    ];

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.primaryRole];
    const hasAdminRole = adminRoles.some(role => userRoles.includes(role));

    if (!hasAdminRole) {
      throw new ForbiddenException('Administrative access required');
    }

    return true;
  }
}

/**
 * Guard for merchant-specific operations
 */
@Injectable()
export class MerchantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const merchantRoles = [
      UserRole.MERCHANT,
      UserRole.AGENT,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ];

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.primaryRole];
    const hasMerchantRole = merchantRoles.some(role => userRoles.includes(role));

    if (!hasMerchantRole) {
      throw new ForbiddenException('Merchant access required');
    }

    return true;
  }
}

/**
 * Guard to ensure user has completed KYC verification
 */
@Injectable()
export class KycVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (user.kycStatus !== KycStatus.APPROVED) {
      throw new ForbiddenException('KYC verification required');
    }

    return true;
  }
}

/**
 * Guard to ensure user has minimum KYC tier
 */
@Injectable()
export class MinKycTierGuard implements CanActivate {
  private readonly minTier: KycTier;

  constructor(minTier?: KycTier) {
    this.minTier = minTier || KycTier.TIER_1;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const tierLevels = {
      [KycTier.TIER_0]: 0,
      [KycTier.TIER_1]: 1,
      [KycTier.TIER_2]: 2,
      [KycTier.TIER_3]: 3,
    };

    const userTierLevel = tierLevels[user.kycTier] || 0;
    const requiredTierLevel = tierLevels[this.minTier];

    if (userTierLevel < requiredTierLevel) {
      throw new ForbiddenException(`KYC ${this.minTier} verification required`);
    }

    return true;
  }
}

/**
 * Guard for support and compliance operations
 */
@Injectable()
export class SupportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const supportRoles = [
      UserRole.SUPPORT,
      UserRole.COMPLIANCE,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ];

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.primaryRole];
    const hasSupportRole = supportRoles.some(role => userRoles.includes(role));

    if (!hasSupportRole) {
      throw new ForbiddenException('Support access required');
    }

    return true;
  }
}

/**
 * Guard to ensure user can perform financial operations
 */
@Injectable()
export class FinancialAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Check account status
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Account must be active for financial operations');
    }

    // Check KYC status for financial operations
    if (user.kycStatus !== KycStatus.APPROVED) {
      throw new ForbiddenException('KYC verification required for financial operations');
    }

    // Must have at least TIER_1 for basic financial operations
    const tierLevels = {
      [KycTier.TIER_0]: 0,
      [KycTier.TIER_1]: 1,
      [KycTier.TIER_2]: 2,
      [KycTier.TIER_3]: 3,
    };

    const userTierLevel = tierLevels[user.kycTier] || 0;
    if (userTierLevel < 1) {
      throw new ForbiddenException('KYC TIER_1 verification required for financial operations');
    }

    return true;
  }
}

/**
 * Guard for super admin only operations
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.primaryRole];
    const isSuperAdmin = userRoles.includes(UserRole.SUPER_ADMIN);

    if (!isSuperAdmin) {
      throw new ForbiddenException('Super administrator access required');
    }

    return true;
  }
}