import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TransactionState, Transaction } from '../../types';
import apiService from '../../services/api';

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getTransactions();
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchTransaction = createAsyncThunk(
  'transaction/fetchTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getTransaction(id);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transaction');
    }
  }
);

export const processPayment = createAsyncThunk(
  'transaction/processPayment',
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.processPayment(paymentData);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to process payment');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Transaction
    builder
      .addCase(fetchTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update or add the transaction
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index >= 0) {
          state.transactions[index] = action.payload;
        } else {
          state.transactions.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Process Payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload);
        state.error = null;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
