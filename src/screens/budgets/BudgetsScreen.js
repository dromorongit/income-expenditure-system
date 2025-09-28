import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatGhanaCedis } from '../../utils/currency';

const BudgetsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { budgets, categories, refreshData } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('current');
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
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    summaryCard: {
      marginBottom: theme.spacing.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      ...theme.typography.body1,
      color: theme.colors.text.secondary,
    },
    summaryValue: {
      ...theme.typography.h6,
      fontWeight: 'bold',
    },
    budgetItem: {
      marginBottom: theme.spacing.md,
    },
    budgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    budgetCategory: {
      ...theme.typography.h6,
      color: theme.colors.text.primary,
    },
    budgetAmount: {
      ...theme.typography.body1,
      color: theme.colors.text.secondary,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.background,
      borderRadius: 4,
      marginBottom: theme.spacing.sm,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    budgetStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      ...theme.typography.body2,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
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


  const getProgressColor = (percentage) => {
    if (percentage >= 90) return theme.colors.error;
    if (percentage >= 75) return theme.colors.warning;
    return theme.colors.success;
  };

  const calculateTotalBudget = () => {
    return budgets.reduce((total, budget) => total + budget.monthlyLimit, 0);
  };

  const calculateTotalBudgetAnnual = () => {
    return budgets.reduce((total, budget) => total + (budget.monthlyLimit * 12), 0);
  };

  const calculateTotalSpent = () => {
    return budgets.reduce((total, budget) => total + budget.currentSpent, 0);
  };

  const calculateTotalSpentAnnual = () => {
    // For simplicity, we'll multiply current spent by 12 to simulate annual spending
    // In a real app, this would sum all transactions for the year
    return budgets.reduce((total, budget) => total + (budget.currentSpent * 12), 0);
  };

  const renderBudgetItem = ({ item }) => {
    const percentage = (item.currentSpent / item.monthlyLimit) * 100;
    const remaining = item.monthlyLimit - item.currentSpent;

    return (
      <Card style={styles.budgetItem}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetCategory}>{item.categoryName}</Text>
          <Text style={styles.budgetAmount}>
            {formatGhanaCedis(item.currentSpent)} / {formatGhanaCedis(item.monthlyLimit)}
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getProgressColor(percentage),
              },
            ]}
          />
        </View>
        
        <View style={styles.budgetStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: getProgressColor(percentage) }]}>
              {percentage.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>Used</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue,
              { color: remaining >= 0 ? theme.colors.success : theme.colors.error }
            ]}>
              {formatGhanaCedis(Math.abs(remaining))}
            </Text>
            <Text style={styles.statLabel}>
              {remaining >= 0 ? 'Remaining' : 'Over Budget'}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="wallet-outline" size={64} color={theme.colors.text.disabled} />
      <Text style={styles.emptyText}>
        No budgets set up yet{'\n'}
        Create your first budget to start tracking expenses
      </Text>
    </View>
  );

  const totalBudget = calculateTotalBudget();
  const totalBudgetAnnual = calculateTotalBudgetAnnual();
  const totalSpent = calculateTotalSpent();
  const totalSpentAnnual = calculateTotalSpentAnnual();
  const totalRemaining = totalBudget - totalSpent;
  const totalRemainingAnnual = totalBudgetAnnual - totalSpentAnnual;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Overview</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await refreshData();
              setRefreshing(false);
            }}
          />
        }
      >
        {/* Monthly Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={{ ...theme.typography.h5, marginBottom: theme.spacing.md, textAlign: 'center' }}>
            Monthly Budget Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Budget:</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
              {formatGhanaCedis(totalBudget)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Spent:</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
              {formatGhanaCedis(totalSpent)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining:</Text>
            <Text style={[
              styles.summaryValue,
              { color: totalRemaining >= 0 ? theme.colors.success : theme.colors.error }
            ]}>
              {formatGhanaCedis(Math.abs(totalRemaining))}
            </Text>
          </View>
        </Card>

        {/* Annual Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={{ ...theme.typography.h5, marginBottom: theme.spacing.md, textAlign: 'center' }}>
            Annual Budget Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Budget:</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
              {formatGhanaCedis(totalBudgetAnnual)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Projected Spending:</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
              {formatGhanaCedis(totalSpentAnnual)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Projected Remaining:</Text>
            <Text style={[
              styles.summaryValue,
              { color: totalRemainingAnnual >= 0 ? theme.colors.success : theme.colors.error }
            ]}>
              {formatGhanaCedis(Math.abs(totalRemainingAnnual))}
            </Text>
          </View>
        </Card>

        {/* Budget Items */}
        {budgets.length > 0 ? (
          <FlatList
            data={budgets}
            renderItem={renderBudgetItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
};

export default BudgetsScreen;