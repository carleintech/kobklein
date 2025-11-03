import { Module } from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { QrPaymentsController } from './qr-payments/qr-payments.controller';
import { QrPaymentsService } from './qr-payments/qr-payments.service';
import { NfcPaymentsController } from './nfc-payments/nfc-payments.controller';
import { NfcPaymentsService } from './nfc-payments/nfc-payments.service';
import { PaymentRequestsController } from './payment-requests/payment-requests.controller';
import { PaymentRequestsService } from './payment-requests/payment-requests.service';
import { MerchantQrController } from './merchant-qr/merchant-qr.controller';
import { MerchantQrService } from './merchant-qr/merchant-qr.service';
import { PaymentSecurityController } from './payment-security/payment-security.controller';
import { PaymentSecurityService } from './payment-security/payment-security.service';

@Module({
  imports: [PaymentsModule],
  controllers: [
    QrPaymentsController,
    NfcPaymentsController,
    PaymentRequestsController,
    MerchantQrController,
    PaymentSecurityController,
  ],
  providers: [
    QrPaymentsService,
    NfcPaymentsService,
    PaymentRequestsService,
    MerchantQrService,
    PaymentSecurityService,
  ],
  exports: [
    QrPaymentsService,
    NfcPaymentsService,
    PaymentRequestsService,
    MerchantQrService,
    PaymentSecurityService,
  ],
})
export class AdvancedPaymentsModule {}