import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectMyDownloads,
  selectMyRequests,
  selectMyBids,
} from "../../redux/slices/buyerDashboardSlice";
import SectionWrapper from "../../components/common/SectionWrapper";
import { FaDownload, FaGavel, FaFileAlt, FaEye } from "react-icons/fa";
import "../../styles/BuyerAccountDashboard.css";

const BuyerAccountDashboard = () => {
  const downloads = useSelector(selectMyDownloads);
  const requests = useSelector(selectMyRequests);
  const bids = useSelector(selectMyBids);

  return (
    <div className="BuyerAccountDashboard">
      <SectionWrapper title="My Account Dashboard">
        {/* Stats Cards */}
        <div className="stats">
          <div className="stat-card downloads">
            <div className="stat-number">
              {downloads.length.toString().padStart(2, "0")}
            </div>
            <div className="stat-label">Total Downloads</div>
          </div>

          <div className="stat-card requests">
            <div className="stat-number">
              {requests.length.toString().padStart(2, "0")}
            </div>
            <div className="stat-label">Total Requests</div>
          </div>

          <div className="stat-card bids">
            <div className="stat-number">
              {bids.length.toString().padStart(2, "0")}
            </div>
            <div className="stat-label">Total Bids</div>
          </div>
        </div>

        {/* My Downloads Section */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">My Downloads</h3>
            <Link to="/buyer/account/downloads" className="view-all">
              View All Downloads
            </Link>
          </div>

          <div className="table">
            <div className="table-header">
              <div className="table-cell no">No.</div>
              <div className="table-cell order-id">Order Id</div>
              <div className="table-cell video">Videos/Documents</div>
              <div className="table-cell date">Date</div>
              <div className="table-cell amount">Amount</div>
              <div className="table-cell status">Status</div>
              <div className="table-cell action">Action</div>
            </div>

            {downloads.slice(0, 2).map((download, index) => (
              <div className="table-row" key={download.id}>
                <div className="table-cell no">{index + 1}</div>
                <div className="table-cell order-id">#{download.id}</div>
                <div className="table-cell video">
                  <div className="content-item">
                    <div className="content-image">
                      <img
                        src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=300&h=200&auto=format&fit=crop"
                        alt={download.title}
                      />
                    </div>
                    <div className="content-info">
                      <div className="content-title">{download.title}</div>
                      <div className="content-coach">By {download.coach}</div>
                    </div>
                  </div>
                </div>
                <div className="table-cell date">
                  {download.downloadDate} | 4:30PM
                </div>
                <div className="table-cell amount">
                  ${(Math.random() * 30 + 20).toFixed(2)}
                </div>
                <div className="table-cell status">
                  <span className="status-badge downloaded">Downloaded</span>
                </div>
                <div className="table-cell action">
                  <button className="action-btn">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Requests Section */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">My Requests</h3>
            <Link to="/buyer/account/requests" className="view-all">
              View All Requests
            </Link>
          </div>

          <div className="table">
            <div className="table-header">
              <div className="table-cell no">No.</div>
              <div className="table-cell order-id">Order Id</div>
              <div className="table-cell video">Videos/Documents</div>
              <div className="table-cell date">Date</div>
              <div className="table-cell amount">Requested Amount</div>
              <div className="table-cell status">Status</div>
              <div className="table-cell action">Action</div>
            </div>

            {requests.slice(0, 2).map((request, index) => (
              <div className="table-row" key={request.id}>
                <div className="table-cell no">{index + 1}</div>
                <div className="table-cell order-id">#{request.id}</div>
                <div className="table-cell video">
                  <div className="content-item">
                    <div className="content-image">
                      <img
                        src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=300&h=200&auto=format&fit=crop"
                        alt={request.title}
                      />
                    </div>
                    <div className="content-info">
                      <div className="content-title">{request.title}</div>
                      <div className="content-coach">By Coach</div>
                    </div>
                  </div>
                </div>
                <div className="table-cell date">{request.date} | 4:30PM</div>
                <div className="table-cell amount">
                  ${(Math.random() * 30 + 20).toFixed(2)}
                </div>
                <div className="table-cell status">
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <div className="table-cell action">
                  <button className="action-btn">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Bids Section */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">My Bids</h3>
            <Link to="/buyer/account/bids" className="view-all">
              View All Bids
            </Link>
          </div>

          <div className="table">
            <div className="table-header">
              <div className="table-cell no">No.</div>
              <div className="table-cell order-id">Bid Id</div>
              <div className="table-cell video">Videos/Documents</div>
              <div className="table-cell date">Date</div>
              <div className="table-cell amount">Bid Amount</div>
              <div className="table-cell status">Status</div>
              <div className="table-cell action">Action</div>
            </div>

            {bids.slice(0, 2).map((bid, index) => (
              <div className="table-row" key={bid.id}>
                <div className="table-cell no">{index + 1}</div>
                <div className="table-cell order-id">#{bid.id}</div>
                <div className="table-cell video">
                  <div className="content-item">
                    <div className="content-image">
                      <img
                        src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=300&h=200&auto=format&fit=crop"
                        alt={bid.title}
                      />
                    </div>
                    <div className="content-info">
                      <div className="content-title">{bid.title}</div>
                      <div className="content-coach">By {bid.coach}</div>
                    </div>
                  </div>
                </div>
                <div className="table-cell date">{bid.date} | 4:30PM</div>
                <div className="table-cell amount">
                  ${bid.bidAmount.toFixed(2)}
                </div>
                <div className="table-cell status">
                  <span className={`status-badge ${bid.status}`}>
                    {bid.status}
                  </span>
                </div>
                <div className="table-cell action">
                  <button className="action-btn">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default BuyerAccountDashboard;
