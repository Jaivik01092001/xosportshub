import React from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const handleBuyerLogin = () => {
    // Simulate login as buyer
    navigate("/buyer/dashboard");
  };

  const handleSellerLogin = () => {
    // Simulate login as seller
    navigate("/seller/dashboard");
  };

  return (
    <div>
      <h1>Login/Register Page</h1>
      <div>
        <button onClick={handleBuyerLogin}>Login as Buyer</button>
        <button onClick={handleSellerLogin}>Login as Seller</button>
      </div>
    </div>
  );
};

export default Auth;
