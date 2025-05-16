import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';
import { formatError } from '../../utils/errorHandler';

// Initial state
const initialState = {
  users: [],
  user: null,
  sellerProfile: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

// Get all users
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, thunkAPI) => {
    try {
      return await userService.getAllUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get single user
export const getUser = createAsyncThunk(
  'user/getUser',
  async (id, thunkAPI) => {
    try {
      return await userService.getUser(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, thunkAPI) => {
    try {
      return await userService.createUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }, thunkAPI) => {
    try {
      return await userService.updateUser(id, userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, thunkAPI) => {
    try {
      return await userService.deleteUser(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      return await userService.updateProfile(profileData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get seller profile
export const getSellerProfile = createAsyncThunk(
  'user/getSellerProfile',
  async (id, thunkAPI) => {
    try {
      return await userService.getSellerProfile(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Verify seller
export const verifySeller = createAsyncThunk(
  'user/verifySeller',
  async (id, thunkAPI) => {
    try {
      return await userService.verifySeller(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get single user
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.push(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.map((user) =>
          user._id === action.payload.data._id ? action.payload.data : user
        );
        if (state.user && state.user._id === action.payload.data._id) {
          state.user = action.payload.data;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter((user) => user._id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get seller profile
      .addCase(getSellerProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sellerProfile = action.payload.data;
      })
      .addCase(getSellerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Verify seller
      .addCase(verifySeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifySeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.map((user) =>
          user._id === action.payload.data._id ? action.payload.data : user
        );
        if (state.user && state.user._id === action.payload.data._id) {
          state.user = action.payload.data;
        }
      })
      .addCase(verifySeller.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
