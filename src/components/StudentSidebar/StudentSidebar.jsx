import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const StudentSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  // This function opens sidebar if closed, then lets the link work normally
  const handleLinkClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
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
      <button
        className="btn btn-primary w-100 my-3"
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          navigate("/student");
        }}
      >
        <i className="bi bi-house-door"></i> {isOpen && " Dashboard"}
      </button>

      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link
            to="/student/courses"
            className="nav-link text-white"
            onClick={handleLinkClick}
          >
            <i className="bi bi-book"></i> {isOpen && " Courses"}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/student/teachers"
            className="nav-link text-white"
            onClick={handleLinkClick}
          >
            <i className="bi bi-people"></i> {isOpen && " Teachers "}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/instructor/reports"
            className="nav-link text-white"
            onClick={handleLinkClick}
          >
            <i className="bi bi-bar-chart"></i> {isOpen && " Reports & Analytics"}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/student/change-password"
            className="nav-link"
            onClick={handleLinkClick}
          >
            <i className="bi bi-key-fill"></i> {isOpen && " Change Password"}
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

export default StudentSidebar;
