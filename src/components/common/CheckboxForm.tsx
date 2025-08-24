import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Control, Controller, FieldError, FieldValues, FieldPath } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/components/lib/utils";

interface CheckboxFormProps<T extends FieldValues> {
  control?: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | FieldError;
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  checkboxClassName?: string;
  rules?: any;
}

export function CheckboxForm<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required = false,
  disabled = false,
  error,
  value,
  onChange,
  className,
  labelClassName,
  descriptionClassName,
  checkboxClassName,
  rules,
}: CheckboxFormProps<T>) {
  const renderCheckbox = (
    checkboxValue: boolean,
    checkboxOnChange: (value: boolean) => void,
    checkboxError?: string | FieldError
  ) => (
    <View className={cn("flex-row items-start space-x-3 py-2", className)}>
      <Checkbox
        checked={checkboxValue}
        onCheckedChange={checkboxOnChange}
        disabled={disabled}
        className={cn(
          checkboxError && "border-red-500",
          checkboxClassName
        )}
      />
      
      <View className="flex-1">
        {label && (
          <TouchableOpacity
            onPress={() => !disabled && checkboxOnChange(!checkboxValue)}
            activeOpacity={0.7}
          >
            <Text
              className={cn(
                "text-sm font-medium text-gray-900",
                disabled && "text-gray-400",
                labelClassName
              )}
            >
              {label}
              {required && <Text className="text-red-500"> *</Text>}
            </Text>
          </TouchableOpacity>
        )}
        
        {description && (
          <Text
            className={cn(
              "text-xs text-gray-600 mt-1",
              disabled && "text-gray-400",
              descriptionClassName
            )}
          >
            {description}
          </Text>
        )}
        
        {(checkboxError || error) && (
          <Text className="text-xs text-red-500 mt-1">
            {typeof checkboxError === "string"
              ? checkboxError
              : checkboxError?.message ||
                (typeof error === "string" ? error : error?.message)}
          </Text>
        )}
      </View>
    </View>
  );

  // If using React Hook Form
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange: fieldOnChange, value: fieldValue },
          fieldState: { error: fieldError },
        }) => renderCheckbox(fieldValue || false, fieldOnChange, fieldError)}
      />
    );
  }

  // Regular checkbox without form control
  return renderCheckbox(
    value || false,
    onChange || (() => {}),
    error
  );
}

export default CheckboxForm;