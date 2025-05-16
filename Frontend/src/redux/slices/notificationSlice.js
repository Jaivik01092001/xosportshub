import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';
import { formatError } from '../../utils/errorHandler';

// Initial state
const initialState = {
  notifications: [],
  userNotifications: [],
  unreadCount: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

// Get all notifications
export const getAllNotifications = createAsyncThunk(
  'notification/getAllNotifications',
  async (_, thunkAPI) => {
    try {
      return await notificationService.getAllNotifications();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get user notifications
export const getUserNotifications = createAsyncThunk(
  'notification/getUserNotifications',
  async (_, thunkAPI) => {
    try {
      return await notificationService.getUserNotifications();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Create notification
export const createNotification = createAsyncThunk(
  'notification/createNotification',
  async (notificationData, thunkAPI) => {
    try {
      return await notificationService.createNotification(notificationData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Mark notification as read
export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id, thunkAPI) => {
    try {
      return await notificationService.markAsRead(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, thunkAPI) => {
    try {
      return await notificationService.markAllAsRead();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (id, thunkAPI) => {
    try {
      return await notificationService.deleteNotification(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get unread notification count
export const getUnreadCount = createAsyncThunk(
  'notification/getUnreadCount',
  async (_, thunkAPI) => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Notification slice
const notificationSlice = createSlice({
  name: 'notification',
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
      // Get all notifications
      .addCase(getAllNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload.data;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get user notifications
      .addCase(getUserNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userNotifications = action.payload.data;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Create notification
      .addCase(createNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications.push(action.payload.data);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Mark notification as read
      .addCase(markAsRead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const updatedNotification = action.payload.data;
        
        // Update in all notification arrays
        state.notifications = state.notifications.map((notification) =>
          notification._id === updatedNotification._id ? updatedNotification : notification
        );
        
        state.userNotifications = state.userNotifications.map((notification) =>
          notification._id === updatedNotification._id ? updatedNotification : notification
        );
        
        // Update unread count
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Mark all notifications as read
      .addCase(markAllAsRead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Mark all notifications as read in the arrays
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));
        
        state.userNotifications = state.userNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));
        
        // Reset unread count
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Remove from all notification arrays
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.meta.arg
        );
        
        state.userNotifications = state.userNotifications.filter(
          (notification) => notification._id !== action.meta.arg
        );
        
        // Update unread count if the deleted notification was unread
        const deletedNotification = state.userNotifications.find(
          (notification) => notification._id === action.meta.arg
        );
        
        if (deletedNotification && !deletedNotification.isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get unread notification count
      .addCase(getUnreadCount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.unreadCount = action.payload.data.count;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const { reset } = notificationSlice.actions;
export default notificationSlice.reducer;
