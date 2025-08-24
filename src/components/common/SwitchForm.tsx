import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Control, Controller, FieldError, FieldValues, FieldPath } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/components/lib/utils";

interface SwitchFormProps<T extends FieldValues> {
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
  switchClassName?: string;
  rules?: any;
}

export function SwitchForm<T extends FieldValues>({
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
  switchClassName,
  rules,
}: SwitchFormProps<T>) {
  const renderSwitch = (
    switchValue: boolean,
    switchOnChange: (value: boolean) => void,
    switchError?: string | FieldError
  ) => (
    <View className={cn("flex-row items-center justify-between py-3", className)}>
      <View className="flex-1 mr-4">
        {label && (
          <TouchableOpacity
            onPress={() => !disabled && switchOnChange(!switchValue)}
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
        
        {(switchError || error) && (
          <Text className="text-xs text-red-500 mt-1">
            {typeof switchError === "string"
              ? switchError
              : switchError?.message ||
                (typeof error === "string" ? error : error?.message)}
          </Text>
        )}
      </View>
      
      <Switch
        checked={switchValue}
        onCheckedChange={switchOnChange}
        disabled={disabled}
        className={cn(
          switchError && "border-red-500",
          switchClassName
        )}
      />
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
        }) => renderSwitch(fieldValue || false, fieldOnChange, fieldError)}
      />
    );
  }

  // Regular switch without form control
  return renderSwitch(
    value || false,
    onChange || (() => {}),
    error
  );
}

export default SwitchForm;