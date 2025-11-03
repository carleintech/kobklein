'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MobileButton, MobileCard, MobileModal, useMobileOptimizations } from './MobileOptimizations';
import { useQRPayments } from '@/hooks/useAdvancedPayments';
import type { QRPaymentData as APIQRPaymentData } from '@/lib/advanced-payments-api';

// QR Code generation utility (fallback for display purposes)
const generateQRCodeDisplay = async (data: string): Promise<string> => {
  // Using QR Server API for display, actual generation handled by backend
  const size = 300;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  return qrUrl;
};

// QR Payment data structure (local component interface)
interface QRPaymentData {
  type: 'payment_request' | 'merchant_payment' | 'p2p_transfer';
  amount?: number;
  currency: string;
  recipient: {
    id: string;
    name: string;
    type: 'user' | 'merchant';
  };
  description?: string;
  expiry?: string;
  nonce: string;
  signature?: string;
}

interface QRCodeGeneratorProps {
  paymentData: QRPaymentData;
  onClose: () => void;
}

export function QRCodeGenerator({ paymentData, onClose }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [shareSupported, setShareSupported] = useState(false);
  const { generateQR, loading, error } = useQRPayments();
  const { hapticFeedback } = useMobileOptimizations();

  useEffect(() => {
    const handleGenerateQR = async () => {
      try {
        // Generate QR code using backend API hook
        const result = await generateQR({
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          type: paymentData.type,
          expiresIn: 30 // 30 minutes default
        });
        
        setQrCodeUrl(result.qrCode);
        
        // Check if Web Share API is supported
        setShareSupported(!!navigator.share);
        
        hapticFeedback('success');
      } catch (error) {
        console.error('QR generation failed:', error);
        hapticFeedback('error');
        
        // Fallback to display-only QR generation
        try {
          const paymentUrl = `kobklein://pay?data=${btoa(JSON.stringify(paymentData))}`;
          const fallbackQr = await generateQRCodeDisplay(paymentUrl);
          setQrCodeUrl(fallbackQr);
        } catch (fallbackError) {
          console.error('Fallback QR generation failed:', fallbackError);
        }
      }
    };

    handleGenerateQR();
  }, [paymentData, generateQR, hapticFeedback]);

  const handleShare = async () => {
    if (!navigator.share || !qrCodeUrl) return;

    try {
      await navigator.share({
        title: 'KobKlein Payment Request',
        text: `Payment request for ${paymentData.amount ? `$${paymentData.amount}` : 'amount'} - ${paymentData.description || 'KobKlein Payment'}`,
        url: `kobklein://pay?data=${btoa(JSON.stringify(paymentData))}`,
      });
      hapticFeedback('success');
    } catch (error) {
      console.error('Share failed:', error);
      hapticFeedback('error');
    }
  };

  const handleCopyLink = async () => {
    const paymentUrl = `https://kobklein.com/pay?data=${btoa(JSON.stringify(paymentData))}`;
    
    try {
      await navigator.clipboard.writeText(paymentUrl);
      hapticFeedback('success');
      
      // Show temporary feedback
      const button = document.activeElement as HTMLElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      hapticFeedback('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="text-center">
        <div className="w-80 h-80 mx-auto bg-white rounded-2xl p-4 shadow-lg">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Payment QR Code"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span>Failed to generate QR code</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <MobileCard padding="md">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-lg">
              {paymentData.amount ? `$${paymentData.amount.toFixed(2)}` : 'Any amount'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{paymentData.recipient.name}</span>
          </div>
          
          {paymentData.description && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">For:</span>
              <span className="font-medium">{paymentData.description}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Type:</span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {paymentData.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </MobileCard>

      {/* Action Buttons */}
      <div className="space-y-3">
        {shareSupported && (
          <MobileButton
            variant="primary"
            size="lg"
            onClick={handleShare}
            haptic="medium"
            className="w-full"
          >
            📤 Share Payment Request
          </MobileButton>
        )}
        
        <MobileButton
          variant="secondary"
          size="lg"
          onClick={handleCopyLink}
          haptic="light"
          className="w-full"
        >
          🔗 Copy Payment Link
        </MobileButton>
        
        <MobileButton
          variant="secondary"
          size="md"
          onClick={onClose}
          haptic="light"
          className="w-full"
        >
          Done
        </MobileButton>
      </div>
    </div>
  );
}

// QR Code Scanner Component
interface QRCodeScannerProps {
  onScanSuccess: (data: QRPaymentData) => void;
  onScanError: (error: string) => void;
  onClose: () => void;
}

export function QRCodeScanner({ onScanSuccess, onScanError, onClose }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { hapticFeedback, viewport } = useMobileOptimizations();

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      // Start scanning after video loads
      setTimeout(() => {
        setIsScanning(true);
        startScanning();
      }, 1000);
      
    } catch (error) {
      console.error('Camera access failed:', error);
      setHasPermission(false);
      onScanError('Camera permission denied or not available');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scanFrame = () => {
      if (!isScanning || !context) return;

      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data for QR scanning
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // In a real implementation, you'd use a QR code library like jsQR here
      // For demo purposes, we'll simulate QR detection
      try {
        const mockQRData = detectMockQR(imageData);
        if (mockQRData) {
          hapticFeedback('success');
          setIsScanning(false);
          onScanSuccess(mockQRData);
          return;
        }
      } catch (error) {
        console.error('QR scan error:', error);
      }

      // Continue scanning
      if (isScanning) {
        requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  };

  // Mock QR detection for demo (replace with real QR library)
  const detectMockQR = (imageData: ImageData): QRPaymentData | null => {
    // In a real app, use jsQR or similar library here
    // For demo, return mock data after 3 seconds
    if (Math.random() < 0.01) { // 1% chance per frame
      return {
        type: 'merchant_payment',
        amount: 25.50,
        currency: 'USD',
        recipient: {
          id: 'merchant_123',
          name: 'Cafe Soleil',
          type: 'merchant'
        },
        description: 'Coffee and pastry',
        nonce: Date.now().toString()
      };
    }
    return null;
  };

  const handleManualInput = () => {
    // For demo, create a sample payment
    const mockPayment: QRPaymentData = {
      type: 'p2p_transfer',
      amount: 50.00,
      currency: 'USD',
      recipient: {
        id: 'user_456',
        name: 'Marie Joseph',
        type: 'user'
      },
      description: 'Lunch money',
      nonce: Date.now().toString()
    };
    
    hapticFeedback('medium');
    onScanSuccess(mockPayment);
  };

  if (hasPermission === false) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📷</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
          <p className="text-gray-600 mb-6">
            To scan QR codes, we need access to your camera. Please allow camera permissions and try again.
          </p>
          <div className="space-y-3">
            <MobileButton
              variant="primary"
              size="lg"
              onClick={startCamera}
              className="w-full"
            >
              🔄 Try Again
            </MobileButton>
            <MobileButton
              variant="secondary"
              size="md"
              onClick={handleManualInput}
              className="w-full"
            >
              📝 Enter Manually
            </MobileButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scanner View */}
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full rounded-lg bg-black"
          style={{ aspectRatio: '4/3' }}
          playsInline
          muted
        />
        
        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {/* Scanning Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Scanning frame */}
            <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>
              
              {/* Scanning line animation */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Flash/torch button (if supported) */}
        <div className="absolute top-4 right-4">
          <MobileButton
            variant="secondary"
            size="sm"
            onClick={() => {
              // Toggle flash if supported
              hapticFeedback('light');
            }}
            className="bg-black/50 text-white border-white/30"
          >
            🔦
          </MobileButton>
        </div>
      </div>

      {/* Instructions */}
      <MobileCard padding="md" className="text-center">
        <p className="text-gray-600 mb-2">
          {isScanning ? 'Scanning for QR codes...' : 'Position QR code within the frame'}
        </p>
        <p className="text-sm text-gray-500">
          Point your camera at a KobKlein payment QR code
        </p>
      </MobileCard>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <MobileButton
          variant="secondary"
          size="md"
          onClick={handleManualInput}
          haptic="light"
          className="w-full"
        >
          📝 Enter Code
        </MobileButton>
        
        <MobileButton
          variant="secondary"
          size="md"
          onClick={onClose}
          haptic="light"
          className="w-full"
        >
          Cancel
        </MobileButton>
      </div>
    </div>
  );
}

// Main QR Payment Interface
export function QRPaymentSystem() {
  const [mode, setMode] = useState<'menu' | 'generate' | 'scan'>('menu');
  const [paymentData, setPaymentData] = useState<QRPaymentData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { hapticFeedback } = useMobileOptimizations();

  const handleGenerateQR = (data: QRPaymentData) => {
    setPaymentData(data);
    setMode('generate');
    hapticFeedback('medium');
  };

  const handleScanSuccess = (data: QRPaymentData) => {
    setPaymentData(data);
    setShowPaymentModal(true);
    setMode('menu');
    hapticFeedback('success');
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
    hapticFeedback('error');
    setMode('menu');
  };

  const createPaymentRequest = () => {
    const mockRequest: QRPaymentData = {
      type: 'payment_request',
      amount: 100.00,
      currency: 'USD',
      recipient: {
        id: 'current_user',
        name: 'Your Account',
        type: 'user'
      },
      description: 'Payment request',
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      nonce: Date.now().toString()
    };
    
    handleGenerateQR(mockRequest);
  };

  const createMerchantQR = () => {
    const mockMerchant: QRPaymentData = {
      type: 'merchant_payment',
      currency: 'USD',
      recipient: {
        id: 'merchant_current',
        name: 'My Business',
        type: 'merchant'
      },
      description: 'Business payment',
      nonce: Date.now().toString()
    };
    
    handleGenerateQR(mockMerchant);
  };

  if (mode === 'generate' && paymentData) {
    return (
      <QRCodeGenerator
        paymentData={paymentData}
        onClose={() => {
          setMode('menu');
          setPaymentData(null);
        }}
      />
    );
  }

  if (mode === 'scan') {
    return (
      <QRCodeScanner
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
        onClose={() => setMode('menu')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-white">📱</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Payments</h2>
        <p className="text-gray-600">Send and receive payments with QR codes</p>
      </div>

      {/* QR Actions */}
      <div className="space-y-4">
        <MobileCard
          onTap={() => setMode('scan')}
          haptic="medium"
          padding="lg"
          className="border-2 border-blue-200 hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Scan QR Code</h3>
              <p className="text-sm text-gray-600">Pay merchants or send to friends</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>

        <MobileCard
          onTap={createPaymentRequest}
          haptic="medium"
          padding="lg"
          className="border-2 border-green-200 hover:border-green-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Request Payment</h3>
              <p className="text-sm text-gray-600">Generate QR for others to pay you</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>

        <MobileCard
          onTap={createMerchantQR}
          haptic="medium"
          padding="lg"
          className="border-2 border-purple-200 hover:border-purple-400 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Merchant QR</h3>
              <p className="text-sm text-gray-600">Static QR for your business</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </MobileCard>
      </div>

      {/* Recent QR Payments */}
      <MobileCard padding="md">
        <h3 className="font-semibold text-gray-900 mb-3">Recent QR Payments</h3>
        <div className="space-y-3">
          {[
            { merchant: 'Cafe Soleil', amount: 12.50, time: '2 min ago', type: 'scan' },
            { merchant: 'Gas Station', amount: 45.00, time: '1 hour ago', type: 'scan' },
            { merchant: 'Marie Joseph', amount: 25.00, time: '2 hours ago', type: 'request' },
          ].map((payment, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">
                    {payment.type === 'scan' ? '📷' : '💰'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{payment.merchant}</p>
                  <p className="text-xs text-gray-500">{payment.time}</p>
                </div>
              </div>
              <span className="font-semibold text-sm">-${payment.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </MobileCard>

      {/* Payment Confirmation Modal */}
      <MobileModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Confirm Payment"
        size="md"
      >
        {paymentData && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Pay ${paymentData.amount?.toFixed(2) || '0.00'}
              </h3>
              <p className="text-gray-600">{paymentData.recipient.name}</p>
              {paymentData.description && (
                <p className="text-sm text-gray-500 mt-1">{paymentData.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <MobileButton
                variant="secondary"
                size="lg"
                onClick={() => setShowPaymentModal(false)}
                className="w-full"
              >
                Cancel
              </MobileButton>
              <MobileButton
                variant="primary"
                size="lg"
                onClick={() => {
                  hapticFeedback('success');
                  setShowPaymentModal(false);
                  // Process payment here
                }}
                className="w-full"
              >
                Pay Now
              </MobileButton>
            </div>
          </div>
        )}
      </MobileModal>
    </div>
  );
}