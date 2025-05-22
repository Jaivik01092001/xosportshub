import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth.css";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";

const Auth = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    countryCode: "+91",
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

  const handleCountryCodeChange = (e) => {
    setFormData({
      ...formData,
      countryCode: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

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

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Navigate to OTP verification page with phone number
    navigate("/otp-verification", {
      state: {
        phoneNumber: `${formData.countryCode} ${formData.phone}`,
      },
    });

    // Note: In a real application, you would:
    // 1. Call an API to send the OTP to the user's phone
    // 2. Store necessary information in state/context/redux
    // 3. Then navigate to the OTP verification page
  };

  return (
    <div className="auth-page auth-container">
      <div className="auth-form-container">
        <h1 className="auth-title">Login in to your account</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-input form-input-container email-input-container">
            <div className="email-icon">
              <CiMail />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email Address"
              className={`form-input email-input ${
                errors.email ? "input-error" : ""
              }`}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="auth-form-input form-input-container">
            <div className="phone-input-wrapper">
              <div>
                <div className="country-code-select">
                  <IoPhonePortraitOutline />
                  <select
                    value={formData.countryCode}
                    onChange={handleCountryCodeChange}
                    className="selectstylesnone"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
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

          <button type="submit" className="signin-button">
            Sign In
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
