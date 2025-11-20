import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const ViewEnrolledStudents = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const hasFetched = useRef(false);

  // Semester mapping
 

  const [enrollments, setEnrollments] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            // Explicitly omit Content-Type
          },
        };

        // Fetch all data
        const [enrollmentsRes, studentsRes, offeringsRes, coursesRes, teachersRes, dropdownsRes] = await Promise.all([
          axios.get("https://localhost:7145/Coordinator/ViewEnrolledStudents", config),
          axios.get("https://localhost:7145/Coordinator/ViewStudents", config),
          axios.get("https://localhost:7145/Coordinator/ViewAllAssignedCoursesToTeachers", config),
          axios.get("https://localhost:7145/Coordinator/ViewCourses", config),
          axios.get("https://localhost:7145/Coordinator/ViewTeachers", config),
          axios.get("https://localhost:7145/Coordinator/GetStudentDropdowns", config),
        ]);

        console.log("Raw enrollments response:", enrollmentsRes.data);
        console.log("Students response:", studentsRes.data);
        console.log("Offerings response:", offeringsRes.data);
        console.log("Courses response:", coursesRes.data);
        console.log("Teachers response:", teachersRes.data);
        console.log("Dropdowns response:", dropdownsRes.data);

        // Map enrollments with student, course, teacher, and department data
        const mappedEnrollments = (Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : []).map(
          (enrollment) => {
            const student = studentsRes.data.find((s) => s.studentId === enrollment.studentId);
            const offering = offeringsRes.data.find(
              (o) => o.courseOfferingId === enrollment.courseOfferingId
            );
            const course = offering
              ? coursesRes.data.find((c) => c.courseId === offering.courseId)
              : null;
            const teacher = offering
              ? teachersRes.data.find((t) => t.teacherId === offering.teacherId)
              : null;
            const department = (dropdownsRes.data.departments || []).find(
              (d) => d.departmentId === student?.departmentId
            );

            return {
              enrollmentId: enrollment.enrollmentId,
              courseOfferingId: enrollment.courseOfferingId,
              studentId: enrollment.studentId,
              semester: enrollment.semester,
              studentName: student
                ? `${student.firstName} ${student.lastName}`
                : "N/A",
              courseName: course?.courseTitle || (offering ? `Course_${offering.courseId.slice(0, 8)}` : "N/A"),
              teacherName: teacher && teacher.firstName && teacher.lastName
                ? `${teacher.firstName} ${teacher.lastName}`
                : teacher?.firstName || teacher?.lastName || (offering ? `Teacher_${offering.teacherId.slice(0, 8)}` : "N/A"),
              departmentName: department?.departmentName || "N/A",
              section: student?.section || "N/A",
            };
          }
        );

        console.log("Mapped enrollments:", mappedEnrollments);
        setEnrollments(mappedEnrollments);
      } catch (err) {
        console.error("Fetch data error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          headers: err.config?.headers,
          responseHeaders: err.response?.headers,
        });
        if (err.response?.status === 404) {
          setEnrollments([]);
          setError("No enrollments found. Verify API endpoints.");
        } else if (err.response?.status === 401) {
          setError("Unauthorized. Please log in.");
          navigate("/login");
        } else {
          setError(
            `Failed to fetch data: ${err.message}. Verify ViewEnrolledStudents, ViewStudents, ViewAllAssignedCoursesToTeachers, ViewCourses, ViewTeachers, and GetStudentDropdowns APIs.`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      hasFetched.current = false;
    };
  }, [navigate, token]);

  const handleDelete = async (enrollmentId) => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }
     const confirmed = window.confirm("Are you sure you want to delete?");
     if (!confirmed) return;


    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log("Deleting enrollment:", enrollmentId);
      const response = await axios.delete(
       `https://localhost:7145/Coordinator/DeleteEnrolledStudent/${enrollmentId}`
,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { enrollmentId },
        }
      );
      console.log("Delete response:", response.data);
      setEnrollments(enrollments.filter((e) => e.enrollmentId !== enrollmentId));
      setSuccessMessage("Enrollment deleted successfully.");
      setTimeout(() => {
      setSuccessMessage(null);
       }, 3000);
    } catch (err) {
      console.error("Delete error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(
        err.response?.data?.message ||
          `Failed to delete enrollment: ${err.message}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (enrollment) => {
    navigate("/coordinator/enroll-students", {
      state: {
        courseOfferingId: enrollment.courseOfferingId,
        semester: enrollment.semester,
      },
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      <div className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Container
          fluid
          className="p-3 d-flex justify-content-center align-items-start"
        >
          <div className="w-100" style={{ maxWidth: "900px" }}>
            <h2 className="text-dark mb-3 text-center">View Enrolled Students</h2>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {successMessage && (
              <Alert variant="success" className="mb-3">
                {successMessage}
              </Alert>
            )}
            {loading && <Alert variant="info" className="mb-3">Loading...</Alert>}

            {enrollments.length === 0 && !loading && (
              <Alert variant="info">
                No enrollments found. Verify the Enrollments API and related data.
              </Alert>
            )}

            {enrollments.length > 0 && (
              <Table
                striped
                bordered
                hover
                responsive
                className="bg-white rounded shadow-sm"
              >
                <thead style={{ backgroundColor: "#1A314A", color: "white" }}>
                  <tr>
                    <th>Student Name</th>
                    <th>Course Name</th>
                    <th>Teacher Name</th>
                    <th>Semester</th>
                    <th>Department</th>
                    <th>Section</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.enrollmentId}>
                      <td>{enrollment.studentName || "N/A"}</td>
                      <td>{enrollment.courseName || "N/A"}</td>
                      <td>{enrollment.teacherName || "N/A"}</td>
                      <td>{enrollment.semester}</td>
                      <td>{enrollment.departmentName || "N/A"}</td>
                      <td>{enrollment.section || "N/A"}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(enrollment)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(enrollment.enrollmentId)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ViewEnrolledStudents;