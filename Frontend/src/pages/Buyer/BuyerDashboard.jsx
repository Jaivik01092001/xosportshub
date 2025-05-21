import React, { useState } from "react";
import "../../styles/BuyerDashboard.css";
import StrategyCard from "../../components/common/StrategyCard";
import { strategyData } from "../../data/strategyData";
import { IoMdSearch } from "react-icons/io";
import { LuFilter } from "react-icons/lu";

const BuyerDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSport, setSelectedSport] = useState("Baseball");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("high");

  // Filter options
  const relatedOptions = [
    { id: "fundamentals", label: "Fundamentals", checked: true },
    { id: "hitting", label: "Hitting", checked: false },
    { id: "pitching", label: "Pitching", checked: false },
    { id: "youth-baseball", label: "Youth Baseball", checked: false },
    { id: "mental-training", label: "Mental Training", checked: false },
    { id: "fielding", label: "Fielding", checked: false },
    { id: "strength-conditioning", label: "Strength & Conditioning", checked: false },
    { id: "drills", label: "Drills", checked: false },
    { id: "catching", label: "Catching", checked: false }
  ];

  // Price range state
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Filter checkboxes state
  const [checkedItems, setCheckedItems] = useState({
    fundamentals: true,
    hitting: false,
    pitching: false,
    "youth-baseball": false,
    "mental-training": false,
    fielding: false,
    "strength-conditioning": false,
    drills: false,
    catching: false
  });

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Clear all filters
  const clearFilters = () => {
    setCheckedItems({
      fundamentals: false,
      hitting: false,
      pitching: false,
      "youth-baseball": false,
      "mental-training": false,
      fielding: false,
      "strength-conditioning": false,
      drills: false,
      catching: false
    });
    setPriceRange([0, 1000]);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const totalPages = 20; // Mock total pages
    const items = [];

    // Previous button
    items.push(
      <button
        key="prev"
        className="buyer-dashboard__pagination-arrow"
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    );

    // Page numbers
    for (let i = 1; i <= 7; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        items.push(
          <button
            key={i}
            className={`buyer-dashboard__pagination-item ${currentPage === i ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        items.push(<span key={`ellipsis-${i}`} className="buyer-dashboard__pagination-ellipsis">...</span>);
      }
    }

    // Next button
    items.push(
      <button
        key="next"
        className="buyer-dashboard__pagination-arrow"
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    );

    return items;
  };

  return (
    <div className="buyer-dashboard">
      <div className="buyer-dashboard__container">
        {/* Filter Section */}
        <div className="buyer-dashboard__filter-section">
          <div className="buyer-dashboard__filter-header">
            <h3>Filter By</h3>
            <button className="buyer-dashboard__clear-all" onClick={clearFilters}>Clear All</button>
          </div>

          {/* Sport Filter */}
          <div className="buyer-dashboard__filter-group">
            <h4>Sport</h4>
            <div className="buyer-dashboard__sport-select-wrapper">
              <select
                className="buyer-dashboard__sport-select"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                <option value="Baseball">Baseball</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">Football</option>
                <option value="Soccer">Soccer</option>
                <option value="Swimming">Swimming</option>
              </select>
            </div>
          </div>

          {/* Related Filters */}
          <div className="buyer-dashboard__filter-group">
            <h4>Related</h4>
            <div className="buyer-dashboard__checkbox-group">
              {relatedOptions.map((option) => (
                <div className="buyer-dashboard__checkbox-item" key={option.id}>
                  <input
                    type="checkbox"
                    id={option.id}
                    name={option.id}
                    checked={checkedItems[option.id]}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={option.id}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="buyer-dashboard__filter-group">
            <h4>Price</h4>
            <div className="buyer-dashboard__price-range">
              <div
                className="buyer-dashboard__price-slider-container"
                style={{
                  '--min-value': priceRange[0],
                  '--max-value': priceRange[1]
                }}
              >
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin < priceRange[1] - 10) {
                      setPriceRange([newMin, priceRange[1]]);
                    }
                  }}
                  className="buyer-dashboard__price-slider buyer-dashboard__min-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax > priceRange[0] + 10) {
                      setPriceRange([priceRange[0], newMax]);
                    }
                  }}
                  className="buyer-dashboard__price-slider buyer-dashboard__max-slider"
                />
              </div>
              <div className="buyer-dashboard__price-labels">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="buyer-dashboard__content-section">
          <div className="buyer-dashboard__content-header">
            <h2 className="buyer-dashboard__content-title">Featured Strategic Content <span>(48 Contents Found)</span></h2>

            <div className="buyer-dashboard__search-sort">
              <div className="buyer-dashboard__search-container">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="buyer-dashboard__search-input"
                />
                <button className="buyer-dashboard__search-button">
                  <IoMdSearch />
                </button>
              </div>

              <div className="buyer-dashboard__sort-container">
                <label htmlFor="sort"><LuFilter /></label>
                <select
                  id="sort"
                  className="buyer-dashboard__sort-select"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="high">Price high to low</option>
                  <option value="low">Price low to high</option>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
          </div>

          {/* Strategy Cards Grid */}
          <div className="buyer-dashboard__strategy-grid">
            {strategyData.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                id={strategy.id}
                image={strategy.image}
                title={strategy.title}
                coach={strategy.coach}
                price={strategy.price}
                hasVideo={strategy.hasVideo}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="buyer-dashboard__pagination">
            {renderPaginationItems()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;


