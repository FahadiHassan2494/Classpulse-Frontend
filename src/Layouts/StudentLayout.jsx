
import { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar/StudentSidebar";
import '../components/StudentSidebar/StudentSidebar.css';

const StudentLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const openSidebar = () => {
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <StudentSidebar isOpen={isOpen} setIsOpen={setIsOpen} openSidebar={openSidebar} />
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

export default StudentLayout;