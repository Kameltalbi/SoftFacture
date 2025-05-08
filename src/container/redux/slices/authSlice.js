import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      console.info("Logging in with:", { email, password });
      setTimeout(() => {
        if (email === "yassinhakiri@gmail.com" && password === "Cbcd328!") {
          resolve({ user: "admin", token: "fake_token_123" });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 2000);
    });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.info("Login successful:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
