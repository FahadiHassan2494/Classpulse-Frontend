import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Table, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const ViewCourses = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Credit hours mapping from AddCourse.jsx
  const creditMap = {
    0: "None",
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
  };

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

        // Fetch departments
        const dropdownResponse = await axios.get("https://localhost:7145/Coordinator/GetStudentDropdowns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dropdowns API response:", dropdownResponse.data);
        setDepartments(dropdownResponse.data.departments || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch data."
        );
        console.error("Fetch data error:", err);
      } finally {
        setLoading(false);
      }
    };
                  
    fetchData();
  }, [navigate, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setLoading(true);
    setError(null);
    try {
      await axios.delete(`https://localhost:7145/Coordinator/DeleteCourse/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course.courseId !== id));
      console.log(`Course ${id} deleted`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete course."
      );
      console.error("Delete course error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      <div className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Container fluid className="p-3 d-flex justify-content-center align-items-start">
          <div className="w-100">
            <h2 className="text-dark mb-3 text-center">View Courses</h2>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {loading && <Alert variant="info" className="mb-3">Loading...</Alert>}
            <div className="p-3 bg-white rounded shadow-sm">
              <Table bordered hover size="sm" responsive>
                <thead>
                  <tr>
                    <th>Course#</th>
                    <th>Course Title</th>
                    <th>Credit Hours</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((course,index) => (
                      <tr key={course.courseId} style={{ fontWeight: "normal" }}>
                        <td>{index +1}</td>
                        <td>{course.courseTitle}</td>
                        <td>{creditMap[course.creditHours] || "Unknown"}</td>
                        <td>{departments.find(d => d.departmentId === course.departmentId)?.departmentName || "N/A"}</td>
                        <td>
                          <Button
                            
                            className="btn btn-warning btn-sm me-2"
                            as={Link}
                            to="/coordinator/add-course"
                            state={{ course }}
                          >
                            Edit
                          </Button>
                          <Button
                           className="btn btn-danger btn-sm me-2"
                            onClick={() => handleDelete(course.courseId)}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No courses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ViewCourses;