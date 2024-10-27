import React from "react";
import "./DashboardLoader.css";

const DashboardLoader = () => {
  return (
    <div>
      <div className="loading-text">Loading your dashboard</div>

      <div className="dots-container">
        <div className="bounce-dot"></div>
        <div className="bounce-dot"></div>
        <div className="bounce-dot"></div>
      </div>
    </div>
  );
};

export default DashboardLoader;
