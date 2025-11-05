import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../../types/database.types';
import { extractError } from '../../utils/error.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      this.logger.debug(`Validating JWT token for user: ${payload.sub}`);

      // Validate the user exists and is active
      const user = await this.authService.validateUser(payload.sub);

      if (!user) {
        this.logger.warn(`JWT validation failed: User ${payload.sub} not found`);
        throw new UnauthorizedException('User not found');
      }

      // Return enhanced user object for request context
      const userContext = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        country: user.country,
        preferredCurrency: user.preferred_currency,
        status: user.status,
        roles: payload.roles || [payload.primaryRole],
        primaryRole: payload.primaryRole,
        kycStatus: payload.kycStatus,
        kycTier: payload.kycTier,
        primaryWalletId: payload.primaryWalletId,
        lastLoginAt: user.last_login_at,
        // Include JWT claims for additional validation
        tokenIat: payload.iat,
        tokenExp: payload.exp,
      };

      this.logger.debug(`JWT validation successful for user: ${user.id}`);
      return userContext;
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`JWT validation error:`, err.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
