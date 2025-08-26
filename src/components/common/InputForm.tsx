import type React from "react";
import { forwardRef, useState } from "react";
import {
  type Control,
  Controller,
  type FieldError,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";
import {
  Text,
  TextInput,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";

interface InputProps<T extends FieldValues = FieldValues> {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string | FieldError;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  name?: string;
  control?: Control<T>;
  rules?: RegisterOptions<T>;
  required?: boolean;
}

const InputForm = forwardRef(
  <T extends FieldValues = FieldValues>(
    {
      label,
      placeholder,
      value,
      onChangeText,
      onBlur,
      secureTextEntry = false,
      keyboardType = "default",
      autoCapitalize = "none",
      error,
      disabled = false,
      multiline = false,
      numberOfLines = 1,
      style,
      inputStyle,
      leftIcon,
      rightIcon,
      onRightIconPress,
      name,
      control,
      rules,
      required = false,
    }: InputProps<T>,
    ref: React.Ref<TextInput>
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Copy exact style từ dropdown để match 100%
    const getInputContainerClassName = () => {
      let baseClasses =
        "flex-row items-center border rounded-lg px-4 py-4 bg-white";

      if (isFocused) {
        baseClasses += " border-purple-500";
      } else if (error) {
        baseClasses += " border-red-500";
      } else {
        baseClasses += " border-gray-300";
      }

      if (disabled) {
        baseClasses += " bg-gray-50";
      }

      return baseClasses;
    };

    const renderInput = (
      inputValue: string,
      inputOnChangeText: (text: string) => void,
      inputOnBlur: () => void,
      inputError?: string | FieldError
    ) => (
      <View style={style}>
        {label && (
          <Text className="text-foreground text-sm font-medium mb-2">
            {label}
            {required && <Text className="text-red-500"> *</Text>}
          </Text>
        )}

        <View className={getInputContainerClassName()}>
          {leftIcon && <View className="mr-3 flex-shrink-0">{leftIcon}</View>}

          <TextInput
            ref={ref}
            className="flex-1 text-base text-gray-900"
            style={[
              {
                // Reset tất cả padding để match dropdown
                paddingVertical: 0,
                paddingHorizontal: 0,
                margin: 0,
                textAlignVertical: "center",
                includeFontPadding: false,
              },
              inputStyle,
            ]}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={inputValue}
            onChangeText={inputOnChangeText}
            onBlur={() => {
              setIsFocused(false);
              inputOnBlur();
            }}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            editable={!disabled}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onFocus={() => setIsFocused(true)}
            underlineColorAndroid="transparent"
          />

          {rightIcon && (
            <TouchableOpacity
              className="ml-3 flex-shrink-0"
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {(inputError || error) && (
          <Text className="text-xs text-red-500 mt-2">
            {typeof inputError === "string"
              ? inputError
              : inputError?.message ||
                (typeof error === "string" ? error : error?.message)}
          </Text>
        )}
      </View>
    );

    // If using React Hook Form
    if (control && name) {
      return (
        <Controller
          control={control}
          name={name as any}
          rules={rules}
          render={({
            field: { onChange, onBlur, value: fieldValue },
            fieldState: { error: fieldError },
          }) => renderInput(fieldValue, onChange, onBlur, fieldError)}
        />
      );
    }

    // Regular input without form control
    return renderInput(
      value || "",
      onChangeText || (() => {}),
      onBlur || (() => {}),
      error
    );
  }
) as <T extends FieldValues = FieldValues>(
  props: InputProps<T> & { ref?: React.Ref<TextInput> }
) => React.ReactElement;

// Add displayName to the function
(InputForm as any).displayName = "InputForm";

export default InputForm;
