import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatGhanaCedis } from '../../utils/currency';

const { width: screenWidth } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { transactions, getMonthlyData, getCategoryData, isLoading } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    greeting: {
      ...theme.typography.h3,
      color: theme.colors.text.white,
    },
    userRole: {
      ...theme.typography.body2,
      color: theme.colors.text.white,
      opacity: 0.8,
    },
    logoutButton: {
      padding: theme.spacing.xs,
    },
    balanceCard: {
      backgroundColor: theme.colors.text.white,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    balanceAmount: {
      ...theme.typography.h1,
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    balanceLabel: {
      ...theme.typography.body2,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    summaryRow: {
      flexDirection: 'row',
      marginTop: theme.spacing.lg,
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    summaryAmount: {
      ...theme.typography.h4,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    incomeColor: {
      color: theme.colors.success,
    },
    expenseColor: {
      color: theme.colors.error,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text.primary,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.xs,
    },
    periodButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    periodButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    periodButtonText: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
    },
    periodButtonTextActive: {
      color: theme.colors.text.white,
    },
    chartContainer: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    chartTitle: {
      ...theme.typography.h6,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    quickActionButton: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    recentTransactions: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionCategory: {
      ...theme.typography.body1,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    transactionDate: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
    },
    transactionAmount: {
      ...theme.typography.h6,
      fontWeight: 'bold',
    },
  });

  const currentDate = new Date();
  const currentMonth = getMonthlyData(currentDate.getMonth(), currentDate.getFullYear());
  const previousMonth = getMonthlyData(
    subMonths(currentDate, 1).getMonth(),
    subMonths(currentDate, 1).getFullYear()
  );


  const getChartData = () => {
    const months = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const monthData = getMonthlyData(date.getMonth(), date.getFullYear());
      
      months.push(format(date, 'MMM'));
      incomeData.push(monthData.income / 1000); // Convert to thousands
      expenseData.push(monthData.expenses / 1000);
    }

    return {
      labels: months,
      datasets: [
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: expenseData,
          color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Income', 'Expenses'],
    };
  };

  const getCategoryChartData = () => {
    const categoryData = getCategoryData();
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    
    return Object.entries(categoryData)
      .filter(([_, data]) => data.expense > 0)
      .slice(0, 6)
      .map(([category, data], index) => ({
        name: category.length > 10 ? category.substring(0, 10) + '...' : category, // Truncate long names
        population: data.expense,
        color: colors[index % colors.length],
        legendFontColor: theme.colors.text.primary,
        legendFontSize: 12,
      }));
  };

  const getRecentTransactions = () => {
    return transactions
      .filter(t => t.status === 'approved')
      .slice(0, 5);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = async () => {
    await logout();
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.md,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]}</Text>
            <Text style={styles.userRole}>{user?.role?.replace('_', ' ').toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.text.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceAmount}>
            {formatGhanaCedis(currentMonth.balance)}
          </Text>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryAmount, styles.incomeColor]}>
                {formatGhanaCedis(currentMonth.income)}
              </Text>
              <Text style={styles.summaryLabel}>Total Income</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryAmount, styles.expenseColor]}>
                {formatGhanaCedis(currentMonth.expenses)}
              </Text>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="Add Income"
            variant="success"
            size="small"
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Transactions', { 
              screen: 'AddTransaction', 
              params: { type: 'income' } 
            })}
            icon={<Ionicons name="add" size={16} color={theme.colors.text.white} />}
          />
          <Button
            title="Add Expense"
            variant="danger"
            size="small"
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Transactions', { 
              screen: 'AddTransaction', 
              params: { type: 'expense' } 
            })}
            icon={<Ionicons name="remove" size={16} color={theme.colors.text.white} />}
          />
        </View>

        {/* Trend Chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>6-Month Trend</Text>
        </View>
        
        <Card style={styles.chartContainer}>
          <LineChart
            data={getChartData()}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: theme.borderRadius.md,
            }}
          />
        </Card>

        {/* Category Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expense Categories</Text>
        </View>
        
        <Card style={styles.chartContainer}>
          <PieChart
            data={getCategoryChartData()}
            width={screenWidth - 96}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="5"
            absolute
          />
        </Card>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Button
            title="View All"
            variant="ghost"
            size="small"
            onPress={() => navigation.navigate('Transactions')}
          />
        </View>
        
        <Card style={styles.recentTransactions}>
          {getRecentTransactions().map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={[
                styles.transactionIcon,
                { backgroundColor: transaction.type === 'income' ? theme.colors.success : theme.colors.error }
              ]}>
                <Ionicons
                  name={transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}
                  size={20}
                  color={theme.colors.text.white}
                />
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
                <Text style={styles.transactionDate}>
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'income' ? styles.incomeColor : styles.expenseColor
              ]}>
                {transaction.type === 'income' ? '+' : '-'}{formatGhanaCedis(transaction.amount)}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;