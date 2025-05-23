import React from "react";
import "../../styles/SectionWrapper.css";

/**
 * Section Wrapper Component
 * A reusable wrapper component for consistent section layout
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.title - Section title
 * @param {string} props.className - Additional CSS class names
 */
const SectionWrapper = ({ children, title, className = "" }) => {
  return (
    <div className={`SectionWrapper ${className}`}>
      {title && <h2 className="SectionWrapper__title">{title}</h2>}
      <div className="SectionWrapper__content">
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;
