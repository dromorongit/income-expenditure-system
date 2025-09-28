import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { formatGhanaCedis } from '../../utils/currency';

const TransactionsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { hasPermission } = useAuth();
  const { transactions, deleteTransaction, updateTransaction, approveTransaction, rejectTransaction, categories, refreshData } = useData();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

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
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    filterButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterButtonText: {
      ...theme.typography.body2,
      color: theme.colors.text.secondary,
    },
    filterButtonTextActive: {
      color: theme.colors.text.white,
    },
    transactionItem: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    transactionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    transactionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionCategory: {
      ...theme.typography.h6,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    transactionDescription: {
      ...theme.typography.body2,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    transactionDate: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
    },
    transactionAmount: {
      ...theme.typography.h5,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    incomeAmount: {
      color: theme.colors.success,
    },
    expenseAmount: {
      color: theme.colors.error,
    },
    transactionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    statusText: {
      ...theme.typography.caption,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    pendingStatus: {
      backgroundColor: theme.colors.warning + '20',
    },
    pendingStatusText: {
      color: theme.colors.warning,
    },
    approvedStatus: {
      backgroundColor: theme.colors.success + '20',
    },
    approvedStatusText: {
      color: theme.colors.success,
    },
    rejectedStatus: {
      backgroundColor: theme.colors.error + '20',
    },
    rejectedStatusText: {
      color: theme.colors.error,
    },
    actionButtons: {
      flexDirection: 'row',
    },
    actionButton: {
      marginLeft: theme.spacing.sm,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing.lg,
      right: theme.spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.medium,
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

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, selectedFilter]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(transaction =>
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === selectedFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredTransactions(filtered);
  };


  const getCategoryIcon = (categoryName, type) => {
    const allCategories = [...categories.income, ...categories.expense];
    const category = allCategories.find(cat => cat.name === categoryName);
    return category?.icon || (type === 'income' ? 'arrow-up' : 'arrow-down');
  };

  const getCategoryColor = (categoryName, type) => {
    const allCategories = [...categories.income, ...categories.expense];
    const category = allCategories.find(cat => cat.name === categoryName);
    return category?.color || (type === 'income' ? theme.colors.success : theme.colors.error);
  };

  const handleDeleteTransaction = (transactionId) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTransaction(transactionId);
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleApproveTransaction = async (transactionId) => {
    const result = await approveTransaction(transactionId);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    const result = await rejectTransaction(transactionId);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const renderTransactionItem = ({ item }) => (
    <Card style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <View style={[
          styles.transactionIcon,
          { backgroundColor: getCategoryColor(item.category, item.type) + '20' }
        ]}>
          <Ionicons
            name={getCategoryIcon(item.category, item.type)}
            size={24}
            color={getCategoryColor(item.category, item.type)}
          />
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {format(new Date(item.date), 'MMM dd, yyyy • hh:mm a')}
          </Text>
        </View>
        
        <Text style={[
          styles.transactionAmount,
          item.type === 'income' ? styles.incomeAmount : styles.expenseAmount
        ]}>
          {item.type === 'income' ? '+' : '-'}{formatGhanaCedis(item.amount)}
        </Text>
      </View>
      
      <View style={styles.transactionStatus}>
        <View style={[
          styles.statusBadge,
          item.status === 'pending' ? styles.pendingStatus :
          item.status === 'approved' ? styles.approvedStatus : styles.rejectedStatus
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'pending' ? styles.pendingStatusText :
            item.status === 'approved' ? styles.approvedStatusText : styles.rejectedStatusText
          ]}>
            {item.status}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          {hasPermission('transactions') && item.status === 'pending' && (
            <>
              <Button
                title="Approve"
                variant="success"
                size="small"
                style={styles.actionButton}
                onPress={() => handleApproveTransaction(item.id)}
              />
              <Button
                title="Reject"
                variant="danger"
                size="small"
                style={styles.actionButton}
                onPress={() => handleRejectTransaction(item.id)}
              />
            </>
          )}
          
          <Button
            title="Edit"
            variant="outline"
            size="small"
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditTransaction', { transaction: item })}
          />
          
          {hasPermission('transactions') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteTransaction(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color={theme.colors.text.disabled} />
      <Text style={styles.emptyText}>
        No transactions found{'\n'}
        {searchQuery ? 'Try adjusting your search' : 'Add your first transaction'}
      </Text>
    </View>
  );

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expenses' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={
            <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
          }
        />
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterButton,
              selectedFilter === option.key && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(option.key)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === option.key && styles.filterButtonTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Transaction FAB */}
      {hasPermission('transactions') && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Ionicons name="add" size={28} color={theme.colors.text.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TransactionsScreen;