import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LedgerModule } from './modules/ledger/ledger.module'; // ✅ NEW: Double-entry ledger system
import { WalletsModule } from './modules/wallets/wallets.module'; // ✅ NEW: Wallet management on ledger
// import { TransactionsModule } from './modules/transactions/transactions.module'; // Will be rebuilt on ledger
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdvancedPaymentsModule } from './modules/advanced-payments/advanced-payments.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    EmailModule, // ✅ NEW: Transactional email service (Resend)
    LedgerModule, // ✅ NEW: Financial core (double-entry bookkeeping)
    WalletsModule, // ✅ NEW: User wallet management
    // TransactionsModule, // Being rebuilt on ledger foundation
    PaymentsModule,
    AdvancedPaymentsModule,
    AdminModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
