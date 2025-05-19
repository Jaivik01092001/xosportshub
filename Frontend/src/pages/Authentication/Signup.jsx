import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Signup.css";
import FormInput from "../../components/common/FormInput";
import buyerIcon from "../../assets/images/buyer-icon.svg";
import sellerIcon from "../../assets/images/seller-icon.svg";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    accountType: "learn",
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

  const handleCountryCodeChange = (e) => {
    setFormData({
      ...formData,
      countryCode: e.target.value,
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

    // Navigate to OTP verification page with phone number
    navigate("/otp-verification", {
      state: {
        phoneNumber: `${formData.countryCode} ${formData.phone}`,
      },
    });
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
                  formData.accountType === "learn" ? "selected" : ""
                }`}
                onClick={() => handleAccountTypeChange("learn")}
              >
                <img
                  src={buyerIcon}
                  alt="Learn"
                  className="account-type-icon"
                />
                <p>I want to learn</p>
              </div>
              <div
                className={`account-type-option ${
                  formData.accountType === "teach" ? "selected" : ""
                }`}
                onClick={() => handleAccountTypeChange("teach")}
              >
                <img
                  src={sellerIcon}
                  alt="Teach"
                  className="account-type-icon"
                />
                <p>I want to teach</p>
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

            <div className="form-input-container">
              <div className="phone-input-wrapper">
                <div>
                  <select
                    value={formData.countryCode}
                    onChange={handleCountryCodeChange}
                    className="country-code-select"
                  >
                    <option value="+1">+1</option>
                    <option value="+91">+91</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+86">+86</option>
                    <option value="+49">+49</option>
                    <option value="+33">+33</option>
                    <option value="+81">+81</option>
                    <option value="+7">+7</option>
                    <option value="+55">+55</option>
                  </select>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const phoneValue = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: {
                        name: "phone",
                        value: phoneValue,
                      },
                    });
                  }}
                  placeholder="Enter Phone Number"
                  className={`form-input phone-input ${
                    errors.phone ? "input-error" : ""
                  }`}
                  required
                  pattern="[0-9]*"
                />
              </div>
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

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
