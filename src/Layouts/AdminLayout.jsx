// AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import '../components/AdminSidebar/AdminSidebar.css';

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const openSidebar = () => {
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} openSidebar={openSidebar} />
      <main
        className="flex-grow-1 p-3"
        style={{
          backgroundColor: "#f8f9fa",
          marginLeft: isOpen ? "250px" : "70px",
          transition: "margin-left 0.3s ease-in-out"
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;