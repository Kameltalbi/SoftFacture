import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../../services/api";
import api from "../../../services/api";

// Helper function to get stored user data
const getStoredUserData = () => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading user data from localStorage:', error);
    return null;
  }
};

const initialState = {
  user: getStoredUserData(),
  token: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Raw login API response:', response);
      
      // Log the exact response structure
      console.log('Full response structure:', JSON.stringify(response.data, null, 2));
      
      if (response.data) {
        // Check if the response has a data property (common API pattern)
        const responseData = response.data.data || response.data;
        console.log('Processed response data:', responseData);

        // Extract user and token data based on actual response structure
        const userData = responseData.user || responseData;
        const accessToken = responseData.access_token || responseData.token;
        const refreshToken = responseData.refresh_token || responseData.refreshToken;

        if (!accessToken) {
          console.error('No access token found in response');
          return rejectWithValue("No access token received");
        }

        // Store tokens and user data in localStorage
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("user_data", JSON.stringify(userData));
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
        
        // Set default authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        
        console.log('Login successful, processed data:', {
          user: userData,
          token: accessToken,
          refreshToken: refreshToken
        });

        return {
          user: userData,
          token: accessToken,
          refreshToken: refreshToken
        };
      } else {
        console.error('Login response missing data:', response);
        return rejectWithValue("Invalid response from server");
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(
        error.response?.data?.message || "Failed to login"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      // Clear all auth data from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      // Clear authorization header
      delete api.defaults.headers.common["Authorization"];
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getUser();
      // Store updated user data in localStorage
      localStorage.setItem('user_data', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authAPI.refreshToken(refreshToken);
      const { token, refresh_token } = response.data;
      
      // Update tokens in localStorage
      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', refresh_token);
      
      return { token, refreshToken: refresh_token };
    } catch (error) {
      // Clear all auth data on refresh failure
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add a reducer to update user data
    updateUserData: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user_data', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        console.log('Login pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Login fulfilled:', action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('Login rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateUserData } = authSlice.actions;
export default authSlice.reducer;
