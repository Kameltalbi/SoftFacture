import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  products: [
    {
      id: "8Dyp_4fboOainKPMeSa2n",
      name: "Product Test",
      description: "Product description",
      unitPrice: 100,
      vat: 0.1,
      categoryId: "1",
    },
    {
      id: "8Dyp_4fboOainKPMeSa2m",
      name: "Product Test 2",
      description: "Product description 2",
      unitPrice: 200,
      vat: 0.2,
      categoryId: "2",
    },
  ],
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
