import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { COLORS, SPACING, TYPOGRAPHY, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Take a Selfie</Text>
          <Text style={styles.subtitle}>
            Take a clear selfie to complete your identity verification
          </Text>
        </View>

        <View style={styles.selfieContainer}>
          <View style={styles.selfieFrame}>
            {selfieImage ? (
              <Image source={{ uri: selfieImage }} style={styles.selfieImage} />
            ) : (
              <View style={styles.selfiePlaceholder}>
                <Text style={styles.selfieIcon}>🤳</Text>
                <Text style={styles.placeholderText}>Your selfie will appear here</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.cameraButton} onPress={takeSelfie}>
            <Text style={styles.cameraButtonText}>
              {selfieImage ? 'Retake Selfie' : 'Take Selfie'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionText}>• Look directly at the camera</Text>
          <Text style={styles.instructionText}>• Ensure your face is well-lit</Text>
          <Text style={styles.instructionText}>• Remove sunglasses or hats</Text>
          <Text style={styles.instructionText}>• Keep a neutral expression</Text>
          <Text style={styles.instructionText}>• Make sure your entire face is visible</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (!selfieImage || isLoading) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!selfieImage || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Selfie</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  selfieContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  selfieFrame: {
    width: 250,
    height: 300,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  selfieImage: {
    width: '100%',
    height: '100%',
  },
  selfiePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
  },
  selfieIcon: {
    fontSize: 60,
    marginBottom: SPACING.sm,
  },
  placeholderText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  cameraButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
  },
  cameraButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  instructionsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  instructionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default VerificationSelfieScreen;