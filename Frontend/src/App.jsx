import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Common Components
import Navbar from "./components/common/Navbar";

// Lazy-loaded Authentication
const Auth = lazy(() => import("./pages/Authentication/Auth"));

// Lazy-loaded Visitor Pages
const Home = lazy(() => import("./pages/Visitor/Home"));
const Contact = lazy(() => import("./pages/Visitor/Contact"));
const Info = lazy(() => import("./pages/Visitor/Info"));

// Lazy-loaded Buyer Pages
const BuyerDashboard = lazy(() => import("./pages/Buyer/BuyerDashboard"));
const BuyerOrders = lazy(() => import("./pages/Buyer/BuyerOrders"));
const BuyerSettings = lazy(() => import("./pages/Buyer/BuyerSettings"));

// Lazy-loaded Seller Pages
const SellerDashboard = lazy(() => import("./pages/Seller/SellerDashboard"));
const SellerMyContent = lazy(() => import("./pages/Seller/SellerMyContent"));
const SellerSettings = lazy(() => import("./pages/Seller/SellerSettings"));

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
          <Routes>
            {/* Visitor Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/info" element={<Info />} />

            {/* Authentication */}
            <Route path="/auth" element={<Auth />} />

            {/* Buyer Routes */}
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="/buyer/orders" element={<BuyerOrders />} />
            <Route path="/buyer/settings" element={<BuyerSettings />} />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/my-content" element={<SellerMyContent />} />
            <Route path="/seller/settings" element={<SellerSettings />} />

            {/* Catch-all route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

export default App;
