import type React from "react";
import { Text, View } from "react-native";
import tokens from "@/components/lib/tokens";

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: "default" | "card" | "bordered";
  size?: "sm" | "base" | "lg";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  variant = "default",
  size = "base",
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  contentClassName = "",
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          titleFontSize: tokens.typography.fontSize.lg,
          descriptionFontSize: tokens.typography.fontSize.sm,
          sectionSpacing: tokens.spacing[4],
          contentSpacing: tokens.spacing[3],
          padding: tokens.spacing[3],
        };
      case "lg":
        return {
          titleFontSize: tokens.typography.fontSize["2xl"],
          descriptionFontSize: tokens.typography.fontSize.lg,
          sectionSpacing: tokens.spacing[8],
          contentSpacing: tokens.spacing[6],
          padding: tokens.spacing[6],
        };
      default:
        return {
          titleFontSize: tokens.typography.fontSize.xl,
          descriptionFontSize: tokens.typography.fontSize.base,
          sectionSpacing: tokens.spacing[6],
          contentSpacing: tokens.spacing[4],
          padding: tokens.spacing[4],
        };
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {
      flex: 1,
    };

    switch (variant) {
      case "card":
        return {
          ...baseStyles,
          backgroundColor: tokens.colors.background.primary,
          borderRadius: tokens.borderRadius.lg,
          shadowColor: tokens.shadows.base.shadowColor,
          shadowOffset: tokens.shadows.base.shadowOffset,
          shadowOpacity: tokens.shadows.base.shadowOpacity,
          shadowRadius: tokens.shadows.base.shadowRadius,
          elevation: tokens.shadows.base.elevation,
        };
      case "bordered":
        return {
          ...baseStyles,
          backgroundColor: tokens.colors.background.primary,
          borderWidth: 1,
          borderColor: tokens.colors.border.primary,
          borderRadius: tokens.borderRadius.base,
        };
      default:
        return baseStyles;
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();
  const needsPadding = variant === "card" || variant === "bordered";

  return (
    <View
      className={className}
      style={[
        variantStyles,
        {
          gap: sizeStyles.sectionSpacing,
          ...(needsPadding && { padding: sizeStyles.padding }),
        },
      ]}
    >
      {/* Header */}
      {(title || description) && (
        <View style={{ gap: tokens.spacing[2] }}>
          {title && (
            <Text
              className={titleClassName}
              style={{
                fontSize: sizeStyles.titleFontSize,
                fontWeight: tokens.typography.fontWeight.semibold as "600",
                color: tokens.colors.text.primary,
                lineHeight: sizeStyles.titleFontSize * 1.2,
              }}
            >
              {title}
            </Text>
          )}
          {description && (
            <Text
              className={descriptionClassName}
              style={{
                fontSize: sizeStyles.descriptionFontSize,
                fontWeight: tokens.typography.fontWeight.normal as "400",
                color: tokens.colors.text.secondary,
                lineHeight: sizeStyles.descriptionFontSize * 1.4,
              }}
            >
              {description}
            </Text>
          )}
        </View>
      )}

      {/* Content */}
      <View
        className={contentClassName}
        style={{
          gap: sizeStyles.contentSpacing,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default FormSection;