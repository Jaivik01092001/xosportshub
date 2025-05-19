import React, { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import "./lenis.css";

// Create a context for Lenis
const LenisContext = createContext(null);

/**
 * Custom hook to use the Lenis instance
 * @returns {Object} The Lenis instance or null if not available
 */
export const useLenis = () => {
  const context = useContext(LenisContext);
  return context;
};

/**
 * Lenis Provider Component
 * Provides smooth scrolling functionality throughout the app
 */
export const LenisProvider = ({ children }) => {
  const [lenisInstance, setLenisInstance] = useState(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Set up the animation frame to update Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation loop
    requestAnimationFrame(raf);

    // Store the Lenis instance in state
    setLenisInstance(lenis);

    // Clean up on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
};

export default LenisProvider;
