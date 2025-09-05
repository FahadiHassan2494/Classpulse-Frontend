import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const AddCoordinator = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const isEdit = state?.isEdit || false;
  const initialCoordinator = state?.coordinator || {};

  const provinceMap = {
    0: "None",
    1: "Punjab",
    2: "Sindh",
    3: "Balochistan",
    4: "KPK",
    5: "GilgitBaltistan",
  };

  const qualificationMap = {
    0: "None",
    1: "Bachelors",
    2: "Masters",
    3: "PhD",
  };

  const [formData, setFormData] = useState({
    firstName: initialCoordinator.firstName || "",
    lastName: initialCoordinator.lastName || "",
    cnic: initialCoordinator.cnic || "",
    fatherName: initialCoordinator.fatherName || "",
    fatherCnic: initialCoordinator.fatherCnic || "",
dateOfBirth: initialCoordinator.dateOfBirth ? new Date(initialCoordinator.dateOfBirth).toISOString().split("T")[0] : "",    qualification: initialCoordinator.qualification || "",
    province: initialCoordinator.province || "",
    city: initialCoordinator.city || "",
    personalNumber: initialCoordinator.personalNumber || "",
    fatherNumber: initialCoordinator.fatherNumber || "",
    emergencyNumber: initialCoordinator.emergencyNumber || "",
    universityName: initialCoordinator.universityName || "",
    departmentId: initialCoordinator.departmentId || "",
    userId: initialCoordinator.userId || "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    departments: [],
    users: [],
    qualifications: [],
    provinces: [],
  });

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    const fetchDropdownData = async () => {
      try {
        const response = await axios.get("https://localhost:7145/Admin/GetCoordinatorDropdowns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDropdownData({
          departments: response.data.departments,
          users: response.data.users,
          qualifications: response.data.qualification,
          provinces: response.data.province,
        });
      } catch (err) {
        setError("Failed to fetch dropdown data.");
      }
    };

    fetchDropdownData();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        cnic: formData.cnic,
        fatherName: formData.fatherName,
        fatherCnic: formData.fatherCnic,
        dateOfBirth: formData.dateOfBirth,
        qualification: parseInt(formData.qualification) || 0,
        province: parseInt(formData.province) || 0,
        city: formData.city,
        personalNumber: formData.personalNumber,
        fatherNumber: formData.fatherNumber,
        emergencyNumber: formData.emergencyNumber,
        universityName: formData.universityName,
        departmentId: formData.departmentId,
        userId: formData.userId,
      };

      if (isEdit) {
        await axios.put(`https://localhost:7145/Admin/EditCoordinator/${initialCoordinator.coordinatorId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Coordinator updated:", initialCoordinator.coordinatorId);
      } else {
        await axios.post("https://localhost:7145/Admin/AddCoordinator", payload, {
          headers: 
           "Content-Type", "application/json"
          :{ Authorization: `Bearer ${token}` },
        });
        console.log("Coordinator added");
      }
      navigate("/admin/view-coordinator");
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to save coordinator."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      <Container fluid className="p-4">
        <h2 className="text-dark mb-4">{isEdit ? "Edit Coordinator" : "Add Coordinator"}</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="cnic">
                <Form.Label>CNIC</Form.Label>
                <Form.Control
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="personalNumber">
                <Form.Label>Personal Number</Form.Label>
                <Form.Control
                  type="text"
                  name="personalNumber"
                  value={formData.personalNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fatherName">
                <Form.Label>Father Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fatherCnic">
                <Form.Label>Father CNIC</Form.Label>
                <Form.Control
                  type="text"
                  name="fatherCnic"
                  value={formData.fatherCnic}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="qualification">
                <Form.Label>Qualification</Form.Label>
                <Form.Select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Qualification</option>
                  {Object.entries(qualificationMap).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="province">
                <Form.Label>Province</Form.Label>
                <Form.Select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                >
                  <option value="">Select Province</option>
                  {Object.entries(provinceMap).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fatherNumber">
                <Form.Label>Father Number</Form.Label>
                <Form.Control
                  type="text"
                  name="fatherNumber"
                  value={formData.fatherNumber}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="emergencyNumber">
                <Form.Label>Emergency Number</Form.Label>
                <Form.Control
                  type="text"
                  name="emergencyNumber"
                  value={formData.emergencyNumber}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="universityName">
                <Form.Label>University Name</Form.Label>
                <Form.Control
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="departmentId">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {dropdownData.departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="userId">
                <Form.Label>User</Form.Label>
                <Form.Select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select User</option>
                  {dropdownData.users.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.userName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#1A314A", border: "none" }}
          >
            {loading ? "Saving..." : isEdit ? "Update Coordinator" : "Add Coordinator"}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AddCoordinator;