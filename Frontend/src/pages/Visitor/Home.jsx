import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
import herosideimg from "../../assets/images/herosideimg.svg";
import ourmissionimage from "../../assets/images/ourmissionimage.svg";
import verticallineimg from "../../assets/images/verticallineimg.svg";
// Components
import SportsCard from "../../components/common/SportsCard";
import StrategyCard from "../../components/common/StrategyCard";

// Icons
import { IoMdArrowForward, IoMdArrowBack } from "react-icons/io";
import { TbLockDollar } from "react-icons/tb";
import { TbPencilDollar } from "react-icons/tb";
import { GoShieldCheck } from "react-icons/go";
import { LiaHandHoldingUsdSolid } from "react-icons/lia";
import { BsDatabaseLock } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { FaRegHandshake } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";



// Data
import { sportsData } from "../../data/sportsData";
import { strategyData } from "../../data/strategyData";

const Home = () => {
  const sportsContainerRef = useRef(null);

  const scrollLeft = () => {
    if (sportsContainerRef.current) {
      sportsContainerRef.current.scrollBy({ left: -800, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sportsContainerRef.current) {
      sportsContainerRef.current.scrollBy({ left: 800, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Digital Sports Playbook Strategy Marketplace</h1>
            <p className="hero-tagline">
            "Elevate Your Game - A Digital Exchange of Sports Strategies"
            </p>
            <div className="hero-description">
              <p>Discover, Buy, and Sell Winning Sports Strategies.</p>
              <p>
                Join a secure, innovative marketplace dedicated to premium
                sports tactics, playbooks, videos, and more.
              </p>
            </div>
            <Link to="/auth" className="btn btn-primary btn-lg">
              Start Trading Strategies Today
            </Link>
          </div>
          <div className="hero-background">
            <img src={herosideimg} alt="Sports Equipment" />
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="sports-section">
        <div className="sports-container">
          <div className="sports-header">
            <h2 className="sports-title">Sports</h2>
            <Link to="/" className="sports-view-all">
              See All Sports
            </Link>
          </div>
          <div className="sports-cards-wrapper">
            <div className="sports-cards-container" ref={sportsContainerRef}>
              {sportsData.map((sport) => (
                <SportsCard
                  key={sport.id}
                  image={sport.image}
                  name={sport.name}
                />
              ))}
            </div>
          </div>
          <div className="navigation-arrows">
            <button className="scroll-arrow" onClick={scrollLeft}>
              <IoMdArrowBack />
            </button>
            <button className="scroll-arrow" onClick={scrollRight}>
              <IoMdArrowForward />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Strategic Content Section */}
      <section className="featured-section">
        <div className="featured-container">
          <div className="featured-header">
            <h2 className="featured-title">Featured Sports Strategies</h2>
            <Link to="/" className="featured-view-all">
              Learn More Contents
            </Link>
          </div>
          <div className="featured-grid">
            {strategyData.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                image={strategy.image}
                title={strategy.title}
                coach={strategy.coach}
                price={strategy.price}
                hasVideo={strategy.hasVideo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-image">
            <img src={ourmissionimage} alt="Coaching Session" />
          </div>
          <div className="mission-content">
            <h2 className="mission-title">Our Mission</h2>

            <p className="mission-description">
              Build a digital marketplace where sports professionals, coaches,
              and enthusiasts can exchange strategic content—videos, PDFs,
              playbooks, and custom requests.
            </p>
            <Link to="/info" className="btn btn-outline py-15 ">
              Start Trading Strategies Today
            </Link>
          </div>
        </div>
      </section>

      {/* What We Offer + Why Join Our Marketplace Section */}
      <section className="offer-join-section">
        <div className="offer-join-container">
          <div className="offer-column">
            <h2 className="offer-title">What We Offer</h2>
            <ul className="offer-list">
              <li className="offer-item">
                <div className="icon-container">
                  <TbLockDollar className="offer-icon" />
                </div>
                <div className="offer-text">
                  <h3>Fixed-price listings and bidding options
                  for Exclusive Sports Digital Content</h3>
                </div>
              </li>
              <li className="offer-item">
                <div className="icon-container">
                  <TbPencilDollar className="offer-icon" />
                </div>
                <div className="offer-text">
                  <h3>Buyer requests for Tailored Playbook, Opponent Scouting Reports, meal plans or wellness guides, etc.</h3>
                </div>
              </li>
              <li className="offer-item">
                <div className="icon-container">
                  <GoShieldCheck className="offer-icon" />
                </div>
                <div className="offer-text">
                  <h3>Secure, Cloud-Based Hosting</h3>
                </div>
              </li>
              <li className="offer-item">
                <div className="icon-container">
                  <LiaHandHoldingUsdSolid className="offer-icon" />
                </div>
                <div className="offer-text">
                  <h3>Transparent Commission-Based Payments For Creators And The Platform</h3>
                </div>
              </li>
              <li className="offer-item">
                <div className="icon-container">
                  <BsDatabaseLock className="offer-icon" />
                </div>
                <div className="offer-text">
                  <h3>Focus On Seller Credibility, Data Security, And High-Quality Content</h3>
                </div>
              </li>
            </ul>
          </div>
          <div className="vertical-line">
            <img src={verticallineimg} alt="verticallineimg" />
          </div>
          <div className="join-column">
            <h2 className="join-title">Why Join Our Marketplace?</h2>
            <ul className="join-list">
              <li className="join-item">
                <div className="icon-container">
                  <GiTeacher className="join-icon" />
                </div>
                <div className="join-text">
                  <h3>Access Expert Strategies</h3>
                  <p>Explore And Purchase Strategies Curated By Top Sports Minds</p>
                </div>
              </li>
              <li className="join-item">
                <div className="icon-container">
                  <GrTransaction className="join-icon" />
                </div>
                <div className="join-text">
                  <h3>Flexible Transactions</h3>
                  <p>Choose Between Fixed Prices Or Competitive Bidding, With Options For Custom Content Requests</p>
                </div>
              </li>
              <li className="join-item">
                <div className="icon-container">
                  <MdSecurity className="join-icon" />
                </div>
                <div className="join-text">
                  <h3>Secure & Protected</h3>
                  <p>Scalable Cloud Hosting And Verified Sellers Ensure Safety And Trust</p>
                </div>
              </li>
              <li className="join-item">
                <div className="icon-container">
                  <FaRegHandshake className="join-icon" />
                </div>
                <div className="join-text">
                  <h3>Fair & Transparent</h3>
                  <p>Clear Fee Structures And Secure Payment Processing Support A Trustworthy Environment</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ready to Elevate Your Game? Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Elevate Your Game?</h2>
          <p className="cta-description">
            Join our platform now and start trading or requesting winning sports
            strategies!
          </p>
          <Link to="/auth" className="btn btn-primary">
            Join The Strategy Exchange
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
