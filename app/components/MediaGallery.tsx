import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { Camera, Plus, Video } from "lucide-react-native";
import MediaUploadForm from "./MediaUploadForm";

interface MediaItem {
  id: string;
  type: "photo" | "video";
  url: string;
  description: string;
  author: string;
  timestamp: string;
}

interface MediaGalleryProps {
  isAuthorized?: boolean;
  mediaItems?: MediaItem[];
  onMediaSelect?: (item: MediaItem) => void;
}

const MediaGallery = ({
  isAuthorized = true,
  mediaItems = [
    {
      id: "1",
      type: "photo",
      url: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80",
      description: "Team celebration after winning the championship",
      author: "John Smith",
      timestamp: "2023-05-15",
    },
    {
      id: "2",
      type: "photo",
      url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80",
      description: "Training session",
      author: "Mike Johnson",
      timestamp: "2023-05-10",
    },
    {
      id: "3",
      type: "video",
      url: "https://images.unsplash.com/photo-1624526267942-ab0c0e53d9c3?w=600&q=80",
      description: "Goal highlights from last match",
      author: "Sarah Williams",
      timestamp: "2023-05-05",
    },
    {
      id: "4",
      type: "photo",
      url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80",
      description: "Team photo before the match",
      author: "David Brown",
      timestamp: "2023-04-28",
    },
    {
      id: "5",
      type: "video",
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
      description: "Interview with the coach",
      author: "Emma Davis",
      timestamp: "2023-04-20",
    },
  ],
  onMediaSelect = () => {},
}: MediaGalleryProps) => {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - 48) / 2; // 2 columns with padding

  const filteredMedia = mediaItems.filter((item) => {
    if (activeTab === "photos") return item.type === "photo";
    return item.type === "video";
  });

  const handleMediaPress = (item: MediaItem) => {
    setSelectedMedia(item);
    onMediaSelect(item);
  };

  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      onPress={() => handleMediaPress(item)}
      className="mb-4"
      style={{ width: itemWidth }}
    >
      <View className="relative rounded-lg overflow-hidden">
        <Image
          source={{ uri: item.url }}
          style={{ width: itemWidth, height: itemWidth }}
          className="bg-gray-200"
          contentFit="cover"
        />
        {item.type === "video" && (
          <View className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
            <Video size={16} color="white" />
          </View>
        )}
      </View>
      <Text className="text-sm font-medium mt-1 truncate">
        {item.description}
      </Text>
      <Text className="text-xs text-gray-500">{item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Media Gallery</Text>
        {isAuthorized && (
          <TouchableOpacity
            onPress={() => setUploadModalVisible(true)}
            className="bg-blue-600 rounded-full p-2"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row mb-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab("photos")}
          className={`flex-1 py-2 ${activeTab === "photos" ? "border-b-2 border-blue-600" : ""}`}
        >
          <View className="flex-row justify-center items-center">
            <Camera
              size={18}
              color={activeTab === "photos" ? "#2563eb" : "#6b7280"}
            />
            <Text
              className={`ml-2 font-medium ${activeTab === "photos" ? "text-blue-600" : "text-gray-500"}`}
            >
              Photos
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("videos")}
          className={`flex-1 py-2 ${activeTab === "videos" ? "border-b-2 border-blue-600" : ""}`}
        >
          <View className="flex-row justify-center items-center">
            <Video
              size={18}
              color={activeTab === "videos" ? "#2563eb" : "#6b7280"}
            />
            <Text
              className={`ml-2 font-medium ${activeTab === "videos" ? "text-blue-600" : "text-gray-500"}`}
            >
              Videos
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <FlatList
          data={filteredMedia}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">
            No {activeTab} available
          </Text>
        </View>
      )}

      {/* Upload Modal */}
      <Modal
        visible={uploadModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-4">
            <MediaUploadForm onClose={() => setUploadModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Media View Modal */}
      <Modal
        visible={!!selectedMedia}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedMedia(null)}
      >
        {selectedMedia && (
          <View className="flex-1 bg-black/90 justify-center items-center">
            <TouchableOpacity
              className="absolute top-10 right-5 z-10"
              onPress={() => setSelectedMedia(null)}
            >
              <Text className="text-white text-lg font-bold">Close</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: selectedMedia.url }}
              style={{ width: "90%", height: "60%" }}
              contentFit="contain"
            />

            <View className="w-full px-8 mt-4">
              <Text className="text-white text-lg font-medium">
                {selectedMedia.description}
              </Text>
              <Text className="text-gray-300 mt-1">
                By {selectedMedia.author} • {selectedMedia.timestamp}
              </Text>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default MediaGallery;
