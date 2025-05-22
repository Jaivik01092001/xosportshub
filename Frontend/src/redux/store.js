import { configureStore } from '@reduxjs/toolkit';
// Remove the thunk import as it's already included in Redux Toolkit's default middleware

// Import reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import contentReducer from './slices/contentSlice';
import orderReducer from './slices/orderSlice';
import bidReducer from './slices/bidSlice';
import paymentReducer from './slices/paymentSlice';
import notificationReducer from './slices/notificationSlice';
import wishlistReducer from './slices/wishlistSlice';
import buyerDashboardReducer from './slices/buyerDashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    content: contentReducer,
    order: orderReducer,
    bid: bidReducer,
    payment: paymentReducer,
    notification: notificationReducer,
    wishlist: wishlistReducer,
    buyerDashboard: buyerDashboardReducer,
  },
  // Use default middleware which already includes thunk
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
