import React, { useEffect, useState } from "react";
import "./Preloader.css";

/**
 * Preloader Component
 *
 * This component displays a Lottie animation as a preloader for 5 seconds
 * before allowing the main content to be displayed.
 *
 * Note: This component requires the lottie-react package to be installed:
 * npm install lottie-react
 *
 * @param {Object} props - Component props
 * @param {Object} props.animationData - The Lottie JSON animation data
 * @param {number} props.duration - Duration in milliseconds to show the preloader (default: 5000ms)
 */
const Preloader = ({ animationData, duration = 5000 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";

    // Set a timeout to hide the preloader after the specified duration
    const timer = setTimeout(() => {
      setLoading(false);

      // Re-enable scrolling after preloader is hidden
      document.body.style.overflow = "auto";
    }, duration);

    // Clean up the timeout if the component unmounts
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, [duration]);

  // Dynamically import Lottie to avoid issues if the package isn't installed
  const LottiePlayer = React.lazy(() => {
    try {
      return import("lottie-react");
    } catch (error) {
      console.error(
        "lottie-react package is not installed. Please run: npm install lottie-react"
      );
      return { default: () => <div>Animation not available</div> };
    }
  });

  return (
    <div className={`preloader ${!loading ? "preloader--hidden" : ""}`}>
      <div className="preloader__content">
        <React.Suspense>
          <LottiePlayer
            animationData={animationData}
            loop={true}
            autoplay={true}
            className="preloader__animation"
          />
        </React.Suspense>
      </div>
    </div>
  );
};

export default Preloader;
