import { createSlice } from '@reduxjs/toolkit';

// Initial state for the buyer dashboard
const initialState = {
  // Sidebar state
  activeTab: 'dashboard', // Default active tab
  isSidebarOpen: false,
  
  // User profile data (mock data for development)
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    phone: '+1 (123) 456-7890',
    profileImage: null,
  },
  
  // Dashboard data
  myCards: [],
  myBids: [],
  myDownloads: [],
  myRequests: [],
};

const buyerDashboardSlice = createSlice({
  name: 'buyerDashboard',
  initialState,
  reducers: {
    // Sidebar actions
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    
    // Profile actions
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateProfileImage: (state, action) => {
      state.profile.profileImage = action.payload;
    },
    
    // Dashboard data actions
    setMyCards: (state, action) => {
      state.myCards = action.payload;
    },
    setMyBids: (state, action) => {
      state.myBids = action.payload;
    },
    setMyDownloads: (state, action) => {
      state.myDownloads = action.payload;
    },
    setMyRequests: (state, action) => {
      state.myRequests = action.payload;
    },
  },
});

// Export actions
export const {
  setActiveTab,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  updateProfile,
  updateProfileImage,
  setMyCards,
  setMyBids,
  setMyDownloads,
  setMyRequests,
} = buyerDashboardSlice.actions;

// Export selectors
export const selectActiveTab = (state) => state.buyerDashboard.activeTab;
export const selectIsSidebarOpen = (state) => state.buyerDashboard.isSidebarOpen;
export const selectProfile = (state) => state.buyerDashboard.profile;
export const selectMyCards = (state) => state.buyerDashboard.myCards;
export const selectMyBids = (state) => state.buyerDashboard.myBids;
export const selectMyDownloads = (state) => state.buyerDashboard.myDownloads;
export const selectMyRequests = (state) => state.buyerDashboard.myRequests;

// Export reducer
export default buyerDashboardSlice.reducer;
