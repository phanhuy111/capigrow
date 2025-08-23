import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';

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

  const getInputContainerClassName = () => {
    let baseClasses = 'flex-row border rounded-lg px-4 py-3 bg-white';
    
    if (isFocused) {
      baseClasses += ' border-blue-500';
    } else if (error) {
      baseClasses += ' border-red-500';
    } else {
      baseClasses += ' border-gray-300';
    }
    
    if (disabled) {
      baseClasses += ' bg-gray-100';
    }

    if (multiline) {
      baseClasses += ' items-start';
    } else {
      baseClasses += ' items-center';
    }

    return baseClasses;
  };

  const renderInput = (inputValue: any, inputOnChangeText: (text: string) => void, inputOnBlur: () => void, inputError?: string | FieldError) => (
    <View className="my-3" style={style}>
      {label && (
        <Text className="text-sm font-medium mb-3 text-gray-900">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      
      <View 
        className={getInputContainerClassName()}
        style={multiline ? { height: numberOfLines * 20 + 32 } : undefined}
      >
        {leftIcon && (
          <View className="mr-4 justify-center items-center">
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          className={`flex-1 text-base ${disabled ? 'text-gray-400' : 'text-gray-900'} ${multiline ? 'pt-3' : ''}`}
          style={[multiline && { textAlignVertical: 'top' }, inputStyle]}
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
        />
        
        {rightIcon && (
          <TouchableOpacity
            className="ml-4 justify-center items-center"
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(inputError || error) && (
        <Text className="text-xs text-red-500 mt-2">
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



export default Input;
