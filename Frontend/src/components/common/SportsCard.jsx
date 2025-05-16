import React from "react";
import "../../styles/SportsCard.css";

const SportsCard = ({ image, name }) => {
  return (
    <div className="sports-card">
      <div className="sports-card-image">
        <img src={image} alt={name} />
      </div>
      <div className="sports-card-overlay">
        <h3 className="sports-card-name">{name}</h3>
      </div>
    </div>
  );
};

export default SportsCard;
