import React from "react";
import "../../styles/BuyerBids.css";

const BuyerBids = () => {
  return (
    <div className="BuyerBids">
      <h2 className="BuyerBids__title">My Bids</h2>
      <div className="BuyerBids__content">
        <p>You have no bids yet.</p>
      </div>
    </div>
  );
};

export default BuyerBids;
