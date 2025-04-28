import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Camera, Upload, X } from "lucide-react-native";

interface MediaUploadFormProps {
  onUploadComplete?: (mediaData: {
    type: "photo" | "video";
    url: string;
    description: string;
  }) => void;
  isOpen?: boolean;
}

export default function MediaUploadForm({
  onUploadComplete = () => {},
  isOpen = true,
}: MediaUploadFormProps) {
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [description, setDescription] = useState("");
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const pickMedia = async () => {
    try {
      // Request permissions
      const permissionResult =
        mediaType === "photo"
          ? await ImagePicker.requestMediaLibraryPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "You need to grant permission to access your media library",
        );
        return;
      }

      // Pick the media
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          mediaType === "photo"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setMediaUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert("Error", "Failed to pick media");
    }
  };

  const handleSubmit = async () => {
    if (!mediaUri) {
      Alert.alert("Missing Media", "Please select a photo or video to upload");
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        "Missing Description",
        "Please add a description for your media",
      );
      return;
    }

    setIsUploading(true);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    // Simulate upload completion after delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);

      // Call the completion handler with the media data
      onUploadComplete({
        type: mediaType,
        url: mediaUri,
        description: description,
      });

      // Reset form
      setMediaUri(null);
      setDescription("");

      Alert.alert("Success", "Your media has been uploaded successfully!");
    }, 3000);
  };

  const clearSelectedMedia = () => {
    setMediaUri(null);
  };

  return (
    <View className="bg-blue-50 p-6 rounded-lg shadow-md w-full max-w-md">
      <Text className="text-2xl font-bold text-blue-800 mb-4">
        Upload Media
      </Text>

      {/* Media Type Selection */}
      <View className="flex-row mb-6 bg-white rounded-lg overflow-hidden">
        <TouchableOpacity
          className={`flex-1 py-3 flex-row justify-center items-center ${mediaType === "photo" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => setMediaType("photo")}
        >
          <Camera size={20} color={mediaType === "photo" ? "white" : "black"} />
          <Text
            className={`ml-2 font-medium ${mediaType === "photo" ? "text-white" : "text-gray-700"}`}
          >
            Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 flex-row justify-center items-center ${mediaType === "video" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => setMediaType("video")}
        >
          <Camera size={20} color={mediaType === "video" ? "white" : "black"} />
          <Text
            className={`ml-2 font-medium ${mediaType === "video" ? "text-white" : "text-gray-700"}`}
          >
            Video
          </Text>
        </TouchableOpacity>
      </View>

      {/* Media Preview */}
      {mediaUri ? (
        <View className="mb-4 relative">
          <Image
            source={{ uri: mediaUri }}
            style={{ width: "100%", height: 200 }}
            className="rounded-lg"
            contentFit="cover"
          />
          <TouchableOpacity
            className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
            onPress={clearSelectedMedia}
          >
            <X size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-400"
          onPress={pickMedia}
        >
          <Upload size={40} color="#4B5563" />
          <Text className="text-gray-600 mt-2 font-medium">
            Tap to select {mediaType}
          </Text>
        </TouchableOpacity>
      )}

      {/* Description Input */}
      <View className="mb-6">
        <Text className="text-gray-700 mb-2 font-medium">Description</Text>
        <TextInput
          className="bg-white p-3 rounded-lg border border-gray-300"
          placeholder="Add a description for your media"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Upload Progress */}
      {isUploading && (
        <View className="mb-4">
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </View>
          <Text className="text-center mt-2 text-blue-800">
            {uploadProgress}% Uploaded
          </Text>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        className={`py-3 rounded-lg flex-row justify-center items-center ${isUploading ? "bg-gray-400" : "bg-blue-600"}`}
        onPress={handleSubmit}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Upload size={20} color="white" />
            <Text className="text-white font-bold ml-2">
              Upload {mediaType}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
