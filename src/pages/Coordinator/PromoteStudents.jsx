import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const PromoteStudents = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // Semester mapping
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

  const [formData, setFormData] = useState({
    currentSemester: "",
    promotionSemester: "",
  });
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch semester dropdown
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
        const semestersData = (response.data?.semester || response.data?.semesters || []).length > 0
          ? (response.data?.semester || response.data?.semesters).map((s) => ({
              value: typeof s === "number" ? s.toString() : Object.keys(semesterMap).find((key) => semesterMap[key].toLowerCase() === s.toLowerCase()) || "0",
              label: typeof s === "number" ? semesterMap[s] || "Unknown" : semesterMap[Object.keys(semesterMap).find((key) => semesterMap[key].toLowerCase() === s.toLowerCase())] || s,
            }))
          : Object.entries(semesterMap).map(([value, label]) => ({ value, label }));
        setSemesters(semestersData);
        console.log("Semesters:", semestersData);
      } catch (err) {
        setError("Failed to fetch semester data.");
        console.error("Dropdown fetch error:", err);
      }
    };

    fetchDropdownData();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    if (formData.currentSemester === formData.promotionSemester) {
      setError("Current semester and promotion semester cannot be the same.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload = {
        currentSemester: parseInt(formData.currentSemester),
        promotionSemester: parseInt(formData.promotionSemester),
      };
      console.log("Submitting payload:", payload);
      const response = await axios.put("https://localhost:7145/Coordinator/PromoteStudents", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Promote response:", response.data);
      setSuccessMessage(response.data);
      setFormData({ currentSemester: "", promotionSemester: "" });
      navigate("/coordinator/view-students");
    } catch (err) {
      console.error("Promote error:", err);
      let errorMessage = err.response?.data?.message || err.response?.data || err.message || "Failed to promote students.";
      if (err.response?.status === 400 && err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors).flat().join(", ");
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
            <h2 className="text-dark mb-3 text-center">Promote Students</h2>
            <Alert variant="info" className="mb-3">
              Select a current semester to promote all students in that semester to a new semester. This will update their enrollments to the new semester's courses.
            </Alert>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
            {loading && <Alert variant="info" className="mb-3">Processing...</Alert>}

            <Form onSubmit={handleSubmit} className="p-3 bg-white rounded shadow-sm">
              <Row className="g-2">
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
                      <option value="">Select Current Semester</option>
                      {semesters.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group controlId="promotionSemester">
                    <Form.Label>Promotion Semester</Form.Label>
                    <Form.Select
                      name="promotionSemester"
                      value={formData.promotionSemester}
                      onChange={handleChange}
                      required
                      size="sm"
                    >
                      <option value="">Select Promotion Semester</option>
                      {semesters.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
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
                  disabled={loading || !formData.currentSemester || !formData.promotionSemester}
                  style={{ backgroundColor: "#1A314A", border: "none", padding: "8px 16px" }}
                >
                  {loading ? "Promoting..." : "Promote Students"}
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default PromoteStudents;