import React from "react";
import { useSelector } from "react-redux";
import { selectMyBids } from "../../redux/slices/buyerDashboardSlice";
import SectionWrapper from "../../components/common/SectionWrapper";
import "../../styles/BuyerBids.css";
import { FaGavel } from "react-icons/fa";

const BuyerBids = () => {
  const bids = useSelector(selectMyBids);

  // Function to get status class
  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "BuyerBids__status--active";
      case "won":
        return "BuyerBids__status--won";
      case "lost":
        return "BuyerBids__status--lost";
      default:
        return "";
    }
  };

  return (
    <div className="BuyerBids">
      <SectionWrapper
        icon={<FaGavel className="BuyerSidebar__icon" />}
        title="My Bids"
      >
        {bids.length > 0 ? (
          <div className="BuyerBids__list">
            <div className="BuyerBids__header">
              <div className="BuyerBids__header-item">Title</div>
              <div className="BuyerBids__header-item">Coach</div>
              <div className="BuyerBids__header-item">Bid Amount</div>
              <div className="BuyerBids__header-item">Date</div>
              <div className="BuyerBids__header-item">Status</div>
            </div>

            {bids.map((bid) => (
              <div className="BuyerBids__item" key={bid.id}>
                <div className="BuyerBids__item-title">{bid.title}</div>
                <div className="BuyerBids__item-coach">{bid.coach}</div>
                <div className="BuyerBids__item-amount">
                  ${bid.bidAmount.toFixed(2)}
                </div>
                <div className="BuyerBids__item-date">{bid.date}</div>
                <div
                  className={`BuyerBids__item-status ${getStatusClass(
                    bid.status
                  )}`}
                >
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="BuyerBids__empty">
            <p>You have no bids yet.</p>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default BuyerBids;
