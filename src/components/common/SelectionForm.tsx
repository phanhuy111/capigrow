import type React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { BottomSheetSelectionForm } from "./BottomSheetSelectionForm";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps<T extends FieldValues = FieldValues> {
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

export function SelectionForm<T extends FieldValues = FieldValues>(
  props: SelectFieldProps<T>
) {
  // Simply pass all props to BottomSheetSelectionForm
  return <BottomSheetSelectionForm points={["85%"]} {...props} />;
}
