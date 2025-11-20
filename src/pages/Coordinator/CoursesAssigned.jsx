import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const CoursesAssigned = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  // Semester mapping based on backend enum
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

  // Initialize form data, prefill from location.state if editing
  const [formData, setFormData] = useState({
    semester: location.state?.semester?.toString() || "",
    courseId: location.state?.courseId || "",
    teacherId: location.state?.teacherId || "",
  });
  const [error, setError] = useState(null);
  const [noTeachersError, setNoTeachersError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch courses
        const courseResponse = await axios.get("https://localhost:7145/Coordinator/ViewCourses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Courses API response:", courseResponse.data);
        setCourses(courseResponse.data || []);

        // Fetch teachers
        const teacherResponse = await axios.get("https://localhost:7145/Coordinator/ViewTeachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Teachers API response:", teacherResponse.data);
        console.log("Teacher name fields:", teacherResponse.data.map(t => ({
          teacherId: t.teacherId,
          firstName: t.firstName,
          lastName: t.lastName
        })));
        const cleanedTeachers = teacherResponse.data.map(t => {
          const firstName = (t.firstName || "").trim();
          const lastName = (t.lastName || "").trim();
          const teacherName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || `Teacher_${t.teacherId.slice(0, 8)}`;
          return {
            teacherId: t.teacherId,
            teacherName,
            departmentId: t.departmentId
          };
        });
        setTeachers(cleanedTeachers || []);

        // Fetch departments
        const dropdownResponse = await axios.get("https://localhost:7145/Coordinator/GetStudentDropdowns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dropdowns API response:", dropdownResponse.data);
        setDepartments(dropdownResponse.data.departments || []);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error("Fetch data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  // Update department name and check teacher availability when course changes
  useEffect(() => {
    if (formData.courseId) {
      const selectedCourse = courses.find((c) => c.courseId === formData.courseId);
      if (selectedCourse) {
        const dept = departments.find((d) => d.departmentId === selectedCourse.departmentId);
        setSelectedDepartmentName(dept?.departmentName || "N/A");

        const courseDeptId = selectedCourse.departmentId.toString().toLowerCase();
        const filteredTeachers = teachers.filter((t) => {
          const teacherDeptId = t.departmentId.toString().toLowerCase();
          return teacherDeptId === courseDeptId;
        });

        console.log("Selected course departmentId:", courseDeptId);
        console.log("Filtered teachers:", filteredTeachers);
        console.log("Teacher dropdown options:", filteredTeachers.map(t => ({
          teacherId: t.teacherId,
          teacherName: t.teacherName
        })));

        if (filteredTeachers.length === 0) {
          setNoTeachersError("No teachers available in this department. Please add a teacher first.");
          setFormData((prev) => ({ ...prev, teacherId: "" }));
        } else {
          setNoTeachersError(null);
          if (formData.teacherId) {
            const selectedTeacher = teachers.find((t) => t.teacherId === formData.teacherId);
            if (selectedTeacher?.departmentId.toString().toLowerCase() !== courseDeptId) {
              setFormData((prev) => ({ ...prev, teacherId: "" }));
            }
          }
        }
      } else {
        setSelectedDepartmentName("");
        setNoTeachersError(null);
        setFormData((prev) => ({ ...prev, teacherId: "" }));
      }
    } else {
      setSelectedDepartmentName("");
      setNoTeachersError(null);
      setFormData((prev) => ({ ...prev, teacherId: "" }));
    }
  }, [formData.courseId, courses, departments, teachers, formData.teacherId]);

  useEffect(() => {
    console.log("formData:", formData);
  }, [formData]);

  useEffect(() => {
    if (teachers.length === 0) {
      console.log("Warning: No teachers loaded from API.");
    } else {
      console.log("Teachers loaded:", teachers);
    }
  }, [teachers]);

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

    if (noTeachersError) {
      setError("Cannot assign course: No teachers available in the department.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const selectedCourse = courses.find((c) => c.courseId === formData.courseId);
      const selectedTeacher = teachers.find((t) => t.teacherId === formData.teacherId);
      if (selectedCourse && selectedTeacher && 
          selectedCourse.departmentId.toString().toLowerCase() !== 
          selectedTeacher.departmentId.toString().toLowerCase()) {
        throw new Error("Teacher must belong to the same department as the course.");
      }

      const payload = {
        semester: parseInt(formData.semester) || 0,
        courseId: formData.courseId,
        teacherId: formData.teacherId,
      };
      console.log("Submitting payload:", payload);

      await axios.post("https://localhost:7145/Coordinator/AssignCourseToTeacher", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Course assigned/updated");
      navigate("/coordinator/view-assigned-courses");
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to assign/update course."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = formData.courseId
    ? teachers.filter((t) => {
        const course = courses.find((c) => c.courseId === formData.courseId);
        return course && t.departmentId.toString().toLowerCase() === course.departmentId.toString().toLowerCase();
      })
    : [];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      <div className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Container fluid className="p-3 d-flex justify-content-center align-items-start">
          <div className="w-100" style={{ maxWidth: "700px" }}>
            <h2 className="text-dark mb-3 text-center">
              {location.state ? "Edit Course Assignment" : "Assign Course to Teacher"}
            </h2>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {noTeachersError && <Alert variant="warning" className="mb-3">{noTeachersError}</Alert>}
            {loading && <Alert variant="info" className="mb-3">Loading...</Alert>}
            {teachers.length === 0 && !loading && (
              <Alert variant="warning" className="mb-3">
                No teachers loaded. Please check the teacher data or API.
              </Alert>
            )}
            <Form onSubmit={handleSubmit} className="p-3 bg-white rounded shadow-sm">
              <Row className="g-2">
                <Col xs={12}>
                  <Form.Group controlId="semester">
                    <Form.Label>Semester</Form.Label>
                    <Form.Select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                      size="sm"
                    >
                      <option value="">Select Semester</option>
                      {Object.entries(semesterMap).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-1">
                <Col xs={12}>
                  <Form.Group controlId="courseId">
                    <Form.Label>Course</Form.Label>
                    <Form.Select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      required
                      size="sm"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.courseId} value={course.courseId}>
                          {course.courseTitle}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-1">
                <Col xs={12}>
                  <Form.Group controlId="department">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDepartmentName}
                      disabled
                      size="sm"
                      placeholder="Select a course to view department"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mt-1">
                <Col xs={12}>
                  <Form.Group controlId="teacherId">
                    <Form.Label>Teacher</Form.Label>
                    <Form.Select
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      required
                      size="sm"
                      disabled={!formData.courseId || filteredTeachers.length === 0}
                      style={{ color: "black", backgroundColor: "white" }}
                    >
                      <option value="">Select Teacher</option>
                      {filteredTeachers.map((teacher) => {
                        console.log("Rendering teacher option:", teacher.teacherName);
                        return (
                          <option key={teacher.teacherId} value={teacher.teacherId}>
                            {teacher.teacherName}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center mt-3">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || !formData.courseId || filteredTeachers.length === 0}
                  style={{ backgroundColor: "#1A314A", border: "none", padding: "8px 16px" }}
                >
                  {loading ? "Saving..." : location.state ? "Update Assignment" : "Assign Course"}
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CoursesAssigned;