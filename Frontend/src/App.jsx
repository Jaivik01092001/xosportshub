import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../src/components/common/Footer";

// Common Components
import Navbar from "./components/common/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import Preloader from "./components/common/Preloader";

// Lenis Smooth Scrolling Provider
import LenisProvider from "./utils/LenisProvider";

// Import and preload Lottie animation data
import preloaderAnimation from "./assets/preloader-animation.json";

// Preload the animation data
const preloadedAnimation = { ...preloaderAnimation };

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
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  // Check if both animation and content are loaded
  const checkAllLoaded = () => {
    if (animationLoaded && contentLoaded) {
      // Add a small delay for a smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  // Handle animation loaded callback
  const handleAnimationLoaded = () => {
    setAnimationLoaded(true);
    checkAllLoaded();
  };

  // Handle content loaded
  useEffect(() => {
    // Listen for when the page content is fully loaded
    const handleLoad = () => {
      setContentLoaded(true);
      checkAllLoaded();
    };

    // Check if already loaded
    if (document.readyState === 'complete') {
      setContentLoaded(true);
      checkAllLoaded();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <LenisProvider>
      <>
        {/* Preloader */}
        <Preloader
          animationData={preloadedAnimation}
          onLoaded={handleAnimationLoaded}
          isLoading={isLoading}
        />

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
