import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const LoginScreen = () => {
  const { theme } = useTheme();
  const { login, isLoading, mockUsers } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxl,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h2,
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.typography.body1,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    formContainer: {
      marginBottom: theme.spacing.lg,
    },
    forgotPassword: {
      ...theme.typography.body2,
      color: theme.colors.primary,
      textAlign: 'right',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    demoSection: {
      marginTop: theme.spacing.lg,
    },
    demoTitle: {
      ...theme.typography.h6,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    demoCredential: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.sm,
    },
    demoCredentialText: {
      ...theme.typography.body2,
      color: theme.colors.text.primary,
    },
    demoCredentialRole: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      textTransform: 'uppercase',
    },
    footer: {
      marginTop: theme.spacing.xl,
      alignItems: 'center',
    },
    footerText: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setFormData({ email, password });
    const result = await login(email, password);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="analytics" size={40} color={theme.colors.text.white} />
          </View>
          <Text style={styles.title}>Tech Maven</Text>
          <Text style={styles.subtitle}>Income & Expenditure Management System</Text>
        </View>

        <Card style={styles.formContainer}>
          <Input
            label="Email Address"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={
              <Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />
            }
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} />
            }
          />

          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            size="large"
          />
        </Card>

        <Card style={styles.demoSection}>
          <Text style={styles.demoTitle}>Demo Accounts</Text>
          <Text style={styles.footerText}>
            Click on any account below to login with demo credentials
          </Text>
          
          {mockUsers.map((user) => {
            let password;
            if (user.email === 'admin@finance.com') {
              password = 'admin123';
            } else if (user.email === 'lois.osei-bonsu@techmaven.com') {
              password = 'finance123';
            } else if (user.email === 'stephen.sayor@techmaven.com') {
              password = 'viewer123';
            }
            
            return (
              <TouchableOpacity
                key={user.id}
                onPress={() => handleDemoLogin(user.email, password)}
                style={styles.demoCredential}
              >
                <View>
                  <Text style={styles.demoCredentialText}>{user.name}</Text>
                  <Text style={styles.demoCredentialRole}>{user.role.replace('_', ' ')}</Text>
                </View>
                <Text style={styles.demoCredentialText}>{user.email}</Text>
              </TouchableOpacity>
            );
          })}
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Tech Maven{'\n'}
            Secure Financial Management System
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;