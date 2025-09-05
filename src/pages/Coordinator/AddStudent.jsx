import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const AddStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const student = location.state?.student; // Get student data for editing

  // Define mappings
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

  const semesterMap = {
    0: "None",
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
    6: "Sixth",
    7: "Seventh",
    8: "Eighth",
  };

  // Initialize formData
  const [formData, setFormData] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    cnic: student?.cnic || "",
    dateOfBirth: student?.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
    enrollmentNumber: student?.enrollmentNumber || "",
    currentSemester: student?.currentSemester?.toString() || "",
    section: student?.section || "",
    batch: student?.batch?.toString() || "",
    qualification: student?.qualification?.toString() || "",
    enrollmentDate: student?.enrollmentDate ? student.enrollmentDate.split("T")[0] : "",
    personalNumber: student?.personalNumber || "",
    guardianNumber: student?.guardianNumber || "",
    email: student?.email || "",
    address: student?.address || "",
    city: student?.city || "",
    province: student?.province?.toString() || "",
    departmentId: student?.departmentId?.toString() || "",
    userId: student?.userId?.toString() || "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    departments: [],
    users: [],
    qualifications: [],
    provinces: [],
    semesters: [],
  });

  // Fetch dropdown data
  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    const fetchDropdownData = async () => {
      try {
        const response = await axios.get("https://localhost:7145/Coordinator/GetStudentDropdowns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dropdowns = {
          departments: response.data?.departments || [],
          users: response.data?.users || [],
          qualifications: (response.data?.qualification || []).map((q) => ({
            value: typeof q === "number" ? q.toString() : Object.keys(qualificationMap).find((key) => qualificationMap[key] === q) || "0",
            label: typeof q === "number" ? qualificationMap[q] || "Unknown" : qualificationMap[Object.keys(qualificationMap).find((key) => qualificationMap[key] === q)] || q,
          })),
          provinces: (response.data?.province || []).map((p) => ({
            value: typeof p === "number" ? p.toString() : Object.keys(provinceMap).find((key) => provinceMap[key] === p) || "0",
            label: typeof p === "number" ? provinceMap[p] || "Unknown" : provinceMap[Object.keys(provinceMap).find((key) => provinceMap[key] === p)] || p,
          })),
          semesters: (response.data?.semester || response.data?.semesters || []).length > 0
            ? (response.data?.semester || response.data?.semesters).map((s) => ({
                value: typeof s === "number" ? s.toString() : Object.keys(semesterMap).find((key) => semesterMap[key].toLowerCase() === s.toLowerCase()) || "0",
                label: typeof s === "number" ? semesterMap[s] || "Unknown" : semesterMap[Object.keys(semesterMap).find((key) => semesterMap[key].toLowerCase() === s.toLowerCase())] || s,
              }))
            : Object.entries(semesterMap).map(([value, label]) => ({ value, label })),
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

  // Log formData changes
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
    setSuccessMessage(null);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        cnic: formData.cnic,
        dateOfBirth: formData.dateOfBirth,
        enrollmentNumber: formData.enrollmentNumber,
        currentSemester: parseInt(formData.currentSemester) || 0,
        section: formData.section,
        batch: parseInt(formData.batch) || 0,
        qualification: parseInt(formData.qualification) || 0,
        enrollmentDate: formData.enrollmentDate,
        personalNumber: formData.personalNumber,
        guardianNumber: formData.guardianNumber,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        province: parseInt(formData.province) || 0,
        departmentId: formData.departmentId,
        userId: formData.userId,
      };
      console.log("Submitting payload:", payload);

      let response;
      if (student) {
        // Update student
        response = await axios.put(`https://localhost:7145/Coordinator/EditStudent/${student.studentId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage(response.data); // String response: "Student edited and enrollments updated successfully!"
      } else {
        // Add new student
        response = await axios.post("https://localhost:7145/Coordinator/AddStudent", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage(response.data.message || "Student created and enrolled in semester courses successfully!");
      }
      console.log(student ? "Student updated" : "Student added", response.data);
      navigate("/coordinator/view-students");
    } catch (err) {
      console.error("Submit error:", err);
      let errorMessage = err.response?.data?.message || err.message || (student ? "Failed to update student." : "Failed to add student.");
      if (err.response?.status === 400 && err.response?.data?.errors) {
        // Extract ModelState errors
        const modelStateErrors = Object.values(err.response.data.errors).flat().join(", ");
        errorMessage = modelStateErrors || "Validation failed.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      <div className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Container fluid className="p-3 d-flex justify-content-center align-items-start">
          <div className="w-100" style={{ maxWidth: "700px" }}>
            <h2 className="text-dark mb-3 text-center">{student ? "Edit Student" : "Add Student"}</h2>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
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
                      placeholder="XXXXX-XXXXXXX-X"
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
                  <Form.Group controlId="enrollmentNumber">
                    <Form.Label>Enrollment Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="enrollmentNumber"
                      value={formData.enrollmentNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter enrollment number"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group controlId="enrollmentDate">
                    <Form.Label>Enrollment Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="enrollmentDate"
                      value={formData.enrollmentDate}
                      onChange={handleChange}
                      required
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-1">
                <Col xs={12} sm={6}>
                  <Form.Group controlId="currentSemester">
                    <Form.Label>Current Semester</Form.Label>
                    <Form.Select
                      name="currentSemester"
                      value={formData.currentSemester}
                      onChange={handleChange}
                      required
                      size="sm"
                    >
                      <option value="">Select Semester</option>
                      {dropdownData.semesters.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                    {student && (
                      <Form.Text className="text-muted">
                        Changing semester will remove existing enrollments and enroll the student in all courses for the new semester.
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group controlId="section">
                    <Form.Label>Section</Form.Label>
                    <Form.Control
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      required
                      placeholder="Enter section"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-1">
                <Col xs={12} sm={6}>
                  <Form.Group controlId="batch">
                    <Form.Label>Batch</Form.Label>
                    <Form.Control
                      type="number"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      required
                      placeholder="Enter batch"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
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
              </Row>
              <Row className="g-2 mt-1">
                <Col xs={12} sm={6}>
                  <Form.Group controlId="guardianNumber">
                    <Form.Label>Guardian Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="guardianNumber"
                      value={formData.guardianNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter guardian number"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group controlId="province">
                    <Form.Label>Province</Form.Label>
                    <Form.Select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
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
                      required
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
                      required
                      placeholder="Enter address"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-1">
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
                  {loading ? "Saving..." : student ? "Update Student" : "Add Student"}
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AddStudent;