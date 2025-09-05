import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Alert, Button } from "react-bootstrap";


const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const token = sessionStorage.getItem("token");

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    const url = "https://localhost:7145/Teacher/ViewCourses";
    try {
      if (!token) {
        throw new Error("User not authenticated. Please log in.");
      }

      console.log("Fetching courses from:", url, "Headers:", { Authorization: `Bearer ${token.substring(0, 20)}...` });
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch response:", response.data);
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid data format: Expected an array of courses.");
      }

      response.data.forEach((course, index) => {
        if (!course.courseId || !course.courseTitle || course.creditHours == null) {
          console.warn(`Invalid course at index ${index}:`, course);
        }
      });

      setCourses(response.data);
    } catch (err) {
      console.error("Fetch error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        config: { url: err.config?.url, headers: err.config?.headers },
      });
      let errorMessage = err.response?.data?.message || err.response?.data || err.message || "Something went wrong.";
      if (err.response?.status === 404 && errorMessage.includes("No teacher Found")) {
        errorMessage = "No teacher profile found for your account. Please contact the administrator.";
      } else if (err.response?.status === 404) {
        errorMessage = `Courses endpoint not found at ${url}. Verify backend route in TeacherController.cs or check server status.`;
      } else if (err.response?.status === 401) {
        errorMessage = "Unauthorized. Please log in again.";
      }

      setError(errorMessage);
      if (retryCount < maxRetries && err.response?.status !== 401 && err.response?.status !== 404) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchCourses();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token, retryCount]);

  if (loading) return (
    <Container fluid className="p-3 text-center">
      <p>Loading...</p>
    </Container>
  );

  if (error) return (
    <Container fluid className="p-4">
      <Alert variant="danger">
        {error}
        {retryCount < maxRetries && error.includes("Something went wrong") && (
          <span> Retrying... ({retryCount + 1}/{maxRetries})</span>
        )}
        {error.includes("endpoint not found") && (
          <Button
            variant="link"
            onClick={() => {
              setRetryCount(0);
              fetchCourses();
            }}
          >
            Retry
          </Button>
        )}
        {error.includes("Unauthorized") && (
          <Button
            variant="link"
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/login";
            }}
          >
            Log In
          </Button>
        )}
      </Alert>
    </Container>
  );

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Your Courses</h2>
      {courses.length === 0 && !error && (
        <p>No courses assigned.</p>
      )}
      {courses.length > 0 && (
        <Table striped bordered hover className="table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Course Name</th>
              <th>Credit Hours</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.courseId}>
                <td>{index + 1}</td>
                <td>{course.courseTitle}</td>
                <td>{course.creditHours}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default TeacherCourses;