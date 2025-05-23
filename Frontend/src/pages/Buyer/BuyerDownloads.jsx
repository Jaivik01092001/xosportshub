import React from "react";
import { useSelector } from "react-redux";
import { selectMyDownloads } from "../../redux/slices/buyerDashboardSlice";
import SectionWrapper from "../../components/common/SectionWrapper";
import { FaDownload, FaFilePdf, FaVideo } from "react-icons/fa";
import "../../styles/BuyerDownloads.css";

const BuyerDownloads = () => {
  const downloads = useSelector(selectMyDownloads);

  // Function to get file type icon
  const getFileTypeIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf className="BuyerDownloads__file-icon BuyerDownloads__file-icon--pdf" />;
      case 'video':
        return <FaVideo className="BuyerDownloads__file-icon BuyerDownloads__file-icon--video" />;
      default:
        return <FaFilePdf className="BuyerDownloads__file-icon" />;
    }
  };

  return (
    <div className="BuyerDownloads">
      <SectionWrapper title="My Downloads">
        {downloads.length > 0 ? (
          <div className="BuyerDownloads__list">
            {downloads.map((download) => (
              <div className="BuyerDownloads__item" key={download.id}>
                <div className="BuyerDownloads__item-icon">
                  {getFileTypeIcon(download.fileType)}
                </div>
                <div className="BuyerDownloads__item-info">
                  <h3 className="BuyerDownloads__item-title">{download.title}</h3>
                  <p className="BuyerDownloads__item-coach">By {download.coach}</p>
                  <div className="BuyerDownloads__item-details">
                    <span className="BuyerDownloads__item-date">Downloaded: {download.downloadDate}</span>
                    <span className="BuyerDownloads__item-size">{download.fileSize}</span>
                  </div>
                </div>
                <button className="BuyerDownloads__download-btn">
                  <FaDownload /> Download
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="BuyerDownloads__empty">
            <p>You have no downloads yet.</p>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default BuyerDownloads;
