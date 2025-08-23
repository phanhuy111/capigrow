import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ViewStyle } from 'react-native';

interface ScreenProps {
  children: React.ReactNode;
  paddingHorizontal?: boolean;
  style?: ViewStyle;
  className?: string;
}

const Screen: React.FC<ScreenProps> = ({ 
  children, 
  paddingHorizontal = false, 
  style,
  className 
}) => {
  const baseClasses = 'flex-1 bg-white';
  const paddingClasses = paddingHorizontal ? ' px-6' : '';
  const combinedClasses = `${baseClasses}${paddingClasses} ${className || ''}`;

  return (
    <SafeAreaView className={combinedClasses} style={style}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;