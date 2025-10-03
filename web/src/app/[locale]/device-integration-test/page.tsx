/**
 * Device Integration Test Page
 * Comprehensive testing interface for all device integration features
 */

"use client";

import {
  BiometricLogin,
  BiometricSetup,
} from "@/components/mobile/biometric-auth";
import { CameraView, QRScanner } from "@/components/mobile/camera";
import { DevicePermissionsManager } from "@/components/mobile/device-permissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeviceCapabilities,
  useDeviceFeatures,
  useDeviceSensors,
  useGeolocation,
  useHaptics,
} from "@/hooks/use-device-integration";
import {
  Activity,
  CheckCircle,
  Info,
  MapPin,
  Smartphone,
  TestTube2,
  Vibrate,
} from "lucide-react";
import { useState } from "react";

export default function DeviceIntegrationTest() {
  const { capabilities, isLoading } = useDeviceCapabilities();
  const {
    location,
    getCurrentLocation,
    startWatching,
    stopWatching,
    isWatching,
  } = useGeolocation();
  const { light, medium, heavy, success, error, notification } = useHaptics();
  const { sensorData, activeSensors, startSensor, stopSensor } =
    useDeviceSensors();
  const deviceInfo = useDeviceFeatures();

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [scannedQR, setScannedQR] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Map<string, boolean>>(
    new Map()
  );

  const runTest = async (
    testName: string,
    testFn: () => Promise<boolean> | boolean
  ) => {
    try {
      const result = await testFn();
      setTestResults((prev) => new Map(prev).set(testName, result));
      return result;
    } catch (error) {
      setTestResults((prev) => new Map(prev).set(testName, false));
      return false;
    }
  };

  const handleLocationTest = async () => {
    return runTest("location", async () => {
      await getCurrentLocation();
      return true;
    });
  };

  const handleHapticsTest = () => {
    return runTest("haptics", () => {
      light();
      setTimeout(() => medium(), 200);
      setTimeout(() => heavy(), 400);
      return true;
    });
  };

  const handleSensorTest = async (sensor: "accelerometer" | "gyroscope") => {
    return runTest(`${sensor}`, async () => {
      await startSensor(sensor);
      setTimeout(() => stopSensor(sensor), 3000);
      return true;
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading device capabilities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Device Integration Test
        </h1>
        <p className="text-gray-600">
          Test and validate all native device capabilities for KobKlein PWA
        </p>
      </div>

      {/* Device Info Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Device Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Device Type</p>
              <Badge variant={deviceInfo.isMobile ? "default" : "secondary"}>
                {deviceInfo.isMobile
                  ? "Mobile"
                  : deviceInfo.isTablet
                  ? "Tablet"
                  : "Desktop"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Screen Size</p>
              <p className="text-sm">
                {deviceInfo.screenSize.width} × {deviceInfo.screenSize.height}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Orientation</p>
              <Badge variant="outline">{deviceInfo.orientation}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Connection</p>
              <Badge variant={deviceInfo.isOnline ? "default" : "destructive"}>
                {deviceInfo.isOnline ? "Online" : "Offline"} (
                {deviceInfo.connectionType})
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Tabs */}
      <Tabs defaultValue="permissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="camera">Camera</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
          <TabsTrigger value="haptics">Haptics</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions">
          <DevicePermissionsManager />
        </TabsContent>

        <TabsContent value="camera" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Photo Capture</CardTitle>
              </CardHeader>
              <CardContent>
                {capturedPhoto ? (
                  <div className="space-y-4">
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      className="w-full rounded-lg"
                    />
                    <Button
                      onClick={() => setCapturedPhoto(null)}
                      variant="outline"
                      className="w-full"
                    >
                      Take Another Photo
                    </Button>
                  </div>
                ) : (
                  <CameraView mode="photo" onPhotoCapture={setCapturedPhoto} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
              </CardHeader>
              <CardContent>
                {scannedQR ? (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        QR Code scanned:{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          {scannedQR}
                        </code>
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={() => setScannedQR(null)}
                      variant="outline"
                      className="w-full"
                    >
                      Scan Another QR Code
                    </Button>
                  </div>
                ) : (
                  <QRScanner onQRCodeScanned={setScannedQR} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Geolocation Testing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={handleLocationTest}>
                  Get Current Location
                </Button>
                <Button
                  onClick={() =>
                    isWatching ? stopWatching() : startWatching()
                  }
                  variant={isWatching ? "destructive" : "default"}
                >
                  {isWatching ? "Stop Watching" : "Start Watching"}
                </Button>
              </div>

              {location && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Location:</strong> {location.latitude.toFixed(6)},{" "}
                    {location.longitude.toFixed(6)}
                    <br />
                    <strong>Accuracy:</strong> {location.accuracy.toFixed(0)}m
                    <br />
                    <strong>Timestamp:</strong>{" "}
                    {new Date(location.timestamp).toLocaleString()}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    testResults.get("location") ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">
                  Location Test{" "}
                  {testResults.get("location") ? "Passed" : "Not Run"}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biometrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BiometricSetup
              userId="test-user"
              userName="Test User"
              onSetupComplete={(success) =>
                runTest("biometric-setup", () => success)
              }
            />
            <Card>
              <CardHeader>
                <CardTitle>Biometric Login Test</CardTitle>
              </CardHeader>
              <CardContent>
                <BiometricLogin
                  onAuthSuccess={() => runTest("biometric-auth", () => true)}
                  onAuthFailure={() => runTest("biometric-auth", () => false)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="haptics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Vibrate className="h-5 w-5" />
                <span>Haptic Feedback Testing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => {
                    light();
                    runTest("haptic-light", () => true);
                  }}
                  variant="outline"
                >
                  Light
                </Button>
                <Button
                  onClick={() => {
                    medium();
                    runTest("haptic-medium", () => true);
                  }}
                  variant="outline"
                >
                  Medium
                </Button>
                <Button
                  onClick={() => {
                    heavy();
                    runTest("haptic-heavy", () => true);
                  }}
                  variant="outline"
                >
                  Heavy
                </Button>
                <Button
                  onClick={() => {
                    success();
                    runTest("haptic-success", () => true);
                  }}
                  variant="outline"
                >
                  Success
                </Button>
                <Button
                  onClick={() => {
                    error();
                    runTest("haptic-error", () => true);
                  }}
                  variant="outline"
                >
                  Error
                </Button>
                <Button
                  onClick={() => {
                    notification();
                    runTest("haptic-notification", () => true);
                  }}
                  variant="outline"
                >
                  Notification
                </Button>
              </div>

              <Button onClick={handleHapticsTest} className="w-full">
                <TestTube2 className="h-4 w-4 mr-2" />
                Test All Haptics
              </Button>

              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    testResults.get("haptics") ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">
                  Haptics Test{" "}
                  {testResults.get("haptics") ? "Passed" : "Not Run"}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Device Sensors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Accelerometer</h4>
                    <Badge
                      variant={
                        activeSensors.has("accelerometer")
                          ? "default"
                          : "secondary"
                      }
                    >
                      {activeSensors.has("accelerometer")
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleSensorTest("accelerometer")}
                    variant="outline"
                    className="w-full"
                  >
                    Test Accelerometer
                  </Button>
                  {sensorData.get("accelerometer") && (
                    <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                      X:{" "}
                      {sensorData.get("accelerometer")?.values[0]?.toFixed(2)}
                      <br />
                      Y:{" "}
                      {sensorData.get("accelerometer")?.values[1]?.toFixed(2)}
                      <br />
                      Z:{" "}
                      {sensorData.get("accelerometer")?.values[2]?.toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Gyroscope</h4>
                    <Badge
                      variant={
                        activeSensors.has("gyroscope") ? "default" : "secondary"
                      }
                    >
                      {activeSensors.has("gyroscope") ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleSensorTest("gyroscope")}
                    variant="outline"
                    className="w-full"
                  >
                    Test Gyroscope
                  </Button>
                  {sensorData.get("gyroscope") && (
                    <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                      α: {sensorData.get("gyroscope")?.values[0]?.toFixed(2)}°
                      <br />
                      β: {sensorData.get("gyroscope")?.values[1]?.toFixed(2)}°
                      <br />
                      γ: {sensorData.get("gyroscope")?.values[2]?.toFixed(2)}°
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Test Results</h4>
                <div className="space-y-1">
                  {["accelerometer", "gyroscope"].map((sensor) => (
                    <div key={sensor} className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          testResults.get(sensor)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm capitalize">
                        {sensor} Test{" "}
                        {testResults.get(sensor) ? "Passed" : "Not Run"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Capabilities Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Device Capabilities Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {capabilities && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {Object.entries(capabilities).map(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                  return Object.entries(value).map(([subKey, subValue]) => (
                    <div
                      key={`${key}.${subKey}`}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          subValue ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm capitalize">{subKey}</span>
                    </div>
                  ));
                }
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        value ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm capitalize">{key}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
