import React from "react";
import "../../styles/BuyerRequests.css";

const BuyerRequests = () => {
  return (
    <div className="BuyerRequests">
      <h2 className="BuyerRequests__title">My Requests</h2>
      <div className="BuyerRequests__content">
        <p>You have no requests yet.</p>
      </div>
    </div>
  );
};

export default BuyerRequests;
