import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: {
      reducer: (state, action) => {
        state.products.push(action.payload);
      },
      prepare: (product) => ({
        payload: {
          id: nanoid(),
          ...product,
        },
      }),
    },
    updateProduct: (state, action) => {
      const { id, ...data } = action.payload;
      const index = state.products.findIndex((prod) => prod.id === id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...data };
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (prod) => prod.id !== action.payload
      );
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
