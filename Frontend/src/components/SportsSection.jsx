import React, { useRef } from "react";
import "./SportsSection.css";

const SportsSection = ({ sports }) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth;
    const newScrollPosition =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="sports-section-outer">
      <div className="sports-section-inner">
        <div className="sports-grid-container" ref={scrollContainerRef}>
          <div className="sports-grid">
            {sports.map((sport) => (
              <div key={sport.id} className="sports-card">
                <div className="sports-card-image">
                  <img src={sport.image} alt={sport.name} />
                </div>
                <div className="sports-card-overlay">
                  <h3 className="sports-card-name">{sport.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sports-arrows">
          <button
            className="scroll-button left"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            className="scroll-button right"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SportsSection;
