import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  quotes: [],
  loading: false,
  error: null,
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    addQuote: {
      reducer: (state, action) => {
        state.quotes.push(action.payload);
      },
      prepare: (quote) => ({
        payload: {
          id: nanoid(),
          ...quote,
        },
      }),
    },
    updateQuote: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.quotes.findIndex((quote) => quote.id === id);
      if (index !== -1) {
        state.quotes[index] = { ...state.quotes[index], ...updatedData };
      }
    },
    deleteQuote: (state, action) => {
      state.quotes = state.quotes.filter((quote) => quote.id !== action.payload);
    },
    setQuotesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setQuotesError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addQuote,
  updateQuote,
  deleteQuote,
  setQuotesLoading,
  setQuotesError,
} = quotesSlice.actions;

export default quotesSlice.reducer;
