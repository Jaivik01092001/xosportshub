import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';
import { formatError } from '../../utils/errorHandler';

// Initial state
const initialState = {
  orders: [],
  order: null,
  buyerOrders: [],
  sellerOrders: [],
  downloadUrl: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

// Get all orders
export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getAllOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get single order
export const getOrder = createAsyncThunk(
  'order/getOrder',
  async (id, thunkAPI) => {
    try {
      return await orderService.getOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Create order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, thunkAPI) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, statusData }, thunkAPI) => {
    try {
      return await orderService.updateOrderStatus(id, statusData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get buyer orders
export const getBuyerOrders = createAsyncThunk(
  'order/getBuyerOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getBuyerOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get seller orders
export const getSellerOrders = createAsyncThunk(
  'order/getSellerOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getSellerOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Download content
export const downloadContent = createAsyncThunk(
  'order/downloadContent',
  async (id, thunkAPI) => {
    try {
      return await orderService.downloadContent(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
    clearDownloadUrl: (state) => {
      state.downloadUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload.data;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get single order
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload.data;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders.push(action.payload.data);
        state.buyerOrders.push(action.payload.data);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = state.orders.map((order) =>
          order._id === action.payload.data._id ? action.payload.data : order
        );
        state.buyerOrders = state.buyerOrders.map((order) =>
          order._id === action.payload.data._id ? action.payload.data : order
        );
        state.sellerOrders = state.sellerOrders.map((order) =>
          order._id === action.payload.data._id ? action.payload.data : order
        );
        if (state.order && state.order._id === action.payload.data._id) {
          state.order = action.payload.data;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get buyer orders
      .addCase(getBuyerOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBuyerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.buyerOrders = action.payload.data;
      })
      .addCase(getBuyerOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get seller orders
      .addCase(getSellerOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sellerOrders = action.payload.data;
      })
      .addCase(getSellerOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Download content
      .addCase(downloadContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(downloadContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.downloadUrl = action.payload;
      })
      .addCase(downloadContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const { reset, clearDownloadUrl } = orderSlice.actions;
export default orderSlice.reducer;
