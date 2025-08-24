import React from "react";
import { BottomSheetSelectionForm } from "./BottomSheetSelectionForm";
import { Control, FieldValues, FieldPath } from "react-hook-form";

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

export function SelectionForm<T extends FieldValues>(props: SelectFieldProps<T>) {
  // Simply pass all props to BottomSheetSelectionForm
  return <BottomSheetSelectionForm {...props} />;
}
