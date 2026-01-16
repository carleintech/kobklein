import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  ForbiddenException,
  Logger 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, UserStatus, KycStatus } from '../../../types/database.types';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('Access denied: No user in request');
      throw new ForbiddenException('Authentication required');
    }

    // Check if user account is active
    if (user.status !== UserStatus.ACTIVE) {
      this.logger.warn(`Access denied: User ${user.id} account is ${user.status}`);
      throw new ForbiddenException(`Account is ${user.status.toLowerCase()}`);
    }

    // Get user roles (handle both single role and multiple roles)
    const userRoles = Array.isArray(user.roles) ? user.roles : 
                     user.role ? [user.role] : 
                     user.primaryRole ? [user.primaryRole] : [];

    if (userRoles.length === 0) {
      this.logger.warn(`Access denied: User ${user.id} has no roles assigned`);
      throw new ForbiddenException('No roles assigned');
    }

    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      this.logger.warn(
        `Access denied: User ${user.id} with roles [${userRoles.join(', ')}] ` +
        `does not have required roles [${requiredRoles.join(', ')}]`
      );
      throw new ForbiddenException('Insufficient permissions');
    }

    this.logger.debug(
      `Access granted: User ${user.id} with roles [${userRoles.join(', ')}] ` +
      `has required role from [${requiredRoles.join(', ')}]`
    );

    return true;
  }
}
