import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ROLE_OPTIONS = [
  {
    key: "individual",
    label: "Individual",
    icon: "person-outline",
    description: "Personal financial management",
  },
  {
    key: "diaspora",
    label: "Diaspora",
    icon: "globe-outline",
    description: "International remittances & connections",
  },
  {
    key: "merchant",
    label: "Merchant",
    icon: "storefront-outline",
    description: "Business transactions & payments",
  },
  {
    key: "distributor",
    label: "Distributor",
    icon: "business-outline",
    description: "Supply chain & wholesale operations",
  },
];

export const SignUpScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "individual" as any,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Animations - using useRef to avoid recreating on each render
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const stepProgressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Update progress bar
    Animated.timing(stepProgressAnim, {
      toValue: currentStep / 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.fullName || !formData.email || !formData.phone) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      setCurrentStep(2);
    } else {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    if (!formData.password || !formData.confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual sign-up with AuthContext
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      Alert.alert(
        "Success!",
        "Your account has been created successfully. Please check your email to verify your account.",
        [{ text: "OK", onPress: () => router.replace("/auth/signin") }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>

      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#A5B4FC"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#A5B4FC"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange("fullName", value)}
          autoCapitalize="words"
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#A5B4FC"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A5B4FC"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="call-outline"
          size={20}
          color="#A5B4FC"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#A5B4FC"
          value={formData.phone}
          onChangeText={(value) => handleInputChange("phone", value)}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Security & Role</Text>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#A5B4FC"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A5B4FC"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#A5B4FC"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#A5B4FC"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#A5B4FC"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#A5B4FC"
          />
        </TouchableOpacity>
      </View>

      {/* Role Selection */}
      <Text style={styles.roleTitle}>Choose Your Role</Text>
      {ROLE_OPTIONS.map((role) => (
        <TouchableOpacity
          key={role.key}
          style={[
            styles.roleOption,
            formData.role === role.key && styles.roleOptionSelected,
          ]}
          onPress={() => handleInputChange("role", role.key)}
        >
          <Ionicons
            name={role.icon as any}
            size={24}
            color={formData.role === role.key ? "#10B981" : "#A5B4FC"}
          />
          <View style={styles.roleContent}>
            <Text
              style={[
                styles.roleLabel,
                formData.role === role.key && styles.roleLabelSelected,
              ]}
            >
              {role.label}
            </Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
          </View>
          {formData.role === role.key && (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={["#0F2A6B", "#1E3A8A", "#1E40AF", "#3B82F6"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() =>
                    currentStep === 1 ? router.back() : setCurrentStep(1)
                  }
                >
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>KobKlein</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Step {currentStep} of 2</Text>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: stepProgressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join the revolutionary fintech experience
              </Text>

              {/* Form Steps */}
              {currentStep === 1 ? renderStep1() : renderStep2()}

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isLoading && styles.actionButtonLoading,
                ]}
                onPress={handleNextStep}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <Animated.View style={styles.loadingSpinner} />
                  ) : (
                    <Text style={styles.actionButtonText}>
                      {currentStep === 1 ? "Continue" : "Create Account"}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <Link href="/auth/signin" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    color: "#E0E7FF",
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    marginBottom: 30,
  },
  stepContainer: {
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  eyeIcon: {
    padding: 4,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleOptionSelected: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  roleContent: {
    flex: 1,
    marginLeft: 12,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  roleLabelSelected: {
    color: "#10B981",
  },
  roleDescription: {
    fontSize: 14,
    color: "#A5B4FC",
    marginTop: 2,
  },
  actionButton: {
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  actionButtonLoading: {
    opacity: 0.7,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingSpinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderTopColor: "transparent",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  signInText: {
    color: "#E0E7FF",
    fontSize: 16,
  },
  signInLink: {
    color: "#10B981",
    fontSize: 16,
    fontWeight: "600",
  },
});
