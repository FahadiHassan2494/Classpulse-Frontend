import React, { useState, useEffect } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ViewCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchCoordinators = async () => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get("https://localhost:7145/Admin/ViewAllCoordinators", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("ViewAllCoordinators API response:", response.data);
        // Ensure coordinators have required fields
        const validCoordinators = response.data.filter(coord => {
          if (!coord.coordinatorId) {
            console.warn("Coordinator missing coordinatorId:", coord);
            return false;
          }
          return true;
        });
        setCoordinators(validCoordinators);
      } catch (err) {
        console.error("Fetch coordinators error:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch coordinators."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinators();
  }, [navigate, token]);

  const handleEdit = (coordinator) => {
    console.log("Editing coordinator:", coordinator);
    navigate("/admin/add-coordinator", { state: { coordinator, isEdit: true } });
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this coordinator?")) {
      return;
    }

    try {
      await axios.delete(`https://localhost:7145/Admin/DeleteCoordinator/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove deleted coordinator from state
      setCoordinators(coordinators.filter(coord => coord.coordinatorId !== id));
      console.log(`Coordinator deleted: ${id}`);
    } catch (err) {
      console.error("Delete coordinator error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete coordinator."
      );
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-dark">Manage Coordinators</h2>
          
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <p>Loading...</p>
        ) : coordinators.length === 0 ? (
          <Alert variant="info">No coordinators found.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>CNIC</th>
                <th>Personal Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coordinators.map((coord) => (
                <tr key={coord.coordinatorId}>
                  <td>{coord.firstName || "N/A"}</td>
                  <td>{coord.lastName || "N/A"}</td>
                  <td>{coord.cnic || "N/A"}</td>
                  <td>{coord.personalNumber || "N/A"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(coord)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(coord.coordinatorId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ViewCoordinators;