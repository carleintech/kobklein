import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface PaymentData {
  amount?: string;
  recipient?: string;
  currency?: string;
  reference?: string;
  type: "payment" | "receive" | "merchant" | "unknown";
}

export default function RevolutionaryQRScanner() {
  // Camera and permissions
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isScanning, setIsScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState<PaymentData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Animation values
  const scanLinePosition = useSharedValue(-200);
  const cornerAnimation = useSharedValue(1);
  const pulseAnimation = useSharedValue(1);
  const successAnimation = useSharedValue(0);
  const modalAnimation = useSharedValue(0);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  useEffect(() => {
    initializeAnimations();
  }, []);

  const initializeAnimations = () => {
    // Scanning line animation
    scanLinePosition.value = withRepeat(
      withTiming(height * 0.6, { duration: 2000 }),
      -1,
      true
    );

    // Corner pulse animation
    cornerAnimation.value = withRepeat(
      withSpring(1.1, { damping: 15, stiffness: 200 }),
      -1,
      true
    );

    // General pulse
    pulseAnimation.value = withRepeat(
      withSpring(1.05, { damping: 12, stiffness: 150 }),
      -1,
      true
    );
  };

  const requestCameraPermission = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await requestPermission();
      return result.granted;
    } catch (error) {
      Alert.alert("Error", "Failed to request camera permission");
      return false;
    }
  };

  const startScanning = async () => {
    if (!permission?.granted) {
      const granted = await requestCameraPermission();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is needed for QR scanning"
        );
        return;
      }
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScannerActive(true);
    setIsScanning(true);
  };

  const stopScanning = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScannerActive(false);
    setIsScanning(false);
  };

  const parseQRData = (data: string): PaymentData => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(data);
      return {
        type: "payment",
        amount: parsed.amount,
        recipient: parsed.recipient,
        currency: parsed.currency || "USD",
        reference: parsed.reference,
      };
    } catch {
      // Handle different QR formats
      if (data.toLowerCase().includes("pay") || data.includes("$")) {
        return {
          type: "payment",
          recipient: "Unknown Merchant",
          currency: "USD",
        };
      } else if (data.toLowerCase().includes("receive")) {
        return {
          type: "receive",
          currency: "USD",
        };
      } else if (data.toLowerCase().includes("merchant")) {
        return {
          type: "merchant",
          recipient: data,
          currency: "USD",
        };
      } else {
        return {
          type: "unknown",
          recipient: data,
        };
      }
    }
  };

  const handleQRScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;

    // Success haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Success animation
    successAnimation.value = withSpring(1, {}, () => {
      runOnJS(setIsScanning)(false);
    });

    const paymentData = parseQRData(data);
    setScannedData(paymentData);

    // Show payment modal after animation
    setTimeout(() => {
      setShowPaymentModal(true);
      modalAnimation.value = withSpring(1);
    }, 500);
  };

  const processPayment = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // Simulate payment processing
      Alert.alert(
        "🚀 Payment Processing",
        `Processing payment of $${paymentAmount || "0.00"}\nTo: ${
          scannedData?.recipient || "Unknown"
        }\nNote: ${paymentNote || "No note"}`,
        [
          {
            text: "Confirm Payment",
            onPress: async () => {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              Alert.alert(
                "✅ Payment Successful!",
                "Your payment has been processed successfully."
              );
              closeModal();
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "❌ Payment Failed",
        "There was an error processing your payment."
      );
    }
  };

  const closeModal = () => {
    modalAnimation.value = withTiming(0, {}, () => {
      runOnJS(setShowPaymentModal)(false);
      runOnJS(setScannedData)(null);
      runOnJS(setPaymentAmount)("");
      runOnJS(setPaymentNote)("");
      successAnimation.value = 0;
    });
  };

  const toggleFlash = async () => {
    await Haptics.selectionAsync();
    setFlashEnabled(!flashEnabled);
  };

  const switchCamera = async () => {
    await Haptics.selectionAsync();
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Animated styles
  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value }],
  }));

  const cornerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cornerAnimation.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const successStyle = useAnimatedStyle(() => ({
    opacity: successAnimation.value,
    transform: [{ scale: successAnimation.value }],
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: modalAnimation.value,
    transform: [{ scale: interpolate(modalAnimation.value, [0, 1], [0.8, 1]) }],
  }));

  // QR Scanner Overlay
  const ScannerOverlay = () => (
    <View style={styles.overlay}>
      {/* Scanning frame */}
      <View style={styles.scanFrame}>
        {/* Corner indicators */}
        <Animated.View style={[styles.cornerTL, cornerStyle]} />
        <Animated.View style={[styles.cornerTR, cornerStyle]} />
        <Animated.View style={[styles.cornerBL, cornerStyle]} />
        <Animated.View style={[styles.cornerBR, cornerStyle]} />

        {/* Scanning line */}
        {isScanning && (
          <Animated.View style={[styles.scanLine, scanLineStyle]}>
            <LinearGradient
              colors={["transparent", "#10B981", "#10B981", "transparent"]}
              style={styles.scanLineGradient}
            />
          </Animated.View>
        )}

        {/* Success overlay */}
        <Animated.View style={[styles.successOverlay, successStyle]}>
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          <Text style={styles.successText}>QR Code Detected!</Text>
        </Animated.View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.6)"]}
          style={styles.instructionsGradient}
        >
          <Text style={styles.instructionsTitle}>
            {isScanning ? "📱 Scan QR Code" : "✅ QR Code Found"}
          </Text>
          <Text style={styles.instructionsText}>
            {isScanning
              ? "Position the QR code within the frame"
              : "Processing payment information..."}
          </Text>
        </LinearGradient>
      </View>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
          <Animated.View style={pulseStyle}>
            <LinearGradient
              colors={
                flashEnabled
                  ? ["#F59E0B", "#D97706"]
                  : ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]
              }
              style={styles.controlGradient}
            >
              <Ionicons
                name={flashEnabled ? "flash" : "flash-off"}
                size={24}
                color={flashEnabled ? "#FFFFFF" : "#A5B4FC"}
              />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchCamera} style={styles.controlButton}>
          <Animated.View style={pulseStyle}>
            <LinearGradient
              colors={["rgba(59, 130, 246, 0.3)", "rgba(37, 99, 235, 0.2)"]}
              style={styles.controlGradient}
            >
              <Ionicons name="camera-reverse" size={24} color="#3B82F6" />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={stopScanning} style={styles.controlButton}>
          <Animated.View style={pulseStyle}>
            <LinearGradient
              colors={["rgba(239, 68, 68, 0.3)", "rgba(220, 38, 38, 0.2)"]}
              style={styles.controlGradient}
            >
              <Ionicons name="close" size={24} color="#EF4444" />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Payment Modal
  const PaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent
      animationType="none"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, modalStyle]}>
          <LinearGradient
            colors={["#1E3A8A", "#1E40AF", "#3B82F6"]}
            style={styles.modalGradient}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💳 Payment Details</Text>
              <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Payment Info */}
            <View style={styles.paymentInfo}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Type:</Text>
                <View
                  style={[
                    styles.paymentBadge,
                    { backgroundColor: getTypeColor(scannedData?.type) },
                  ]}
                >
                  <Text style={styles.paymentBadgeText}>
                    {scannedData?.type?.toUpperCase()}
                  </Text>
                </View>
              </View>

              {scannedData?.recipient && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>To:</Text>
                  <Text style={styles.paymentValue}>
                    {scannedData.recipient}
                  </Text>
                </View>
              )}

              {scannedData?.currency && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Currency:</Text>
                  <Text style={styles.paymentValue}>
                    {scannedData.currency}
                  </Text>
                </View>
              )}
            </View>

            {/* Payment Form */}
            <View style={styles.paymentForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>💰 Amount</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.00"
                  placeholderTextColor="#A5B4FC"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>📝 Note (Optional)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Payment description..."
                  placeholderTextColor="#A5B4FC"
                  value={paymentNote}
                  onChangeText={setPaymentNote}
                  multiline
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={closeModal}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={processPayment}
                style={[styles.actionButton, styles.payButton]}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.payButtonGradient}
                >
                  <Ionicons name="card" size={20} color="#FFFFFF" />
                  <Text style={styles.payButtonText}>
                    Pay ${paymentAmount || "0.00"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "payment":
        return "#3B82F6";
      case "receive":
        return "#10B981";
      case "merchant":
        return "#F59E0B";
      default:
        return "#8B5CF6";
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={["#0F2A6B", "#1E3A8A", "#3B82F6"]}
          style={styles.permissionGradient}
        >
          <Text style={styles.permissionText}>📷 Camera Access Required</Text>
          <Text style={styles.permissionSubtext}>
            Grant camera permission to scan QR codes
          </Text>
        </LinearGradient>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={["#0F2A6B", "#1E3A8A", "#3B82F6"]}
          style={styles.permissionGradient}
        >
          <Animated.View style={pulseStyle}>
            <Ionicons name="camera" size={80} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.permissionTitle}>🔐 Camera Permission</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan QR codes for payments and
            transactions.
          </Text>
          <TouchableOpacity
            onPress={requestCameraPermission}
            style={styles.permissionButton}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scannerActive ? (
        <>
          <CameraView
            style={styles.camera}
            facing={facing}
            onBarcodeScanned={handleQRScanned}
            flash={flashEnabled ? "on" : "off"}
          />
          <ScannerOverlay />
        </>
      ) : (
        <LinearGradient
          colors={["#0F2A6B", "#1E3A8A", "#3B82F6"]}
          style={styles.startScreen}
        >
          <Animated.View style={[styles.startContent, pulseStyle]}>
            <Ionicons name="qr-code" size={100} color="#FFFFFF" />
            <Text style={styles.startTitle}>🚀 Revolutionary QR Scanner</Text>
            <Text style={styles.startSubtitle}>
              Scan QR codes for instant payments, merchant transactions, and
              peer-to-peer transfers
            </Text>

            <TouchableOpacity
              onPress={startScanning}
              style={styles.startButton}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.startButtonGradient}
              >
                <Ionicons name="camera" size={24} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Start Scanning</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      )}

      <PaymentModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 100,
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#10B981",
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#10B981",
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#10B981",
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#10B981",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
  },
  scanLineGradient: {
    flex: 1,
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
  },
  successText: {
    color: "#10B981",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  instructionsContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  instructionsGradient: {
    padding: 20,
    alignItems: "center",
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 14,
    color: "#A5B4FC",
    textAlign: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  controlButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  controlGradient: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  startScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  startContent: {
    alignItems: "center",
  },
  startTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  startSubtitle: {
    fontSize: 16,
    color: "#A5B4FC",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  startButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  permissionContainer: {
    flex: 1,
  },
  permissionGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: "#A5B4FC",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionSubtext: {
    fontSize: 14,
    color: "#A5B4FC",
    textAlign: "center",
  },
  permissionButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  permissionButtonGradient: {
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 25,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalClose: {
    padding: 5,
  },
  paymentInfo: {
    marginBottom: 25,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  paymentLabel: {
    fontSize: 16,
    color: "#A5B4FC",
    width: 80,
  },
  paymentValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    flex: 1,
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  paymentForm: {
    marginBottom: 25,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  modalActions: {
    flexDirection: "row",
    gap: 15,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  payButton: {
    overflow: "hidden",
  },
  payButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
