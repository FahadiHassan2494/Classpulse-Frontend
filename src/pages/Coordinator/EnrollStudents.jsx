import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const EnrollStudents = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const [courseOfferings, setCourseOfferings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    courseOfferingId: "",
    semester: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle prefilled values from navigation
  useEffect(() => {
    if (location.state?.courseOfferingId && location.state?.semester) {
      setFormData({
        courseOfferingId: location.state.courseOfferingId,
        semester: location.state.semester.toString(),
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setInfoMessage(null);
      try {
        const offeringsResponse = await axios.get("https://localhost:7145/Coordinator/ViewAllAssignedCoursesToTeachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Course Offerings API response:", offeringsResponse.data);

        const courseResponse = await axios.get("https://localhost:7145/Coordinator/ViewCourses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Courses API response:", courseResponse.data);
        setCourses(courseResponse.data || []);

        const teacherResponse = await axios.get("https://localhost:7145/Coordinator/ViewTeachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Teachers API response:", teacherResponse.data);
        setTeachers(teacherResponse.data || []);

        const dropdownResponse = await axios.get("https://localhost:7145/Coordinator/GetStudentDropdowns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dropdowns API response:", dropdownResponse.data);
        setDepartments(dropdownResponse.data.departments || []);

        const mappedOfferings = offeringsResponse.data.map(offering => {
          const course = courseResponse.data.find(c => c.courseId === offering.courseId);
          const teacher = teacherResponse.data.find(t => t.teacherId === offering.teacherId);
          const department = dropdownResponse.data.departments.find(d => d.departmentId === (course?.departmentId || ""));

          return {
            courseOfferingId: offering.courseOfferingId,
            courseId: offering.courseId,
            teacherId: offering.teacherId,
            semester: offering.semester,
            courseTitle: course?.courseTitle || `Course_${offering.courseId.slice(0, 8)}`,
            teacherName: teacher && teacher.firstName && teacher.lastName
              ? `${teacher.firstName} ${teacher.lastName}`
              : teacher?.firstName || teacher?.lastName || `Teacher_${offering.teacherId.slice(0, 8)}`,
            departmentName: department?.departmentName || "N/A",
          };
        });
        setCourseOfferings(mappedOfferings || []);
      } catch (err) {
        setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
        console.error("Fetch data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleCourseOfferingChange = (e) => {
    const courseOfferingId = e.target.value;
    const offering = courseOfferings.find(o => o.courseOfferingId === courseOfferingId);
    setFormData({
      courseOfferingId,
      semester: offering?.semester.toString() || "",
    });
    setSuccessMessage(null);
    setError(null);
    setInfoMessage(null);
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
    setInfoMessage(null);
    setSuccessMessage(null);
    try {
      // Check existing enrollments
      const enrollmentsResponse = await axios.get("https://localhost:7145/Coordinator/ViewEnrolledStudents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const existingEnrollments = enrollmentsResponse.data.filter(
        e => e.courseOfferingId === formData.courseOfferingId && e.semester === parseInt(formData.semester)
      );
      
      // Get students in the semester
      const studentsResponse = await axios.get("https://localhost:7145/Coordinator/ViewStudents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const semesterStudents = studentsResponse.data.filter(s => s.currentSemester === parseInt(formData.semester));

      // Check if all semester students are already enrolled
      const unenrolledStudents = semesterStudents.filter(
        student => !existingEnrollments.some(e => e.studentId === student.studentId)
      );

      if (unenrolledStudents.length === 0 && semesterStudents.length > 0) {
        setInfoMessage("All students in this semester are already enrolled in the selected course.");
        setLoading(false);
        return;
      }

      const payload = {
        courseOfferingId: formData.courseOfferingId,
        semester: parseInt(formData.semester),
        studentId: "00000000-0000-0000-0000-000000000000", // Dummy value, ignored by backend
      };
      console.log("Enroll payload:", payload);
      console.log("Sending POST to: https://localhost:7145/Coordinator/EnrollStudents");
      const response = await axios.post("https://localhost:7145/Coordinator/EnrollStudents", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Enroll response:", response.data);
      setSuccessMessage(response.data);
      setFormData({ courseOfferingId: "", semester: "" });
      navigate("/coordinator/view-enroll-students");
    } catch (err) {
      if (err.response?.status === 404 && err.response?.data === "No students found in the selected semester.") {
        setInfoMessage(err.response.data);
      } else {
        console.error("Enroll error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
        });
        setError(
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message ||
              `Failed to enroll students: ${err.message}.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      <div className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Container fluid className="p-3 d-flex justify-content-center align-items-start">
          <div className="w-100" style={{ maxWidth: "700px" }}>
            <h2 className="text-dark mb-3 text-center">Enroll Students</h2>
            <Alert variant="info" className="mb-3">
              Note: New students are automatically enrolled in all courses for their semester when added. Use this form to enroll students in additional courses.
            </Alert>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {infoMessage && <Alert variant="info" className="mb-3">{infoMessage}</Alert>}
            {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
            {loading && <Alert variant="info" className="mb-3">Loading...</Alert>}

            <Form onSubmit={handleSubmit} className="p-3 bg-white rounded shadow-sm">
              <Row className="g-2">
                <Col xs={12}>
                  <Form.Group controlId="courseOfferingId">
                    <Form.Label>Course Offering</Form.Label>
                    <Form.Select
                      name="courseOfferingId"
                      value={formData.courseOfferingId}
                      onChange={handleCourseOfferingChange}
                      required
                      size="sm"
                    >
                      <option value="">Select Course Offering</option>
                      {courseOfferings.map((offering) => (
                        <option key={offering.courseOfferingId} value={offering.courseOfferingId}>
                          {`${offering.courseTitle} - ${offering.teacherName}`}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-1">
                <Col xs={12}>
                  <Form.Group controlId="semester">
                    <Form.Label>Semester</Form.Label>
                    <Form.Control
                      type="text"
                      value={semesterMap[formData.semester] || ""}
                      disabled
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center mt-3">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || !formData.courseOfferingId}
                  style={{ backgroundColor: "#1A314A", border: "none", padding: "8px 16px" }}
                >
                  {loading ? "Enrolling..." : "Enroll Students"}
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default EnrollStudents;