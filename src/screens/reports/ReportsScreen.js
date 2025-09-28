import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatGhanaCedis } from '../../utils/currency';

const { width: screenWidth } = Dimensions.get('window');

const ReportsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { transactions, getMonthlyData, getCategoryData } = useData();
  const [selectedReport, setSelectedReport] = useState('overview');

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
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      ...theme.typography.body2,
      color: theme.colors.text.secondary,
    },
    activeTabText: {
      color: theme.colors.text.white,
      fontWeight: '600',
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    chartContainer: {
      marginBottom: theme.spacing.lg,
    },
    chartTitle: {
      ...theme.typography.h6,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.lg,
    },
    summaryItem: {
      width: '48%',
      marginRight: '2%',
      marginBottom: theme.spacing.md,
    },
    summaryValue: {
      ...theme.typography.h4,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      ...theme.typography.body2,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    categoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    categoryName: {
      ...theme.typography.body1,
      color: theme.colors.text.primary,
      flex: 1,
    },
    categoryAmount: {
      ...theme.typography.body1,
      fontWeight: 'bold',
    },
  });


  const getChartData = () => {
    const months = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthData = getMonthlyData(date.getMonth(), date.getFullYear());
      
      months.push(format(date, 'MMM'));
      incomeData.push(monthData.income / 1000);
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
        name: category,
        population: data.expense,
        color: colors[index % colors.length],
        legendFontColor: theme.colors.text.primary,
        legendFontSize: 12,
      }));
  };

  const getCurrentMonthData = () => {
    const currentDate = new Date();
    return getMonthlyData(currentDate.getMonth(), currentDate.getFullYear());
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
  };

  const currentMonthData = getCurrentMonthData();
  const categoryData = getCategoryData();

  const renderOverview = () => (
    <>
      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
            {formatGhanaCedis(currentMonthData.income)}
          </Text>
          <Text style={styles.summaryLabel}>This Month Income</Text>
        </Card>
        
        <Card style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
            {formatGhanaCedis(currentMonthData.expenses)}
          </Text>
          <Text style={styles.summaryLabel}>This Month Expenses</Text>
        </Card>
        
        <Card style={styles.summaryItem}>
          <Text style={[
            styles.summaryValue,
            { color: currentMonthData.balance >= 0 ? theme.colors.success : theme.colors.error }
          ]}>
            {formatGhanaCedis(currentMonthData.balance)}
          </Text>
          <Text style={styles.summaryLabel}>Net Balance</Text>
        </Card>
        
        <Card style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            {transactions.length}
          </Text>
          <Text style={styles.summaryLabel}>Total Transactions</Text>
        </Card>
      </View>

      {/* Trend Chart */}
      <Card style={styles.chartContainer}>
        <Text style={styles.chartTitle}>6-Month Trend</Text>
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
    </>
  );

  const renderCategoryBreakdown = () => (
    <>
      {/* Pie Chart */}
      <Card style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Expense Categories</Text>
        <PieChart
          data={getCategoryChartData()}
          width={screenWidth - 64}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </Card>

      {/* Category List */}
      <Card>
        <Text style={styles.chartTitle}>Category Breakdown</Text>
        {Object.entries(categoryData).map(([category, data]) => (
          <View key={category} style={styles.categoryItem}>
            <Text style={styles.categoryName}>{category}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.categoryAmount, { color: theme.colors.success }]}>
                +{formatGhanaCedis(data.income)}
              </Text>
              <Text style={[styles.categoryAmount, { color: theme.colors.error }]}>
                -{formatGhanaCedis(data.expense)}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </>
  );

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'categories', label: 'Categories' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Reports</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedReport === tab.key && styles.activeTab]}
            onPress={() => setSelectedReport(tab.key)}
          >
            <Text style={[
              styles.tabText,
              selectedReport === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollContainer}>
        {selectedReport === 'overview' ? renderOverview() : renderCategoryBreakdown()}
      </ScrollView>
    </View>
  );
};

export default ReportsScreen;