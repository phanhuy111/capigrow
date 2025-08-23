import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';
import { COLORS, TYPOGRAPHY, INPUT_STYLES, SPACING } from '@/utils/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string | FieldError;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  // React Hook Form integration
  name?: string;
  control?: Control<any>;
  rules?: any;
  required?: boolean;
}

const Input = forwardRef<TextInput, InputProps>((
  {
    label,
    placeholder,
    value,
    onChangeText,
    onBlur,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
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
  },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    return {
      ...styles.container,
      ...style,
    };
  };

  const getInputContainerStyle = (): ViewStyle => {
    let baseStyle = INPUT_STYLES.default;
    
    if (isFocused) {
      baseStyle = { ...baseStyle, ...INPUT_STYLES.focused };
    }
    
    if (error) {
      baseStyle = { ...baseStyle, ...INPUT_STYLES.error };
    }
    
    if (disabled) {
      baseStyle = { ...baseStyle, ...INPUT_STYLES.disabled };
    }

    return {
      ...baseStyle,
      ...(multiline && { height: numberOfLines * 20 + SPACING.xl * 2 }),
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      ...styles.input,
      ...TYPOGRAPHY.bodyMedium,
      color: disabled ? COLORS.textDisabled : COLORS.textPrimary,
      ...(multiline && { textAlignVertical: 'top', paddingTop: SPACING.lg }),
      ...inputStyle,
    };
  };

  const renderInput = (inputValue: any, inputOnChangeText: (text: string) => void, inputOnBlur: () => void, inputError?: string | FieldError) => (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={{ color: COLORS.error }}> *</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
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
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(inputError || error) && (
        <Text style={styles.errorText}>
          {typeof inputError === 'string' ? inputError : inputError?.message || (typeof error === 'string' ? error : error?.message)}
        </Text>
      )}
    </View>
  );

  // If using React Hook Form
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value: fieldValue }, fieldState: { error: fieldError } }) =>
          renderInput(fieldValue, onChange, onBlur, fieldError)
        }
      />
    );
  }

  // Regular input without form control
  return renderInput(value, onChangeText || (() => {}), onBlur || (() => {}), error);
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.labelMedium,
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  leftIcon: {
    marginRight: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.sm,
  },
});

export default Input;
