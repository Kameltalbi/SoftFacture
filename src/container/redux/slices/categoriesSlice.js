import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: {
      reducer: (state, action) => {
        state.categories.push(action.payload);
      },
      prepare: (category) => ({
        payload: {
          id: nanoid(),
          ...category,
        },
      }),
    },
    updateCategory: (state, action) => {
      const { id, ...data } = action.payload;
      const index = state.categories.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...data };
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((cat) => cat.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
