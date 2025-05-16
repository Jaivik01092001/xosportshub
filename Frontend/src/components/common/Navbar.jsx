import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../../styles/Navbar.css";
import logo from "../../assets/images/XOsports-hub-logo.svg";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine user role based on URL path
  let userRole = "visitor";
  if (path.startsWith("/buyer")) {
    userRole = "buyer";
  } else if (path.startsWith("/seller")) {
    userRole = "seller";
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="XO Sports Hub Logo" />
          </Link>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {userRole === "visitor" && (
            // Visitor links
            <>
              <Link to="/" className={path === "/" ? "active" : ""}>
                Home
              </Link>

              <Link to="/info" className={path === "/info" ? "active" : ""}>
                About Us
              </Link>
              <Link
                to="/contact"
                className={path === "/contact" ? "active" : ""}
              >
                Contact
              </Link>
            </>
          )}

          {userRole === "buyer" && (
            // Buyer links
            <>
              <Link
                to="/buyer/dashboard"
                className={path === "/buyer/dashboard" ? "active" : ""}
              >
                Dashboard
              </Link>
              <Link
                to="/buyer/orders"
                className={path === "/buyer/orders" ? "active" : ""}
              >
                Orders
              </Link>
              <Link
                to="/buyer/settings"
                className={path === "/buyer/settings" ? "active" : ""}
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
              >
                Dashboard
              </Link>
              <Link
                to="/seller/my-content"
                className={path === "/seller/my-content" ? "active" : ""}
              >
                My Content
              </Link>
              <Link
                to="/seller/settings"
                className={path === "/seller/settings" ? "active" : ""}
              >
                Settings
              </Link>
            </>
          )}
        </div>

        <div className={`navbar-auth ${menuOpen ? "active" : ""}`}>
          {userRole === "visitor" && (
            <>
              <Link to="/auth" className="btn signinbtn">
                Sign In
              </Link>
              <Link to="/auth" className="btn signupbtn">
                Sign Up
              </Link>
            </>
          )}

          {(userRole === "buyer" || userRole === "seller") && (
            <Link to="/" className="btn btn-outline">
              Logout
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
