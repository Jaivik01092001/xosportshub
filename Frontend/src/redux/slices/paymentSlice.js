import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from '../../services/paymentService';
import { formatError } from '../../utils/errorHandler';

// Initial state
const initialState = {
  payments: [],
  payment: null,
  buyerPayments: [],
  sellerPayments: [],
  paymentIntent: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

// Get all payments
export const getAllPayments = createAsyncThunk(
  'payment/getAllPayments',
  async (_, thunkAPI) => {
    try {
      return await paymentService.getAllPayments();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get single payment
export const getPayment = createAsyncThunk(
  'payment/getPayment',
  async (id, thunkAPI) => {
    try {
      return await paymentService.getPayment(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (paymentData, thunkAPI) => {
    try {
      return await paymentService.createPaymentIntent(paymentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Confirm payment
export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async (confirmData, thunkAPI) => {
    try {
      return await paymentService.confirmPayment(confirmData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get buyer payments
export const getBuyerPayments = createAsyncThunk(
  'payment/getBuyerPayments',
  async (_, thunkAPI) => {
    try {
      return await paymentService.getBuyerPayments();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get seller payments
export const getSellerPayments = createAsyncThunk(
  'payment/getSellerPayments',
  async (_, thunkAPI) => {
    try {
      return await paymentService.getSellerPayments();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Process payout
export const processPayout = createAsyncThunk(
  'payment/processPayout',
  async (id, thunkAPI) => {
    try {
      return await paymentService.processPayout(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Payment slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all payments
      .addCase(getAllPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payments = action.payload.data;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get single payment
      .addCase(getPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payment = action.payload.data;
      })
      .addCase(getPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Create payment intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.paymentIntent = action.payload.data;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.paymentIntent = null;
        
        // Add the new payment to the buyer payments list
        if (action.payload.data) {
          state.buyerPayments.push(action.payload.data);
        }
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get buyer payments
      .addCase(getBuyerPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBuyerPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.buyerPayments = action.payload.data;
      })
      .addCase(getBuyerPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get seller payments
      .addCase(getSellerPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sellerPayments = action.payload.data;
      })
      .addCase(getSellerPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Process payout
      .addCase(processPayout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(processPayout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update payment status in all relevant arrays
        const updatedPayment = action.payload.data;
        
        state.payments = state.payments.map((payment) =>
          payment._id === updatedPayment._id ? updatedPayment : payment
        );
        
        state.sellerPayments = state.sellerPayments.map((payment) =>
          payment._id === updatedPayment._id ? updatedPayment : payment
        );
        
        if (state.payment && state.payment._id === updatedPayment._id) {
          state.payment = updatedPayment;
        }
      })
      .addCase(processPayout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const { reset, clearPaymentIntent } = paymentSlice.actions;
export default paymentSlice.reducer;
