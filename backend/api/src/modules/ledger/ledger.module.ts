import { Module } from '@nestjs/common';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';

@Module({
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService], // Export for use in other modules
})
export class LedgerModule {}
