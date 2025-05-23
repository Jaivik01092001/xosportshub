import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProfile,
  updateProfile,
  updateProfileImage
} from "../../redux/slices/buyerDashboardSlice";
import SectionWrapper from "../../components/common/SectionWrapper";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import "../../styles/BuyerProfile.css";

const BuyerProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  // Local state for form inputs
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    // Show success message or handle API call here
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateProfileImage(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    // Show confirmation dialog and handle account deletion
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Handle account deletion logic here
    }
  };

  return (
    <div className="BuyerProfile">
      <SectionWrapper title="My Profile">
        <div className="BuyerProfile__container">
          <div className="BuyerProfile__left-section">
            <div className="BuyerProfile__form-row">
              <div className="BuyerProfile__input-field">
                <div className="BuyerProfile__input-container">
                  <div className="BuyerProfile__input-icon">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                    className="BuyerProfile__input"
                  />
                </div>
              </div>

              <div className="BuyerProfile__input-field">
                <div className="BuyerProfile__input-container">
                  <div className="BuyerProfile__input-icon">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                    className="BuyerProfile__input"
                  />
                </div>
              </div>
            </div>

            <div className="BuyerProfile__input-field">
              <div className="BuyerProfile__input-container">
                <div className="BuyerProfile__input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                  className="BuyerProfile__input"
                />
              </div>
            </div>

            <div className="BuyerProfile__input-field">
              <div className="BuyerProfile__input-container">
                <div className="BuyerProfile__input-icon">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="BuyerProfile__input"
                />
              </div>
            </div>
          </div>

          <div className="BuyerProfile__right-section">
            <div className="BuyerProfile__image-container">
              <h3 className="BuyerProfile__image-title">Profile Image</h3>
              <div className="BuyerProfile__image">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" />
                ) : (
                  <div className="BuyerProfile__placeholder">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </div>
                )}
              </div>
              <button
                className="BuyerProfile__upload-btn"
                onClick={() => document.getElementById("profile-image-upload").click()}
              >
                Upload Photo
              </button>
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        <div className="BuyerProfile__buttons">
          <button
            type="button"
            className="BuyerProfile__delete-btn"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>

          <button
            type="button"
            className="BuyerProfile__save-btn"
            onClick={handleSubmit}
          >
            Update & Save
          </button>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default BuyerProfile;
