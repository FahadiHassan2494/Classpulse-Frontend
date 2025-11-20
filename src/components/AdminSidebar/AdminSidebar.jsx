
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AdminSidebar.css";

const AdminSidebar = ({ isOpen, setIsOpen, openSidebar }) => {
  const navigate = useNavigate();

  return (
    <div className={`sidebar d-flex flex-column text-white vh-100 ${isOpen ? "open" : "closed"}`} style={{ backgroundColor: "#152c44" }}>
      {/* Toggle Button */}
      <div className="toggle-container">
        <button className="btn btn-outline-light toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? "bi bi-chevron-left" : "bi bi-list"}></i>
        </button>
      </div>

      <button
  className="btn w-100 my-3"
  style={{ backgroundColor: '#1A314A', color: 'white', border: 'none' }}
        onClick={() => {
          openSidebar();
          navigate("/admin");
        }}
      >
        <i className="bi bi-house-door"></i> {isOpen && " "}
      </button>

      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link to="/admin/create-department" className="nav-link text-white" onClick={openSidebar}>
            <i className="bi bi-building"></i> {isOpen && "Create Department"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/view-departments" className="nav-link text-white" onClick={openSidebar}>
            <i className="bi bi-person-plus-fill"></i> {isOpen && "View Departments"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/register-coordinator" className="nav-link text-white" onClick={openSidebar}>
            <i className="bi bi-person-plus-fill"></i> {isOpen && "Register Coordinator"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/view-coordinator" className="nav-link text-white" onClick={openSidebar}>
            <i className="bi bi-person-lines-fill"></i> {isOpen && "View Coordinators"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/add-coordinator" className="nav-link text-white" onClick={openSidebar}>
            <i className="bi bi-person-plus-fill"></i> {isOpen && "Add Coordinator"}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/change-password" className="nav-link text-white" onClick={openSidebar}>
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

export default AdminSidebar;