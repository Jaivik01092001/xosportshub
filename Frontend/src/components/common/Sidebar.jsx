import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../../styles/Sidebar.css";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaDownload, FaGavel, FaCreditCard } from "react-icons/fa";
import { MdRequestPage } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../redux/slices/buyerDashboardSlice";

const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const location = useLocation();
  const path = location.pathname;
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isOpen
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  // Close sidebar when clicking a link
  const handleLinkClick = () => {
    toggleSidebar();
  };

  // Handle account navigation
  const handleAccountNavigation = (tab) => {
    dispatch(setActiveTab(tab));
    toggleSidebar();
  };

  return (
    <div
      className={`sidebar-component sidebar-container ${
        isOpen ? "active" : ""
      }`}
    >
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      <div className="sidebar" ref={sidebarRef}>
        <div className="sidebar-header"></div>

        <div className="sidebar-links">
          {userRole === "visitor" && (
            // Visitor links
            <>
              <Link
                to="/"
                className={path === "/" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Home
              </Link>
              <Link
                to="/info"
                className={path === "/info" ? "active" : ""}
                onClick={handleLinkClick}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={path === "/contact" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Contact Us
              </Link>
              <Link
                to="/buyer/dashboard"
                className={path === "/buyer/dashboard" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Buy
              </Link>
              <Link
                to="/seller/dashboard"
                className={path === "/seller/dashboard" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Sell
              </Link>
            </>
          )}

          {userRole === "buyer" && (
            // Buyer links
            <>
              <Link
                to="/buyer/dashboard"
                className={path === "/buyer/dashboard" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Dashboard
              </Link>
              <Link
                to="/buyer/orders"
                className={path === "/buyer/orders" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Orders
              </Link>
              <Link
                to="/buyer/settings"
                className={path === "/buyer/settings" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Settings
              </Link>

              {/* Account dropdown section */}
              <div className="sidebar-account-section">
                <div
                  className="sidebar-account-header"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                >
                  <span>My Account</span>
                  <span className={`sidebar-dropdown-icon ${accountDropdownOpen ? 'active' : ''}`}>
                    ▼
                  </span>
                </div>

                {accountDropdownOpen && (
                  <div className="sidebar-account-dropdown">
                    <Link
                      to="/buyer/dashboard"
                      className={path === "/buyer/dashboard" ? "active" : ""}
                      onClick={() => handleAccountNavigation("dashboard")}
                    >
                      <MdDashboard className="sidebar-icon" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/buyer/account/profile"
                      className={path.includes("/profile") ? "active" : ""}
                      onClick={() => handleAccountNavigation("profile")}
                    >
                      <FaUser className="sidebar-icon" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/buyer/account/bids"
                      className={path.includes("/bids") ? "active" : ""}
                      onClick={() => handleAccountNavigation("bids")}
                    >
                      <FaGavel className="sidebar-icon" />
                      <span>My Bids</span>
                    </Link>

                    <Link
                      to="/buyer/account/downloads"
                      className={path.includes("/downloads") ? "active" : ""}
                      onClick={() => handleAccountNavigation("downloads")}
                    >
                      <FaDownload className="sidebar-icon" />
                      <span>My Downloads</span>
                    </Link>

                    <Link
                      to="/buyer/account/requests"
                      className={path.includes("/requests") ? "active" : ""}
                      onClick={() => handleAccountNavigation("requests")}
                    >
                      <MdRequestPage className="sidebar-icon" />
                      <span>My Requests</span>
                    </Link>

                    <Link
                      to="/buyer/account/cards"
                      className={path.includes("/cards") ? "active" : ""}
                      onClick={() => handleAccountNavigation("cards")}
                    >
                      <FaCreditCard className="sidebar-icon" />
                      <span>My Cards</span>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {userRole === "seller" && (
            // Seller links
            <>
              <Link
                to="/seller/dashboard"
                className={path === "/seller/dashboard" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Dashboard
              </Link>
              <Link
                to="/seller/my-content"
                className={path === "/seller/my-content" ? "active" : ""}
                onClick={handleLinkClick}
              >
                My Content
              </Link>
              <Link
                to="/seller/settings"
                className={path === "/seller/settings" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Settings
              </Link>
            </>
          )}
        </div>

        <div className="sidebar-auth">
          {userRole === "visitor" && (
            <>
              <Link
                to="/auth"
                className="btn signinbtn"
                onClick={handleLinkClick}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn signupbtn"
                onClick={handleLinkClick}
              >
                Sign Up
              </Link>
            </>
          )}

          {userRole === "seller" && (
            <Link to="/" className="btn btn-outline" onClick={handleLinkClick}>
              Logout
            </Link>
          )}

          {userRole === "buyer" && (
            <Link
              to="/"
              className="btn btn-outline"
              onClick={() => handleAccountNavigation("logout")}
            >
              <IoLogOut style={{ marginRight: '8px' }} />
              Logout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
