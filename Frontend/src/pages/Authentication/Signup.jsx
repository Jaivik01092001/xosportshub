import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Signup.css";
import {
  FaBook,
  FaChalkboardTeacher,
  FaUser,
  FaEnvelope,
  FaCheck,
} from "react-icons/fa";
import { FaMobile } from "react-icons/fa6";

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
    <div className="signup__page">
      <div className="signup__container">
        <h1 className="signup__title">Sign up to your account</h1>

        <div className="signup__account-type">
          <p className="signup__label">Select Account Type</p>
          <div className="signup__options">
            <div
              className={`signup__option ${
                formData.accountType === "learn"
                  ? "signup__option--selected"
                  : ""
              }`}
              onClick={() => handleAccountTypeChange("learn")}
            >
              <div className="signup__option-icon">
                <FaBook />
              </div>
              <p className="signup__option-text">I want to learn</p>
            </div>

            <div
              className={`signup__option ${
                formData.accountType === "teach"
                  ? "signup__option--selected"
                  : ""
              }`}
              onClick={() => handleAccountTypeChange("teach")}
            >
              <div className="signup__option-icon">
                <FaChalkboardTeacher />
              </div>
              <p className="signup__option-text">I want to teach</p>
              <div className="signup__option-content">
                {formData.accountType === "teach" && (
                  <div className="signup__check-circle">
                    <FaCheck className="signup__check-icon" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="signup__form">
          <div className="signup__form-row">
            <div className="signup__input-container">
              <div className="signup__input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className={`signup__input ${
                  errors.firstName ? "signup__input--error" : ""
                }`}
                required
              />
              {errors.firstName && (
                <p className="signup__error">{errors.firstName}</p>
              )}
            </div>

            <div className="signup__input-container">
              <div className="signup__input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className={`signup__input ${
                  errors.lastName ? "signup__input--error" : ""
                }`}
                required
              />
              {errors.lastName && (
                <p className="signup__error">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="signup__input-container">
            <div className="signup__input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email Address"
              className={`signup__input ${
                errors.email ? "signup__input--error" : ""
              }`}
              required
            />
            {errors.email && <p className="signup__error">{errors.email}</p>}
          </div>

          <div className="signup__phone-container">
            <div className="signup__phone-wrapper">
              <div className="signup__input-icon">
                <FaMobile />
              </div>
              <select
                value={formData.countryCode}
                onChange={handleCountryCodeChange}
                className="signup__country-code"
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
                placeholder="00000 00000"
                className={`signup__phone-input ${
                  errors.phone ? "signup__input--error" : ""
                }`}
                required
                pattern="[0-9]*"
              />
            </div>
            {errors.phone && <p className="signup__error">{errors.phone}</p>}
          </div>

          <div className="signup__terms">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="signup__checkbox"
            />
            <label htmlFor="agreeToTerms" className="signup__terms-label">
              By sign up you agree to our{" "}
              <Link to="/terms" className="signup__terms-link">
                Terms & Conditions
              </Link>
            </label>
            {errors.agreeToTerms && (
              <p className="signup__error">{errors.agreeToTerms}</p>
            )}
          </div>

          <button type="submit" className="signup__button">
            Create Your Account
          </button>

          <p className="signup__login-link">
            Do you have an account?{" "}
            <Link to="/auth" className="signup__link">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
