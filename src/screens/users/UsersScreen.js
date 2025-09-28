import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

const UsersScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { mockUsers } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

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
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    userItem: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    userHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      ...theme.typography.h6,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    userEmail: {
      ...theme.typography.body2,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    userRole: {
      ...theme.typography.caption,
      color: theme.colors.primary,
      textTransform: 'uppercase',
      fontWeight: '600',
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.success + '20',
    },
    statusText: {
      ...theme.typography.caption,
      color: theme.colors.success,
      fontWeight: '600',
    },
    permissionsList: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
    },
    permissionsTitle: {
      ...theme.typography.body2,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    permissionChip: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    permissionText: {
      ...theme.typography.caption,
      color: theme.colors.text.primary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyText: {
      ...theme.typography.h6,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  });

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return theme.colors.error;
      case 'finance_admin':
        return theme.colors.primary;
      case 'viewer':
        return theme.colors.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const renderUserItem = ({ item }) => (
    <Card style={styles.userItem}>
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={24} color={theme.colors.text.white} />
        </View>
        
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={[styles.userRole, { color: getRoleColor(item.role) }]}>
            {item.role.replace('_', ' ')}
          </Text>
        </View>
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>
      
      <View style={styles.permissionsList}>
        <Text style={styles.permissionsTitle}>Permissions:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {item.permissions.map((permission, index) => (
            <View key={index} style={styles.permissionChip}>
              <Text style={styles.permissionText}>{permission}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color={theme.colors.text.disabled} />
      <Text style={styles.emptyText}>
        No users found{'\n'}
        {searchQuery ? 'Try adjusting your search' : 'No users available'}
      </Text>
    </View>
  );

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
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={
            <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
          }
        />
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default UsersScreen;