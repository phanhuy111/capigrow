import React from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 bg-white',
        filled: 'border-transparent bg-gray-100',
        outlined: 'border-gray-400 bg-transparent',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  InputProps
>((
  {
    className,
    variant,
    size,
    label,
    error,
    containerClassName,
    labelClassName,
    errorClassName,
    leftIcon,
    rightIcon,
    onRightIconPress,
    editable = true,
    ...props
  },
  ref
) => {
  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <Text className={cn('text-sm font-medium text-gray-700 mb-2', labelClassName)}>
          {label}
        </Text>
      )}
      <View className="relative flex-row items-center">
        {leftIcon && (
          <View className="absolute left-3 z-10">
            {leftIcon}
          </View>
        )}
        <TextInput
          className={cn(
            inputVariants({ variant, size }),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            !editable && 'opacity-50',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          ref={ref}
          editable={editable}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            className="absolute right-3 z-10"
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className={cn('text-sm text-red-500 mt-1', errorClassName)}>
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export { Input, inputVariants };