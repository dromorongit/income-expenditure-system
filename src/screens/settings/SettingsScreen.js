import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const SettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, logout, hasPermission } = useAuth();

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
    },
    headerTitle: {
      ...theme.typography.h3,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    menuIcon: {
      marginRight: theme.spacing.md,
    },
    menuText: {
      ...theme.typography.body1,
      color: theme.colors.text.primary,
      flex: 1,
    },
    menuArrow: {
      marginLeft: theme.spacing.sm,
    },
    logoutButton: {
      marginTop: theme.spacing.xl,
    },
  });

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      title: 'Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('Profile'),
      show: true,
    },
    {
      title: 'User Management',
      icon: 'people-outline',
      onPress: () => navigation.navigate('Users'),
      show: hasPermission('all') || user?.role === 'super_admin',
    },
    {
      title: 'Theme Settings',
      icon: 'color-palette-outline',
      onPress: () => {}, // TODO: Implement theme settings
      show: true,
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => {}, // TODO: Implement notifications settings
      show: true,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* User Info */}
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <View style={{ alignItems: 'center', paddingVertical: theme.spacing.md }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <Ionicons name="person" size={40} color={theme.colors.text.white} />
            </View>
            <Text style={{ ...theme.typography.h5, color: theme.colors.text.primary }}>
              {user?.name}
            </Text>
            <Text style={{ ...theme.typography.body2, color: theme.colors.text.secondary }}>
              {user?.role?.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={{ ...theme.typography.caption, color: theme.colors.text.secondary }}>
              {user?.email}
            </Text>
          </View>
        </Card>

        {/* Menu Items */}
        <Card>
          {menuItems
            .filter(item => item.show)
            .map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={theme.colors.text.secondary}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>{item.title}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={styles.menuArrow}
                />
              </TouchableOpacity>
            ))}
        </Card>

        {/* Logout Button */}
        <Button
          title="Logout"
          variant="danger"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon={<Ionicons name="log-out-outline" size={20} color={theme.colors.text.white} />}
        />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;