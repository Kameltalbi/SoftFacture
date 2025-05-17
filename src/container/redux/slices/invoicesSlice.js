import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [
    {
      id: 1,
      number: "INV-001",
      client: "Acme Corp",
      issueDate: "2025-04-01",
      dueDate: "2025-04-15",
      amount: 1200.0,
      status: "Paid",
    },
    {
      id: 2,
      number: "INV-002",
      client: "Beta Ldd",
      issueDate: "2025-04-05",
      dueDate: "2025-04-20",
      amount: 850.5,
      status: "Unpaid",
    },
    {
      id: 3,
      number: "INV-003",
      client: "Gamma LLC",
      issueDate: "2025-03-28",
      dueDate: "2025-04-10",
      amount: 430.75,
      status: "Overdue",
    },
  ],
  loading: false,
  error: null,
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.id !== action.payload
      );
    },
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  deleteInvoice,
  addInvoice,
  updateInvoice,
  setLoading,
  setError,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
