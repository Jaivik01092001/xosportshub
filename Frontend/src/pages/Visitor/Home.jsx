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
            <h1 className="hero-title">Sports Playbook Strategy Marketplace</h1>
            <p className="hero-tagline">
              "How To Win Games" – A Digital Sports Strategy Exchange
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
            <h2 className="featured-title">Featured Strategic Content</h2>
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
              <li>Expert-created training content across multiple sports</li>
              <li>High-quality videos, PDFs, and interactive materials</li>
              <li>Content for all skill levels from beginner to advanced</li>
              <li>Personalized coaching and custom content requests</li>
              <li>Secure platform with verified coaches and sellers</li>
            </ul>
          </div>
          <div className="vertical-line">
            <img src={verticallineimg} alt="verticallineimg" />
          </div>
          <div className="join-column">
            <h2 className="join-title">Why Join Our Marketplace?</h2>
            <ul className="join-list">
              <li>Access to exclusive content from professional coaches</li>
              <li>Learn at your own pace with on-demand content</li>
              <li>Affordable alternatives to in-person coaching</li>
              <li>Connect with a community of athletes and coaches</li>
              <li>Continuous updates with new content added regularly</li>
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
