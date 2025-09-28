import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const EditTransactionScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { updateTransaction, categories } = useData();
  const { transaction } = route.params;

  const [formData, setFormData] = useState({
    type: transaction.type,
    amount: transaction.amount.toString(),
    category: transaction.category,
    description: transaction.description,
    date: transaction.date.split('T')[0],
    receiptUrl: transaction.receiptUrl,
  });
  const [errors, setErrors] = useState({});
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
    submitButton: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      const result = await updateTransaction(transaction.id, updatedData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Transaction updated successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
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
        <Text style={styles.headerTitle}>Edit Transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <Card>
          <Input
            label="Amount"
            value={formData.amount}
            onChangeText={(value) => updateFormData('amount', value)}
            placeholder="0.00"
            keyboardType="numeric"
            error={errors.amount}
            leftIcon={
              <Text style={{ ...theme.typography.h6, color: theme.colors.text.secondary }}>GH₵</Text>
            }
          />
        </Card>

        {/* Description */}
        <Card>
          <Input
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            placeholder="Enter transaction description"
            multiline
            numberOfLines={3}
            error={errors.description}
          />
        </Card>

        {/* Date */}
        <Card>
          <Input
            label="Date"
            value={formData.date}
            onChangeText={(value) => updateFormData('date', value)}
            placeholder="YYYY-MM-DD"
            leftIcon={
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
            }
          />
        </Card>

        {/* Submit Button */}
        <Button
          title="Update Transaction"
          onPress={handleSubmit}
          loading={loading}
          size="large"
          style={styles.submitButton}
          icon={
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.text.white} />
          }
        />
      </ScrollView>
    </View>
  );
};

export default EditTransactionScreen;