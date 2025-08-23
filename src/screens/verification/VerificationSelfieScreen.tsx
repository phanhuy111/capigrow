import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useVerificationStore } from '@/store/verificationStore';
import { COLORS } from '@/utils/theme';

type VerificationSelfieScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationSelfie'
>;

const VerificationSelfieScreen: React.FC = () => {
  const navigation = useNavigation<VerificationSelfieScreenNavigationProp>();
  const { isLoading, uploadSelfie } = useVerificationStore();

  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  const takeSelfie = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled && result.assets[0]) {
      setSelfieImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!selfieImage) {
      Alert.alert('Error', 'Please take a selfie to continue');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('selfie', {
        uri: selfieImage,
        type: 'image/jpeg',
        name: 'selfie.jpg',
      } as any);

      try {
        await uploadSelfie(formData);
        Alert.alert('Success', 'Selfie uploaded successfully!', [
          { text: 'Continue', onPress: () => navigation.navigate('VerificationStatus') },
        ]);
      } catch (uploadError) {
        Alert.alert('Error', 'Failed to upload selfie. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}>
        <View className="mt-4 mb-6 items-center">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Take a Selfie
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            Take a clear selfie to complete your identity verification
          </Text>
        </View>

        <View className="items-center mb-6">
          <View className="w-64 h-80 rounded-2xl border-4 border-blue-600 overflow-hidden mb-4">
            {selfieImage ? (
              <Image source={{ uri: selfieImage }} className="w-full h-full" />
            ) : (
              <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-6xl mb-2">🤳</Text>
                <Text className="text-sm text-gray-600 text-center">
                  Your selfie will appear here
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            className="bg-blue-600 py-3 px-6 rounded-md" 
            onPress={takeSelfie}
          >
            <Text className="text-white text-base font-semibold">
              {selfieImage ? 'Retake Selfie' : 'Take Selfie'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-gray-100 p-4 rounded-md mb-6">
          <Text className="text-sm font-semibold text-gray-900 mb-1">
            Instructions:
          </Text>
          <Text className="text-sm text-gray-600 mb-1">• Look directly at the camera</Text>
          <Text className="text-sm text-gray-600 mb-1">• Ensure your face is well-lit</Text>
          <Text className="text-sm text-gray-600 mb-1">• Remove sunglasses or hats</Text>
          <Text className="text-sm text-gray-600 mb-1">• Keep a neutral expression</Text>
          <Text className="text-sm text-gray-600 mb-1">• Make sure your entire face is visible</Text>
        </View>

        <TouchableOpacity
          className={`py-4 rounded-md items-center mb-6 ${
            (!selfieImage || isLoading) ? 'bg-gray-400' : 'bg-blue-600'
          }`}
          onPress={handleSubmit}
          disabled={!selfieImage || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text className="text-white text-base font-semibold">
              Submit Selfie
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};



export default VerificationSelfieScreen;