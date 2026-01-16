import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface TransactionEmailData {
  recipientEmail: string;
  recipientName: string;
  transactionId: string;
  amount: number;
  currency: 'HTG' | 'USD';
  type: 'payment_sent' | 'payment_received' | 'wallet_credited' | 'wallet_debited';
  timestamp: Date;
  balance?: number;
}

export interface WelcomeEmailData {
  recipientEmail: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private readonly fromEmail: string;
  private readonly enabled: boolean;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL', 'KobKlein <notifications@kobklein.ht>');
    this.enabled = !!apiKey;

    if (this.enabled) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend email service initialized');
    } else {
      this.logger.warn('Resend API key not configured - emails will be logged only');
    }
  }

  /**
   * Send transaction notification email
   */
  async sendTransactionEmail(data: TransactionEmailData): Promise<void> {
    try {
      const subject = this.getTransactionSubject(data.type, data.amount, data.currency);
      const html = this.generateTransactionEmailHTML(data);

      if (!this.enabled) {
        this.logger.log(`[MOCK EMAIL] To: ${data.recipientEmail} | Subject: ${subject}`);
        return;
      }

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: data.recipientEmail,
        subject,
        html,
      });

      if (result.data) {
        this.logger.log(`Transaction email sent: ${result.data.id} to ${data.recipientEmail}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to send transaction email: ${errorMessage}`, errorStack);
      // Don't throw - email failure shouldn't break transaction
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      const subject = 'Welcome to KobKlein! 🎉';
      const html = this.generateWelcomeEmailHTML(data);

      if (!this.enabled) {
        this.logger.log(`[MOCK EMAIL] To: ${data.recipientEmail} | Subject: ${subject}`);
        return;
      }

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: data.recipientEmail,
        subject,
        html,
      });

      if (result.data) {
        this.logger.log(`Welcome email sent: ${result.data.id} to ${data.recipientEmail}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to send welcome email: ${errorMessage}`, errorStack);
    }
  }

  /**
   * Generate transaction email subject line
   */
  private getTransactionSubject(type: string, amount: number, currency: string): string {
    const formattedAmount = this.formatCurrency(amount, currency);
    
    switch (type) {
      case 'payment_sent':
        return `Payment Sent: ${formattedAmount} - KobKlein`;
      case 'payment_received':
        return `Payment Received: ${formattedAmount} - KobKlein`;
      case 'wallet_credited':
        return `Wallet Credited: ${formattedAmount} - KobKlein`;
      case 'wallet_debited':
        return `Wallet Debited: ${formattedAmount} - KobKlein`;
      default:
        return `Transaction Update - KobKlein`;
    }
  }

  /**
   * Format currency for display
   */
  private formatCurrency(amount: number, currency: string): string {
    const symbol = currency === 'HTG' ? 'G' : '$';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Generate HTML for transaction email
   */
  private generateTransactionEmailHTML(data: TransactionEmailData): string {
    const formattedAmount = this.formatCurrency(data.amount, data.currency);
    const formattedDate = data.timestamp.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const typeLabels = {
      payment_sent: 'Payment Sent',
      payment_received: 'Payment Received',
      wallet_credited: 'Wallet Credited',
      wallet_debited: 'Wallet Debited',
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${typeLabels[data.type]}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0066cc 0%, #00ccff 100%); padding: 30px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">KobKlein</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                ${typeLabels[data.type]}
              </h2>
              
              <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                Hello ${data.recipientName},
              </p>
              
              <!-- Transaction Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Amount</td>
                        <td align="right" style="color: #0066cc; font-size: 24px; font-weight: bold;">
                          ${formattedAmount}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Transaction ID</td>
                        <td align="right" style="color: #333333; font-size: 14px; font-family: monospace;">
                          ${data.transactionId}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px;">Date & Time</td>
                        <td align="right" style="color: #333333; font-size: 14px;">
                          ${formattedDate}
                        </td>
                      </tr>
                      ${data.balance !== undefined ? `
                      <tr>
                        <td style="color: #666666; font-size: 14px;">New Balance</td>
                        <td align="right" style="color: #333333; font-size: 16px; font-weight: 600;">
                          ${this.formatCurrency(data.balance, data.currency)}
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://kobklein.ht/dashboard" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      View in Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                This is an automated notification. If you have any questions, please contact our support team.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                © ${new Date().getFullYear()} KobKlein. All rights reserved.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Secure, bank-free payments for Haiti and the diaspora
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Generate HTML for welcome email
   */
  private generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to KobKlein</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0066cc 0%, #00ccff 100%); padding: 50px 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to KobKlein! 🎉</h1>
              <p style="margin: 0; color: #ffffff; font-size: 18px; opacity: 0.9;">Your financial journey starts here</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 18px; line-height: 1.6;">
                Hello <strong>${data.firstName} ${data.lastName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Thank you for joining KobKlein! We're excited to have you as part of our community. Your account has been created and your digital wallet is ready to use.
              </p>
              
              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 10px;">
                    <h3 style="margin: 0 0 10px 0; color: #0066cc; font-size: 18px;">✨ What's Next?</h3>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #666666; font-size: 15px; line-height: 1.8;">
                      <li>Add funds to your wallet</li>
                      <li>Send money instantly to friends and family</li>
                      <li>Make secure payments with NFC or QR codes</li>
                      <li>Track all your transactions in real-time</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://kobklein.ht/dashboard" style="display: inline-block; padding: 16px 40px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: 600;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5; text-align: center;">
                Need help? Contact us at <a href="mailto:support@kobklein.ht" style="color: #0066cc; text-decoration: none;">support@kobklein.ht</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                © ${new Date().getFullYear()} KobKlein. All rights reserved.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Secure, bank-free payments for Haiti and the diaspora
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}
