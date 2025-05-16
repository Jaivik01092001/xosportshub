import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bidService from '../../services/bidService';
import { formatError } from '../../utils/errorHandler';

// Initial state
const initialState = {
  bids: [],
  bid: null,
  contentBids: [],
  userBids: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

// Get all bids
export const getAllBids = createAsyncThunk(
  'bid/getAllBids',
  async (_, thunkAPI) => {
    try {
      return await bidService.getAllBids();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get single bid
export const getBid = createAsyncThunk(
  'bid/getBid',
  async (id, thunkAPI) => {
    try {
      return await bidService.getBid(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Create bid
export const createBid = createAsyncThunk(
  'bid/createBid',
  async (bidData, thunkAPI) => {
    try {
      return await bidService.createBid(bidData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Cancel bid
export const cancelBid = createAsyncThunk(
  'bid/cancelBid',
  async (id, thunkAPI) => {
    try {
      return await bidService.cancelBid(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get content bids
export const getContentBids = createAsyncThunk(
  'bid/getContentBids',
  async (contentId, thunkAPI) => {
    try {
      return await bidService.getContentBids(contentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get user bids
export const getUserBids = createAsyncThunk(
  'bid/getUserBids',
  async (_, thunkAPI) => {
    try {
      return await bidService.getUserBids();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// End auction
export const endAuction = createAsyncThunk(
  'bid/endAuction',
  async (contentId, thunkAPI) => {
    try {
      return await bidService.endAuction(contentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Bid slice
const bidSlice = createSlice({
  name: 'bid',
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
      // Get all bids
      .addCase(getAllBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bids = action.payload.data;
      })
      .addCase(getAllBids.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get single bid
      .addCase(getBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bid = action.payload.data;
      })
      .addCase(getBid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Create bid
      .addCase(createBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bids.push(action.payload.data);
        state.userBids.push(action.payload.data);
        
        // Update content bids if the content ID matches
        if (state.contentBids.length > 0 && 
            state.contentBids[0].contentId === action.payload.data.contentId) {
          state.contentBids.push(action.payload.data);
        }
      })
      .addCase(createBid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Cancel bid
      .addCase(cancelBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update bid status in all relevant arrays
        const updatedBid = action.payload.data;
        
        state.bids = state.bids.map((bid) =>
          bid._id === updatedBid._id ? updatedBid : bid
        );
        
        state.userBids = state.userBids.map((bid) =>
          bid._id === updatedBid._id ? updatedBid : bid
        );
        
        state.contentBids = state.contentBids.map((bid) =>
          bid._id === updatedBid._id ? updatedBid : bid
        );
        
        if (state.bid && state.bid._id === updatedBid._id) {
          state.bid = updatedBid;
        }
      })
      .addCase(cancelBid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get content bids
      .addCase(getContentBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContentBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contentBids = action.payload.data;
      })
      .addCase(getContentBids.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get user bids
      .addCase(getUserBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userBids = action.payload.data;
      })
      .addCase(getUserBids.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // End auction
      .addCase(endAuction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(endAuction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // The response might include updated bids or content
        // We'll handle this in the content slice if needed
      })
      .addCase(endAuction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const { reset } = bidSlice.actions;
export default bidSlice.reducer;
