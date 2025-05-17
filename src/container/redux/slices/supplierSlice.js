import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  supplier: [
    {
      id: "8Dyp_4fboOainKPMeSe",
      fullName: "Supplier Test",
      email: "supplier@test.com",
      phone: "123456789",
      address: "The address",
    },
  ],
  loading: false,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    addSupplier: (state, action) => {
      const newSupplier = { id: nanoid(), ...action.payload };
      state.supplier.push(newSupplier);
    },
    updateSupplier: (state, action) => {
      const index = state.supplier.findIndex(
        (supplier) => supplier.id === action.payload.id
      );
      if (index !== -1) {
        state.supplier[index] = action.payload;
      }
    },
    deleteSupplier: (state, action) => {
      state.supplier = state.supplier.filter(
        (supplier) => supplier.id !== action.payload
      );
    },
  },
});

export const { addSupplier, updateSupplier, deleteSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;
