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

type VerificationDocumentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationDocument'
>;

const VerificationDocumentScreen: React.FC = () => {
  const navigation = useNavigation<VerificationDocumentScreenNavigationProp>();
  const { isLoading, uploadDocument } = useVerificationStore();

  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const documentTypes = [
    { id: 'passport', label: 'Passport', requiresBack: false },
    { id: 'national_id', label: 'National ID', requiresBack: true },
    { id: 'drivers_license', label: "Driver's License", requiresBack: true },
  ];

  const showImagePicker = (side: 'front' | 'back') => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add your document photo',
      [
        { text: 'Camera', onPress: () => openCamera(side) },
        { text: 'Gallery', onPress: () => openGallery(side) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async (side: 'front' | 'back') => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      if (side === 'front') {
        setFrontImage(imageUri);
      } else {
        setBackImage(imageUri);
      }
    }
  };

  const openGallery = async (side: 'front' | 'back') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      if (side === 'front') {
        setFrontImage(imageUri);
      } else {
        setBackImage(imageUri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedDocumentType) {
      Alert.alert('Error', 'Please select a document type');
      return;
    }

    if (!frontImage) {
      Alert.alert('Error', 'Please upload the front of your document');
      return;
    }

    const selectedDoc = documentTypes.find(doc => doc.id === selectedDocumentType);
    if (selectedDoc?.requiresBack && !backImage) {
      Alert.alert('Error', 'Please upload the back of your document');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('document_type', selectedDocumentType);

      if (frontImage) {
        formData.append('document_front', {
          uri: frontImage,
          type: 'image/jpeg',
          name: 'document_front.jpg',
        } as any);
      }

      if (backImage) {
        formData.append('document_back', {
          uri: backImage,
          type: 'image/jpeg',
          name: 'document_back.jpg',
        } as any);
      }

      try {
        await uploadDocument(formData);
        Alert.alert('Success', 'Document uploaded successfully!', [
          { text: 'Continue', onPress: () => navigation.navigate('VerificationSelfie') },
        ]);
      } catch (uploadError) {
        Alert.alert('Error', 'Failed to upload document. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const selectedDoc = documentTypes.find(doc => doc.id === selectedDocumentType);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}>
        <View className="mt-4 mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Document Verification
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            Upload a clear photo of your government-issued ID to verify your identity
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Select Document Type
          </Text>
          {documentTypes.map((docType) => (
            <TouchableOpacity
              key={docType.id}
              className={`border rounded-md py-4 px-4 mb-2 ${
                selectedDocumentType === docType.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
              onPress={() => setSelectedDocumentType(docType.id)}
            >
              <Text
                className={`text-base text-center ${
                  selectedDocumentType === docType.id
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-900'
                }`}
              >
                {docType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedDocumentType && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Upload Photos
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-900 mb-1">
                Front of Document
              </Text>
              <TouchableOpacity
                className="border-2 border-dashed border-gray-300 rounded-md h-50 justify-center items-center"
                onPress={() => showImagePicker('front')}
              >
                {frontImage ? (
                  <Image source={{ uri: frontImage }} className="w-full h-full rounded-md" />
                ) : (
                  <View className="items-center">
                    <Text className="text-4xl mb-2">📷</Text>
                    <Text className="text-base text-gray-600">Tap to upload</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {selectedDoc?.requiresBack && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-900 mb-1">
                  Back of Document
                </Text>
                <TouchableOpacity
                  className="border-2 border-dashed border-gray-300 rounded-md h-50 justify-center items-center"
                  onPress={() => showImagePicker('back')}
                >
                  {backImage ? (
                    <Image source={{ uri: backImage }} className="w-full h-full rounded-md" />
                  ) : (
                    <View className="items-center">
                      <Text className="text-4xl mb-2">📷</Text>
                      <Text className="text-base text-gray-600">Tap to upload</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View className="bg-gray-100 p-4 rounded-md mb-6">
          <Text className="text-sm font-semibold text-gray-900 mb-1">
            Tips for best results:
          </Text>
          <Text className="text-sm text-gray-600 mb-1">• Ensure good lighting</Text>
          <Text className="text-sm text-gray-600 mb-1">• Keep the document flat</Text>
          <Text className="text-sm text-gray-600 mb-1">• Make sure all text is readable</Text>
          <Text className="text-sm text-gray-600 mb-1">• Avoid glare and shadows</Text>
        </View>

        <TouchableOpacity
          className={`py-4 rounded-md items-center mb-6 ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600'
          }`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text className="text-white text-base font-semibold">
              Submit Documents
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};



export default VerificationDocumentScreen;