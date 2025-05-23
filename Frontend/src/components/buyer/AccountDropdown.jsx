import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../redux/slices/buyerDashboardSlice";
import "../../styles/AccountDropdown.css";

// Icons
import { MdDashboard, MdKeyboardArrowDown } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { MdRequestPage } from "react-icons/md";
import { FaGavel } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = location.pathname;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle navigation and set active tab
  const handleNavigation = (tab) => {
    setIsOpen(false);
    dispatch(setActiveTab(tab));
    
    // Navigate to the corresponding route
    switch (tab) {
      case "dashboard":
        navigate("/buyer/dashboard");
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
        navigate("/buyer/dashboard");
    }
  };

  // Determine if a menu item is active
  const isActive = (route) => {
    if (route === "dashboard" && path === "/buyer/dashboard") return true;
    if (route === "profile" && path.includes("/profile")) return true;
    if (route === "bids" && path.includes("/bids")) return true;
    if (route === "downloads" && path.includes("/downloads")) return true;
    if (route === "requests" && path.includes("/requests")) return true;
    if (route === "cards" && path.includes("/cards")) return true;
    return false;
  };

  return (
    <div className="account-dropdown" ref={dropdownRef}>
      <button 
        className={`account-dropdown__button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        My Account
        <MdKeyboardArrowDown className="account-dropdown__icon" />
      </button>
      
      <div className={`account-dropdown__menu ${isOpen ? 'active' : ''}`}>
        <Link 
          to="/buyer/dashboard" 
          className={`account-dropdown__item ${isActive("dashboard") ? 'active' : ''}`}
          onClick={() => handleNavigation("dashboard")}
        >
          <MdDashboard className="account-dropdown__item-icon" />
          Dashboard
        </Link>
        
        <Link 
          to="/buyer/account/profile" 
          className={`account-dropdown__item ${isActive("profile") ? 'active' : ''}`}
          onClick={() => handleNavigation("profile")}
        >
          <FaUser className="account-dropdown__item-icon" />
          My Profile
        </Link>
        
        <Link 
          to="/buyer/account/bids" 
          className={`account-dropdown__item ${isActive("bids") ? 'active' : ''}`}
          onClick={() => handleNavigation("bids")}
        >
          <FaGavel className="account-dropdown__item-icon" />
          My Bids
        </Link>
        
        <Link 
          to="/buyer/account/downloads" 
          className={`account-dropdown__item ${isActive("downloads") ? 'active' : ''}`}
          onClick={() => handleNavigation("downloads")}
        >
          <FaDownload className="account-dropdown__item-icon" />
          My Downloads
        </Link>
        
        <Link 
          to="/buyer/account/requests" 
          className={`account-dropdown__item ${isActive("requests") ? 'active' : ''}`}
          onClick={() => handleNavigation("requests")}
        >
          <MdRequestPage className="account-dropdown__item-icon" />
          My Requests
        </Link>
        
        <Link 
          to="/buyer/account/cards" 
          className={`account-dropdown__item ${isActive("cards") ? 'active' : ''}`}
          onClick={() => handleNavigation("cards")}
        >
          <FaCreditCard className="account-dropdown__item-icon" />
          My Cards
        </Link>
        
        <div className="account-dropdown__divider"></div>
        
        <Link 
          to="/" 
          className="account-dropdown__item"
          onClick={() => handleNavigation("logout")}
        >
          <IoLogOut className="account-dropdown__item-icon" />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default AccountDropdown;
