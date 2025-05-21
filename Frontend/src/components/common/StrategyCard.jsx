import React from "react";
import { Link } from "react-router-dom";
import "../../styles/StrategyCard.css";
import { FaPlay } from "react-icons/fa";

const StrategyCard = ({ image, title, coach, price, hasVideo, id }) => {
  return (
    <div className="strategy-card-component strategy-card">
      <div className="strategy-card-image">
        <img src={image} alt={title} />
        {hasVideo && (
          <div className="video-icon">
            <FaPlay />
          </div>
        )}
      </div>
      <div className="strategy-card-content">
        <h3 className="strategy-card-title">{title}</h3>
        <p className="strategy-card-coach">By {coach}</p>
        <div className="strategy-card-footer">
          <span className="strategy-card-price">${price.toFixed(2)}</span>
          <Link to={`/strategy/${id}`} className="learn-more">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
