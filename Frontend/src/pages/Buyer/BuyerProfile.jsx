import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  selectProfile, 
  updateProfile, 
  updateProfileImage 
} from "../../redux/slices/buyerDashboardSlice";
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
      <h2 className="BuyerProfile__title">My Profile</h2>
      
      <div className="BuyerProfile__container">
        <div className="BuyerProfile__image-section">
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
        
        <div className="BuyerProfile__form-section">
          <form onSubmit={handleSubmit}>
            <div className="BuyerProfile__form-row">
              <div className="BuyerProfile__form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="BuyerProfile__form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="BuyerProfile__form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="BuyerProfile__form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="BuyerProfile__buttons">
              <button type="submit" className="BuyerProfile__save-btn">
                Update & Save
              </button>
              
              <button 
                type="button" 
                className="BuyerProfile__delete-btn"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfile;
