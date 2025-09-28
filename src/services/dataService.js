import apiService from './apiService';

class DataService {
  // Transactions methods
  async getTransactions(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = `/transactions${query ? `?${query}` : ''}`;
      const response = await apiService.get(endpoint);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Get transactions error:', error);
      return { success: false, error: error.message };
    }
  }

  async getTransaction(id) {
    try {
      const response = await apiService.get(`/transactions/${id}`);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch transaction');
      }
    } catch (error) {
      console.error('Get transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  async createTransaction(transactionData) {
    try {
      const response = await apiService.post('/transactions', transactionData);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Create transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateTransaction(id, transactionData) {
    try {
      const response = await apiService.put(`/transactions/${id}`, transactionData);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Update transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteTransaction(id) {
    try {
      const response = await apiService.delete(`/transactions/${id}`);
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Delete transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  async approveTransaction(id) {
    try {
      const response = await apiService.put(`/transactions/${id}/approve`);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to approve transaction');
      }
    } catch (error) {
      console.error('Approve transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  async rejectTransaction(id) {
    try {
      const response = await apiService.put(`/transactions/${id}/reject`);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to reject transaction');
      }
    } catch (error) {
      console.error('Reject transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  // Budgets methods
  async getBudgets(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = `/budgets${query ? `?${query}` : ''}`;
      const response = await apiService.get(endpoint);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch budgets');
      }
    } catch (error) {
      console.error('Get budgets error:', error);
      return { success: false, error: error.message };
    }
  }

  async getBudget(id) {
    try {
      const response = await apiService.get(`/budgets/${id}`);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch budget');
      }
    } catch (error) {
      console.error('Get budget error:', error);
      return { success: false, error: error.message };
    }
  }

  async createBudget(budgetData) {
    try {
      const response = await apiService.post('/budgets', budgetData);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create budget');
      }
    } catch (error) {
      console.error('Create budget error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateBudget(id, budgetData) {
    try {
      const response = await apiService.put(`/budgets/${id}`, budgetData);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update budget');
      }
    } catch (error) {
      console.error('Update budget error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteBudget(id) {
    try {
      const response = await apiService.delete(`/budgets/${id}`);
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete budget');
      }
    } catch (error) {
      console.error('Delete budget error:', error);
      return { success: false, error: error.message };
    }
  }

  // Categories methods
  async getCategories() {
    try {
      const response = await apiService.get('/categories');
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Get categories error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCategoryWithTransactions() {
    try {
      const response = await apiService.get('/categories/with-transactions');
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch categories with transactions');
      }
    } catch (error) {
      console.error('Get categories with transactions error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService;