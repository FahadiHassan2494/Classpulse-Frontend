// Classroom.jsx
import React from "react";
import "./classroom.css";

export default function Classroom() {
  return (
    <div className="meeting-container d-flex">
      
      {/* Sidebar (User list) */}
      <div className="sidebar d-none d-md-flex flex-column p-3 shadow-sm">
        <h5 className="fw-bold mb-3">Participants</h5>

        <div className="participant-item d-flex align-items-center mb-2">
          <div className="circle me-2"></div>
          <span>Fahad Hassan</span>
        </div>

        <div className="participant-item d-flex align-items-center mb-2">
          <div className="circle me-2"></div>
          <span>John Doe</span>
        </div>

        <div className="participant-item d-flex align-items-center mb-2">
          <div className="circle me-2"></div>
          <span>Student A</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        
        {/* Top Bar */}
        <div className="top-bar shadow-sm px-3 py-2 d-flex justify-content-between align-items-center">
          <h5 className="fw-semibold m-0">Classroom Session</h5>
          <button className="btn btn-outline-danger btn-sm">End Session</button>
        </div>

        {/* Video Area */}
        <div className="video-area flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="video-box shadow-lg">
            <p className="text-center text-white mt-5">Live Video Stream</p>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="controls-bar d-flex justify-content-center gap-4 py-3">
          <button className="control-btn btn btn-light shadow-sm p-3 rounded-circle">
            🎤
          </button>
          <button className="control-btn btn btn-light shadow-sm p-3 rounded-circle">
            🎥
          </button>
          <button className="control-btn btn btn-light shadow-sm p-3 rounded-circle">
            👨‍🏫
          </button>
          <button className="control-btn btn btn-danger shadow-sm p-3 rounded-circle">
            📞
          </button>
        </div>
      </div>
    </div>
  );
}
