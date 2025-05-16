import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../services/wishlistService';
import { formatError } from '../../utils/errorHandler';

// Initial state
const initialState = {
  wishlist: [],
  isInWishlist: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

// Get wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, thunkAPI) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (wishlistData, thunkAPI) => {
    try {
      return await wishlistService.addToWishlist(wishlistData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (contentId, thunkAPI) => {
    try {
      return await wishlistService.removeFromWishlist(contentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Check wishlist item
export const checkWishlistItem = createAsyncThunk(
  'wishlist/checkWishlistItem',
  async (contentId, thunkAPI) => {
    try {
      return await wishlistService.checkWishlistItem(contentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
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
      // Get wishlist
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.wishlist = action.payload.data;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.wishlist.push(action.payload.data);
        state.isInWishlist = true;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.wishlist = state.wishlist.filter(
          (item) => item.contentId !== action.meta.arg
        );
        state.isInWishlist = false;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Check wishlist item
      .addCase(checkWishlistItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkWishlistItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isInWishlist = action.payload.data.isInWishlist;
      })
      .addCase(checkWishlistItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const { reset } = wishlistSlice.actions;
export default wishlistSlice.reducer;
