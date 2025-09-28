import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getContainerStyle = () => ({
    marginBottom: theme.spacing.md,
  });

  const getLabelStyle = () => ({
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  });

  const getInputContainerStyle = () => ({
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    borderWidth: 1,
    borderColor: error 
      ? theme.colors.error 
      : isFocused 
        ? theme.colors.primary 
        : theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: disabled ? theme.colors.background : theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: multiline ? theme.spacing.md : theme.spacing.sm,
    minHeight: multiline ? 80 : 44,
  });

  const getInputStyle = () => ({
    flex: 1,
    ...theme.typography.body1,
    color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
    textAlignVertical: multiline ? 'top' : 'center',
    paddingVertical: 0,
  });

  const getErrorStyle = () => ({
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <View style={[getInputContainerStyle(), style]}>
        {leftIcon && (
          <View style={{ marginRight: theme.spacing.sm }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.hint}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={handleTogglePassword}
            style={{ marginLeft: theme.spacing.sm }}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: theme.spacing.sm }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
};

export default Input;