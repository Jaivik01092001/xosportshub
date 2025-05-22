import React from "react";
import "../../styles/BuyerCards.css";

const BuyerCards = () => {
  return (
    <div className="BuyerCards">
      <h2 className="BuyerCards__title">My Cards</h2>
      <div className="BuyerCards__content">
        <p>You have no saved payment methods yet.</p>
      </div>
    </div>
  );
};

export default BuyerCards;
