import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex flex-row items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        large: 'h-12 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const textVariants = cva(
  'font-medium text-center',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-foreground',
        link: 'text-primary',
        primary: 'text-white',
      },
      size: {
        default: 'text-sm',
        sm: 'text-sm',
        lg: 'text-base',
        large: 'text-base',
        icon: 'text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  title?: string;
  loading?: boolean;
  children?: React.ReactNode;
  textClassName?: string;
  fullWidth?: boolean;
}

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, title, loading, children, textClassName, fullWidth, disabled, ...props }, ref) => {
  return (
    <Pressable
      className={cn(
        buttonVariants({ variant, size, className }),
        fullWidth && 'w-full',
        disabled && 'opacity-50'
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' ? '#000' : '#fff'} />
      ) : (
        <>
          {title && (
            <Text className={cn(textVariants({ variant, size }), textClassName)}>
              {title}
            </Text>
          )}
          {children}
        </>
      )}
    </Pressable>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };