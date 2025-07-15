// File: kobklein/web/src/components/wallet/wallet-card.tsx

import React from 'react';
import { CreditCard, Wifi, Chip, Nfc } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface WalletCardProps {
  cardNumber: string;
  holderName: string;
  cardType: 'basic' | 'named' | 'merchant' | 'distributor';
  balance: number;
  currency: 'HTG' | 'USD';
  isActive?: boolean;
  showBalance?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function WalletCard({
  cardNumber,
  holderName,
  cardType,
  balance,
  currency = 'HTG',
  isActive = true,
  showBalance = true,
  size = 'medium',
}: WalletCardProps) {
  const getCardGradient = () => {
    switch (cardType) {
      case 'basic':
        return 'from-blue-600 to-blue-800';
      case 'named':
        return 'from-indigo-600 to-indigo-800';
      case 'merchant':
        return 'from-amber-500 to-amber-700';
      case 'distributor':
        return 'from-gray-800 to-black';
      default:
        return 'from-blue-600 to-blue-800';
    }
  };

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-64 h-40',
          text: {
            brand: 'text-lg',
            number: 'text-sm',
            name: 'text-xs',
            balance: 'text-lg',
            label: 'text-xs',
          },
          spacing: 'p-4',
          chip: 'w-8 h-6',
          nfc: 'w-4 h-4',
        };
      case 'large':
        return {
          container: 'w-96 h-60',
          text: {
            brand: 'text-3xl',
            number: 'text-xl',
            name: 'text-lg',
            balance: 'text-2xl',
            label: 'text-sm',
          },
          spacing: 'p-8',
          chip: 'w-12 h-8',
          nfc: 'w-6 h-6',
        };
      default:
        return {
          container: 'w-80 h-48',
          text: {
            brand: 'text-2xl',
            number: 'text-base',
            name: 'text-sm',
            balance: 'text-xl',
            label: 'text-xs',
          },
          spacing: 'p-6',
          chip: 'w-10 h-7',
          nfc: 'w-5 h-5',
        };
    }
  };

  const cardSize = getCardSize();
  const gradient = getCardGradient();
  
  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className={`
      ${cardSize.container} 
      bg-gradient-to-br ${gradient} 
      rounded-xl shadow-lg text-white relative overflow-hidden
      ${isActive ? '' : 'opacity-50 grayscale'}
      transform transition-transform hover:scale-105 hover:shadow-xl
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>

      <div className={`relative h-full flex flex-col justify-between ${cardSize.spacing}`}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className={`font-bold ${cardSize.text.brand}`}>KobKlein</h3>
            <p className={`text-white/80 ${cardSize.text.label} uppercase tracking-wider`}>
              {cardType === 'basic' ? 'Basic Card' :
               cardType === 'named' ? 'Named Card' :
               cardType === 'merchant' ? 'Merchant Pro' :
               'Distributor Card'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-white/20 rounded">
              <Nfc className={`${cardSize.nfc} text-white`} />
            </div>
            <Wifi className={`${cardSize.nfc} text-white/60`} />
          </div>
        </div>

        {/* Chip */}
        <div className="flex items-center space-x-4">
          <div className={`${cardSize.chip} bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-md flex items-center justify-center`}>
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className={`font-mono ${cardSize.text.number} tracking-wider`}>
              {formatCardNumber(cardNumber)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-white/80 ${cardSize.text.label} uppercase tracking-wide`}>
              Card Holder
            </p>
            <p className={`font-semibold ${cardSize.text.name} uppercase`}>
              {holderName}
            </p>
          </div>
          
          {showBalance && (
            <div className="text-right">
              <p className={`text-white/80 ${cardSize.text.label} uppercase tracking-wide`}>
                Balance
              </p>
              <p className={`font-bold ${cardSize.text.balance} font-mono`}>
                {formatCurrency(balance, currency)}
              </p>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              INACTIVE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}