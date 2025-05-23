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
  myCards: [
    { id: '1', lastFourDigits: '1234', cardType: 'mastercard' },
    { id: '2', lastFourDigits: '5678', cardType: 'mastercard' },
    { id: '3', lastFourDigits: '9012', cardType: 'mastercard' },
  ],
  myBids: [
    {
      id: '1',
      title: 'Advanced Basketball Strategies',
      coach: 'Michael Johnson',
      bidAmount: 75.00,
      date: '2023-05-15',
      status: 'active'
    },
    {
      id: '2',
      title: 'Football Defense Techniques',
      coach: 'Robert Williams',
      bidAmount: 60.00,
      date: '2023-05-10',
      status: 'won'
    },
    {
      id: '3',
      title: 'Soccer Goal Keeping Masterclass',
      coach: 'David Martinez',
      bidAmount: 85.00,
      date: '2023-05-05',
      status: 'lost'
    }
  ],
  myDownloads: [
    {
      id: '1',
      title: 'Basketball Offense Strategies',
      coach: 'John Smith',
      downloadDate: '2023-05-20',
      fileSize: '15.2 MB',
      fileType: 'PDF'
    },
    {
      id: '2',
      title: 'Football Training Drills',
      coach: 'Mike Johnson',
      downloadDate: '2023-05-18',
      fileSize: '25.6 MB',
      fileType: 'Video'
    },
    {
      id: '3',
      title: 'Tennis Serve Techniques',
      coach: 'Sarah Williams',
      downloadDate: '2023-05-15',
      fileSize: '10.8 MB',
      fileType: 'PDF'
    }
  ],
  myRequests: [
    {
      id: '1',
      title: 'Advanced Swimming Techniques',
      description: 'Looking for professional swimming techniques for competitive swimmers',
      date: '2023-05-22',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Golf Swing Analysis',
      description: 'Need a detailed analysis of golf swing mechanics',
      date: '2023-05-19',
      status: 'approved'
    },
    {
      id: '3',
      title: 'Marathon Training Plan',
      description: 'Request for a 16-week marathon training plan for beginners',
      date: '2023-05-17',
      status: 'completed'
    }
  ],

  // Card UI state
  cardUI: {
    viewMode: 'list', // 'list' or 'add'
  },

  // Card form state
  cardForm: {
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  },
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
    addCard: (state, action) => {
      state.myCards.push(action.payload);
    },
    removeCard: (state, action) => {
      state.myCards = state.myCards.filter(card => card.id !== action.payload);
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

    // Card UI actions
    setCardViewMode: (state, action) => {
      state.cardUI.viewMode = action.payload;
    },

    // Card form actions
    updateCardForm: (state, action) => {
      state.cardForm = { ...state.cardForm, ...action.payload };
    },
    resetCardForm: (state) => {
      state.cardForm = initialState.cardForm;
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
  addCard,
  removeCard,
  setMyBids,
  setMyDownloads,
  setMyRequests,
  setCardViewMode,
  updateCardForm,
  resetCardForm,
} = buyerDashboardSlice.actions;

// Export selectors
export const selectActiveTab = (state) => state.buyerDashboard.activeTab;
export const selectIsSidebarOpen = (state) => state.buyerDashboard.isSidebarOpen;
export const selectProfile = (state) => state.buyerDashboard.profile;
export const selectMyCards = (state) => state.buyerDashboard.myCards;
export const selectMyBids = (state) => state.buyerDashboard.myBids;
export const selectMyDownloads = (state) => state.buyerDashboard.myDownloads;
export const selectMyRequests = (state) => state.buyerDashboard.myRequests;
export const selectCardViewMode = (state) => state.buyerDashboard.cardUI.viewMode;
export const selectCardForm = (state) => state.buyerDashboard.cardForm;

// Export reducer
export default buyerDashboardSlice.reducer;
