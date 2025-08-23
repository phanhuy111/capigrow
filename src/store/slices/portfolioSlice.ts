import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PortfolioState, Portfolio } from '../../types';
import apiService from '../../services/api';

const initialState: PortfolioState = {
  portfolio: null,
  performance: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPortfolio();
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch portfolio');
    }
  }
);

export const fetchPortfolioPerformance = createAsyncThunk(
  'portfolio/fetchPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPortfolioPerformance();
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch portfolio performance');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPortfolio: (state) => {
      state.portfolio = null;
      state.performance = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Portfolio
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolio = action.payload;
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Portfolio Performance
    builder
      .addCase(fetchPortfolioPerformance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioPerformance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.performance = action.payload;
        state.error = null;
      })
      .addCase(fetchPortfolioPerformance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
