/**
 * Device Integration Library
 * Provides native device capabilities for PWA including camera, geolocation,
 * biometric auth, haptic feedback, and device sensors
 */

// Types for device capabilities
export interface DeviceCapabilities {
  camera: boolean;
  geolocation: boolean;
  biometrics: boolean;
  haptics: boolean;
  sensors: {
    accelerometer: boolean;
    gyroscope: boolean;
    magnetometer: boolean;
    ambientLight: boolean;
  };
  networkInfo: boolean;
  battery: boolean;
  storage: boolean;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export interface CameraOptions {
  facingMode: "user" | "environment";
  width?: number;
  height?: number;
  quality?: number;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: "fingerprint" | "face" | "voice";
}

export interface SensorData {
  type: "accelerometer" | "gyroscope" | "magnetometer" | "ambientLight";
  values: number[];
  timestamp: number;
}

// Device Capabilities Detector
export class DeviceCapabilitiesDetector {
  private static instance: DeviceCapabilitiesDetector;
  private capabilities: DeviceCapabilities | null = null;

  static getInstance(): DeviceCapabilitiesDetector {
    if (!DeviceCapabilitiesDetector.instance) {
      DeviceCapabilitiesDetector.instance = new DeviceCapabilitiesDetector();
    }
    return DeviceCapabilitiesDetector.instance;
  }

  async detectCapabilities(): Promise<DeviceCapabilities> {
    if (this.capabilities) {
      return this.capabilities;
    }

    const capabilities: DeviceCapabilities = {
      camera: await this.checkCameraSupport(),
      geolocation: this.checkGeolocationSupport(),
      biometrics: await this.checkBiometricSupport(),
      haptics: this.checkHapticsSupport(),
      sensors: {
        accelerometer: await this.checkSensorSupport("accelerometer"),
        gyroscope: await this.checkSensorSupport("gyroscope"),
        magnetometer: await this.checkSensorSupport("magnetometer"),
        ambientLight: await this.checkSensorSupport("ambient-light"),
      },
      networkInfo: this.checkNetworkInfoSupport(),
      battery: this.checkBatterySupport(),
      storage: this.checkStorageSupport(),
    };

    this.capabilities = capabilities;
    return capabilities;
  }

  private async checkCameraSupport(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some((device) => device.kind === "videoinput");
    } catch {
      return false;
    }
  }

  private checkGeolocationSupport(): boolean {
    return "geolocation" in navigator;
  }

  private async checkBiometricSupport(): Promise<boolean> {
    return "credentials" in navigator && "create" in navigator.credentials;
  }

  private checkHapticsSupport(): boolean {
    return "vibrate" in navigator;
  }

  private async checkSensorSupport(sensorType: string): Promise<boolean> {
    try {
      // Check if Generic Sensor API is supported
      return (
        "Accelerometer" in window ||
        "Gyroscope" in window ||
        "DeviceMotionEvent" in window
      );
    } catch {
      return false;
    }
  }

  private checkNetworkInfoSupport(): boolean {
    return (
      "connection" in navigator ||
      "mozConnection" in navigator ||
      "webkitConnection" in navigator
    );
  }

  private checkBatterySupport(): boolean {
    return "getBattery" in navigator;
  }

  private checkStorageSupport(): boolean {
    return "storage" in navigator && "estimate" in navigator.storage;
  }
}

// Camera Manager
export class CameraManager {
  private stream: MediaStream | null = null;

  async requestPermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      return result.state === "granted";
    } catch {
      // Fallback: try to access camera to check permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch {
        return false;
      }
    }
  }

  async startCamera(
    options: CameraOptions = { facingMode: "environment" }
  ): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: options.facingMode,
          width: options.width || 640,
          height: options.height || 480,
        },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (error) {
      throw new Error(`Failed to start camera: ${error}`);
    }
  }

  async capturePhoto(
    canvas: HTMLCanvasElement,
    quality: number = 0.8
  ): Promise<string> {
    if (!this.stream) {
      throw new Error("Camera not started");
    }

    const video = document.createElement("video");
    video.srcObject = this.stream;
    video.play();

    return new Promise((resolve) => {
      video.addEventListener("loadedmetadata", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      });
    });
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  async switchCamera(): Promise<MediaStream> {
    const currentFacing = this.getCurrentFacingMode();
    const newFacing = currentFacing === "user" ? "environment" : "user";

    this.stopCamera();
    return this.startCamera({ facingMode: newFacing });
  }

  private getCurrentFacingMode(): "user" | "environment" {
    if (!this.stream) return "environment";

    const videoTrack = this.stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    return (settings.facingMode as "user" | "environment") || "environment";
  }
}

// Geolocation Manager
export class GeolocationManager {
  private watchId: number | null = null;

  async requestPermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      return result.state === "granted";
    } catch {
      return false;
    }
  }

  async getCurrentLocation(
    highAccuracy: boolean = true
  ): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: highAccuracy,
        timeout: 10000,
        maximumAge: 60000,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        options
      );
    });
  }

  watchLocation(
    callback: (location: GeolocationData) => void,
    errorCallback: (error: string) => void,
    highAccuracy: boolean = true
  ): void {
    if (!navigator.geolocation) {
      errorCallback("Geolocation not supported");
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: highAccuracy,
      timeout: 10000,
      maximumAge: 60000,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        errorCallback(`Geolocation error: ${error.message}`);
      },
      options
    );
  }

  stopWatchingLocation(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      // Using a simple reverse geocoding service (you might want to use Google Maps API)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      return (
        data.displayName || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      );
    } catch {
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }
}

// Biometric Authentication Manager
export class BiometricAuthManager {
  async isSupported(): Promise<boolean> {
    return "credentials" in navigator && "create" in navigator.credentials;
  }

  async createCredential(userId: string, userName: string): Promise<boolean> {
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "KobKlein",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: userName,
            displayName: userName,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
          attestation: "direct",
        },
      });

      return credential !== null;
    } catch (error) {
      console.error("Failed to create biometric credential:", error);
      return false;
    }
  }

  async authenticate(challenge: string): Promise<BiometricAuthResult> {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new TextEncoder().encode(challenge),
          allowCredentials: [],
          userVerification: "required",
          timeout: 60000,
        },
      });

      if (credential) {
        return { success: true, biometricType: "fingerprint" };
      } else {
        return { success: false, error: "Authentication failed" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  }
}

// Haptic Feedback Manager
export class HapticManager {
  isSupported(): boolean {
    return "vibrate" in navigator;
  }

  // Basic vibration patterns
  light(): void {
    this.vibrate([10]);
  }

  medium(): void {
    this.vibrate([20]);
  }

  heavy(): void {
    this.vibrate([50]);
  }

  success(): void {
    this.vibrate([10, 10, 10]);
  }

  error(): void {
    this.vibrate([100, 50, 100]);
  }

  notification(): void {
    this.vibrate([50, 50, 50]);
  }

  custom(pattern: number[]): void {
    this.vibrate(pattern);
  }

  private vibrate(pattern: number[]): void {
    if (this.isSupported()) {
      navigator.vibrate(pattern);
    }
  }
}

// Device Sensor Manager
export class DeviceSensorManager {
  private sensorListeners: Map<string, any> = new Map();

  async startAccelerometer(
    callback: (data: SensorData) => void
  ): Promise<void> {
    if ("DeviceMotionEvent" in window) {
      const listener = (event: DeviceMotionEvent) => {
        if (event.acceleration) {
          callback({
            type: "accelerometer",
            values: [
              event.acceleration.x || 0,
              event.acceleration.y || 0,
              event.acceleration.z || 0,
            ],
            timestamp: Date.now(),
          });
        }
      };

      window.addEventListener("devicemotion", listener);
      this.sensorListeners.set("accelerometer", listener);
    }
  }

  async startGyroscope(callback: (data: SensorData) => void): Promise<void> {
    if ("DeviceOrientationEvent" in window) {
      const listener = (event: DeviceOrientationEvent) => {
        callback({
          type: "gyroscope",
          values: [event.alpha || 0, event.beta || 0, event.gamma || 0],
          timestamp: Date.now(),
        });
      };

      window.addEventListener("deviceorientation", listener);
      this.sensorListeners.set("gyroscope", listener);
    }
  }

  stopSensor(sensorType: string): void {
    const listener = this.sensorListeners.get(sensorType);
    if (listener) {
      if (sensorType === "accelerometer") {
        window.removeEventListener("devicemotion", listener);
      } else if (sensorType === "gyroscope") {
        window.removeEventListener("deviceorientation", listener);
      }
      this.sensorListeners.delete(sensorType);
    }
  }

  stopAllSensors(): void {
    Array.from(this.sensorListeners.keys()).forEach((sensorType) => {
      this.stopSensor(sensorType);
    });
  }
}

// Main Device Integration Manager
export class DeviceIntegrationManager {
  private static instance: DeviceIntegrationManager;

  public capabilities: DeviceCapabilitiesDetector;
  public camera: CameraManager;
  public geolocation: GeolocationManager;
  public biometric: BiometricAuthManager;
  public haptic: HapticManager;
  public sensors: DeviceSensorManager;

  private constructor() {
    this.capabilities = DeviceCapabilitiesDetector.getInstance();
    this.camera = new CameraManager();
    this.geolocation = new GeolocationManager();
    this.biometric = new BiometricAuthManager();
    this.haptic = new HapticManager();
    this.sensors = new DeviceSensorManager();
  }

  static getInstance(): DeviceIntegrationManager {
    if (!DeviceIntegrationManager.instance) {
      DeviceIntegrationManager.instance = new DeviceIntegrationManager();
    }
    return DeviceIntegrationManager.instance;
  }

  async initialize(): Promise<DeviceCapabilities> {
    return await this.capabilities.detectCapabilities();
  }

  // Convenience method for requesting all permissions
  async requestAllPermissions(): Promise<{
    camera: boolean;
    geolocation: boolean;
    notifications: boolean;
  }> {
    const results = await Promise.allSettled([
      this.camera.requestPermission(),
      this.geolocation.requestPermission(),
      Notification.requestPermission().then((result) => result === "granted"),
    ]);

    return {
      camera: results[0].status === "fulfilled" ? results[0].value : false,
      geolocation: results[1].status === "fulfilled" ? results[1].value : false,
      notifications:
        results[2].status === "fulfilled" ? results[2].value : false,
    };
  }
}

// Export singleton instance
export const deviceManager = DeviceIntegrationManager.getInstance();
