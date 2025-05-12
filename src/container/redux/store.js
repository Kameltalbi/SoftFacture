import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import supplierReducer from "./slices/supplierSlice";
import clientsReducer from "./slices/clientsSlice";
import settingsReducer from "./slices/settingsSlice";
import invoicesReducer from "./slices/invoicesSlice";
import categoriesReducer from "./slices/categoriesSlice";
import productsReducer from "./slices/productsSlice";
import quotesReducer from "./slices/quotesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    settings: settingsReducer,
    invoices: invoicesReducer,
    supplier: supplierReducer,
    categories: categoriesReducer,
    products: productsReducer,
    quotes: quotesReducer,
  },
});
