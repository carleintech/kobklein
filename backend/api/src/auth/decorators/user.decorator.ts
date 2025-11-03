import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from '../../types/database.types';

/**
 * Decorator to inject the current user from the request
 * Usage: @User() user: UserProfile
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserProfile => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

/**
 * Decorator to inject the current user's ID
 * Usage: @UserId() userId: string
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

/**
 * Decorator to inject the current user's roles
 * Usage: @UserRoles() roles: UserRole[]
 */
export const UserRoles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string[] => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.roles || [request.user?.primaryRole] || [];
  },
);

/**
 * Decorator to inject the current user's primary wallet ID
 * Usage: @UserWalletId() walletId: string
 */
export const UserWalletId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.primaryWalletId;
  },
);

/**
 * Decorator to inject the current user's KYC status
 * Usage: @UserKycStatus() kycStatus: KycStatus
 */
export const UserKycStatus = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.kycStatus;
  },
);

/**
 * Decorator to inject the current user's country
 * Usage: @UserCountry() country: string
 */
export const UserCountry = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.country;
  },
);