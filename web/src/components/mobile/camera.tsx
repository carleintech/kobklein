/**
 * Advanced Camera Component
 * Provides camera functionality with QR scanning, photo capture, and document scanning
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCamera, useHaptics } from "@/hooks/use-device-integration";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  FileImage,
  QrCode,
  Square,
  SwitchCamera,
  X,
  Zap,
  ZapOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CameraViewProps {
  onPhotoCapture?: (photoData: string) => void;
  onQRCodeScanned?: (data: string) => void;
  mode?: "photo" | "qr" | "document";
  className?: string;
}

export function CameraView({
  onPhotoCapture,
  onQRCodeScanned,
  mode = "photo",
  className = "",
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    isActive,
    stream,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    requestPermission,
    hasPermission,
  } = useCamera();
  const { light: hapticLight, error: hapticError } = useHaptics();

  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [flashEnabled, setFlashEnabled] = useState(false);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleStartCamera = async () => {
    try {
      setError(null);

      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setError("Camera permission is required");
          return;
        }
      }

      await startCamera({ facingMode });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start camera");
    }
  };

  const handleCapturePhoto = async () => {
    if (!canvasRef.current) return;

    try {
      setIsCapturing(true);
      hapticLight();

      const photoData = await capturePhoto(canvasRef.current);
      onPhotoCapture?.(photoData);
    } catch (err) {
      hapticError();
      setError(err instanceof Error ? err.message : "Failed to capture photo");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSwitchCamera = async () => {
    try {
      await switchCamera();
      setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to switch camera");
    }
  };

  const handleStopCamera = () => {
    stopCamera();
    setError(null);
  };

  if (hasPermission === false) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-16 w-16 text-orange-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Camera Permission Required
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Please allow camera access to use this feature
          </p>
          <Button onClick={handleStartCamera}>Grant Camera Permission</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>
              {mode === "qr"
                ? "QR Scanner"
                : mode === "document"
                ? "Document Scanner"
                : "Camera"}
            </span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {mode === "qr" && <QrCode className="h-4 w-4 text-blue-500" />}
            {mode === "document" && (
              <FileImage className="h-4 w-4 text-green-500" />
            )}
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          className="relative bg-black rounded-lg overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          {isActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Camera overlay for different modes */}
              {mode === "qr" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg">
                    <div className="w-full h-full border-2 border-blue-500 rounded-lg animate-pulse" />
                  </div>
                </div>
              )}

              {mode === "document" && (
                <div className="absolute inset-4 border-2 border-green-500 rounded-lg">
                  <div className="absolute top-2 left-2 right-2 text-center">
                    <Badge className="bg-green-500 text-white">
                      Align document within frame
                    </Badge>
                  </div>
                </div>
              )}

              {/* Camera controls overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={() => setFlashEnabled(!flashEnabled)}
                >
                  {flashEnabled ? (
                    <Zap className="h-4 w-4" />
                  ) : (
                    <ZapOff className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16"
                  onClick={handleCapturePhoto}
                  disabled={isCapturing}
                >
                  {isCapturing ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
                  ) : (
                    <Square className="h-6 w-6" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={handleSwitchCamera}
                >
                  <SwitchCamera className="h-4 w-4" />
                </Button>
              </div>

              {/* Stop camera button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={handleStopCamera}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <Camera className="h-16 w-16 mb-4 text-gray-400" />
              <p className="text-gray-400 mb-4">Camera not active</p>
              <Button onClick={handleStartCamera}>Start Camera</Button>
            </div>
          )}
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Mode-specific instructions */}
        <div className="text-center text-sm text-gray-500">
          {mode === "qr" && "Point your camera at a QR code to scan it"}
          {mode === "document" &&
            "Position the document within the green frame for best results"}
          {mode === "photo" && "Tap the capture button to take a photo"}
        </div>
      </CardContent>
    </Card>
  );
}

interface PhotoPreviewProps {
  photoData: string;
  onSave?: () => void;
  onRetake?: () => void;
  onClose?: () => void;
  title?: string;
}

export function PhotoPreview({
  photoData,
  onSave,
  onRetake,
  onClose,
  title = "Photo Preview",
}: PhotoPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileImage className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          {onClose && (
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={photoData}
            alt="Captured photo"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex space-x-2">
          {onRetake && (
            <Button variant="outline" onClick={onRetake} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Retake
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Photo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface QRScannerProps {
  onQRCodeScanned: (data: string) => void;
  isActive?: boolean;
  className?: string;
}

export function QRScanner({
  onQRCodeScanned,
  isActive = true,
  className = "",
}: QRScannerProps) {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const { success: hapticSuccess } = useHaptics();

  const handleQRScanned = (data: string) => {
    setScannedData(data);
    hapticSuccess();
    onQRCodeScanned(data);
  };

  if (scannedData) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            QR Code Scanned!
          </h3>
          <p className="text-gray-500 text-center mb-4 font-mono bg-gray-100 p-2 rounded break-all">
            {scannedData}
          </p>
          <Button onClick={() => setScannedData(null)} variant="outline">
            Scan Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <CameraView
      mode="qr"
      onQRCodeScanned={handleQRScanned}
      className={className}
    />
  );
}

