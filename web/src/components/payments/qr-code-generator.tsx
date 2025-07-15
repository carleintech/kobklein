// File: kobklein/web/src/components/payments/qr-code-generator.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw, Copy, Share2, QrCode, CheckCircle2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface QRCodeGeneratorProps {
  walletId: string;
  amount?: number;
  currency?: 'HTG' | 'USD';
  description?: string;
  merchantName?: string;
  expiresIn?: number; // minutes
  onScan?: (data: any) => void;
  size?: 'small' | 'medium' | 'large';
  showControls?: boolean;
}

export function QRCodeGenerator({
  walletId,
  amount,
  currency = 'HTG',
  description,
  merchantName,
  expiresIn = 30,
  onScan,
  size = 'medium',
  showControls = true,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrData, setQrData] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(expiresIn * 60); // Convert to seconds
  const [copied, setCopied] = useState(false);

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { canvas: 150, container: 'w-40', text: 'text-sm' };
      case 'large':
        return { canvas: 300, container: 'w-80', text: 'text-lg' };
      default:
        return { canvas: 200, container: 'w-56', text: 'text-base' };
    }
  };

  const sizeConfig = getSizeConfig();

  // Generate QR code data
  useEffect(() => {
    const paymentData = {
      type: 'kobklein_payment',
      walletId,
      amount,
      currency,
      description,
      merchantName,
      timestamp: Date.now(),
      expiresAt: Date.now() + (expiresIn * 60 * 1000),
    };

    setQrData(JSON.stringify(paymentData));
  }, [walletId, amount, currency, description, merchantName, expiresIn]);

  // Generate QR code (simplified - in real implementation you'd use a QR library like qrcode)
  useEffect(() => {
    if (!qrData || !canvasRef.current) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Simple QR-like pattern (in real implementation, use a proper QR library)
      const blockSize = canvas.width / 20;
      ctx.fillStyle = '#000000';
      
      // Generate a simple pattern based on data
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          const shouldFill = (i + j + qrData.charCodeAt((i * j) % qrData.length)) % 3 === 0;
          if (shouldFill) {
            ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
          }
        }
      }
      
      // Add corner squares (finder patterns)
      ctx.fillStyle = '#000000';
      // Top-left
      ctx.fillRect(0, 0, blockSize * 7, blockSize * 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(blockSize, blockSize, blockSize * 5, blockSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(blockSize * 2, blockSize * 2, blockSize * 3, blockSize * 3);
      
      // Top-right
      ctx.fillStyle = '#000000';
      ctx.fillRect(blockSize * 13, 0, blockSize * 7, blockSize * 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(blockSize * 14, blockSize, blockSize * 5, blockSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(blockSize * 15, blockSize * 2, blockSize * 3, blockSize * 3);
      
      // Bottom-left
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, blockSize * 13, blockSize * 7, blockSize * 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(blockSize, blockSize * 14, blockSize * 5, blockSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(blockSize * 2, blockSize * 15, blockSize * 3, blockSize * 3);
    }
    
    setTimeout(() => setIsGenerating(false), 500);
  }, [qrData]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `kobklein-payment-qr-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((blob) => {
          resolve(blob!);
        });
      });

      const file = new File([blob], 'kobklein-payment-qr.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'KobKlein Payment QR Code',
          text: 'Scan this QR code to make a payment',
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Failed to share:', err);
      handleDownload();
    }
  };

  const regenerateQR = () => {
    setTimeLeft(expiresIn * 60);
    setQrData(JSON.stringify({
      type: 'kobklein_payment',
      walletId,
      amount,
      currency,
      description,
      merchantName,
      timestamp: Date.now(),
      expiresAt: Date.now() + (expiresIn * 60 * 1000),
    }));
  };

  return (
    <KobKleinCard className="p-6 text-center">
      {/* Header */}
      <div className="flex items-center justify-center space-x-2 mb-4">
        <QrCode className="h-5 w-5 text-kobklein-accent" />
        <h3 className="text-lg font-semibold">Payment QR Code</h3>
      </div>

      {/* QR Code Display */}
      <div className={`${sizeConfig.container} mx-auto mb-6 relative`}>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          {isGenerating ? (
            <div className="flex items-center justify-center" style={{ height: sizeConfig.canvas }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kobklein-accent"></div>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={sizeConfig.canvas}
              height={sizeConfig.canvas}
              className="w-full h-auto"
            />
          )}
          
          {/* KobKlein Logo Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="w-8 h-8 bg-kobklein-accent rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expired Overlay */}
        {timeLeft <= 0 && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              EXPIRED
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="space-y-2 mb-6">
        {merchantName && (
          <p className="text-lg font-semibold">{merchantName}</p>
        )}
        {amount && (
          <p className="text-2xl font-bold text-kobklein-accent">
            {formatCurrency(amount, currency)}
          </p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <p className="text-xs text-muted-foreground font-mono">
          Wallet ID: {walletId}
        </p>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Badge 
          variant="outline" 
          className={timeLeft <= 300 ? 'text-red-600 border-red-200' : 'text-blue-600 border-blue-200'}
        >
          {timeLeft > 0 ? (
            <>Expires in {formatTime(timeLeft)}</>
          ) : (
            <>Expired</>
          )}
        </Badge>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Data</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          
          {timeLeft <= 0 && (
            <button
              onClick={regenerateQR}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-kobklein-accent text-white rounded hover:bg-kobklein-accent/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-sm text-blue-700 mb-2">How to Pay</h4>
        <ol className="text-xs text-blue-600 text-left space-y-1">
          <li>1. Open your KobKlein mobile app</li>
          <li>2. Tap "Scan QR Code" or "Pay"</li>
          <li>3. Point your camera at this QR code</li>
          <li>4. Confirm the payment details</li>
          <li>5. Complete the transaction</li>
        </ol>
      </div>
    </KobKleinCard>
  );
}