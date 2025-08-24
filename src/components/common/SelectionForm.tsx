import React from "react";
import { Controller, Control, FieldValues, FieldPath } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
  Option,
  NativeSelectScrollView,
} from "../ui/select";
import { View, Text } from "react-native";
import { cn } from "@/components/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps<T extends FieldValues> {
  control?: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[] | SelectOption[][];
  required?: boolean;
  disabled?: boolean;
  size?: "default" | "sm";
  groupLabels?: string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
  leftIcon?: React.ReactNode;
}

export function SelectionForm<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option...",
  options,
  required = false,
  disabled = false,
  size = "default",
  groupLabels,
  value,
  onChange,
  error,
  className,
  leftIcon,
}: SelectFieldProps<T>) {
  const hasGroups = Array.isArray(options[0]);

  const renderSelectContent = () => (
    <SelectContent>
      <NativeSelectScrollView>
        {hasGroups
          ? (options as SelectOption[][]).map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {groupLabels?.[groupIndex] && (
                  <SelectLabel>{groupLabels[groupIndex]}</SelectLabel>
                )}
                <SelectGroup>
                  {group.map((option) => (
                    <SelectItem
                      label={option.label}
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                {groupIndex < (options as SelectOption[][]).length - 1 && (
                  <SelectSeparator />
                )}
              </React.Fragment>
            ))
          : (options as SelectOption[]).map((option) => (
              <SelectItem
                label={option.label}
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
      </NativeSelectScrollView>
    </SelectContent>
  );

  if (control) {
    return (
      <View className={cn("space-y-2", className)}>
        {label && (
          <Text
            className={cn(
              "text-foreground text-sm font-medium",
              required && "after:content-['*'] after:text-red-500 after:ml-1"
            )}
          >
            {label}
          </Text>
        )}

        <Controller
          control={control}
          name={name}
          rules={{ required }}
          render={({
            field: { onChange: fieldOnChange, value: fieldValue },
            fieldState: { error: fieldError },
          }) => (
            <Select value={fieldValue} onValueChange={fieldOnChange}>
              <SelectTrigger
                className={cn(
                  "w-full",
                  (fieldError || error) &&
                    "border-red-500 focus-visible:ring-red-500/20"
                )}
                disabled={disabled}
                size={size}
              >
                {leftIcon}
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              {renderSelectContent()}
            </Select>
          )}
        />

        {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
      </View>
    );
  }

  return (
    <View className={cn("space-y-2", className)}>
      {label && (
        <Text
          className={cn(
            "text-foreground text-sm font-medium",
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {label}
        </Text>
      )}

      <Select
        value={value ? { value, label: value } : undefined}
        onValueChange={(option: Option | undefined) =>
          onChange?.(option?.value || "")
        }
      >
        <SelectTrigger
          className={cn(
            "w-full",
            error && "border-red-500 focus-visible:ring-red-500/20"
          )}
          disabled={disabled}
          size={size}
        >
          {leftIcon}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {renderSelectContent()}
      </Select>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
