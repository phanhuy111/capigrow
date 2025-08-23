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
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { uploadDocument } from '../../store/slices/verificationSlice';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';

type VerificationDocumentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationDocument'
>;

const VerificationDocumentScreen: React.FC = () => {
  const navigation = useNavigation<VerificationDocumentScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.verification);

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

  const openCamera = (side: 'front' | 'back') => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri;
          if (side === 'front') {
            setFrontImage(imageUri || null);
          } else {
            setBackImage(imageUri || null);
          }
        }
      }
    );
  };

  const openGallery = (side: 'front' | 'back') => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri;
          if (side === 'front') {
            setFrontImage(imageUri || null);
          } else {
            setBackImage(imageUri || null);
          }
        }
      }
    );
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

      const result = await dispatch(uploadDocument(formData));
      if (uploadDocument.fulfilled.match(result)) {
        Alert.alert('Success', 'Document uploaded successfully!', [
          { text: 'Continue', onPress: () => navigation.navigate('VerificationSelfie') },
        ]);
      } else {
        Alert.alert('Error', 'Failed to upload document. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const selectedDoc = documentTypes.find(doc => doc.id === selectedDocumentType);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Document Verification</Text>
          <Text style={styles.subtitle}>
            Upload a clear photo of your government-issued ID to verify your identity
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Document Type</Text>
          {documentTypes.map((docType) => (
            <TouchableOpacity
              key={docType.id}
              style={[
                styles.documentTypeButton,
                selectedDocumentType === docType.id && styles.documentTypeButtonSelected,
              ]}
              onPress={() => setSelectedDocumentType(docType.id)}
            >
              <Text
                style={[
                  styles.documentTypeText,
                  selectedDocumentType === docType.id && styles.documentTypeTextSelected,
                ]}
              >
                {docType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedDocumentType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Photos</Text>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>Front of Document</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => showImagePicker('front')}
              >
                {frontImage ? (
                  <Image source={{ uri: frontImage }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadPlaceholderText}>📷</Text>
                    <Text style={styles.uploadText}>Tap to upload</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {selectedDoc?.requiresBack && (
              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>Back of Document</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => showImagePicker('back')}
                >
                  {backImage ? (
                    <Image source={{ uri: backImage }} style={styles.uploadedImage} />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Text style={styles.uploadPlaceholderText}>📷</Text>
                      <Text style={styles.uploadText}>Tap to upload</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Tips for best results:</Text>
          <Text style={styles.tipText}>• Ensure good lighting</Text>
          <Text style={styles.tipText}>• Keep the document flat</Text>
          <Text style={styles.tipText}>• Make sure all text is readable</Text>
          <Text style={styles.tipText}>• Avoid glare and shadows</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Documents</Text>
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
    lineHeight: 22,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  documentTypeButton: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  documentTypeButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '20',
  },
  documentTypeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  documentTypeTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  uploadSection: {
    marginBottom: SPACING.lg,
  },
  uploadLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadPlaceholderText: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  uploadText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  tips: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tipText: {
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

export default VerificationDocumentScreen;