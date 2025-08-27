import { useNavigation } from "@react-navigation/native";
import type React from "react";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Icons } from "@/assets";
import Icon from "@/components/common/Icon";
import Screen from "@/components/common/Screen";
import { Button, Card } from "@/components/ui";
import { useUploadDocumentMutation } from "@/hooks/useVerificationQueries";
import { COLORS } from "@/utils/theme";

const IdentityVerificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const uploadDocument = useUploadDocumentMutation();

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
      const formData = new FormData();
      formData.append("documentType", type);

      const response = await uploadDocument.mutateAsync(formData);
      setDocuments((prev) => ({
        ...prev,
        [type]: response?.url || "uploaded",
      }));
      Alert.alert("Success", "Document uploaded successfully");
    } catch (_error) {
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
    } catch (_error) {
      Alert.alert("Error", "Failed to submit verification");
    } finally {
      setUploading(false);
    }
  };

  const renderStepIndicator = () => (
    <View className="flex-row justify-center items-center mb-12">
      {steps.map((step, index) => (
        <View key={step.id} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full justify-center items-center ${
              currentStep >= step.id
                ? currentStep > step.id
                  ? "bg-green-500"
                  : "bg-blue-600"
                : "bg-gray-300"
            }`}
          >
            {currentStep > step.id ? (
              <Icon name="tick" size={16} color={COLORS.white} />
            ) : (
              <Text className="text-xs text-white font-semibold">
                {step.id}
              </Text>
            )}
          </View>
          {index < steps.length - 1 && (
            <View
              className={`w-10 h-0.5 mx-4 ${
                currentStep > step.id ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderDocumentUpload = () => (
    <View className="mb-12">
      <Text className="text-xl font-semibold text-gray-900 text-center mb-4">
        Upload Identity Document
      </Text>
      <Text className="text-base text-gray-600 text-center leading-6 mb-10">
        Please upload clear photos of the front and back of your
        government-issued ID card or passport.
      </Text>

      <View className="mb-10">
        <Text className="text-sm font-medium text-gray-900 mb-4">
          Front of ID
        </Text>
        <Button
          variant="outline"
          onPress={() => handleDocumentUpload("idFront")}
        >
          {documents.idFront ? (
            <View className="items-center gap-4">
              <Icon name="tick" size={24} color={COLORS.success} />
              <Text className="text-sm font-medium text-green-600">
                Document uploaded
              </Text>
            </View>
          ) : (
            <View className="items-center gap-4">
              <Icon name="camera" size={32} color={COLORS.primary} />
              <Text className="text-sm font-medium text-gray-900">
                Tap to upload front of ID
              </Text>
              <Text className="text-xs text-gray-500">JPG, PNG up to 10MB</Text>
            </View>
          )}
        </Button>

        <Text className="text-sm font-medium text-gray-900 mb-4">
          Back of ID
        </Text>
        <Button
          variant="outline"
          onPress={() => handleDocumentUpload("idBack")}
        >
          {documents.idBack ? (
            <View className="items-center gap-4">
              <Icon name="tick" size={24} color={COLORS.success} />
              <Text className="text-sm font-medium text-green-600">
                Document uploaded
              </Text>
            </View>
          ) : (
            <View className="items-center gap-4">
              <Icon name="camera" size={32} color={COLORS.primary} />
              <Text className="text-sm font-medium text-gray-900">
                Tap to upload back of ID
              </Text>
              <Text className="text-xs text-gray-500">JPG, PNG up to 10MB</Text>
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
    <View className="mb-12">
      <Text className="text-xl font-semibold text-gray-900 text-center mb-4">
        Take a Selfie
      </Text>
      <Text className="text-base text-gray-600 text-center leading-6 mb-10">
        Take a clear selfie to verify your identity matches the uploaded
        document.
      </Text>

      <View className="mb-10">
        <Button
          variant="outline"
          onPress={() => handleDocumentUpload("selfie")}
        >
          {documents.selfie ? (
            <View className="items-center gap-4">
              <Icon name="tick" size={32} color={COLORS.success} />
              <Text className="text-sm font-medium text-green-600">
                Selfie captured
              </Text>
            </View>
          ) : (
            <View className="items-center gap-6">
              <Icon name="camera" size={48} color={COLORS.primary} />
              <Text className="text-lg font-medium text-gray-900">
                Tap to take selfie
              </Text>
              <Text className="text-base text-gray-500 text-center">
                Make sure your face is clearly visible
              </Text>
            </View>
          )}
        </Button>
      </View>

      <View className="flex-row gap-4">
        <Button
          title="Back"
          onPress={() => setCurrentStep(1)}
          variant="secondary"
        />
        <Button
          title="Continue"
          onPress={() => setCurrentStep(3)}
          disabled={!documents.selfie}
        />
      </View>
    </View>
  );

  const renderReviewSubmit = () => (
    <View className="mb-12">
      <Text className="text-xl font-semibold text-gray-900 text-center mb-4">
        Review & Submit
      </Text>
      <Text className="text-base text-gray-600 text-center leading-6 mb-10">
        Please review your uploaded documents before submitting for
        verification.
      </Text>

      <View className="mb-10">
        <Card className="mb-4">
          <View className="flex-row items-center gap-4">
            <Icon name="cardPos" size={24} color={COLORS.primary} />
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900 mb-1">
                Identity Document
              </Text>
              <Text className="text-xs text-gray-600">
                Front and back uploaded
              </Text>
            </View>
            <Icon name="tick" size={20} color={COLORS.success} />
          </View>
        </Card>

        <Card className="mb-4">
          <View className="flex-row items-center gap-4">
            <Icon name="camera" size={24} color={COLORS.primary} />
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900 mb-1">
                Selfie Verification
              </Text>
              <Text className="text-xs text-gray-600">Photo captured</Text>
            </View>
            <Icon name="tick" size={20} color={COLORS.success} />
          </View>
        </Card>
      </View>

      <View className="flex-row items-start gap-4 bg-blue-50 p-6 rounded-lg mb-10">
        <Icon name="infoCircle" size={20} color={COLORS.info} />
        <Text className="text-base text-blue-800 flex-1 leading-5">
          Verification typically takes 1-2 business days. You'll be notified
          once complete.
        </Text>
      </View>

      <View className="flex-row gap-4">
        <Button
          title="Back"
          onPress={() => setCurrentStep(2)}
          variant="secondary"
        />
        <Button
          title="Submit"
          onPress={handleSubmitVerification}
          loading={uploading}
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
        <View className="flex-row justify-between items-center mb-12 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrowLeft" size={24} color={COLORS.textPrimary} />
          </Button>
          <Text className="text-xl font-semibold text-gray-900">
            Identity Verification
          </Text>
          <View className="w-11" />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Current Step Content */}
        {renderCurrentStep()}
      </ScrollView>
    </Screen>
  );
};

export default IdentityVerificationScreen;
