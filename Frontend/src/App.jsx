import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../src/components/common/Footer";

// Common Components
import Navbar from "./components/common/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import Preloader from "./components/common/Preloader";

// Lenis Smooth Scrolling Provider
import LenisProvider from "./utils/LenisProvider";

// Import Lottie animation data
import preloaderAnimation from "./assets/preloader-animation.json";

// Lazy-loaded Authentication
const Auth = lazy(() => import("./pages/Authentication/Auth"));
const Signup = lazy(() => import("./pages/Authentication/Signup"));

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
  const [showPreloader, setShowPreloader] = useState(true);

  // Effect to handle preloader visibility
  useEffect(() => {
    // The Preloader component will handle its own timing and fade-out
    // This state is just to control whether to render it at all
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 1000); // 5.5 seconds (5s display + 0.5s for fade-out)

    return () => clearTimeout(timer);
  }, []);

  return (
    <LenisProvider>
      <>
        {/* Preloader */}
        {showPreloader && (
          <Preloader animationData={preloaderAnimation} duration={5000} />
        )}

        <Navbar />
        <main>
          <Suspense>
            <Routes>
              {/* Visitor Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/info" element={<Info />} />

              {/* Authentication */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<Signup />} />

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
        {/* Footer */}
        <Footer />
        {/* Scroll to Top Button */}
        <ScrollToTop />
      </>
    </LenisProvider>
  );
};

export default App;
