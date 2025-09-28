import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AddTransactionScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { addTransaction, categories } = useData();
  const { type: initialType } = route.params || {};

  const [formData, setFormData] = useState({
    type: initialType || 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    receiptUrl: null,
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
    typeSelector: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    typeButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    typeButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    typeButtonText: {
      ...theme.typography.h6,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    typeButtonTextActive: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
    },
    categoryButton: {
      width: '30%',
      aspectRatio: 1,
      margin: '1.5%',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    categoryButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    categoryIcon: {
      marginBottom: theme.spacing.xs,
    },
    categoryText: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    categoryTextActive: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    receiptSection: {
      marginTop: theme.spacing.lg,
    },
    receiptButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
    },
    receiptButtonText: {
      ...theme.typography.body1,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.sm,
    },
    receiptPreview: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.success + '10',
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    receiptPreviewText: {
      ...theme.typography.body2,
      color: theme.colors.success,
      flex: 1,
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

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      const result = await addTransaction(transactionData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Transaction added successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to attach receipts.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, receiptUrl: result.assets[0].uri }));
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const currentCategories = categories[formData.type] || [];

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
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Transaction Type Selector */}
        <Card>
          <Text style={{ ...theme.typography.h6, marginBottom: theme.spacing.md }}>
            Transaction Type
          </Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'income' && styles.typeButtonActive
              ]}
              onPress={() => updateFormData('type', 'income')}
            >
              <Ionicons
                name="arrow-up-circle"
                size={32}
                color={formData.type === 'income' ? theme.colors.success : theme.colors.text.secondary}
              />
              <Text style={[
                styles.typeButtonText,
                formData.type === 'income' && styles.typeButtonTextActive
              ]}>
                Income
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'expense' && styles.typeButtonActive
              ]}
              onPress={() => updateFormData('type', 'expense')}
            >
              <Ionicons
                name="arrow-down-circle"
                size={32}
                color={formData.type === 'expense' ? theme.colors.error : theme.colors.text.secondary}
              />
              <Text style={[
                styles.typeButtonText,
                formData.type === 'expense' && styles.typeButtonTextActive
              ]}>
                Expense
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

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

        {/* Category Selection */}
        <Card>
          <Text style={{ ...theme.typography.h6, marginBottom: theme.spacing.md }}>
            Category {errors.category && <Text style={{ color: theme.colors.error }}>*</Text>}
          </Text>
          <View style={styles.categoryGrid}>
            {currentCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  formData.category === category.name && styles.categoryButtonActive
                ]}
                onPress={() => updateFormData('category', category.name)}
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={formData.category === category.name ? theme.colors.primary : category.color}
                  style={styles.categoryIcon}
                />
                <Text style={[
                  styles.categoryText,
                  formData.category === category.name && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && (
            <Text style={{ color: theme.colors.error, marginTop: theme.spacing.sm }}>
              {errors.category}
            </Text>
          )}
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
            error={errors.date}
            leftIcon={
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
            }
          />
        </Card>

        {/* Receipt Attachment */}
        <Card style={styles.receiptSection}>
          <Text style={{ ...theme.typography.h6, marginBottom: theme.spacing.md }}>
            Receipt (Optional)
          </Text>
          
          <TouchableOpacity style={styles.receiptButton} onPress={handleImagePicker}>
            <Ionicons name="camera-outline" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.receiptButtonText}>
              {formData.receiptUrl ? 'Change Receipt' : 'Add Receipt'}
            </Text>
          </TouchableOpacity>

          {formData.receiptUrl && (
            <View style={styles.receiptPreview}>
              <Text style={styles.receiptPreviewText}>Receipt attached</Text>
              <TouchableOpacity onPress={() => updateFormData('receiptUrl', null)}>
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Submit Button */}
        <Button
          title={`Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
          onPress={handleSubmit}
          loading={loading}
          size="large"
          style={styles.submitButton}
          icon={
            <Ionicons 
              name={formData.type === 'income' ? 'add-circle' : 'remove-circle'} 
              size={20} 
              color={theme.colors.text.white} 
            />
          }
        />
      </ScrollView>
    </View>
  );
};

export default AddTransactionScreen;