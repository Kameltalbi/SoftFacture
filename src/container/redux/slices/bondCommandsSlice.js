import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { bondCommandAPI } from "../../../services/api";

const initialState = {
  commands: [],
  loading: false,
  error: null,
  currentCommand: null,
  commandNumber: null,
};

// Async thunks
export const fetchBondCommands = createAsyncThunk(
  "bondCommands/fetchBondCommands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bondCommandAPI.getAll();
      console.log('Bond Commands API Response:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bond commands:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch bond commands");
    }
  }
);

export const createBondCommand = createAsyncThunk(
  "bondCommands/createBondCommand",
  async (commandData, { rejectWithValue }) => {
    try {
      const response = await bondCommandAPI.create(commandData);
      message.success("Bond command created successfully");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create bond command");
    }
  }
);

export const updateBondCommand = createAsyncThunk(
  "bondCommands/updateBondCommand",
  async ({ id, commandData }, { rejectWithValue }) => {
    try {
      const response = await bondCommandAPI.update(id, commandData);
      message.success("Bond command updated successfully");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update bond command");
    }
  }
);

export const deleteBondCommand = createAsyncThunk(
  "bondCommands/deleteBondCommand",
  async (id, { rejectWithValue }) => {
    try {
      await bondCommandAPI.delete(id);
      message.success("Bond command deleted successfully");
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete bond command");
    }
  }
);

export const cancelBondCommand = createAsyncThunk(
  "bondCommands/cancelBondCommand",
  async (id, { rejectWithValue }) => {
    try {
      const response = await bondCommandAPI.cancel(id);
      message.success("Bond command cancelled successfully");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to cancel bond command");
    }
  }
);

export const generateCommandNumber = createAsyncThunk(
  "bondCommands/generateCommandNumber",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bondCommandAPI.generateNumber();
      return response.data.data.command_number;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to generate command number");
    }
  }
);

const bondCommandsSlice = createSlice({
  name: "bondCommands",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCommand: (state, action) => {
      state.currentCommand = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bond Commands
      .addCase(fetchBondCommands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBondCommands.fulfilled, (state, action) => {
        console.log('Setting bond commands in Redux store:', action.payload);
        state.loading = false;
        state.commands = action.payload;
        state.error = null;
      })
      .addCase(fetchBondCommands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Bond Command
      .addCase(createBondCommand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBondCommand.fulfilled, (state, action) => {
        state.loading = false;
        state.commands.push(action.payload);
        state.error = null;
      })
      .addCase(createBondCommand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Bond Command
      .addCase(updateBondCommand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBondCommand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.commands.findIndex(cmd => cmd.id === action.payload.id);
        if (index !== -1) {
          state.commands[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBondCommand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Bond Command
      .addCase(deleteBondCommand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBondCommand.fulfilled, (state, action) => {
        state.loading = false;
        state.commands = state.commands.filter(cmd => cmd.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBondCommand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Bond Command
      .addCase(cancelBondCommand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBondCommand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.commands.findIndex(cmd => cmd.id === action.payload.id);
        if (index !== -1) {
          state.commands[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(cancelBondCommand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate Command Number
      .addCase(generateCommandNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCommandNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.commandNumber = action.payload;
        state.error = null;
      })
      .addCase(generateCommandNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentCommand } = bondCommandsSlice.actions;
export default bondCommandsSlice.reducer; 