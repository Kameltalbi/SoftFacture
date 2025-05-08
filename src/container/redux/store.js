import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientsReducer from './slices/clientsSlice';
import settingsReducer from './slices/settingsSlice';
import invoicesReducer from './slices/invoicesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    settings: settingsReducer,
    invoices: invoicesReducer
  },
});
