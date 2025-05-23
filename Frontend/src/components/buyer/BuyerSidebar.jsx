import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActiveTab,
  setActiveTab,
} from "../../redux/slices/buyerDashboardSlice";
import "../../styles/BuyerSidebar.css";

// Icons
import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { MdRequestPage } from "react-icons/md";
import { FaGavel } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const BuyerSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeTab = useSelector(selectActiveTab);

  // Handle tab click
  const handleTabClick = (tab) => {
    dispatch(setActiveTab(tab));

    // Navigate to the corresponding route
    switch (tab) {
      case "dashboard":
        navigate("/buyer/account/dashboard");
        break;
      case "profile":
        navigate("/buyer/account/profile");
        break;
      case "downloads":
        navigate("/buyer/account/downloads");
        break;
      case "requests":
        navigate("/buyer/account/requests");
        break;
      case "bids":
        navigate("/buyer/account/bids");
        break;
      case "cards":
        navigate("/buyer/account/cards");
        break;
      case "logout":
        // Handle logout logic here
        navigate("/");
        break;
      default:
        navigate("/buyer/account/dashboard");
    }
  };

  return (
    <div className="BuyerSidebar">
      <div className="BuyerSidebar__container">
        <ul className="BuyerSidebar__menu">
          <li
            className={`BuyerSidebar__item ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => handleTabClick("dashboard")}
          >
            <MdDashboard className="BuyerSidebar__icon" />
            <span>Dashboard</span>
          </li>

          <li
            className={`BuyerSidebar__item ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => handleTabClick("profile")}
          >
            <FaUser className="BuyerSidebar__icon" />
            <span>My Profile</span>
          </li>

          <li
            className={`BuyerSidebar__item ${
              activeTab === "downloads" ? "active" : ""
            }`}
            onClick={() => handleTabClick("downloads")}
          >
            <FaDownload className="BuyerSidebar__icon" />
            <span>My Downloads</span>
          </li>

          <li
            className={`BuyerSidebar__item ${
              activeTab === "requests" ? "active" : ""
            }`}
            onClick={() => handleTabClick("requests")}
          >
            <MdRequestPage className="BuyerSidebar__icon" />
            <span>My Requests</span>
          </li>

          <li
            className={`BuyerSidebar__item ${
              activeTab === "bids" ? "active" : ""
            }`}
            onClick={() => handleTabClick("bids")}
          >
            <FaGavel className="BuyerSidebar__icon" />
            <span>My Bids</span>
          </li>

          <li
            className={`BuyerSidebar__item ${
              activeTab === "cards" ? "active" : ""
            }`}
            onClick={() => handleTabClick("cards")}
          >
            <FaCreditCard className="BuyerSidebar__icon" />
            <span>My Cards</span>
          </li>

          <li
            className="BuyerSidebar__item BuyerSidebar__logout"
            onClick={() => handleTabClick("logout")}
          >
            <IoLogOut className="BuyerSidebar__icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BuyerSidebar;
