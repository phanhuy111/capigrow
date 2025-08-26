import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Check, ChevronDown } from "lucide-react-native";
import type React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  type Control,
  Controller,
  type FieldError,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface BottomSheetSelectionFormProps<T extends FieldValues = FieldValues> {
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
  points?: string[];
}

export function BottomSheetSelectionForm<T extends FieldValues = FieldValues>({
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
  points,
}: BottomSheetSelectionFormProps<T>) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Variables
  const snapPoints = useMemo(() => points || ["25%", "50%", "75%"], []);

  const hasGroups = Array.isArray(options[0]);

  // Callbacks
  const handleSheetChanges = useCallback((index: number) => {
    setIsOpen(index >= 0);
  }, []);

  const openBottomSheet = useCallback(() => {
    if (!disabled) {
      bottomSheetRef.current?.present();
      setIsOpen(true);
    }
  }, [disabled]);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    setIsOpen(false);
  }, []);

  const handleOptionSelect = useCallback(
    (optionValue: string, fieldOnChange?: (value: string) => void) => {
      if (fieldOnChange) {
        fieldOnChange(optionValue);
      } else if (onChange) {
        onChange(optionValue);
      }
      closeBottomSheet();
    },
    [onChange, closeBottomSheet]
  );

  const getSelectedLabel = useCallback(
    (selectedValue: string) => {
      if (hasGroups) {
        for (const group of options as SelectOption[][]) {
          const found = group.find((option) => option.value === selectedValue);
          if (found) return found.label;
        }
      } else {
        const found = (options as SelectOption[]).find(
          (option) => option.value === selectedValue
        );
        if (found) return found.label;
      }
      return placeholder;
    },
    [options, hasGroups, placeholder]
  );

  const renderTrigger = (
    fieldValue?: string,
    _fieldOnChange?: (value: string) => void,
    fieldError?: FieldError
  ) => (
    <TouchableOpacity
      onPress={openBottomSheet}
      disabled={disabled}
      className={cn(
        "flex-row items-center justify-between px-3 py-3 border border-gray-300 bg-background rounded-lg",
        size === "sm" && "py-2",
        (fieldError || error) && "border-red-500",
        disabled && "opacity-50",
        "min-h-[62px]"
      )}
    >
      <View className="flex-row items-center flex-1">
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <Text
          className={cn(
            "flex-1 text-foreground",
            !fieldValue && !value && "text-muted-foreground"
          )}
        >
          {fieldValue
            ? getSelectedLabel(fieldValue)
            : value
            ? getSelectedLabel(value)
            : placeholder}
        </Text>
      </View>
      <ChevronDown
        size={16}
        className={cn("text-muted-foreground ml-2", isOpen && "rotate-180")}
      />
    </TouchableOpacity>
  );

  const renderOptions = (
    fieldValue?: string,
    fieldOnChange?: (value: string) => void
  ) => {
    if (hasGroups) {
      return (options as SelectOption[][]).map((group, groupIndex) => (
        <View
          key={
            groupLabels?.[groupIndex] ||
            `group-${group[0]?.value || groupIndex}`
          }
        >
          {groupLabels?.[groupIndex] && (
            <Text className="text-sm font-medium text-muted-foreground px-4 py-2 bg-muted/50">
              {groupLabels[groupIndex]}
            </Text>
          )}
          {group.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleOptionSelect(option.value, fieldOnChange)}
              disabled={option.disabled}
              className={cn(
                "flex-row items-center justify-between px-4 py-3 min-h-[44px]",
                "active:bg-accent",
                option.disabled && "opacity-50",
                (fieldValue === option.value || value === option.value) &&
                  "bg-accent"
              )}
            >
              <Text
                className={cn(
                  "text-foreground flex-1",
                  option.disabled && "text-muted-foreground"
                )}
              >
                {option.label}
              </Text>
              {(fieldValue === option.value || value === option.value) && (
                <Check size={16} className="text-primary ml-2" />
              )}
            </TouchableOpacity>
          ))}
          {groupIndex < (options as SelectOption[][]).length - 1 && (
            <View className="h-px bg-border mx-4" />
          )}
        </View>
      ));
    } else {
      return (options as SelectOption[]).map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleOptionSelect(option.value, fieldOnChange)}
          disabled={option.disabled}
          className={cn(
            "flex-row items-center justify-between px-4 py-3 min-h-[44px]",
            "active:bg-accent",
            option.disabled && "opacity-50",
            (fieldValue === option.value || value === option.value) &&
              "bg-accent"
          )}
        >
          <Text
            className={cn(
              "text-foreground flex-1",
              option.disabled && "text-muted-foreground"
            )}
          >
            {option.label}
          </Text>
          {(fieldValue === option.value || value === option.value) && (
            <Check size={16} className="text-primary ml-2" />
          )}
        </TouchableOpacity>
      ));
    }
  };

  if (control) {
    return (
      <View className={cn("space-y-2", className)}>
        {label && (
          <Text
            className={cn(
              "text-foreground text-sm font-medium mb-2",
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
            <>
              {renderTrigger(fieldValue, fieldOnChange, fieldError)}

              <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
                backgroundStyle={{ backgroundColor: "#ffffff" }}
                handleIndicatorStyle={{ backgroundColor: "#e5e7eb" }}
              >
                <BottomSheetView className="flex-1">
                  <View className="px-4 py-2 border-b border-border">
                    <Text className="text-lg font-semibold text-foreground text-center">
                      {label || "Select Option"}
                    </Text>
                  </View>

                  <BottomSheetScrollView className="flex-1">
                    {renderOptions(fieldValue, fieldOnChange)}
                  </BottomSheetScrollView>
                </BottomSheetView>
              </BottomSheetModal>
            </>
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

      {renderTrigger(value)}

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#ffffff" }}
        handleIndicatorStyle={{ backgroundColor: "#e5e7eb" }}
      >
        <BottomSheetView className="flex-1">
          <View className="px-4 py-2 border-b border-border">
            <Text className="text-lg font-semibold text-foreground text-center">
              {label || "Select Option"}
            </Text>
          </View>

          <BottomSheetScrollView className="flex-1">
            {renderOptions(value)}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
