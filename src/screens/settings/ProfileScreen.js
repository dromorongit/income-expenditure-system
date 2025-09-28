import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  });
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: 50,
      paddingBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      ...theme.typography.h3,
      color: theme.colors.text.primary,
      flex: 1,
      textAlign: 'center',
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    editButton: {
      position: 'absolute',
      right: 0,
      top: 0,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    infoIcon: {
      marginRight: theme.spacing.md,
    },
    infoLabel: {
      ...theme.typography.body2,
      color: theme.colors.text.secondary,
      width: 80,
    },
    infoValue: {
      ...theme.typography.body1,
      color: theme.colors.text.primary,
      flex: 1,
    },
    actionButtons: {
      flexDirection: 'row',
      marginTop: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
    },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
    });
    setIsEditing(false);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons
            name={isEditing ? "close" : "create-outline"}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={60} color={theme.colors.text.white} />
          </View>
          <Text style={{ ...theme.typography.h4, color: theme.colors.text.primary }}>
            {user?.name}
          </Text>
          <Text style={{ ...theme.typography.body2, color: theme.colors.text.secondary }}>
            {user?.role?.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        {/* Profile Information */}
        <Card>
          {isEditing ? (
            <>
              <Input
                label="Full Name"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.text.secondary} />}
              />
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />}
              />
              <Input
                label="Department"
                value={formData.department}
                onChangeText={(value) => updateFormData('department', value)}
                leftIcon={<Ionicons name="business-outline" size={20} color={theme.colors.text.secondary} />}
              />
            </>
          ) : (
            <>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color={theme.colors.text.secondary} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{user?.name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="business-outline" size={20} color={theme.colors.text.secondary} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Department:</Text>
                <Text style={styles.infoValue}>{user?.department}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="shield-outline" size={20} color={theme.colors.text.secondary} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Role:</Text>
                <Text style={styles.infoValue}>{user?.role?.replace('_', ' ').toUpperCase()}</Text>
              </View>
            </>
          )}
        </Card>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleCancel}
              style={styles.actionButton}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              style={styles.actionButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;