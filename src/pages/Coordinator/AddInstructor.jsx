import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


// Define mappings for qualifications and provinces (int to string)
const qualificationMap = {
  0: "None",
  1: "Bachelors",
  2: "Masters",
  3: "PhD",
};

const provinceMap = {
  0: "None",
  1: "Punjab",
  2: "Sindh",
  3: "Balochistan",
  4: "KPK",
  5: "GilgitBaltistan",
};

const AddInstructor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const isEdit = state?.isEdit || false;
  const initialInstructor = state?.instructor || {};

  // Log initialInstructor to debug
  console.log("initialInstructor:", initialInstructor);

  // Check if initialInstructor is empty in edit mode
  useEffect(() => {
    if (isEdit && Object.keys(initialInstructor).length === 0) {
      setError("No instructor data provided for editing. Please check ViewInstructor navigation.");
      setTimeout(() => navigate("/coordinator/view-instructor"), 3000);
    }
  }, [isEdit, initialInstructor, navigate]);

  // Initialize formData, using integer values for qualification and province
  const [formData, setFormData] = useState({
    firstName: initialInstructor.firstName || "",
    lastName: initialInstructor.lastName || "",
    cnic: initialInstructor.cnic || "",
    dateOfBirth: initialInstructor.dateOfBirth ? new Date(initialInstructor.dateOfBirth).toISOString().split("T")[0] : "",
    qualification: initialInstructor.qualification !== undefined ? initialInstructor.qualification.toString() : "",
    personalNumber: initialInstructor.personalNumber || "",
    emergencyNumber: initialInstructor.emergencyNumber || "",
    email: initialInstructor.email || "",
    address: initialInstructor.address || "",
    city: initialInstructor.city || "",
    province: initialInstructor.province !== undefined ? initialInstructor.province.toString() : "",
    departmentId: initialInstructor.departmentId || "",
    userId: initialInstructor.userId || "",
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
        const response = await axios.get("https://localhost:7145/Coordinator/GetTeacherDropdowns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dropdowns = {
          departments: response.data.departments || [],
          users: response.data.users || [],
          qualifications: (response.data.qualification || []).map((q) => ({
            value: typeof q === "number" ? q.toString() : Object.keys(qualificationMap).find((key) => qualificationMap[key] === q) || "0",
            label: typeof q === "number" ? qualificationMap[q] || "Unknown" : qualificationMap[Object.keys(qualificationMap).find((key) => qualificationMap[key] === q)] || q,
          })),
          provinces: (response.data.province || []).map((p) => ({
            value: typeof p === "number" ? p.toString() : Object.keys(provinceMap).find((key) => provinceMap[key] === p) || "0",
            label: typeof p === "number" ? provinceMap[p] || "Unknown" : provinceMap[Object.keys(provinceMap).find((key) => provinceMap[key] === p)] || p,
          })),
        };
        setDropdownData(dropdowns);
        console.log("dropdownData:", dropdowns);
      } catch (err) {
        setError("Failed to fetch dropdown data.");
        console.error("Dropdown fetch error:", err);
      }
    };

    fetchDropdownData();
  }, [navigate, token]);

  // Log formData whenever it changes
  useEffect(() => {
    console.log("formData:", formData);
  }, [formData]);

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
        dateOfBirth: formData.dateOfBirth,
        qualification: parseInt(formData.qualification) || 0,
        personalNumber: formData.personalNumber,
        emergencyNumber: formData.emergencyNumber,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        province: parseInt(formData.province) || 0,
        departmentId: formData.departmentId,
        userId: formData.userId,
      };
      console.log("Submitting payload:", payload);

      if (isEdit) {
        await axios.put(`https://localhost:7145/Coordinator/EditTeacher/${initialInstructor.teacherId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Teacher updated:", initialInstructor.teacherId);
      } else {
        await axios.post("https://localhost:7145/Coordinator/AddTeacher", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Teacher added");
      }
      navigate("/coordinator/view-instructors");
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to save teacher."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      <Container fluid className="p-3 d-flex justify-content-center align-items-center">
        <div className="w-100" style={{ maxWidth: "700px" }}>
          <h2 className="text-dark mb-3 text-center">{isEdit ? "Edit Teacher" : "Add Teacher"}</h2>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="p-3 bg-white rounded shadow-sm">
            <Row className="g-2">
              <Col xs={12} sm={6}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col xs={12} sm={6}>
                <Form.Group controlId="cnic">
                  <Form.Label>CNIC</Form.Label>
                  <Form.Control
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    required
                    placeholder="Enter CNIC"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="personalNumber">
                  <Form.Label>Personal Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="personalNumber"
                    value={formData.personalNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter personal number"
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col xs={12} sm={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="dateOfBirth">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col xs={12} sm={6}>
                <Form.Group controlId="qualification">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    size="sm"
                  >
                    <option value="">Select Qualification</option>
                    {dropdownData.qualifications.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="province">
                  <Form.Label>Province</Form.Label>
                  <Form.Select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    size="sm"
                  >
                    <option value="">Select Province</option>
                    {dropdownData.provinces.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col xs={12} sm={6}>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col xs={12} sm={6}>
                <Form.Group controlId="emergencyNumber">
                  <Form.Label>Emergency Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyNumber"
                    value={formData.emergencyNumber}
                    onChange={handleChange}
                    placeholder="Enter emergency number"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="departmentId">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    required
                    size="sm"
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
            <Row className="g-2 mt-1">
              <Col xs={12} sm={6}>
                <Form.Group controlId="userId">
                  <Form.Label>User</Form.Label>
                  <Form.Select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                    size="sm"
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
            <div className="text-center mt-3">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#1A314A", border: "none", padding: "8px 16px" }}
              >
                {loading ? "Saving..." : isEdit ? "Update Teacher" : "Add Teacher"}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default AddInstructor;