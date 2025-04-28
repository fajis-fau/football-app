import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Search, ChevronLeft, Star, Video } from "lucide-react-native";
import { TextInput } from "react-native";

interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets?: number;
  tackles?: number;
  passAccuracy: number;
}

interface PlayerMedia {
  id: string;
  type: "photo" | "video";
  url: string;
  thumbnail?: string;
  title: string;
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  image: string;
  stats: PlayerStats;
  media: PlayerMedia[];
}

interface PlayerProfilesProps {
  players?: Player[];
  onSelectPlayer?: (player: Player) => void;
}

const defaultPlayers: Player[] = [
  {
    id: "1",
    name: "Alex Johnson",
    position: "Forward",
    number: 9,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    stats: {
      appearances: 28,
      goals: 15,
      assists: 7,
      passAccuracy: 78,
    },
    media: [
      {
        id: "m1",
        type: "photo",
        url: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80",
        title: "Goal celebration",
      },
      {
        id: "m2",
        type: "video",
        url: "https://example.com/video1.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
        title: "Hat-trick highlights",
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Martinez",
    position: "Midfielder",
    number: 8,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    stats: {
      appearances: 30,
      goals: 5,
      assists: 12,
      passAccuracy: 89,
    },
    media: [
      {
        id: "m3",
        type: "photo",
        url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80",
        title: "Training session",
      },
    ],
  },
  {
    id: "3",
    name: "David Kim",
    position: "Defender",
    number: 4,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    stats: {
      appearances: 27,
      goals: 1,
      assists: 3,
      cleanSheets: 10,
      tackles: 45,
      passAccuracy: 82,
    },
    media: [
      {
        id: "m4",
        type: "photo",
        url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80",
        title: "Defensive action",
      },
      {
        id: "m5",
        type: "video",
        url: "https://example.com/video2.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80",
        title: "Tackle compilation",
      },
    ],
  },
  {
    id: "4",
    name: "Emma Wilson",
    position: "Goalkeeper",
    number: 1,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    stats: {
      appearances: 30,
      goals: 0,
      assists: 0,
      cleanSheets: 12,
      passAccuracy: 75,
    },
    media: [
      {
        id: "m6",
        type: "photo",
        url: "https://images.unsplash.com/photo-1602211844066-d3bb556e983b?w=600&q=80",
        title: "Penalty save",
      },
    ],
  },
];

const PlayerProfiles: React.FC<PlayerProfilesProps> = ({
  players = defaultPlayers,
  onSelectPlayer = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "photos" | "videos">(
    "stats",
  );

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    onSelectPlayer(player);
  };

  const handleBack = () => {
    setSelectedPlayer(null);
  };

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm"
      onPress={() => handleSelectPlayer(item)}
    >
      <Image
        source={{ uri: item.image }}
        className="w-16 h-16 rounded-full bg-gray-200"
        contentFit="cover"
      />
      <View className="ml-4 flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold">{item.name}</Text>
          <View className="bg-blue-100 px-2 py-1 rounded">
            <Text className="text-blue-800 font-medium">#{item.number}</Text>
          </View>
        </View>
        <Text className="text-gray-600">{item.position}</Text>
        <View className="flex-row mt-1">
          <Text className="text-gray-500 text-sm">
            {item.stats.appearances} matches
          </Text>
          <Text className="text-gray-500 text-sm mx-2">•</Text>
          <Text className="text-gray-500 text-sm">
            {item.stats.goals} goals
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPlayerMedia = () => {
    if (!selectedPlayer) return null;

    let mediaToShow = selectedPlayer.media;
    if (activeTab === "photos") {
      mediaToShow = selectedPlayer.media.filter(
        (item) => item.type === "photo",
      );
    } else if (activeTab === "videos") {
      mediaToShow = selectedPlayer.media.filter(
        (item) => item.type === "video",
      );
    }

    return (
      <View className="mt-4">
        {mediaToShow.length > 0 ? (
          <FlatList
            data={mediaToShow}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="mr-4 rounded-lg overflow-hidden">
                <Image
                  source={{
                    uri: item.type === "video" ? item.thumbnail : item.url,
                  }}
                  className="w-40 h-32 bg-gray-200"
                  contentFit="cover"
                />
                {item.type === "video" && (
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="bg-black bg-opacity-50 rounded-full p-2">
                      <Video size={24} color="white" />
                    </View>
                  </View>
                )}
                <Text className="text-sm mt-1">{item.title}</Text>
              </View>
            )}
          />
        ) : (
          <Text className="text-gray-500 italic">No {activeTab} available</Text>
        )}
      </View>
    );
  };

  const renderPlayerStats = () => {
    if (!selectedPlayer) return null;
    const { stats } = selectedPlayer;

    return (
      <View className="mt-4 bg-white rounded-lg p-4 shadow-sm">
        <View className="flex-row justify-between mb-3">
          <View className="items-center">
            <Text className="text-2xl font-bold">{stats.appearances}</Text>
            <Text className="text-gray-600 text-sm">Matches</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold">{stats.goals}</Text>
            <Text className="text-gray-600 text-sm">Goals</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold">{stats.assists}</Text>
            <Text className="text-gray-600 text-sm">Assists</Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          {stats.cleanSheets !== undefined && (
            <View className="items-center">
              <Text className="text-2xl font-bold">{stats.cleanSheets}</Text>
              <Text className="text-gray-600 text-sm">Clean Sheets</Text>
            </View>
          )}
          {stats.tackles !== undefined && (
            <View className="items-center">
              <Text className="text-2xl font-bold">{stats.tackles}</Text>
              <Text className="text-gray-600 text-sm">Tackles</Text>
            </View>
          )}
          <View className="items-center">
            <Text className="text-2xl font-bold">{stats.passAccuracy}%</Text>
            <Text className="text-gray-600 text-sm">Pass Accuracy</Text>
          </View>
        </View>
      </View>
    );
  };

  if (selectedPlayer) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-blue-600 pt-12 pb-4 px-4">
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center"
          >
            <ChevronLeft color="white" size={24} />
            <Text className="text-white ml-1 text-base">Back to Players</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4">
          <View className="items-center mt-4">
            <Image
              source={{ uri: selectedPlayer.image }}
              className="w-24 h-24 rounded-full bg-gray-200"
              contentFit="cover"
            />
            <Text className="text-2xl font-bold mt-2">
              {selectedPlayer.name}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-600">{selectedPlayer.position}</Text>
              <View className="bg-blue-100 px-2 py-1 rounded mx-2">
                <Text className="text-blue-800 font-medium">
                  #{selectedPlayer.number}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-around mt-6 border-b border-gray-200">
            <TouchableOpacity
              className={`pb-2 px-4 ${activeTab === "stats" ? "border-b-2 border-blue-600" : ""}`}
              onPress={() => setActiveTab("stats")}
            >
              <Text
                className={
                  activeTab === "stats"
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
                }
              >
                Stats
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`pb-2 px-4 ${activeTab === "photos" ? "border-b-2 border-blue-600" : ""}`}
              onPress={() => setActiveTab("photos")}
            >
              <Text
                className={
                  activeTab === "photos"
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
                }
              >
                Photos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`pb-2 px-4 ${activeTab === "videos" ? "border-b-2 border-blue-600" : ""}`}
              onPress={() => setActiveTab("videos")}
            >
              <Text
                className={
                  activeTab === "videos"
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
                }
              >
                Videos
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "stats" ? renderPlayerStats() : renderPlayerMedia()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-12 px-4">
      <Text className="text-2xl font-bold mb-4">Player Profiles</Text>

      <View className="flex-row items-center bg-white rounded-lg px-3 mb-4 shadow-sm">
        <Search size={20} color="#9ca3af" />
        <TextInput
          className="flex-1 py-2 px-2"
          placeholder="Search players..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500">No players found</Text>
          </View>
        }
      />
    </View>
  );
};

export default PlayerProfiles;
