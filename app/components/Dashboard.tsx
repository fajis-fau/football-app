import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  Grid,
  User,
  Image as ImageIcon,
  Info,
  Bell,
} from "lucide-react-native";

interface DashboardProps {
  username?: string;
  teamName?: string;
  recentActivities?: Array<{
    id: string;
    type: "photo" | "video" | "news";
    title: string;
    timestamp: string;
  }>;
  notifications?: number;
  onLogout?: () => void;
}

const Dashboard = ({
  username = "John Doe",
  teamName = "FC United",
  recentActivities = [
    {
      id: "1",
      type: "photo",
      title: "Team Photo Session",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "video",
      title: "Match Highlights",
      timestamp: "1 day ago",
    },
    {
      id: "3",
      type: "news",
      title: "Upcoming Tournament",
      timestamp: "3 days ago",
    },
  ],
  notifications = 5,
}: DashboardProps) => {
  const router = useRouter();

  const navigateTo = (route: string) => {
    // In a real app, this would navigate to the respective screen
    console.log(`Navigating to ${route}`);
    // router.push(route);
  };

  return (
    <View className="flex-1 bg-blue-900 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-white text-2xl font-bold">{teamName}</Text>
          <Text className="text-blue-200">Welcome back, {username}</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            className="relative mr-4"
            onPress={() => navigateTo("/notifications")}
          >
            <Bell color="white" size={24} />
            {notifications > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs">{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Text className="text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Team Logo */}
      <View className="items-center mb-8">
        <Image
          source="https://api.dicebear.com/7.x/avataaars/svg?seed=football-club"
          style={{ width: 100, height: 100 }}
          className="rounded-full bg-white"
          contentFit="cover"
        />
      </View>

      {/* Navigation Grid */}
      <View className="flex-row flex-wrap justify-between mb-8">
        <TouchableOpacity
          className="bg-blue-800 w-[48%] p-4 rounded-xl mb-4 items-center"
          onPress={() => navigateTo("/player-profiles")}
        >
          <User color="white" size={32} />
          <Text className="text-white mt-2 font-semibold">Player Profiles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-800 w-[48%] p-4 rounded-xl mb-4 items-center"
          onPress={() => navigateTo("/media-gallery")}
        >
          <ImageIcon color="white" size={32} />
          <Text className="text-white mt-2 font-semibold">Media Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-800 w-[48%] p-4 rounded-xl mb-4 items-center"
          onPress={() => navigateTo("/club-info")}
        >
          <Info color="white" size={32} />
          <Text className="text-white mt-2 font-semibold">
            Club Information
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-800 w-[48%] p-4 rounded-xl mb-4 items-center"
          onPress={() => navigateTo("/user-profile")}
        >
          <User color="white" size={32} />
          <Text className="text-white mt-2 font-semibold">User Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View className="flex-1">
        <Text className="text-white text-xl font-bold mb-4">
          Recent Activity
        </Text>
        <ScrollView className="bg-blue-800 rounded-xl p-4">
          {recentActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              className="border-b border-blue-700 py-3 flex-row items-center"
              onPress={() => navigateTo(`/activity/${activity.id}`)}
            >
              <View className="bg-blue-600 p-2 rounded-full mr-3">
                {activity.type === "photo" && (
                  <ImageIcon color="white" size={16} />
                )}
                {activity.type === "video" && <Grid color="white" size={16} />}
                {activity.type === "news" && <Info color="white" size={16} />}
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  {activity.title}
                </Text>
                <Text className="text-blue-300 text-xs">
                  {activity.timestamp}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Dashboard;
