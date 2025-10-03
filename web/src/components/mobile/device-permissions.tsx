/**
 * Device Permissions Manager Component
 * Handles requesting and managing device permissions for PWA
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useDeviceCapabilities,
  useDevicePermissions,
} from "@/hooks/use-device-integration";
import {
  AlertCircle,
  Bell,
  Camera,
  CheckCircle,
  MapPin,
  Smartphone,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface PermissionItemProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: boolean | null;
  onRequest: () => Promise<void>;
  isRequired?: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({
  name,
  description,
  icon,
  status,
  onRequest,
  isRequired = false,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      await onRequest();
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusIcon = () => {
    if (status === true)
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === false) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (status === true) return "Granted";
    if (status === false) return "Denied";
    return "Unknown";
  };

  const getStatusColor = () => {
    if (status === true) return "bg-green-100 text-green-800 border-green-200";
    if (status === false) return "bg-red-100 text-red-800 border-red-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900">{name}</h3>
            {isRequired && (
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
        {status !== true && (
          <Button
            onClick={handleRequest}
            disabled={isRequesting}
            size="sm"
            variant={status === false ? "destructive" : "default"}
          >
            {isRequesting
              ? "Requesting..."
              : status === false
              ? "Retry"
              : "Grant"}
          </Button>
        )}
      </div>
    </div>
  );
};

export function DevicePermissionsManager() {
  const { permissions, requestAllPermissions, checkPermissions } =
    useDevicePermissions();
  const { capabilities, isLoading: capabilitiesLoading } =
    useDeviceCapabilities();
  const [isRequestingAll, setIsRequestingAll] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const handleRequestAll = async () => {
    setIsRequestingAll(true);
    try {
      await requestAllPermissions();
    } finally {
      setIsRequestingAll(false);
    }
  };

  const handleRequestCamera = async () => {
    await checkPermissions();
  };

  const handleRequestGeolocation = async () => {
    await checkPermissions();
  };

  const handleRequestNotifications = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    await checkPermissions();
  };

  const allGranted =
    permissions.camera && permissions.geolocation && permissions.notifications;
  const anyDenied =
    permissions.camera === false ||
    permissions.geolocation === false ||
    permissions.notifications === false;

  if (capabilitiesLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Detecting device capabilities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Device Permissions</span>
            </CardTitle>
            <CardDescription>
              Grant permissions to enable native device features for the best
              KobKlein experience
            </CardDescription>
          </div>
          {allGranted && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              All Set
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Status Overview */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Permission Status</h3>
            <p className="text-sm text-gray-500">
              {allGranted
                ? "All permissions granted - you can use all features!"
                : anyDenied
                ? "Some permissions are denied - some features may be limited"
                : "Permissions needed for full functionality"}
            </p>
          </div>
          <Button
            onClick={handleRequestAll}
            disabled={isRequestingAll || !!allGranted}
            variant={allGranted ? "outline" : "default"}
          >
            {isRequestingAll
              ? "Requesting..."
              : allGranted
              ? "All Granted"
              : "Request All"}
          </Button>
        </div>

        <Separator />

        {/* Individual Permissions */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Individual Permissions</h3>

          {capabilities?.camera && (
            <PermissionItem
              name="Camera Access"
              description="Take photos, scan QR codes, and capture receipts"
              icon={<Camera className="h-5 w-5 text-blue-500" />}
              status={permissions.camera}
              onRequest={handleRequestCamera}
              isRequired
            />
          )}

          {capabilities?.geolocation && (
            <PermissionItem
              name="Location Access"
              description="Find nearby merchants and ATMs, detect fraudulent transactions"
              icon={<MapPin className="h-5 w-5 text-green-500" />}
              status={permissions.geolocation}
              onRequest={handleRequestGeolocation}
              isRequired
            />
          )}

          <PermissionItem
            name="Push Notifications"
            description="Receive transaction alerts, security notifications, and promotions"
            icon={<Bell className="h-5 w-5 text-orange-500" />}
            status={permissions.notifications}
            onRequest={handleRequestNotifications}
            isRequired
          />
        </div>

        <Separator />

        {/* Device Capabilities Summary */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Device Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  capabilities?.camera ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">Camera</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  capabilities?.geolocation ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">GPS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  capabilities?.biometrics ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">Biometrics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  capabilities?.haptics ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">Haptics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  capabilities?.sensors.accelerometer
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm">Motion</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  capabilities?.networkInfo ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  capabilities?.battery ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">Battery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  capabilities?.storage ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">Storage</span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Why do we need these permissions?
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Camera:</strong> Scan QR codes for quick payments and
              capture receipt photos
            </li>
            <li>
              • <strong>Location:</strong> Find nearby merchants, ATMs, and
              detect suspicious activity
            </li>
            <li>
              • <strong>Notifications:</strong> Instant alerts for transactions,
              security, and account updates
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

