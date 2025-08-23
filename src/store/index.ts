import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import investmentSlice from './slices/investmentSlice';
import portfolioSlice from './slices/portfolioSlice';
import transactionSlice from './slices/transactionSlice';
import verificationSlice from './slices/verificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    investment: investmentSlice,
    portfolio: portfolioSlice,
    transaction: transactionSlice,
    verification: verificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
