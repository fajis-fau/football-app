import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking authentication status
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      // In a real app, you would check for a token in secure storage
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(checkAuth);
  }, []);

  const handleLogin = (email: string, password: string) => {
    console.log(`Login attempt with: ${email}`);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-blue-900">
        <Image
          source="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&q=80"
          className="w-24 h-24 rounded-full mb-4"
          contentFit="cover"
        />
        <Text className="text-white text-xl font-bold mb-4">
          Football Club App
        </Text>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-900">
      <StatusBar style="light" />
      <View className="flex-1">
        <View className="py-4 px-4 bg-blue-800 flex-row items-center justify-center">
          <Image
            source="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&q=80"
            className="w-10 h-10 rounded-full"
            contentFit="cover"
          />
          <Text className="text-white text-xl font-bold ml-2">
            FC Champions
          </Text>
        </View>

        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <AuthScreen onLogin={handleLogin} />
        )}
      </View>
    </SafeAreaView>
  );
}
