const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Field name mappings (snake_case -> camelCase)
const fieldMappings = {
  'first_name': 'firstName',
  'last_name': 'lastName',
  'date_of_birth': 'dateOfBirth',
  'pin_hash': 'pinHash',
  'two_factor_enabled': 'twoFactorEnabled',
  'created_at': 'createdAt',
  'updated_at': 'updatedAt',
  'last_login_at': 'lastLoginAt',
  'email_verified_at': 'emailVerifiedAt',
  'user_id': 'userId',
  'preferred_language': 'preferredLanguage',
  'receive_notifications': 'receiveNotifications',
  'preferred_currency': 'preferredCurrency',
  'business_name': 'businessName',
  'business_type': 'businessType',
  'business_address': 'businessAddress',
  'business_phone': 'businessPhone',
  'tax_id': 'taxId',
  'is_verified': 'isVerified',
  'verified_at': 'verifiedAt',
  'auto_accept_payments': 'autoAcceptPayments',
  'max_transaction_amount': 'maxTransactionAmount',
  'territory_name': 'territoryName',
  'territory_code': 'territoryCode',
  'is_active': 'isActive',
  'refill_commission_rate': 'refillCommissionRate',
  'withdrawal_commission_rate': 'withdrawalCommissionRate',
  'cards_in_stock': 'cardsInStock',
  'last_restock_at': 'lastRestockAt',
  'country_of_residence': 'countryOfResidence',
  'auto_refill_enabled': 'autoRefillEnabled',
  'auto_refill_amount': 'autoRefillAmount',
  'auto_refill_frequency': 'autoRefillFrequency',
  'next_auto_refill_date': 'nextAutoRefillDate',
  'daily_limit': 'dailyLimit',
  'monthly_limit': 'monthlyLimit',
  'sender_id': 'senderId',
  'receiver_id': 'receiverId',
  'sender_wallet_id': 'senderWalletId',
  'receiver_wallet_id': 'receiverWalletId',
  'card_id': 'cardId',
  'stripe_payment_id': 'stripePaymentId',
  'processed_at': 'processedAt',
  'processed_by': 'processedBy',
  'failure_reason': 'failureReason',
  'ip_address': 'ipAddress',
  'user_agent': 'userAgent',
  'issued_by': 'issuedBy',
  'issued_at': 'issuedAt',
  'activated_at': 'activatedAt',
  'expires_at': 'expiresAt',
  'last_used_at': 'lastUsedAt',
  'usage_count': 'usageCount',
  'card_number': 'cardNumber',
  'printed_name': 'printedName',
  'from_user_id': 'fromUserId',
  'to_wallet_id': 'toWalletId',
  'payment_method': 'paymentMethod',
  'diaspora_user_id': 'diasporaUserId',
  'client_user_id': 'clientUserId',
  'device_info': 'deviceInfo',
  'resource_id': 'resourceId',
  'old_values': 'oldValues',
  'new_values': 'newValues',
  'from_currency': 'fromCurrency',
  'to_currency': 'toCurrency',
  'stripe_payment_intent_id': 'stripePaymentIntentId',
  'completed_at': 'completedAt',
  'sent_at': 'sentAt',
  'delivered_at': 'deliveredAt',
  'read_at': 'readAt',
  'frozen_balance': 'frozenBalance',
};

// Add @map() directives to fields
Object.entries(fieldMappings).forEach(([snakeCase, camelCase]) => {
  // Match field definitions and add @map if not already present
  const regex = new RegExp(`(\\s+)${snakeCase}(\\s+)`, 'g');
  schema = schema.replace(regex, (match, space1, space2) => {
    // Check if this line already has @map
    const lines = schema.split('\n');
    let modified = false;
    const newLines = lines.map(line => {
      if (line.includes(`${snakeCase}${space2}`) && !line.includes('@map') && !modified) {
        modified = true;
        // Insert camelCase name and add @map directive
        return line.replace(`${snakeCase}${space2}`, `${camelCase}${space2}`).replace(/(\s+)(@db\.|@default|@unique|@id|String|Int|Boolean|DateTime|Decimal|Json)/, `$1@map("${snakeCase}") $2`);
      }
      return line;
    });
    if (modified) {
      schema = newLines.join('\n');
    }
    return match;
  });
});

console.log('Prisma schema updated with camelCase field names and @map directives');
console.log('Please run: pnpm prisma generate');
