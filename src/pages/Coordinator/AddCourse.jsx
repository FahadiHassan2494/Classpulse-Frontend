import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const course = location.state?.course; // Get course data from ViewCourses

  // Credit hours mapping based on backend enum
  const creditMap = {
    0: "None",
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
  };

  // Initialize form data with course data if editing
  const [formData, setFormData] = useState({
    courseId: course?.courseId || "",
    courseTitle: course?.courseTitle || "",
    creditHours: course?.creditHours?.toString() || "",
    departmentId: course?.departmentId || "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://localhost:7145/Coordinator/GetStudentDropdowns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dropdowns API response:", response.data);
        setDepartments(response.data.departments || []);
      } catch (err) {
        setError("Failed to fetch departments.");
        console.error("Dropdown fetch error:", err);
      }
    };

    fetchDepartments();
  }, [navigate, token]);

  // Log formData for debugging
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
        courseTitle: formData.courseTitle,
        creditHours: parseInt(formData.creditHours) || 0,
        departmentId: formData.departmentId,
      };
      console.log("Submitting payload:", payload);

      if (course) {
        // Update course
        await axios.put(`https://localhost:7145/Coordinator/EditCourse/${course.courseId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Course updated");
      } else {
        // Add new course
        await axios.post("https://localhost:7145/Coordinator/AddCourse", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Course added");
      }
      navigate("/coordinator/view-courses");
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        course ? "Failed to update course." : "Failed to add course."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
    
      <div className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Container fluid className="p-3 d-flex justify-content-center align-items-start">
          <div className="w-100" style={{ maxWidth: "700px" }}>
            <h2 className="text-dark mb-3 text-center">{course ? "Edit Course" : "Add Course"}</h2>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="p-3 bg-white rounded shadow-sm">
              <Row className="g-2">
                <Col xs={12}>
                  <Form.Group controlId="courseTitle">
                    <Form.Label>Course Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="courseTitle"
                      value={formData.courseTitle}
                      onChange={handleChange}
                      required
                      placeholder="Enter course title"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-1">
                <Col xs={12} sm={6}>
                  <Form.Group controlId="creditHours">
                    <Form.Label>Credit Hours</Form.Label>
                    <Form.Select
                      name="creditHours"
                      value={formData.creditHours}
                      onChange={handleChange}
                      required
                      size="sm"
                    >
                      <option value="">Select Credit Hours</option>
                      {Object.entries(creditMap).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
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
                      {departments.map((dept) => (
                        <option key={dept.departmentId} value={dept.departmentId}>
                          {dept.departmentName}
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
                  {loading ? "Saving..." : course ? "Update Course" : "Add Course"}
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AddCourse;