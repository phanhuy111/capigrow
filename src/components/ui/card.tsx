import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl bg-white shadow-sm", {
  variants: {
    variant: {
      default: "bg-white shadow-md",
      elevated: "bg-white shadow-lg",
      outlined: "border border-gray-200 bg-white shadow-none",
      filled: "bg-gray-50 shadow-none",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      default: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

export interface CardProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

const Card = React.forwardRef<React.ElementRef<typeof View>, CardProps>(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <View ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...props}>
        {children}
      </View>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, children, ...props }, ref) => {
  return (
    <View ref={ref} className={cn("pb-4", className)} {...props}>
      {children}
    </View>
  );
});

CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, children, ...props }, ref) => {
  return (
    <View ref={ref} className={cn("flex-1", className)} {...props}>
      {children}
    </View>
  );
});

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, children, ...props }, ref) => {
  return (
    <View ref={ref} className={cn("pt-4", className)} {...props}>
      {children}
    </View>
  );
});

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter, cardVariants };
