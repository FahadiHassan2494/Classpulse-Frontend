// InstructorLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import InstructorSidebar from "../components/InstructorSidebar/InstructorSidebar";
import '../components/InstructorSidebar/InstructorSidebar.css';

const InstructorLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <InstructorSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main
        className="flex-grow-1 p-3"
        style={{
          backgroundColor: "#f8f9fa",
          marginLeft: isOpen ? "250px" : "70px",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorLayout;