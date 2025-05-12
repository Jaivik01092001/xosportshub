import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Determine user role based on URL path
  let userRole = "visitor";
  if (path.startsWith("/buyer")) {
    userRole = "buyer";
  } else if (path.startsWith("/seller")) {
    userRole = "seller";
  }

  return (
    <nav>
      <h1>Sports Marketplace</h1>
      <div>
        {userRole === "visitor" && (
          // Visitor links
          <>
            <Link to="/">Home</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/info">Info</Link>
            <Link to="/auth">Register / Login</Link>
          </>
        )}

        {userRole === "buyer" && (
          // Buyer links
          <>
            <Link to="/buyer/dashboard">Dashboard</Link>
            <Link to="/buyer/orders">Orders</Link>
            <Link to="/buyer/settings">Settings</Link>
            <Link to="/">Logout</Link>
          </>
        )}

        {userRole === "seller" && (
          // Seller links
          <>
            <Link to="/seller/dashboard">Dashboard</Link>
            <Link to="/seller/my-content">My Content</Link>
            <Link to="/seller/settings">Settings</Link>
            <Link to="/">Logout</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
