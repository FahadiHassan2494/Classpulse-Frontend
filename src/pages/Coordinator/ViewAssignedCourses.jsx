import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const ViewAssignedCourses = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // Semester mapping based on backend enum
  
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        // Fetch assigned courses
        const assignedResponse = await axios.get("https://localhost:7145/Coordinator/ViewAllAssignedCoursesToTeachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Assigned Courses API response:", assignedResponse.data);

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
        setTeachers(teacherResponse.data || []);

        // Fetch departments
        const dropdownResponse = await axios.get("https://localhost:7145/Coordinator/GetStudentDropdowns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dropdowns API response:", dropdownResponse.data);
        setDepartments(dropdownResponse.data.departments || []);

        // Map assigned courses with courseTitle, teacherName, and departmentName
        const mappedCourses = assignedResponse.data.map(assignment => {
          const course = courseResponse.data.find(c => c.courseId === assignment.courseId);
          const teacher = teacherResponse.data.find(t => t.teacherId === assignment.teacherId);
          const department = dropdownResponse.data.departments.find(d => d.departmentId === (course?.departmentId || ""));
          
          return {
            courseOfferingId: assignment.courseOfferingId,
            courseId: assignment.courseId,
            teacherId: assignment.teacherId,
            semester: assignment.semester,
            courseTitle: course?.courseTitle || `Course_${assignment.courseId.slice(0, 8)}`,
            teacherName: teacher && teacher.firstName && teacher.lastName 
              ? `${teacher.firstName} ${teacher.lastName}`
              : teacher?.firstName || teacher?.lastName || `Teacher_${assignment.teacherId.slice(0, 8)}`,
            departmentName: department?.departmentName || "N/A"
          };
        });
        setAssignedCourses(mappedCourses || []);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error("Fetch data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleEdit = (course) => {
    navigate("/coordinator/courses-assigned", {
      state: {
        courseId: course.courseId,
        teacherId: course.teacherId,
        semester: course.semester
      }
    });
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Are you sure you want to delete the assignment for ${course.courseTitle} assigned to ${course.teacherName}?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Deleting assignment ID:", course.courseOfferingId);
      await axios.delete(`https://localhost:7145/Coordinator/DeleteAssignedCourse/${course.courseOfferingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignedCourses(assignedCourses.filter(c => c.courseOfferingId !== course.courseOfferingId));
      console.log("Course assignment deleted");
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete course assignment."
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
            <h2 className="text-dark mb-3 text-center">View Assigned Courses</h2>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {loading && <Alert variant="info" className="mb-3">Loading...</Alert>}
            {assignedCourses.length === 0 && !loading && !error && (
              <Alert variant="info" className="mb-3">
                No courses assigned yet.
              </Alert>
            )}
            {assignedCourses.length > 0 && (
              <div className="p-3 bg-white rounded shadow-sm">
                <Table striped bordered hover size="sm" responsive>
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Teacher Name</th>
                      <th>Department</th>
                      <th>Semester</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedCourses.map((course) => (
                      <tr key={`${course.courseId}-${course.teacherId}-${course.semester}`}>
                        <td>{course.courseTitle}</td>
                        <td>{course.teacherName}</td>
                        <td>{course.departmentName}</td>
                        <td>{course.semester}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEdit(course)}
                            disabled={loading}
                            style={{ padding: "4px 8px", marginRight: "8px" }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(course)}
                            disabled={loading}
                            style={{ padding: "4px 8px" }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ViewAssignedCourses;