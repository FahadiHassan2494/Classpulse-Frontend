import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Alert, Card, Row, Col } from "react-bootstrap";


const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructorName, setInstructorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (!token) {
          throw new Error("Please log in to view dashboard.");
        }

        // Decode JWT for instructor name
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const name = payload.given_name || payload.name || "Instructor";
          setInstructorName(name);
        } catch (e) {
          console.warn("Failed to decode JWT:", e);
          setInstructorName("Instructor");
        }

        const [coursesResponse, studentsResponse] = await Promise.all([
          axios.get("https://localhost:7145/Teacher/ViewCourses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://localhost:7145/Teacher/ViewStudents", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!Array.isArray(coursesResponse.data)) {
          throw new Error("Invalid course data received.");
        }
        if (!Array.isArray(studentsResponse.data)) {
          throw new Error("Invalid student data received.");
        }

        setCourses(coursesResponse.data);
        setStudents(studentsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return (
    <Container fluid className="p-3 text-center">
      <p>Loading dashboard...</p>
    </Container>
  );

  if (error) return (
    <Container fluid className="p-4">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container fluid className="p-4">
      <h2 className="text-center mb-4">Welcome, {instructorName}</h2>
      <h4 className="mb-3">Your Courses</h4>
      {courses.length === 0 && (
        <p>No courses assigned.</p>
      )}
      {courses.length > 0 && (
        <Row>
          {courses.slice(0, 3).map((course, index) => (
            <Col md={4} className="mb-4" key={course.courseId}>
              <Card className="course-card h-100 shadow-lg border-0">
                <Card.Header className="bg-primary text-white">
                  <h5 className="card-title mb-0">{course.courseTitle}</h5>
                </Card.Header>
                <Card.Body>
                  <p className="card-text">
                    <strong>Course Name:</strong> {course.courseTitle}<br />
                    <strong>Credit Hours:</strong> {course.creditHours}
                  </p>
                </Card.Body>
                <Card.Footer className="bg-light text-muted text-end">
                  #{index + 1}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <h4 className="mb-3 mt-5">Your Students</h4>
      {students.length === 0 && (
        <p>No students enrolled.</p>
      )}
      {students.length > 0 && (
        <Row>
          {students.slice(0, 5).map((student, index) => (
            <Col md={4} className="mb-4" key={`${student.email}-${index}`}>
              <Card className="course-card h-100 shadow-lg border-0">
                <Card.Header className="bg-primary text-white">
                  <h5 className="card-title mb-0">{student.firstName} {student.lastName}</h5>
                </Card.Header>
                <Card.Body>
                  <p className="card-text">
                    <strong>Email:</strong> {student.email}<br />
                    <strong>Semester:</strong> {student.semester}
                  </p>
                </Card.Body>
                <Card.Footer className="bg-light text-muted text-end">
                  #{index + 1}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default InstructorDashboard;