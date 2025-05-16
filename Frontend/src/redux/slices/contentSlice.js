import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from '../../services/contentService';
import { formatError } from '../../utils/errorHandler';

// Initial state
const initialState = {
  content: [],
  singleContent: null,
  sellerContent: [],
  categories: [],
  trendingContent: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  uploadProgress: 0,
};

// Get all content
export const getAllContent = createAsyncThunk(
  'content/getAllContent',
  async (params, thunkAPI) => {
    try {
      return await contentService.getAllContent(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get content categories
export const getContentCategories = createAsyncThunk(
  'content/getContentCategories',
  async (_, thunkAPI) => {
    try {
      return await contentService.getContentCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get trending content
export const getTrendingContent = createAsyncThunk(
  'content/getTrendingContent',
  async (_, thunkAPI) => {
    try {
      return await contentService.getTrendingContent();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get single content
export const getContent = createAsyncThunk(
  'content/getContent',
  async (id, thunkAPI) => {
    try {
      return await contentService.getContent(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Create content
export const createContent = createAsyncThunk(
  'content/createContent',
  async (contentData, thunkAPI) => {
    try {
      return await contentService.createContent(contentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Update content
export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, contentData }, thunkAPI) => {
    try {
      return await contentService.updateContent(id, contentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Delete content
export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id, thunkAPI) => {
    try {
      return await contentService.deleteContent(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Get seller content
export const getSellerContent = createAsyncThunk(
  'content/getSellerContent',
  async (_, thunkAPI) => {
    try {
      return await contentService.getSellerContent();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Upload content file
export const uploadContentFile = createAsyncThunk(
  'content/uploadContentFile',
  async (formData, thunkAPI) => {
    try {
      return await contentService.uploadContentFile(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatError(error));
    }
  }
);

// Content slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
      state.uploadProgress = 0;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all content
      .addCase(getAllContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.content = action.payload.data;
      })
      .addCase(getAllContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get content categories
      .addCase(getContentCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContentCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload.data;
      })
      .addCase(getContentCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get trending content
      .addCase(getTrendingContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrendingContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trendingContent = action.payload.data;
      })
      .addCase(getTrendingContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get single content
      .addCase(getContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleContent = action.payload.data;
      })
      .addCase(getContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Create content
      .addCase(createContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.content.push(action.payload.data);
        state.sellerContent.push(action.payload.data);
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update content
      .addCase(updateContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.content = state.content.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
        state.sellerContent = state.sellerContent.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item
        );
        if (state.singleContent && state.singleContent._id === action.payload.data._id) {
          state.singleContent = action.payload.data;
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Delete content
      .addCase(deleteContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.content = state.content.filter((item) => item._id !== action.meta.arg);
        state.sellerContent = state.sellerContent.filter((item) => item._id !== action.meta.arg);
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get seller content
      .addCase(getSellerContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sellerContent = action.payload.data;
      })
      .addCase(getSellerContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Upload content file
      .addCase(uploadContentFile.pending, (state) => {
        state.isLoading = true;
        state.uploadProgress = 0;
      })
      .addCase(uploadContentFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.uploadProgress = 100;
      })
      .addCase(uploadContentFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.uploadProgress = 0;
      });
  },
});

export const { reset, setUploadProgress } = contentSlice.actions;
export default contentSlice.reducer;
