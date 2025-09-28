import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({ 
  children, 
  style, 
  padding = 'md',
  shadow = 'medium',
  borderRadius = 'md',
  ...props 
}) => {
  const { theme } = useTheme();

  const getCardStyle = () => {
    const paddingValue = typeof padding === 'string' ? theme.spacing[padding] : padding;
    const shadowStyle = typeof shadow === 'string' ? theme.shadows[shadow] : shadow;
    const borderRadiusValue = typeof borderRadius === 'string' ? theme.borderRadius[borderRadius] : borderRadius;

    return {
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadiusValue,
      padding: paddingValue,
      ...shadowStyle,
    };
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

export default Card;