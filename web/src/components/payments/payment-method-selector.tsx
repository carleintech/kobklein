// File: kobklein/web/src/components/payments/payment-method-selector.tsx
import React, { useState } from 'react';
import { Smartphone, QrCode, CreditCard, Banknote, Wifi } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PaymentMethod {
  id: 'nfc' | 'qr' | 'card' | 'cash';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  available: boolean;
  recommended?: boolean;
  fee?: string;
}

interface PaymentMethodSelectorProps {
  userRole: 'client' | 'merchant' | 'distributor';
  onMethodSelect: (method: PaymentMethod['id']) => void;
  selectedMethod?: PaymentMethod['id'];
}

export function PaymentMethodSelector({ 
  userRole, 
  onMethodSelect, 
  selectedMethod 
}: PaymentMethodSelectorProps) {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'nfc',
      name: 'NFC Tap',
      description: 'Tap your phone or card',
      icon: Smartphone,
      available: true,
      recommended: true,
      fee: 'No fee',
    },
    {
      id: 'qr',
      name: 'QR Code',
      description: 'Scan to pay instantly',
      icon: QrCode,
      available: true,
      fee: 'No fee',
    },
    {
      id: 'card',
      name: 'Card Payment',
      description: 'Credit/debit card',
      icon: CreditCard,
      available: userRole === 'merchant',
      fee: '2.9% + 30¢',
    },
    {
      id: 'cash',
      name: 'Cash Exchange',
      description: 'Physical cash transaction',
      icon: Banknote,
      available: userRole === 'distributor',
      fee: '2% fee',
    },
  ];

  const availableMethods = paymentMethods.filter(method => method.available);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>
        <p className="text-muted-foreground text-sm">
          Select how you want to {userRole === 'client' ? 'pay' : 'accept payment'}
        </p>
      </div>

      <div className="grid gap-3">
        {availableMethods.map((method) => (
          <KobKleinCard
            key={method.id}
            className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
              selectedMethod === method.id 
                ? 'border-kobklein-secondary bg-accent/30' 
                : 'border-border'
            }`}
            onClick={() => onMethodSelect(method.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedMethod === method.id 
                  ? 'bg-kobklein-secondary text-white' 
                  : 'bg-accent'
              }`}>
                <method.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{method.name}</h4>
                  {method.recommended && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
                <p className="text-xs text-kobklein-secondary">{method.fee}</p>
              </div>
              
              {selectedMethod === method.id && (
                <div className="w-6 h-6 bg-kobklein-secondary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          </KobKleinCard>
        ))}
      </div>
    </div>
  );
}