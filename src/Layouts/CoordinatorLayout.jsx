import { useState } from "react";
import { Outlet } from "react-router-dom";
import CoordinatorSidebar from "../components/CoordinatorSidebar/CoordinatorSidebar";
import '../components/CoordinatorSidebar/CoordinatorSidebar.css';


const CoordinatorLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  
  const openSidebar = () => {
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <CoordinatorSidebar isOpen={isOpen} setIsOpen={setIsOpen} openSidebar={openSidebar} />
     <main
  className="flex-grow-1 p-3"
  style={{
    backgroundColor: "#f8f9fa",
    marginLeft: isOpen ? "250px" : "70px", // Add margin equal to sidebar width
    minHeight: "100vh",
  }}
>
  <Outlet />
</main>
    </div>
  );
};

export default CoordinatorLayout;