import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VerificationState, IdentityVerification } from '@/types';
import apiService from '@/services/api';

const initialState: VerificationState = {
  verification: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const uploadDocument = createAsyncThunk(
  'verification/uploadDocument',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiService.uploadDocument(formData);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload document');
    }
  }
);

export const uploadSelfie = createAsyncThunk(
  'verification/uploadSelfie',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiService.uploadSelfie(formData);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload selfie');
    }
  }
);

export const fetchVerificationStatus = createAsyncThunk(
  'verification/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getVerificationStatus();
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch verification status');
    }
  }
);

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVerification: (state) => {
      state.verification = null;
    },
  },
  extraReducers: (builder) => {
    // Upload Document
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verification = action.payload;
        state.error = null;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Upload Selfie
    builder
      .addCase(uploadSelfie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadSelfie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verification = action.payload;
        state.error = null;
      })
      .addCase(uploadSelfie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Verification Status
    builder
      .addCase(fetchVerificationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVerificationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verification = action.payload;
        state.error = null;
      })
      .addCase(fetchVerificationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearVerification } = verificationSlice.actions;
export default verificationSlice.reducer;
