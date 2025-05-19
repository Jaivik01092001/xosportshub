import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";
import logo from "../../assets/images/XOsports-hub-logo.svg";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <img src={logo} alt="XO Sports Hub Logo" className="footer-logo" />
          <p className="footer-tagline">
          "Elevate Your Game - A Digital Exchange of Sports Strategies"
          </p>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: info@XOsportshub.com</p>
            <div className="icons">
              <FaEnvelope size={30} className="social-icon"/>
              <FaLinkedin size={30} className="social-icon"/>
              <RiInstagramFill size={30} className="social-icon"/>
              <FaXTwitter size={30} className="social-icon"/>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/become-instructor">Become Instructor</Link>
            </li>
            <li>
              <Link to="/terms">Terms & Rules</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div className="footer-sports">
          <h3>What Sport Do You Want To Learn?</h3>
          <div className="footer-sports-grid">
            <div className="footer-sports-column">
              <ul>
                <li>
                  <Link to="/">Archery</Link>
                </li>
                <li>
                  <Link to="/">Aussie Football</Link>
                </li>
                <li>
                  <Link to="/">Badminton</Link>
                </li>
                <li>
                  <Link to="/">Baseball</Link>
                </li>
                <li>
                  <Link to="/">Basketball</Link>
                </li>
                <li>
                  <Link to="/">Cricket</Link>
                </li>
                <li>
                  <Link to="/">Extreme Sports</Link>
                </li>
                <li>
                  <Link to="/">Fencing</Link>
                </li>
                <li>
                  <Link to="/">Football</Link>
                </li>
              </ul>
            </div>
            <div className="footer-sports-column">
              <ul>
                <li>
                  <Link to="/">Gymnastics</Link>
                </li>
                <li>
                  <Link to="/">Health & Fitness</Link>
                </li>
                <li>
                  <Link to="/">Hockey</Link>
                </li>
                <li>
                  <Link to="/">Mental Training</Link>
                </li>
                <li>
                  <Link to="/">Racquetball</Link>
                </li>
                <li>
                  <Link to="/">Recreational</Link>
                </li>
                <li>
                  <Link to="/">Rugby</Link>
                </li>
                <li>
                  <Link to="/">Running</Link>
                </li>
                <li>
                  <Link to="/">Skating</Link>
                </li>
              </ul>
            </div>
            <div className="footer-sports-column">
              <ul>
                <li>
                  <Link to="/">Skiing</Link>
                </li>
                <li>
                  <Link to="/">Snowboarding</Link>
                </li>
                <li>
                  <Link to="/">Soccer</Link>
                </li>
                <li>
                  <Link to="/">Squash</Link>
                </li>
                <li>
                  <Link to="/">Swimming</Link>
                </li>
                <li>
                  <Link to="/">Ultimate Frisbee</Link>
                </li>
                <li>
                  <Link to="/">Yoga</Link>
                </li>
                <li>
                  <Link to="/">Youth coaching</Link>
                </li>
                <li>
                  <Link to="/">All sports</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Sports Playbook Strategy
          Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
