import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./CoordinatorSidebar.css";

const CoordinatorSidebar = ({ isOpen, setIsOpen, openSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState({
    instructors: false,
    students: false,
    courses: false,
    enrolled: false,
  });

  const navigate = useNavigate();

  const toggleDropdown = (key) => {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    setDropdownOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLinkClick = () => {
    if (!isOpen) setIsOpen(true);
  };

  
  const renderDropdownToggle = (label, key, iconClass) => (
    <button
      className={`dropdown-toggle ${dropdownOpen[key] ? "show" : ""}`}
      onClick={() => toggleDropdown(key)}
      type="button"
    >
      <i className={`bi ${iconClass}`}></i>
      {isOpen && (
        <>
          <span>{label}</span>
          {dropdownOpen[key] && <i className="bi bi-caret-up-fill ms-auto"></i>}
        </>
      )}
    </button>
  );

  return (
    <div className={`sidebar d-flex flex-column ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)} type="button">
        <i className="bi bi-list"></i>
      </button>

      <ul className="nav flex-column">

        {/* Dashboard */}
        <li className="nav-item">
          <Link
            to="/coordinator-dashboard"
            className="nav-link home-btn"
            onClick={handleLinkClick}
          >
            <i className="bi bi-house"></i> {isOpen && "Dashboard"}
          </Link>
        </li>

        {/* Dropdown Sections */}
        <li className="nav-item">
          {renderDropdownToggle("Manage Instructors", "instructors", "bi-person-badge")}
          <ul className={`dropdown-menu ${dropdownOpen.instructors && isOpen ? "show" : ""}`}>
            <li><Link to="/coordinator/view-instructors" className="dropdown-item" onClick={handleLinkClick}>View Instructors</Link></li>
            <li><Link to="/coordinator/register-instructor" className="dropdown-item" onClick={handleLinkClick}>Register Instructor</Link></li>
            <li><Link to="/coordinator/add-instructor" className="dropdown-item" onClick={handleLinkClick}>Add Instructor</Link></li>
          </ul>
        </li>

        <li className="nav-item">
          {renderDropdownToggle("Manage Students", "students", "bi-people")}
          <ul className={`dropdown-menu ${dropdownOpen.students && isOpen ? "show" : ""}`}>
            <li><Link to="/coordinator/view-students" className="dropdown-item" onClick={handleLinkClick}>View Students</Link></li>
            <li><Link to="/coordinator/register-student" className="dropdown-item" onClick={handleLinkClick}>Register Student</Link></li>
            <li><Link to="/coordinator/add-student" className="dropdown-item" onClick={handleLinkClick}>Add Student</Link></li>
            <li><Link to="/coordinator/promote-students" className="dropdown-item" onClick={handleLinkClick}>PromoteStudents</Link></li>
          </ul>
        </li>

        <li className="nav-item">
          {renderDropdownToggle("Manage Courses", "courses", "bi-book")}
          <ul className={`dropdown-menu ${dropdownOpen.courses && isOpen ? "show" : ""}`}>
            <li><Link to="/coordinator/add-course" className="dropdown-item" onClick={handleLinkClick}>Add Course</Link></li>
            <li><Link to="/coordinator/view-courses" className="dropdown-item" onClick={handleLinkClick}>View Courses</Link></li>
            <li><Link to="/coordinator/courses-assigned" className="dropdown-item" onClick={handleLinkClick}>Assign Course to Instructor</Link></li>
            <li><Link to="/coordinator/view-assigned-courses" className="dropdown-item" onClick={handleLinkClick}>View All Assigned Courses</Link></li>
          </ul>
        </li>

        <li className="nav-item">
          {renderDropdownToggle("Manage Enrolled Students", "enrolled", "bi-person-check")}
          <ul className={`dropdown-menu ${dropdownOpen.enrolled && isOpen ? "show" : ""}`}>
            <li><Link to="/coordinator/enroll-students" className="dropdown-item" onClick={handleLinkClick}>Enroll Students</Link></li>
            <li><Link to="/coordinator/view-enroll-students" className="dropdown-item" onClick={handleLinkClick}>View Enrolled Students</Link></li>
          </ul>
        </li>

        {/* Change Password */}
        <li className="nav-item">
          <Link to="/coordinator/change-password" className="nav-link" onClick={handleLinkClick}>
            <i className="bi bi-key-fill"></i> {isOpen && "Change Password"}
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
        <i className="bi bi-box-arrow-right"></i> {isOpen && "LogOut"}
      </button>
        
      
    </div>
  );
};

export default CoordinatorSidebar;
