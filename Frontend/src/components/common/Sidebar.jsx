import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "../../styles/Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const location = useLocation();
  const path = location.pathname;
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
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

  return (
    <div className={`sidebar-container ${isOpen ? "active" : ""}`}>
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      <div className="sidebar" ref={sidebarRef}>
        <div className="sidebar-header">
         
        </div>
        
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
              <Link to="/auth" className="btn signinbtn" onClick={handleLinkClick}>
                Sign In
              </Link>
              <Link to="/auth" className="btn signupbtn" onClick={handleLinkClick}>
                Sign Up
              </Link>
            </>
          )}

          {(userRole === "buyer" || userRole === "seller") && (
            <Link to="/" className="btn btn-outline" onClick={handleLinkClick}>
              Logout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
