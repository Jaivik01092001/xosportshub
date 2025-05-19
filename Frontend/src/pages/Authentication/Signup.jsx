import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Signup.css";
import FormInput from "../../components/common/FormInput";
import buyerIcon from "../../assets/images/buyer-icon.svg";
import sellerIcon from "../../assets/images/seller-icon.svg";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: "buyer",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleAccountTypeChange = (type) => {
    setFormData({
      ...formData,
      accountType: type,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Form is valid, proceed with submission
    console.log("Form submitted:", formData);
    // Here you would typically call an API to register the user
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-form-container">
          <h1 className="signup-title">Sign up to your account</h1>

          <div className="account-type-selector">
            <p className="account-type-label">Select Account Type</p>
            <div className="account-type-options">
              <div
                className={`account-type-option ${
                  formData.accountType === "buyer" ? "selected" : ""
                }`}
                onClick={() => handleAccountTypeChange("buyer")}
              >
                <img
                  src={buyerIcon}
                  alt="Buyer"
                  className="account-type-icon"
                />
                <p>I want to buy</p>
              </div>
              <div
                className={`account-type-option ${
                  formData.accountType === "seller" ? "selected" : ""
                }`}
                onClick={() => handleAccountTypeChange("seller")}
              >
                <img
                  src={sellerIcon}
                  alt="Seller"
                  className="account-type-icon"
                />
                <p>I want to sell</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <FormInput
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                required
                error={errors.firstName}
                showLabel={false}
              />

              <FormInput
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                required
                error={errors.lastName}
                showLabel={false}
              />
            </div>

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email Address"
              required
              error={errors.email}
              showLabel={false}
            />

            <FormInput
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              pattern="[0-9]{10}"
              required
              error={errors.phone}
              showLabel={false}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
              error={errors.password}
              showLabel={false}
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              error={errors.confirmPassword}
              showLabel={false}
            />

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeToTerms">
                By signing up, you agree to our{" "}
                <Link to="/terms">Terms & Conditions</Link>
              </label>
              {errors.agreeToTerms && (
                <p className="error-message">{errors.agreeToTerms}</p>
              )}
            </div>

            <button type="submit" className="signup-button">
              Create Your Account
            </button>

            <p className="login-link">
              Do you have an account? <Link to="/auth">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
