/**
 * React Hooks for Device Integration
 * Provides easy-to-use hooks for accessing native device capabilities
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  deviceManager,
  DeviceCapabilities,
  GeolocationData,
  CameraOptions,
  BiometricAuthResult,
  SensorData,
} from '@/lib/device-integration';

// Hook for device capabilities detection
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectCapabilities = async () => {
      try {
        setIsLoading(true);
        const caps = await deviceManager.initialize();
        setCapabilities(caps);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to detect capabilities');
      } finally {
        setIsLoading(false);
      }
    };

    detectCapabilities();
  }, []);

  return { capabilities, isLoading, error };
}

// Hook for camera functionality
export function useCamera() {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const granted = await deviceManager.camera.requestPermission();
      setHasPermission(granted);
      return granted;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Permission request failed');
      return false;
    }
  }, []);

  const startCamera = useCallback(async (options?: CameraOptions) => {
    try {
      setError(null);
      const mediaStream = await deviceManager.camera.startCamera(options);
      setStream(mediaStream);
      setIsActive(true);
      return mediaStream;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start camera');
      throw err;
    }
  }, []);

  const stopCamera = useCallback(() => {
    deviceManager.camera.stopCamera();
    setStream(null);
    setIsActive(false);
  }, []);

  const capturePhoto = useCallback(async (canvas: HTMLCanvasElement, quality?: number) => {
    try {
      return await deviceManager.camera.capturePhoto(canvas, quality);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture photo');
      throw err;
    }
  }, []);

  const switchCamera = useCallback(async () => {
    try {
      const newStream = await deviceManager.camera.switchCamera();
      setStream(newStream);
      return newStream;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch camera');
      throw err;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    isActive,
    stream,
    error,
    hasPermission,
    requestPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
  };
}

// Hook for geolocation functionality
export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const granted = await deviceManager.geolocation.requestPermission();
      setHasPermission(granted);
      return granted;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Permission request failed');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (highAccuracy?: boolean) => {
    try {
      setError(null);
      const loc = await deviceManager.geolocation.getCurrentLocation(highAccuracy);
      setLocation(loc);
      return loc;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
      throw err;
    }
  }, []);

  const startWatching = useCallback((highAccuracy?: boolean) => {
    setError(null);
    setIsWatching(true);

    deviceManager.geolocation.watchLocation(
      (loc) => {
        setLocation(loc);
      },
      (err) => {
        setError(err);
        setIsWatching(false);
      },
      highAccuracy
    );
  }, []);

  const stopWatching = useCallback(() => {
    deviceManager.geolocation.stopWatchingLocation();
    setIsWatching(false);
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      return await deviceManager.geolocation.reverseGeocode(lat, lng);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reverse geocode');
      throw err;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    location,
    isWatching,
    error,
    hasPermission,
    requestPermission,
    getCurrentLocation,
    startWatching,
    stopWatching,
    reverseGeocode,
  };
}

// Hook for biometric authentication
export function useBiometricAuth() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await deviceManager.biometric.isSupported();
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  const createCredential = useCallback(async (userId: string, userName: string) => {
    try {
      setError(null);
      const success = await deviceManager.biometric.createCredential(userId, userName);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create credential');
      throw err;
    }
  }, []);

  const authenticate = useCallback(async (challenge: string): Promise<BiometricAuthResult> => {
    try {
      setError(null);
      const result = await deviceManager.biometric.authenticate(challenge);
      setIsAuthenticated(result.success);
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Authentication failed';
      setError(error);
      return { success: false, error };
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setError(null);
  }, []);

  return {
    isSupported,
    isAuthenticated,
    error,
    createCredential,
    authenticate,
    logout,
  };
}

// Hook for haptic feedback
export function useHaptics() {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    setIsSupported(deviceManager.haptic.isSupported());
  }, []);

  const light = useCallback(() => {
    deviceManager.haptic.light();
  }, []);

  const medium = useCallback(() => {
    deviceManager.haptic.medium();
  }, []);

  const heavy = useCallback(() => {
    deviceManager.haptic.heavy();
  }, []);

  const success = useCallback(() => {
    deviceManager.haptic.success();
  }, []);

  const error = useCallback(() => {
    deviceManager.haptic.error();
  }, []);

  const notification = useCallback(() => {
    deviceManager.haptic.notification();
  }, []);

  const custom = useCallback((pattern: number[]) => {
    deviceManager.haptic.custom(pattern);
  }, []);

  return {
    isSupported,
    light,
    medium,
    heavy,
    success,
    error,
    notification,
    custom,
  };
}

// Hook for device sensors
export function useDeviceSensors() {
  const [sensorData, setSensorData] = useState<Map<string, SensorData>>(new Map());
  const [activeSensors, setActiveSensors] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const startSensor = useCallback(async (sensorType: 'accelerometer' | 'gyroscope') => {
    try {
      setError(null);

      const callback = (data: SensorData) => {
        setSensorData(prev => new Map(prev).set(sensorType, data));
      };

      if (sensorType === 'accelerometer') {
        await deviceManager.sensors.startAccelerometer(callback);
      } else if (sensorType === 'gyroscope') {
        await deviceManager.sensors.startGyroscope(callback);
      }

      setActiveSensors(prev => new Set(prev).add(sensorType));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to start ${sensorType}`);
    }
  }, []);

  const stopSensor = useCallback((sensorType: string) => {
    deviceManager.sensors.stopSensor(sensorType);
    setActiveSensors(prev => {
      const newSet = new Set(prev);
      newSet.delete(sensorType);
      return newSet;
    });
    setSensorData(prev => {
      const newMap = new Map(prev);
      newMap.delete(sensorType);
      return newMap;
    });
  }, []);

  const stopAllSensors = useCallback(() => {
    deviceManager.sensors.stopAllSensors();
    setActiveSensors(new Set());
    setSensorData(new Map());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSensors();
    };
  }, [stopAllSensors]);

  return {
    sensorData,
    activeSensors,
    error,
    startSensor,
    stopSensor,
    stopAllSensors,
  };
}

// Hook for requesting device permissions
export function useDevicePermissions() {
  const [permissions, setPermissions] = useState<{
    camera: boolean | null;
    geolocation: boolean | null;
    notifications: boolean | null;
  }>({
    camera: null,
    geolocation: null,
    notifications: null,
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const requestAllPermissions = useCallback(async () => {
    setIsRequesting(true);
    try {
      const results = await deviceManager.requestAllPermissions();
      setPermissions(results);
      return results;
    } catch (err) {
      console.error('Failed to request permissions:', err);
      return { camera: false, geolocation: false, notifications: false };
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const checkPermissions = useCallback(async () => {
    try {
      const cameraPermission = await deviceManager.camera.requestPermission();
      const geoPermission = await deviceManager.geolocation.requestPermission();
      const notificationPermission = Notification.permission === 'granted';

      const results = {
        camera: cameraPermission,
        geolocation: geoPermission,
        notifications: notificationPermission,
      };

      setPermissions(results);
      return results;
    } catch (err) {
      console.error('Failed to check permissions:', err);
      return { camera: false, geolocation: false, notifications: false };
    }
  }, []);

  return {
    permissions,
    isRequesting,
    requestAllPermissions,
    checkPermissions,
  };
}

// Hook for device-specific features detection
export function useDeviceFeatures() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    platform: '',
    userAgent: '',
    screenSize: { width: 0, height: 0 },
    orientation: 'portrait' as 'portrait' | 'landscape',
    pixelRatio: 1,
    isOnline: true,
    connectionType: 'unknown',
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        platform: navigator.platform,
        userAgent,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        pixelRatio: window.devicePixelRatio || 1,
        isOnline: navigator.onLine,
        connectionType: (navigator as any).connection?.effectiveType || 'unknown',
      });
    };

    updateDeviceInfo();

    const handleResize = () => updateDeviceInfo();
    const handleOnline = () => updateDeviceInfo();
    const handleOffline = () => updateDeviceInfo();

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return deviceInfo;
}