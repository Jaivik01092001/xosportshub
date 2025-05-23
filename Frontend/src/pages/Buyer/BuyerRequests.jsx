import React from "react";
import { useSelector } from "react-redux";
import { selectMyRequests } from "../../redux/slices/buyerDashboardSlice";
import SectionWrapper from "../../components/common/SectionWrapper";
import { FaPlus } from "react-icons/fa";
import "../../styles/BuyerRequests.css";

const BuyerRequests = () => {
  const requests = useSelector(selectMyRequests);

  // Function to get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'BuyerRequests__status--pending';
      case 'approved':
        return 'BuyerRequests__status--approved';
      case 'completed':
        return 'BuyerRequests__status--completed';
      default:
        return '';
    }
  };

  return (
    <div className="BuyerRequests">
      <SectionWrapper title="My Requests">
        <div className="BuyerRequests__header">
          <button className="BuyerRequests__add-btn">
            <FaPlus /> New Request
          </button>
        </div>

        {requests.length > 0 ? (
          <div className="BuyerRequests__list">
            {requests.map((request) => (
              <div className="BuyerRequests__item" key={request.id}>
                <div className="BuyerRequests__item-header">
                  <h3 className="BuyerRequests__item-title">{request.title}</h3>
                  <div className={`BuyerRequests__item-status ${getStatusClass(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
                <p className="BuyerRequests__item-description">{request.description}</p>
                <div className="BuyerRequests__item-footer">
                  <span className="BuyerRequests__item-date">Requested on: {request.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="BuyerRequests__empty">
            <p>You have no requests yet.</p>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default BuyerRequests;
