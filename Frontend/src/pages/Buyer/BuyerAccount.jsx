import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  selectActiveTab,
  setActiveTab,
} from "../../redux/slices/buyerDashboardSlice";
import BuyerSidebar from "../../components/buyer/BuyerSidebar";
import BuyerProfile from "./BuyerProfile";
import BuyerDownloads from "./BuyerDownloads";
import BuyerRequests from "./BuyerRequests";
import BuyerBids from "./BuyerBids";
import BuyerCards from "./BuyerCards";
import "../../styles/BuyerAccount.css";

const BuyerAccount = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const activeTab = useSelector(selectActiveTab);

  // Set active tab based on URL path
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/profile")) {
      dispatch(setActiveTab("profile"));
    } else if (path.includes("/downloads")) {
      dispatch(setActiveTab("downloads"));
    } else if (path.includes("/requests")) {
      dispatch(setActiveTab("requests"));
    } else if (path.includes("/bids")) {
      dispatch(setActiveTab("bids"));
    } else if (path.includes("/cards")) {
      dispatch(setActiveTab("cards"));
    } else {
      dispatch(setActiveTab("profile")); // Default to profile
    }
  }, [location.pathname, dispatch]);

  // Render the active component based on the active tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "profile":
        return <BuyerProfile />;
      case "downloads":
        return <BuyerDownloads />;
      case "requests":
        return <BuyerRequests />;
      case "bids":
        return <BuyerBids />;
      case "cards":
        return <BuyerCards />;
      default:
        return <BuyerProfile />;
    }
  };

  return (
    <div className="BuyerAccount">
      <div className="BuyerAccount__container max-container">
        <div className="BuyerAccount__sidebar">
          <BuyerSidebar />
        </div>
        <div className="BuyerAccount__content">{renderActiveComponent()}</div>
      </div>
    </div>
  );
};

export default BuyerAccount;
