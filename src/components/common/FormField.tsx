import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Text, View } from "react-native";
import tokens from "@/components/lib/tokens";
import { Input } from "../ui/input";
import FormError from "./FormError";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?:
    | "name"
    | "email"
    | "tel"
    | "off"
    | "username"
    | "password"
    | "new-password"
    | "current-password";
  maxLength?: number;
  rules?: object;
  helperText?: string;
  variant?: "default" | "floating";
  size?: "sm" | "base" | "lg";
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const FormField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  multiline = false,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoComplete,
  maxLength,
  rules = {},
  helperText,
  variant = "default",
  size = "base",
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
}: FormFieldProps<T>) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          labelFontSize: tokens.typography.fontSize.sm,
          helperFontSize: tokens.typography.fontSize.xs,
          spacing: tokens.spacing[1],
        };
      case "lg":
        return {
          labelFontSize: tokens.typography.fontSize.lg,
          helperFontSize: tokens.typography.fontSize.sm,
          spacing: tokens.spacing[3],
        };
      default:
        return {
          labelFontSize: tokens.typography.fontSize.base,
          helperFontSize: tokens.typography.fontSize.sm,
          spacing: tokens.spacing[2],
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const combinedRules = {
    ...rules,
    ...(required && {
      required: `${label || "This field"} is required`,
    }),
  };

  return (
    <View className={className} style={{ gap: sizeStyles.spacing }}>
      {/* Label */}
      {label && variant !== "floating" && (
        <Text
          className={labelClassName}
          style={{
            fontSize: sizeStyles.labelFontSize,
            fontWeight: tokens.typography.fontWeight.medium as "500",
            color: disabled ? tokens.colors.text.disabled : tokens.colors.text.primary,
          }}
        >
          {label}
          {required && <Text style={{ color: tokens.colors.error[500] }}> *</Text>}
        </Text>
      )}

      {/* Input Field */}
      <Controller
        name={name}
        control={control}
        rules={combinedRules}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder || (variant === "floating" ? label : undefined)}
              state={disabled ? "disable" : "enable"}
              multiline={multiline}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              maxLength={maxLength}
              variant={error ? "error" : disabled ? "disabled" : "normal"}
              size={size}
              className={inputClassName}
              label={variant === "floating" ? label : undefined}
            />

            {/* Error Message */}
            {error && (
              <FormError
                message={error.message}
                variant="inline"
                size={size}
                className={errorClassName}
              />
            )}
          </>
        )}
      />

      {/* Helper Text */}
      {helperText && (
        <Text
          style={{
            fontSize: sizeStyles.helperFontSize,
            color: tokens.colors.text.secondary,
            lineHeight: sizeStyles.helperFontSize * 1.4,
          }}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default FormField;