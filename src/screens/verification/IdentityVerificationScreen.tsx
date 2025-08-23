import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from "@/utils/theme";
import { Icons } from "@/assets";
import Screen from "@/components/common/Screen";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui";
import { mockUserApi } from "@/mock/api/user";

const IdentityVerificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);

  const handleGoBack = (): void => {
    navigation.goBack();
  };
  const [documents, setDocuments] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });
  const [uploading, setUploading] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Identity Document",
      description: "Upload front and back of your ID card or passport",
      icon: Icons.cardPos,
    },
    {
      id: 2,
      title: "Selfie Verification",
      description: "Take a selfie to verify your identity",
      icon: Icons.camera,
    },
    {
      id: 3,
      title: "Review & Submit",
      description: "Review your documents and submit for verification",
      icon: Icons.tick,
    },
  ];

  const handleDocumentUpload = async (type: string) => {
    try {
      setUploading(true);
      // Simulate document upload
      const response = await mockUserApi.uploadDocument(type, null);
      if (response.success) {
        setDocuments((prev) => ({ ...prev, [type]: response.data.url }));
        Alert.alert("Success", "Document uploaded successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      setUploading(true);
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      Alert.alert(
        "Verification Submitted",
        "Your documents have been submitted for review. You will be notified once the verification is complete.",
        [
          {
            text: "OK",
            onPress: () => handleGoBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit verification");
    } finally {
      setUploading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step.id && styles.activeStepCircle,
              currentStep > step.id && styles.completedStepCircle,
            ]}
          >
            {currentStep > step.id ? (
              <SvgXml
                xml={Icons.tick}
                width={16}
                height={16}
                fill={COLORS.white}
              />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step.id && styles.activeStepNumber,
                ]}
              >
                {step.id}
              </Text>
            )}
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step.id && styles.completedStepLine,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderDocumentUpload = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Upload Identity Document</Text>
      <Text style={styles.stepDescription}>
        Please upload clear photos of the front and back of your
        government-issued ID card or passport.
      </Text>

      <View style={styles.uploadSection}>
        <Text style={styles.uploadLabel}>Front of ID</Text>
        <Button
          variant="outline"
          onPress={() => handleDocumentUpload("idFront")}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 items-center"
        >
          {documents.idFront ? (
            <View style={styles.uploadedContent}>
              <SvgXml
                xml={Icons.tick}
                width={24}
                height={24}
                fill={COLORS.success}
              />
              <Text style={styles.uploadedText}>Document uploaded</Text>
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <SvgXml
                xml={Icons.camera}
                width={32}
                height={32}
                fill={COLORS.primary}
              />
              <Text style={styles.uploadText}>Tap to upload front of ID</Text>
              <Text style={styles.uploadSubtext}>JPG, PNG up to 10MB</Text>
            </View>
          )}
        </Button>

        <Text style={styles.uploadLabel}>Back of ID</Text>
        <Button
          variant="outline"
          onPress={() => handleDocumentUpload("idBack")}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 items-center"
        >
          {documents.idBack ? (
            <View style={styles.uploadedContent}>
              <SvgXml
                xml={Icons.tick}
                width={24}
                height={24}
                fill={COLORS.success}
              />
              <Text style={styles.uploadedText}>Document uploaded</Text>
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <SvgXml
                xml={Icons.camera}
                width={32}
                height={32}
                fill={COLORS.primary}
              />
              <Text style={styles.uploadText}>Tap to upload back of ID</Text>
              <Text style={styles.uploadSubtext}>JPG, PNG up to 10MB</Text>
            </View>
          )}
        </Button>
      </View>

      <Button
        title="Continue"
        onPress={() => setCurrentStep(2)}
        disabled={!documents.idFront || !documents.idBack}
        fullWidth
      />
    </View>
  );

  const renderSelfieVerification = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Take a Selfie</Text>
      <Text style={styles.stepDescription}>
        Take a clear selfie to verify your identity matches the uploaded
        document.
      </Text>

      <View style={styles.selfieSection}>
        <Button
          variant="outline"
          onPress={() => handleDocumentUpload("selfie")}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 items-center"
        >
          {documents.selfie ? (
            <View style={styles.uploadedContent}>
              <SvgXml
                xml={Icons.tick}
                width={32}
                height={32}
                fill={COLORS.success}
              />
              <Text style={styles.uploadedText}>Selfie captured</Text>
            </View>
          ) : (
            <View style={styles.selfieContent}>
              <SvgXml
                xml={Icons.camera}
                width={48}
                height={48}
                fill={COLORS.primary}
              />
              <Text style={styles.selfieText}>Tap to take selfie</Text>
              <Text style={styles.selfieSubtext}>
                Make sure your face is clearly visible
              </Text>
            </View>
          )}
        </Button>
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={() => setCurrentStep(1)}
          variant="secondary"
          style={styles.halfButton}
        />
        <Button
          title="Continue"
          onPress={() => setCurrentStep(3)}
          disabled={!documents.selfie}
          style={styles.halfButton}
        />
      </View>
    </View>
  );

  const renderReviewSubmit = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review & Submit</Text>
      <Text style={styles.stepDescription}>
        Please review your uploaded documents before submitting for
        verification.
      </Text>

      <View style={styles.reviewSection}>
        <Card style={styles.reviewCard}>
          <View style={styles.reviewItem}>
            <SvgXml
              xml={Icons.cardPos}
              width={24}
              height={24}
              fill={COLORS.primary}
            />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewTitle}>Identity Document</Text>
              <Text style={styles.reviewStatus}>Front and back uploaded</Text>
            </View>
            <SvgXml
              xml={Icons.tick}
              width={20}
              height={20}
              fill={COLORS.success}
            />
          </View>
        </Card>

        <Card style={styles.reviewCard}>
          <View style={styles.reviewItem}>
            <SvgXml
              xml={Icons.camera}
              width={24}
              height={24}
              fill={COLORS.primary}
            />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewTitle}>Selfie Verification</Text>
              <Text style={styles.reviewStatus}>Photo captured</Text>
            </View>
            <SvgXml
              xml={Icons.tick}
              width={20}
              height={20}
              fill={COLORS.success}
            />
          </View>
        </Card>
      </View>

      <View style={styles.infoCard}>
        <SvgXml
          xml={Icons.infoCircle}
          width={20}
          height={20}
          fill={COLORS.info}
        />
        <Text style={styles.infoText}>
          Verification typically takes 1-2 business days. You'll be notified
          once complete.
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={() => setCurrentStep(2)}
          variant="secondary"
          style={styles.halfButton}
        />
        <Button
          title="Submit"
          onPress={handleSubmitVerification}
          loading={uploading}
          style={styles.halfButton}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderDocumentUpload();
      case 2:
        return renderSelfieVerification();
      case 3:
        return renderReviewSubmit();
      default:
        return renderDocumentUpload();
    }
  };

  return (
    <Screen paddingHorizontal>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => navigation.goBack()}
            className="w-11 h-11 rounded-full bg-gray-100 justify-center items-center"
          >
            <SvgXml
              xml={Icons.arrowLeft}
              width={24}
              height={24}
              fill={COLORS.textPrimary}
            />
          </Button>
          <Text style={styles.screenTitle}>Identity Verification</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Current Step Content */}
        {renderCurrentStep()}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xxxl,
    paddingTop: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 44,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xxxxxxl,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray300,
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepCircle: {
    backgroundColor: COLORS.primary,
  },
  completedStepCircle: {
    backgroundColor: COLORS.success,
  },
  stepNumber: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.white,
    fontWeight: "600",
  },
  activeStepNumber: {
    color: COLORS.white,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.gray300,
    marginHorizontal: SPACING.md,
  },
  completedStepLine: {
    backgroundColor: COLORS.success,
  },
  stepContent: {
    marginBottom: SPACING.xxxxxxl,
  },
  stepTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  stepDescription: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xxxxl,
  },
  uploadSection: {
    marginBottom: SPACING.xxxxl,
  },
  uploadLabel: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  uploadCard: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxxxl,
    marginBottom: SPACING.xxxl,
    alignItems: "center",
  },
  uploadContent: {
    alignItems: "center",
    gap: SPACING.lg,
  },
  uploadText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
  },
  uploadSubtext: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
  },
  uploadedContent: {
    alignItems: "center",
    gap: SPACING.lg,
  },
  uploadedText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.success,
  },
  selfieSection: {
    marginBottom: SPACING.xxxxl,
  },
  selfieCard: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxxxxxl,
    alignItems: "center",
  },
  selfieContent: {
    alignItems: "center",
    gap: SPACING.xl,
  },
  selfieText: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textPrimary,
  },
  selfieSubtext: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textTertiary,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.lg,
  },
  halfButton: {
    flex: 1,
  },
  reviewSection: {
    marginBottom: SPACING.xxxxl,
  },
  reviewCard: {
    marginBottom: SPACING.lg,
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  reviewStatus: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.lg,
    backgroundColor: COLORS.infoLight,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xxxxl,
  },
  infoText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.infoDark,
    flex: 1,
    lineHeight: 20,
  },
});

export default IdentityVerificationScreen;
