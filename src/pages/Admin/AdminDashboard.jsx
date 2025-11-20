import "../../components/AdminSidebar/AdminSidebar.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { PeopleFill, Building } from "react-bootstrap-icons";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [departments, setDepartments] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingCoordinators, setLoadingCoordinators] = useState(false);
  const [errorDepartments, setErrorDepartments] = useState(null);
  const [errorCoordinators, setErrorCoordinators] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      setErrorDepartments(null);
      try {
        const response = await axios.get("https://localhost:7145/Admin/ViewDepartments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (err) {
        setErrorDepartments(
          err.response?.data?.message || err.message || "Failed to load departments."
        );
      } finally {
        setLoadingDepartments(false);
      }
    };

    const fetchCoordinators = async () => {
      setLoadingCoordinators(true);
      setErrorCoordinators(null);
      try {
        const response = await axios.get("https://localhost:7145/Admin/ViewAllCoordinators", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoordinators(response.data);
      } catch (err) {
        setErrorCoordinators(
          err.response?.data?.message || err.message || "Failed to load coordinators."
        );
      } finally {
        setLoadingCoordinators(false);
      }
    };

    fetchDepartments();
    fetchCoordinators();
  }, [navigate, token]);

  return (
    <div className="d-flex">
      <div
        className="p-5 w-100"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        <h2 className="mb-5" style={{ color: "#343a40", fontWeight: "700" }}>
          Welcome Admin
        </h2>
        <p className="mb-5 text-secondary" style={{ fontSize: "1.1rem" }}>
          Select an option from the sidebar to manage departments, coordinators, and users.
        </p>

        <Row className="g-5">
          {/* Department Card */}
          <Col xs={12} md={6}>
            <Card
              className="h-100 shadow-sm"
              style={{ borderRadius: "12px", cursor: "pointer", minHeight: "320px" }}
              onClick={() => navigate("/admin/view-departments")}
            >
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-4">
                  <Building size={50} color="#0d6efd" className="me-3" />
                  <div>
                    <Card.Title className="mb-0" style={{ fontWeight: "700", fontSize: "1.6rem", color: "#0d6efd" }}>
                      Departments
                    </Card.Title>
                    <small className="text-muted" style={{ fontSize: "1rem" }}>{departments.length} total</small>
                  </div>
                </div>

                {loadingDepartments ? (
                  <div className="d-flex justify-content-center my-4">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : errorDepartments ? (
                  <Alert variant="danger" className="py-2">
                    {errorDepartments}
                  </Alert>
                ) : departments.length === 0 ? (
                  <p className="text-muted flex-grow-1">No departments found.</p>
                ) : (
                  <ul className="list-unstyled flex-grow-1 mb-4" style={{ maxHeight: "140px", overflowY: "auto", fontSize: "1.1rem" }}>
                    {departments.slice(0, 3).map((dept) => (
                      <li key={dept.departmentId} className="mb-2">
                        {dept.departmentName}
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  variant="primary"
                  className="mt-auto align-self-start px-4 py-2"
                  onClick={() => navigate("/admin/view-departments")}
                  disabled={loadingDepartments}
                >
                  View Departments
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Coordinator Card */}
          <Col xs={12} md={6}>
            <Card
              className="h-100 shadow-sm"
              style={{ borderRadius: "12px", cursor: "pointer", minHeight: "320px" }}
              onClick={() => navigate("/admin/view-coordinator")}
            >
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-4">
                  <PeopleFill size={50} color="#198754" className="me-3" />
                  <div>
                    <Card.Title className="mb-0" style={{ fontWeight: "700", fontSize: "1.6rem", color: "#198754" }}>
                      Coordinators
                    </Card.Title>
                    <small className="text-muted" style={{ fontSize: "1rem" }}>{coordinators.length} total</small>
                  </div>
                </div>

                {loadingCoordinators ? (
                  <div className="d-flex justify-content-center my-4">
                    <Spinner animation="border" variant="success" />
                  </div>
                ) : errorCoordinators ? (
                  <Alert variant="danger" className="py-2">
                    {errorCoordinators}
                  </Alert>
                ) : coordinators.length === 0 ? (
                  <p className="text-muted flex-grow-1">No coordinators found.</p>
                ) : (
                  <ul className="list-unstyled flex-grow-1 mb-4" style={{ maxHeight: "140px", overflowY: "auto", fontSize: "1.1rem" }}>
                    {coordinators.slice(0, 3).map((coord) => (
                      <li key={coord.coordinatorId} className="mb-2">
                        {coord.firstName} {coord.lastName}
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  variant="success"
                  className="mt-auto align-self-start px-4 py-2"
                  onClick={() => navigate("/admin/view-coordinator")}
                  disabled={loadingCoordinators}
                >
                  View Coordinators
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
