import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import dataService from '../services/dataService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Default categories structure
const DEFAULT_CATEGORIES = {
  income: [],
  expense: [],
};

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadTransactions(),
        loadBudgets(),
        loadCategories()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const result = await dataService.getTransactions();
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadBudgets = async () => {
    try {
      const result = await dataService.getBudgets();
      if (result.success) {
        setBudgets(result.data);
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await dataService.getCategories();
      if (result.success) {
        // Organize categories by type
        const incomeCategories = result.data.filter(cat => cat.type === 'income');
        const expenseCategories = result.data.filter(cat => cat.type === 'expense');
        setCategories({
          income: incomeCategories,
          expense: expenseCategories
        });
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const result = await dataService.createTransaction(transactionData);
      
      if (result.success) {
        // Refresh transactions after adding
        await loadTransactions();
        return { success: true, transaction: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const result = await dataService.updateTransaction(id, updates);
      
      if (result.success) {
        // Refresh transactions after updating
        await loadTransactions();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const result = await dataService.deleteTransaction(id);
      
      if (result.success) {
        // Refresh transactions after deleting
        await loadTransactions();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const approveTransaction = async (id) => {
    try {
      const result = await dataService.approveTransaction(id);
      
      if (result.success) {
        // Refresh transactions after approving
        await loadTransactions();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const rejectTransaction = async (id) => {
    try {
      const result = await dataService.rejectTransaction(id);
      
      if (result.success) {
        // Refresh transactions after rejecting
        await loadTransactions();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getTransactionsByDateRange = (startDate, endDate) => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const getMonthlyData = (month, year) => {
    const startDate = startOfMonth(new Date(year, month));
    const endDate = endOfMonth(new Date(year, month));
    
    const monthlyTransactions = getTransactionsByDateRange(startDate, endDate);
    
    const income = monthlyTransactions
      .filter(t => t.type === 'income' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
      transactions: monthlyTransactions,
    };
  };

  const getCategoryData = () => {
    const categoryTotals = {};
    
    transactions
      .filter(t => t.status === 'approved')
      .forEach(t => {
        if (!categoryTotals[t.category]) {
          categoryTotals[t.category] = { income: 0, expense: 0 };
        }
        categoryTotals[t.category][t.type] += t.amount;
      });
    
    return categoryTotals;
  };

  const addBudget = async (budgetData) => {
    try {
      const result = await dataService.createBudget(budgetData);
      
      if (result.success) {
        // Refresh budgets after adding
        await loadBudgets();
        return { success: true, budget: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateBudget = async (id, updates) => {
    try {
      const result = await dataService.updateBudget(id, updates);
      
      if (result.success) {
        // Refresh budgets after updating
        await loadBudgets();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteBudget = async (id) => {
    try {
      const result = await dataService.deleteBudget(id);
      
      if (result.success) {
        // Refresh budgets after deleting
        await loadBudgets();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    transactions,
    budgets,
    categories,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    approveTransaction,
    rejectTransaction,
    getTransactionsByDateRange,
    getMonthlyData,
    getCategoryData,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshData: loadData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};