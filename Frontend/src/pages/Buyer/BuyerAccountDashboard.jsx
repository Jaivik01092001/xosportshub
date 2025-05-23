import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectMyDownloads,
  selectMyRequests,
  selectMyBids
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
        <div className="BuyerAccountDashboard__stats">
          <div className="BuyerAccountDashboard__stat-card downloads">
            <div className="BuyerAccountDashboard__stat-number">
              {downloads.length.toString().padStart(2, '0')}
            </div>
            <div className="BuyerAccountDashboard__stat-label">
              Total Downloads
            </div>
          </div>

          <div className="BuyerAccountDashboard__stat-card requests">
            <div className="BuyerAccountDashboard__stat-number">
              {requests.length.toString().padStart(2, '0')}
            </div>
            <div className="BuyerAccountDashboard__stat-label">
              Total Requests
            </div>
          </div>

          <div className="BuyerAccountDashboard__stat-card bids">
            <div className="BuyerAccountDashboard__stat-number">
              {bids.length.toString().padStart(2, '0')}
            </div>
            <div className="BuyerAccountDashboard__stat-label">
              Total Bids
            </div>
          </div>
        </div>

        {/* My Downloads Section */}
        <div className="BuyerAccountDashboard__section">
          <div className="BuyerAccountDashboard__section-header">
            <h3 className="BuyerAccountDashboard__section-title">My Downloads</h3>
            <Link to="/buyer/account/downloads" className="BuyerAccountDashboard__view-all">
              View All Downloads
            </Link>
          </div>

          <div className="BuyerAccountDashboard__table">
            <div className="BuyerAccountDashboard__table-header">
              <div className="BuyerAccountDashboard__table-cell no">No.</div>
              <div className="BuyerAccountDashboard__table-cell order-id">Order Id</div>
              <div className="BuyerAccountDashboard__table-cell video">Videos/Documents</div>
              <div className="BuyerAccountDashboard__table-cell date">Date</div>
              <div className="BuyerAccountDashboard__table-cell amount">Amount</div>
              <div className="BuyerAccountDashboard__table-cell status">Status</div>
              <div className="BuyerAccountDashboard__table-cell action">Action</div>
            </div>

            {downloads.slice(0, 2).map((download, index) => (
              <div className="BuyerAccountDashboard__table-row" key={download.id}>
                <div className="BuyerAccountDashboard__table-cell no">{index + 1}</div>
                <div className="BuyerAccountDashboard__table-cell order-id">#{download.id}</div>
                <div className="BuyerAccountDashboard__table-cell video">
                  <div className="BuyerAccountDashboard__content-item">
                    <div className="BuyerAccountDashboard__content-image">
                      <img src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=300&h=200&auto=format&fit=crop" alt={download.title} />
                    </div>
                    <div className="BuyerAccountDashboard__content-info">
                      <div className="BuyerAccountDashboard__content-title">{download.title}</div>
                      <div className="BuyerAccountDashboard__content-coach">By {download.coach}</div>
                    </div>
                  </div>
                </div>
                <div className="BuyerAccountDashboard__table-cell date">{download.downloadDate} | 4:30PM</div>
                <div className="BuyerAccountDashboard__table-cell amount">${(Math.random() * 30 + 20).toFixed(2)}</div>
                <div className="BuyerAccountDashboard__table-cell status">
                  <span className="BuyerAccountDashboard__status-badge downloaded">Downloaded</span>
                </div>
                <div className="BuyerAccountDashboard__table-cell action">
                  <button className="BuyerAccountDashboard__action-btn">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Requests Section */}
        <div className="BuyerAccountDashboard__section">
          <div className="BuyerAccountDashboard__section-header">
            <h3 className="BuyerAccountDashboard__section-title">My Requests</h3>
            <Link to="/buyer/account/requests" className="BuyerAccountDashboard__view-all">
              View All Requests
            </Link>
          </div>

          <div className="BuyerAccountDashboard__table">
            <div className="BuyerAccountDashboard__table-header">
              <div className="BuyerAccountDashboard__table-cell no">No.</div>
              <div className="BuyerAccountDashboard__table-cell order-id">Order Id</div>
              <div className="BuyerAccountDashboard__table-cell video">Videos/Documents</div>
              <div className="BuyerAccountDashboard__table-cell date">Date</div>
              <div className="BuyerAccountDashboard__table-cell amount">Requested Amount</div>
              <div className="BuyerAccountDashboard__table-cell status">Status</div>
              <div className="BuyerAccountDashboard__table-cell action">Action</div>
            </div>

            {requests.slice(0, 2).map((request, index) => (
              <div className="BuyerAccountDashboard__table-row" key={request.id}>
                <div className="BuyerAccountDashboard__table-cell no">{index + 1}</div>
                <div className="BuyerAccountDashboard__table-cell order-id">#{request.id}</div>
                <div className="BuyerAccountDashboard__table-cell video">
                  <div className="BuyerAccountDashboard__content-item">
                    <div className="BuyerAccountDashboard__content-image">
                      <img src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=300&h=200&auto=format&fit=crop" alt={request.title} />
                    </div>
                    <div className="BuyerAccountDashboard__content-info">
                      <div className="BuyerAccountDashboard__content-title">{request.title}</div>
                      <div className="BuyerAccountDashboard__content-coach">By Coach</div>
                    </div>
                  </div>
                </div>
                <div className="BuyerAccountDashboard__table-cell date">{request.date} | 4:30PM</div>
                <div className="BuyerAccountDashboard__table-cell amount">${(Math.random() * 30 + 20).toFixed(2)}</div>
                <div className="BuyerAccountDashboard__table-cell status">
                  <span className={`BuyerAccountDashboard__status-badge ${request.status}`}>{request.status}</span>
                </div>
                <div className="BuyerAccountDashboard__table-cell action">
                  <button className="BuyerAccountDashboard__action-btn">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Bids Section */}
        <div className="BuyerAccountDashboard__section">
          <div className="BuyerAccountDashboard__section-header">
            <h3 className="BuyerAccountDashboard__section-title">My Bids</h3>
            <Link to="/buyer/account/bids" className="BuyerAccountDashboard__view-all">
              View All Bids
            </Link>
          </div>

          <div className="BuyerAccountDashboard__table">
            <div className="BuyerAccountDashboard__table-header">
              <div className="BuyerAccountDashboard__table-cell no">No.</div>
              <div className="BuyerAccountDashboard__table-cell order-id">Bid Id</div>
              <div className="BuyerAccountDashboard__table-cell video">Videos/Documents</div>
              <div className="BuyerAccountDashboard__table-cell date">Date</div>
              <div className="BuyerAccountDashboard__table-cell amount">Bid Amount</div>
              <div className="BuyerAccountDashboard__table-cell status">Status</div>
              <div className="BuyerAccountDashboard__table-cell action">Action</div>
            </div>

            {bids.slice(0, 2).map((bid, index) => (
              <div className="BuyerAccountDashboard__table-row" key={bid.id}>
                <div className="BuyerAccountDashboard__table-cell no">{index + 1}</div>
                <div className="BuyerAccountDashboard__table-cell order-id">#{bid.id}</div>
                <div className="BuyerAccountDashboard__table-cell video">
                  <div className="BuyerAccountDashboard__content-item">
                    <div className="BuyerAccountDashboard__content-image">
                      <img src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=300&h=200&auto=format&fit=crop" alt={bid.title} />
                    </div>
                    <div className="BuyerAccountDashboard__content-info">
                      <div className="BuyerAccountDashboard__content-title">{bid.title}</div>
                      <div className="BuyerAccountDashboard__content-coach">By {bid.coach}</div>
                    </div>
                  </div>
                </div>
                <div className="BuyerAccountDashboard__table-cell date">{bid.date} | 4:30PM</div>
                <div className="BuyerAccountDashboard__table-cell amount">${bid.bidAmount.toFixed(2)}</div>
                <div className="BuyerAccountDashboard__table-cell status">
                  <span className={`BuyerAccountDashboard__status-badge ${bid.status}`}>{bid.status}</span>
                </div>
                <div className="BuyerAccountDashboard__table-cell action">
                  <button className="BuyerAccountDashboard__action-btn">
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
