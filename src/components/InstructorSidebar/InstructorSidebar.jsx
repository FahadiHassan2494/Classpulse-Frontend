import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const InstructorSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  // 🔥 Start Session handler
  const startSession = () => {
    // Generate a simple session ID
    const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Redirect instructor to classroom
    navigate(`/classroom?room=${sessionId}`);

    // Copy join link for students
    const joinLink = `${window.location.origin}/join/${sessionId}`;
    navigator.clipboard.writeText(joinLink);
    alert(`Session started!\nStudent join link copied to clipboard:\n${joinLink}`);
  };

  return (
    <div
      className={`sidebar d-flex flex-column text-white vh-100 ${isOpen ? "open" : "closed"}`}
      style={{ backgroundColor: "#152c44" }}
    >
      <div className="toggle-container">
        <button className="btn btn-outline-light toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? "bi bi-chevron-left" : "bi bi-list"}></i>
        </button>
      </div>

      {/* Dashboard */}
      <button
        className="btn btn-primary w-100 my-3"
        onClick={() => navigate("/instructor")}
      >
        <i className="bi bi-house-door"></i> {isOpen && " Dashboard"}
      </button>

      {/* 🔥 Start Session */}
      <button
        className="btn btn-primary w-100 my-3"
        onClick={startSession}
      >
        <i className="bi bi-camera-video"></i> {isOpen && " Start Session"}
      </button>

      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link to="/instructor/teacher-courses" className="nav-link text-white">
            <i className="bi bi-book"></i> {isOpen && " Courses"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/instructor/students" className="nav-link text-white">
            <i className="bi bi-people"></i> {isOpen && " Students"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/instructor/reports" className="nav-link text-white">
            <i className="bi bi-bar-chart"></i> {isOpen && " Reports & Analytics"}
          </Link>
        </li>
      </ul>

      <button
        className="logout-btn"
        onClick={() => {
          sessionStorage.clear();
          navigate("/");
        }}
      >
        <i className="bi bi-box-arrow-right"></i> {isOpen && " Logout"}
      </button>
    </div>
  );
};

export default InstructorSidebar;
