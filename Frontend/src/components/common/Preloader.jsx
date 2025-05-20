import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import "./Preloader.css";

/**
 * Preloader Component
 *
 * This component displays a Lottie animation as a preloader while the app is loading.
 * It will be hidden when the onLoaded callback is triggered.
 *
 * Note: This component requires the lottie-react package to be installed:
 * npm install lottie-react
 *
 * @param {Object} props - Component props
 * @param {Object} props.animationData - The Lottie JSON animation data
 * @param {Function} props.onLoaded - Callback function to notify when animation is loaded
 * @param {boolean} props.isLoading - Whether the app is still loading
 */
const Preloader = ({ animationData, onLoaded, isLoading = true }) => {
  const [animationLoaded, setAnimationLoaded] = useState(false);

  useEffect(() => {
    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";

    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Re-enable scrolling when preloader is no longer needed
  useEffect(() => {
    if (!isLoading) {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  // Mark animation as loaded when it's ready
  useEffect(() => {
    if (animationData) {
      setAnimationLoaded(true);
      if (onLoaded) {
        onLoaded();
      }
    }
  }, [animationData, onLoaded]);

  return (
    <div className={`preloader-component preloader ${!isLoading ? "preloader--hidden" : ""}`}>
      <div className="preloader__content">
        {animationLoaded ? (
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            className="preloader__animation"
          />
        ) : (
          <div className="preloader__placeholder"></div>
        )}
      </div>
    </div>
  );
};

export default Preloader;
