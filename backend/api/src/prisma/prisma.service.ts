import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma database connection established');
    } catch (error) {
      this.logger.warn('⚠️  Prisma database connection failed - continuing without direct DB access');
      this.logger.warn(`   This is expected if port 5432 is blocked by corporate firewall`);
      this.logger.warn(`   The app will use Supabase HTTPS API instead`);
      // Don't throw - allow app to start even if Prisma can't connect
    }
  }
}
