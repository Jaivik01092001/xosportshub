# Redux Setup and API Integration

This document outlines the Redux setup and API integration for the XO Sports Hub frontend application.

## Table of Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Redux Store](#redux-store)
- [API Integration](#api-integration)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Usage Examples](#usage-examples)

## Overview

The Redux setup follows a feature-based organization, with each major feature having its own slice. The API integration is handled through service files that encapsulate the API calls and provide a clean interface for the Redux actions.

## Folder Structure

```
src/
├── redux/
│   ├── store.js                # Redux store configuration
│   ├── slices/                 # Redux slices (reducers + actions)
│   │   ├── authSlice.js        # Authentication slice
│   │   ├── userSlice.js        # User management slice
│   │   ├── contentSlice.js     # Content management slice
│   │   ├── orderSlice.js       # Order management slice
│   │   ├── bidSlice.js         # Bidding system slice
│   │   ├── paymentSlice.js     # Payment integration slice
│   │   ├── notificationSlice.js # Notification system slice
│   │   └── wishlistSlice.js    # Wishlist management slice
├── services/                   # API service files
│   ├── api.js                  # Base API configuration
│   ├── authService.js          # Authentication service
│   ├── userService.js          # User management service
│   ├── contentService.js       # Content management service
│   ├── orderService.js         # Order management service
│   ├── bidService.js           # Bidding system service
│   ├── paymentService.js       # Payment integration service
│   ├── notificationService.js  # Notification system service
│   └── wishlistService.js      # Wishlist management service
└── utils/
    ├── constants.js            # API endpoints and constants
    └── errorHandler.js         # Error handling utilities
```

## Redux Store

The Redux store is configured using Redux Toolkit's `configureStore` function. It combines all the reducers from the slices and adds middleware for handling async actions.

```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

// Import reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
// ... other reducers

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
});
```

## API Integration

API integration is handled through service files that encapsulate the API calls. Each service file corresponds to a specific feature and provides methods for interacting with the API endpoints.

The base API configuration is in `services/api.js`, which sets up an Axios instance with common configuration like base URL, headers, and interceptors.

```javascript
// api.js
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ... response interceptor

export default api;
```

## Error Handling

Error handling is centralized in the `utils/errorHandler.js` file, which provides utilities for formatting error responses from the API.

```javascript
// errorHandler.js
export const formatError = (error) => {
  // Default error object
  const formattedError = {
    message: 'Something went wrong. Please try again.',
    status: 500,
    errors: null,
  };

  if (!error.response) {
    // Network error or server not responding
    formattedError.message = 'Network error. Please check your connection.';
    return formattedError;
  }

  // ... handle different status codes

  return formattedError;
};
```

## Authentication

Authentication is handled through the `authSlice.js` and `authService.js` files. The authentication state is stored in Redux and the JWT token is stored in localStorage.

```javascript
// authService.js
export const login = async (credentials) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
  
  // Store token and user data in localStorage
  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  }
  
  return response.data;
};
```

## Usage Examples

### Using Redux in Components

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const LoginComponent = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    await dispatch(login(credentials));
  };

  return (
    // Component JSX
  );
};
```

### Making API Calls

```jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllContent } from '../redux/slices/contentSlice';

const ContentListComponent = () => {
  const dispatch = useDispatch();
  const { content, isLoading } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(getAllContent());
  }, [dispatch]);

  return (
    // Component JSX
  );
};
```
