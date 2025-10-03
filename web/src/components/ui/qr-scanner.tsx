"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Loader,
  SwitchCamera,
  Upload,
  X,
  Zap,
  ZapOff,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Extend MediaTrackCapabilities for torch support
interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  allowUpload?: boolean;
  scanning?: boolean;
}

export function QRScanner({
  onScan,
  onError,
  onClose,
  allowUpload = true,
  scanning = true,
}: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Request camera permission
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        setHasPermission(true);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera permission denied:", error);
        setHasPermission(false);
        onError?.("Camera permission denied. Please enable camera access.");
      }
    };

    if (scanning) {
      requestPermission();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scanning, facingMode, onError]);

  // Mock QR detection (in real implementation, use a QR library like jsqr)
  useEffect(() => {
    if (!scanning || !videoRef.current || !hasPermission) return;

    const detectQR = () => {
      if (isProcessing || scannedData) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Mock QR detection - in real implementation, use jsqr library
      // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      // const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      // Mock successful scan for demo
      const mockScan = Math.random() < 0.001; // 0.1% chance per frame
      if (mockScan && !scannedData) {
        const mockData =
          "kobklein://pay?recipient=user123&amount=50.00&currency=USD";
        setScannedData(mockData);
        setIsProcessing(true);

        setTimeout(() => {
          onScan(mockData);
          setIsProcessing(false);
        }, 1500);
      }
    };

    const interval = setInterval(detectQR, 100); // Check 10 times per second
    return () => clearInterval(interval);
  }, [scanning, hasPermission, isProcessing, scannedData, onScan]);

  const toggleFlash = async () => {
    if (!streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const capabilities =
        videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;

      if (capabilities.torch) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !isFlashOn } as ExtendedMediaTrackConstraintSet],
        });
        setIsFlashOn(!isFlashOn);
      }
    } catch (error) {
      console.error("Flash toggle failed:", error);
    }
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target?.result as string;

      // Create image element to process
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        // Mock QR detection from image
        const mockData =
          "kobklein://pay?recipient=uploaded&amount=25.00&currency=USD";
        setScannedData(mockData);
        setIsProcessing(true);

        setTimeout(() => {
          onScan(mockData);
          setIsProcessing(false);
        }, 1000);
      };

      img.src = imageSrc;
    };

    reader.readAsDataURL(file);
  };

  if (hasPermission === false) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Camera Access Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Please enable camera access to scan QR codes
            </p>
          </div>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
            {allowUpload && (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload QR Image
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Scanner Interface */}
      <Card className="overflow-hidden">
        <div className="relative aspect-square bg-black">
          {/* Video Preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Scanning Frame */}
              <div
                className={cn(
                  "w-64 h-64 border-2 border-white rounded-lg relative",
                  isProcessing && "border-green-500",
                  scannedData && "border-green-500"
                )}
              >
                {/* Corner Indicators */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />

                {/* Scanning Line */}
                {!isProcessing && !scannedData && (
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary animate-pulse" />
                )}

                {/* Success Indicator */}
                {scannedData && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                )}

                {/* Processing Indicator */}
                {isProcessing && !scannedData && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-lg">
                    <Loader className="h-16 w-16 text-primary animate-spin" />
                  </div>
                )}
              </div>

              {/* Status Text */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <Badge
                  variant="secondary"
                  className="bg-black/50 text-white border-0"
                >
                  {isProcessing
                    ? "Processing..."
                    : scannedData
                    ? "QR Code Found!"
                    : "Align QR code within frame"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            {onClose && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onClose}
                className="bg-black/50 text-white border-0 backdrop-blur"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleFlash}
                className="bg-black/50 text-white border-0 backdrop-blur"
              >
                {isFlashOn ? (
                  <ZapOff className="h-4 w-4" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={switchCamera}
                className="bg-black/50 text-white border-0 backdrop-blur"
              >
                <SwitchCamera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Instructions */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur">
              Point camera at QR code
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      {allowUpload && (
        <div className="mt-4 space-y-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload QR Image
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload QR code image"
            title="Upload QR code image"
          />
        </div>
      )}
    </div>
  );
}

// QR Code Generator Component
interface QRGeneratorProps {
  data: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  foreground?: string;
  background?: string;
}

export function QRGenerator({
  data,
  size = 200,
  level = "M",
  foreground = "#000000",
  background = "#ffffff",
}: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Mock QR generation - in real implementation, use qrcode library
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Fill background
    context.fillStyle = background;
    context.fillRect(0, 0, size, size);

    // Draw mock QR pattern
    context.fillStyle = foreground;
    const moduleSize = size / 25; // 25x25 grid for simplicity

    // Draw corner squares
    const corners = [
      { x: 0, y: 0 },
      { x: 18, y: 0 },
      { x: 0, y: 18 },
    ];

    corners.forEach((corner) => {
      // Outer square
      context.fillRect(
        corner.x * moduleSize,
        corner.y * moduleSize,
        7 * moduleSize,
        7 * moduleSize
      );
      // Inner square (background)
      context.fillStyle = background;
      context.fillRect(
        (corner.x + 1) * moduleSize,
        (corner.y + 1) * moduleSize,
        5 * moduleSize,
        5 * moduleSize
      );
      // Center square
      context.fillStyle = foreground;
      context.fillRect(
        (corner.x + 2) * moduleSize,
        (corner.y + 2) * moduleSize,
        3 * moduleSize,
        3 * moduleSize
      );
    });

    // Draw random data pattern
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 25; y++) {
        // Skip corner detection patterns
        const inCorner = corners.some(
          (corner) =>
            x >= corner.x &&
            x < corner.x + 7 &&
            y >= corner.y &&
            y < corner.y + 7
        );

        if (!inCorner && Math.random() > 0.5) {
          context.fillRect(
            x * moduleSize,
            y * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
  }, [data, size, level, foreground, background]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareQR = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], "qr-code.png", { type: "image/png" });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "KobKlein QR Code",
            text: "Scan this QR code to make a payment",
          });
        } else {
          // Fallback to download
          downloadQR();
        }
      });
    } catch (error) {
      console.error("Share failed:", error);
      downloadQR();
    }
  };

  return (
    <Card className="max-w-sm mx-auto">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="border border-border rounded-lg" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Scan with any QR code reader
          </p>

          <div className="flex space-x-2">
            <Button onClick={shareQR} className="flex-1">
              Share QR Code
            </Button>
            <Button onClick={downloadQR} variant="outline" className="flex-1">
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

