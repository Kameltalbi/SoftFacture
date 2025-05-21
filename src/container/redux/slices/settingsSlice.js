import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company: {
    name: "Example Company",
    vatNumber: "EXP123456789",
    email: "contact@Exp.com",
    phone: "01 23 45 67 89",
    address: "123 Billing Street, Somewhere 75000",
  },
  taxes: [],
  currencies: [],
  invoiceNumbering: {
    prefix: "INV-",
    suffix: "",
    numberOfDigits: 4,
    nextNumber: 1,
    resetPeriod: "annual", // or "monthly"
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // Company
    setCompanyInfo: (state, action) => {
      const { name, vatNumber, email, phone, address } = action.payload;
      state.company = { name, vatNumber, email, phone, address };
    },

    // Taxes
    setTaxes(state, action) {
      state.taxes = action.payload;
    },
    addTax(state, action) {
      state.taxes.push(action.payload);
    },
    updateTax(state, action) {
      const index = state.taxes.findIndex(
        (tax) => tax.key === action.payload.key
      );
      if (index !== -1) {
        state.taxes[index] = action.payload;
      }
    },
    deleteTax(state, action) {
      state.taxes = state.taxes.filter((tax) => tax.key !== action.payload);
    },

    // Currencies
    setCurrencies(state, action) {
      state.currencies = action.payload;
    },
    addCurrency(state, action) {
      state.currencies.push(action.payload);
    },
    updateCurrency(state, action) {
      const index = state.currencies.findIndex(
        (currency) => currency.key === action.payload.key
      );
      if (index !== -1) {
        state.currencies[index] = action.payload;
      }
    },
    deleteCurrency(state, action) {
      state.currencies = state.currencies.filter(
        (currency) => currency.key !== action.payload
      );
    },

    // Invoice Numbering
    setInvoiceNumbering(state, action) {
      state.invoiceNumbering = action.payload;
    },

    // Loading/Error
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCompanyInfo,
  setTaxes,
  addTax,
  updateTax,
  deleteTax,
  setCurrencies,
  addCurrency,
  updateCurrency,
  deleteCurrency,
  setInvoiceNumbering,
  setLoading,
  setError,
} = settingsSlice.actions;

export const selectCompanyInfo = (state) => state.settings.company;
export const selectTaxes = (state) => state.settings.taxes;
export const selectCurrencies = (state) => state.settings.currencies;
export const selectInvoiceNumbering = (state) => state.settings.invoiceNumbering;
export const selectLoading = (state) => state.settings.isLoading;
export const selectError = (state) => state.settings.error;

export default settingsSlice.reducer;
