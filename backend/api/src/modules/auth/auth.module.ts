import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { WalletsModule } from '../wallets/wallets.module';
import { EmailModule } from '../email/email.module';

// Guards
import { RolesGuard } from './guards/roles.guard';
import { 
  AdminGuard,
  MerchantGuard,
  KycVerifiedGuard,
  MinKycTierGuard,
  SupportGuard,
  FinancialAccessGuard,
  SuperAdminGuard,
} from './guards/specialized.guard';

@Module({
  imports: [
    WalletsModule,
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    SupabaseStrategy,
    // Guards
    RolesGuard,
    AdminGuard,
    MerchantGuard,
    KycVerifiedGuard,
    // MinKycTierGuard, // Temporarily disabled - requires factory pattern
    SupportGuard,
    FinancialAccessGuard,
    SuperAdminGuard,
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    // Export guards for use in other modules
    RolesGuard,
    AdminGuard,
    MerchantGuard,
    KycVerifiedGuard,
    // MinKycTierGuard, // Temporarily disabled - requires factory pattern
    SupportGuard,
    FinancialAccessGuard,
    SuperAdminGuard,
  ],
})
export class AuthModule {}
