import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InvestmentState, Investment, UserInvestment } from '../../types';
import apiService from '../../services/api';

const initialState: InvestmentState = {
  investments: [],
  userInvestments: [],
  selectedInvestment: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchInvestments = createAsyncThunk(
  'investment/fetchInvestments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getInvestments();
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch investments');
    }
  }
);

export const fetchInvestment = createAsyncThunk(
  'investment/fetchInvestment',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getInvestment(id);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch investment');
    }
  }
);

export const registerForInvestment = createAsyncThunk(
  'investment/register',
  async ({ id, amount }: { id: string; amount: number }, { rejectWithValue }) => {
    try {
      const response = await apiService.registerInvestment(id, amount);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to register for investment');
    }
  }
);

const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedInvestment: (state, action: PayloadAction<Investment | null>) => {
      state.selectedInvestment = action.payload;
    },
    clearSelectedInvestment: (state) => {
      state.selectedInvestment = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Investments
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments = action.payload;
        state.error = null;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Investment
    builder
      .addCase(fetchInvestment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedInvestment = action.payload;
        state.error = null;
      })
      .addCase(fetchInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register for Investment
    builder
      .addCase(registerForInvestment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerForInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInvestments.push(action.payload);
        state.error = null;
      })
      .addCase(registerForInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedInvestment, clearSelectedInvestment } = investmentSlice.actions;
export default investmentSlice.reducer;
