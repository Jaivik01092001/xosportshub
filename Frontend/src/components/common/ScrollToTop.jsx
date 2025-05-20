import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useLenis } from "../../utils/LenisProvider";
import "./ScrollToTop.css";

/**
 * ScrollToTop Component
 * A button that appears when the user scrolls down and scrolls the page back to top when clicked
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  // Handle window scroll for fallback when Lenis is not available
  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // If Lenis is not available, use regular scroll event
    if (!lenis) {
      window.addEventListener("scroll", handleWindowScroll);
      return () => {
        window.removeEventListener("scroll", handleWindowScroll);
      };
    }
  }, [lenis]);

  // Use Lenis for scroll detection when available
  useEffect(() => {
    if (!lenis) return;

    const handleLenisScroll = ({ scroll }) => {
      if (scroll > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    lenis.on("scroll", handleLenisScroll);

    // Clean up
    return () => {
      lenis.off("scroll", handleLenisScroll);
    };
  }, [lenis]);

  // Scroll to top with smooth animation
  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      // Fallback to regular scroll behavior
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      className={`scroll-to-top-component  ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTop;
