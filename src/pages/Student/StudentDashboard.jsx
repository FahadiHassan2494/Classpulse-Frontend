import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("https://localhost:7145/Student/courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data.slice(0, 3)))
      .catch((err) => console.error("Error fetching courses:", err));

    axios
      .get("https://localhost:7145/Student/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTeachers(res.data.slice(0, 3)))
      .catch((err) => console.error("Error fetching teachers:", err));
  }, [navigate]);

  const buttonStyle = {
    backgroundColor: "#152c44",
    borderColor: "#152c44",
    padding: "8px 20px",
    fontWeight: "bold",
    borderRadius: "8px",
  };

  const sectionTitleStyle = {
    fontWeight: "600",
    fontSize: "1.5rem",
    borderBottom: "2px solid #dee2e6",
    paddingBottom: "0.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Container className="py-5">
        <h2 className="text-center mb-4">Welcome Student</h2>
        <p className="text-center text-muted mb-5">
          Here's a quick overview of your enrolled courses and assigned teachers.
        </p>

        {/* Courses Section */}
        <div className="mb-5">
          <div style={sectionTitleStyle}>Your Courses</div>
          <Row className="g-4">
            {courses.map((course, index) => (
              <Col key={index} md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-book-fill me-2 fs-4 text-primary"></i>
                      <Card.Title className="mb-0">{course.courseTitle}</Card.Title>
                    </div>
                    <Card.Text className="mt-2">
                      <i className="bi bi-clock-fill me-2 text-secondary"></i>
                      {course.creditHours} Credit Hours
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/student/courses">
              <Button style={buttonStyle}>View All Courses</Button>
            </Link>
          </div>
        </div>

        {/* Teachers Section */}
        <div>
          <div style={sectionTitleStyle}>Your Teachers</div>
          <Row className="g-4">
            {teachers.map((teacher, index) => (
              <Col key={index} md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-person-badge-fill me-2 fs-4 text-success"></i>
                      <Card.Title className="mb-0">
                        {teacher.firstName} {teacher.lastName}
                      </Card.Title>
                    </div>
                    <Card.Text className="mt-2">
                      <i className="bi bi-envelope-fill me-2 text-secondary"></i>
                      {teacher.email}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/student/teachers">
              <Button style={buttonStyle}>View All Teachers</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StudentDashboard;
