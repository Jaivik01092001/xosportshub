import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../../styles/OtpVerification.css";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");

  // Get phone number from location state or use default
  const phoneNumber = location.state?.phoneNumber || "+1 (000) 000-0000";

  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Clear any previous errors
    if (error) setError("");

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }

    // Handle left arrow key
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Handle right arrow key
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleResend = () => {
    // Reset OTP fields
    setOtp(["", "", "", "", "", ""]);
    setError("");

    // Focus first input
    inputRefs.current[0].focus();

    // Here you would typically call an API to resend the OTP
    console.log("Resending OTP...");
  };

  const handleVerify = () => {
    // Check if all OTP fields are filled
    if (otp.some((digit) => digit === "")) {
      setError("Please enter the complete OTP");
      return;
    }

    const otpString = otp.join("");

    // Here you would typically call an API to verify the OTP
    console.log("Verifying OTP:", otpString);

    // For demo purposes, let's assume 123456 is the correct OTP
    if (otpString === "123456") {
      // Navigate to the appropriate page after successful verification
      navigate("/buyer/dashboard");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="otp-page otp-container">
      <div className="otp-form-container">
        <h1 className="otp-title">OTP Verification</h1>

        <p className="otp-instruction">Enter The OTP Sent To {phoneNumber}</p>

        <div className="otp-input-group">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : null}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-input"
              aria-label={`Digit ${index + 1} of OTP`}
            />
          ))}
        </div>

        {error && <p className="otp-error">{error}</p>}

        <div className="otp-resend">
          <span>Didn't Received OTP? </span>
          <button onClick={handleResend} className="resend-button">
            Resend
          </button>
        </div>

        <button onClick={handleVerify} className="verify-button">
          Verify
        </button>

        <div className="back-to-signin">
          <Link to="/auth">Back To Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
