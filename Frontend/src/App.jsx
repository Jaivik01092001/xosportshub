import React from "react";
import { Routes, Route } from "react-router-dom";

// Common Components
import Navbar from "./components/common/Navbar";

// Authentication
import Auth from "./pages/Authentication/Auth";

// Visitor Pages
import Home from "./pages/Visitor/Home";
import Contact from "./pages/Visitor/Contact";
import Info from "./pages/Visitor/Info";

// Buyer Pages
import BuyerDashboard from "./pages/Buyer/BuyerDashboard";
import BuyerOrders from "./pages/Buyer/BuyerOrders";
import BuyerSettings from "./pages/Buyer/BuyerSettings";

// Seller Pages
import SellerDashboard from "./pages/Seller/SellerDashboard";
import SellerMyContent from "./pages/Seller/SellerMyContent";
import SellerSettings from "./pages/Seller/SellerSettings";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
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
      </main>
    </>
  );
};

export default App;
