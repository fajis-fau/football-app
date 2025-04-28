import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react-native";

interface AuthScreenProps {
  onAuthenticated?: () => void;
}

const AuthScreen = ({ onAuthenticated = () => {} }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Username validation for signup
    if (!isLogin && !formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    // Confirm password validation for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Call the onLogin prop with email and password
      console.log("Authentication successful", formData);
      onLogin(formData.email, formData.password);
      // No need to navigate as the parent component will handle the state change
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear form and errors when switching modes
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-blue-900"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center px-6 py-10">
          {/* Logo and Header */}
          <View className="items-center mb-8">
            <Image
              source={{
                uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=football",
              }}
              className="w-24 h-24 rounded-full bg-white mb-4"
              style={{ width: 96, height: 96 }}
            />
            <Text className="text-3xl font-bold text-white mb-2">
              Football Club
            </Text>
            <Text className="text-lg text-blue-200 text-center">
              {isLogin
                ? "Sign in to access your account"
                : "Create an account to join"}
            </Text>
          </View>

          {/* Auth Form */}
          <View className="w-full bg-white rounded-xl p-6 shadow-lg">
            <Text className="text-2xl font-bold text-blue-900 mb-6">
              {isLogin ? "Login" : "Sign Up"}
            </Text>

            {/* Username field (signup only) */}
            {!isLogin && (
              <View className="mb-4">
                <View className="flex-row items-center border-b border-gray-300 pb-2">
                  <User size={20} color="#1e3a8a" />
                  <TextInput
                    className="flex-1 ml-2 text-base text-gray-800"
                    placeholder="Username"
                    value={formData.username}
                    onChangeText={(text) => handleChange("username", text)}
                  />
                </View>
                {errors.username ? (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.username}
                  </Text>
                ) : null}
              </View>
            )}

            {/* Email field */}
            <View className="mb-4">
              <View className="flex-row items-center border-b border-gray-300 pb-2">
                <Mail size={20} color="#1e3a8a" />
                <TextInput
                  className="flex-1 ml-2 text-base text-gray-800"
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                />
              </View>
              {errors.email ? (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            {/* Password field */}
            <View className="mb-4">
              <View className="flex-row items-center border-b border-gray-300 pb-2">
                <Lock size={20} color="#1e3a8a" />
                <TextInput
                  className="flex-1 ml-2 text-base text-gray-800"
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#1e3a8a" />
                  ) : (
                    <Eye size={20} color="#1e3a8a" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* Confirm Password field (signup only) */}
            {!isLogin && (
              <View className="mb-4">
                <View className="flex-row items-center border-b border-gray-300 pb-2">
                  <Lock size={20} color="#1e3a8a" />
                  <TextInput
                    className="flex-1 ml-2 text-base text-gray-800"
                    placeholder="Confirm Password"
                    secureTextEntry={!showPassword}
                    value={formData.confirmPassword}
                    onChangeText={(text) =>
                      handleChange("confirmPassword", text)
                    }
                  />
                </View>
                {errors.confirmPassword ? (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </Text>
                ) : null}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-blue-900 py-3 rounded-lg mt-4"
              onPress={handleSubmit}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isLogin ? "Login" : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password (login only) */}
            {isLogin && (
              <TouchableOpacity className="mt-4">
                <Text className="text-blue-900 text-center">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            {/* Toggle between login and signup */}
            <TouchableOpacity className="mt-6" onPress={toggleAuthMode}>
              <Text className="text-blue-900 text-center">
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
