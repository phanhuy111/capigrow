import type React from "react";
import { StyleSheet, Text, type TextStyle, View, type ViewStyle } from "react-native";
import tokens from "../lib/tokens";

export interface StepIndicatorProps {
  /** Current active step (0-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Array of step labels */
  stepLabels?: string[];
  /** Variant of the step indicator */
  variant?: "dots" | "progress" | "numbered" | "labeled";
  /** Size of the indicator */
  size?: "sm" | "base" | "lg";
  /** Color scheme */
  colorScheme?: "primary" | "secondary";
  /** Show step numbers */
  showNumbers?: boolean;
  /** Show step labels */
  showLabels?: boolean;
  /** Custom styles */
  style?: ViewStyle;
  /** Custom step style */
  stepStyle?: ViewStyle;
  /** Custom active step style */
  activeStepStyle?: ViewStyle;
  /** Custom completed step style */
  completedStepStyle?: ViewStyle;
  /** Custom label style */
  labelStyle?: TextStyle;
  /** Custom active label style */
  activeLabelStyle?: TextStyle;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels = [],
  variant = "dots",
  size = "base",
  colorScheme = "primary",
  showNumbers = false,
  showLabels = false,
  style,
  stepStyle,
  activeStepStyle,
  completedStepStyle,
  labelStyle,
  activeLabelStyle,
}) => {
  const sizeConfig = {
    sm: {
      stepSize: 24,
      fontSize: tokens.typography.fontSize.sm,
      spacing: tokens.spacing[2],
      lineHeight: 2,
    },
    base: {
      stepSize: 32,
      fontSize: tokens.typography.fontSize.base,
      spacing: tokens.spacing[3],
      lineHeight: 3,
    },
    lg: {
      stepSize: 40,
      fontSize: tokens.typography.fontSize.lg,
      spacing: tokens.spacing[4],
      lineHeight: 4,
    },
  };

  const colorConfig = {
    primary: {
      active: tokens.colors.primary[500],
      completed: tokens.colors.primary[500],
      inactive: tokens.colors.neutral[300],
      activeText: tokens.colors.neutral[0],
      completedText: tokens.colors.neutral[0],
      inactiveText: tokens.colors.neutral[500],
      line: tokens.colors.neutral[300],
      activeLine: tokens.colors.primary[500],
    },
    secondary: {
      active: tokens.colors.secondary[600],
      completed: tokens.colors.secondary[600],
      inactive: tokens.colors.neutral[300],
      activeText: tokens.colors.neutral[0],
      completedText: tokens.colors.neutral[0],
      inactiveText: tokens.colors.neutral[500],
      line: tokens.colors.neutral[300],
      activeLine: tokens.colors.secondary[600],
    },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[colorScheme];

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "active";
    return "inactive";
  };

  const getStepStyle = (stepIndex: number): ViewStyle => {
    const status = getStepStatus(stepIndex);
    const baseStepStyle: ViewStyle = {
      width: config.stepSize,
      height: config.stepSize,
      borderRadius: config.stepSize / 2,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
    };

    switch (status) {
      case "completed":
        return {
          ...baseStepStyle,
          backgroundColor: colors.completed,
          borderColor: colors.completed,
          ...completedStepStyle,
        };
      case "active":
        return {
          ...baseStepStyle,
          backgroundColor: colors.active,
          borderColor: colors.active,
          ...activeStepStyle,
        };
      default:
        return {
          ...baseStepStyle,
          backgroundColor: "transparent",
          borderColor: colors.inactive,
          ...stepStyle,
        };
    }
  };

  const getStepTextStyle = (stepIndex: number): TextStyle => {
    const status = getStepStatus(stepIndex);
    const baseTextStyle: TextStyle = {
      fontSize: config.fontSize,
      fontWeight: tokens.typography.fontWeight.medium as "500",
    };

    switch (status) {
      case "completed":
        return {
          ...baseTextStyle,
          color: colors.completedText,
        };
      case "active":
        return {
          ...baseTextStyle,
          color: colors.activeText,
          ...activeLabelStyle,
        };
      default:
        return {
          ...baseTextStyle,
          color: colors.inactiveText,
        };
    }
  };

  const getLabelStyle = (stepIndex: number): TextStyle => {
    const status = getStepStatus(stepIndex);
    const baseLabelStyle: TextStyle = {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.normal as "400",
      textAlign: "center",
      marginTop: tokens.spacing[1],
      ...labelStyle,
    };

    switch (status) {
      case "active":
        return {
          ...baseLabelStyle,
          color: colors.active,
          fontWeight: tokens.typography.fontWeight.medium as "500",
          ...activeLabelStyle,
        };
      default:
        return {
          ...baseLabelStyle,
          color: colors.inactiveText,
        };
    }
  };

  const renderProgressBar = () => {
    if (variant !== "progress") return null;

    const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.line }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.activeLine,
                width: `${Math.min(progressPercentage, 100)}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.active }]}>
          {currentStep + 1} / {totalSteps}
        </Text>
      </View>
    );
  };

  const renderConnectorLine = (stepIndex: number) => {
    if (stepIndex === totalSteps - 1) return null;

    const isCompleted = stepIndex < currentStep;
    return (
      <View
        style={[
          styles.connectorLine,
          {
            backgroundColor: isCompleted ? colors.activeLine : colors.line,
            height: config.lineHeight,
          },
        ]}
      />
    );
  };

  const renderStep = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    const stepLabel = stepLabels[stepIndex] || `Step ${stepIndex + 1}`;

    return (
      <View key={stepIndex} style={styles.stepContainer}>
        <View style={styles.stepWrapper}>
          <View style={getStepStyle(stepIndex)}>
            {showNumbers || variant === "numbered" ? (
              <Text style={getStepTextStyle(stepIndex)}>{stepIndex + 1}</Text>
            ) : (
              status === "completed" && <Text style={getStepTextStyle(stepIndex)}>✓</Text>
            )}
          </View>
          {renderConnectorLine(stepIndex)}
        </View>
        {(showLabels || variant === "labeled") && (
          <Text style={getLabelStyle(stepIndex)}>{stepLabel}</Text>
        )}
      </View>
    );
  };

  if (variant === "progress") {
    return <View style={[styles.container, style]}>{renderProgressBar()}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => renderStep(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  connectorLine: {
    flex: 1,
    marginHorizontal: tokens.spacing[2],
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: tokens.borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: tokens.borderRadius.full,
  },
  progressText: {
    marginTop: tokens.spacing[2],
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium as "500",
  },
});

export default StepIndicator;
