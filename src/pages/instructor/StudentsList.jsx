import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Alert, Button } from "react-bootstrap";


const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const token = sessionStorage.getItem("token");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    const url = "https://localhost:7145/Teacher/ViewStudents";
    try {
      if (!token) {
        throw new Error("User not authenticated. Please log in.");
      }

      console.log("Fetching students from:", url, "Headers:", { Authorization: `Bearer ${token.substring(0, 20)}...` });
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch response:", response.data);
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid data format: Expected an array of students.");
      }

      response.data.forEach((student, index) => {
        if (!student.firstName || !student.lastName || !student.email || student.semester == null) {
          console.warn(`Invalid student at index ${index}:`, student);
        }
      });

      setStudents(response.data);
    } catch (err) {
      console.error("Fetch error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        config: { url: err.config?.url, headers: err.config?.headers },
      });
      let errorMessage = err.response?.data?.message || err.response?.data || err.message || "Something went wrong.";
      if (err.response?.status === 404 && errorMessage.includes("No teacher found")) {
        errorMessage = "No teacher profile found for your account. Please contact the administrator.";
      } else if (err.response?.status === 404) {
        errorMessage = `Students endpoint not found at ${url}. Verify backend route in TeacherController.cs or check server status.`;
      } else if (err.response?.status === 401) {
        errorMessage = "Unauthorized. Please log in again.";
      }

      setError(errorMessage);
      if (retryCount < maxRetries && err.response?.status !== 401 && err.response?.status !== 404) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchStudents();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [retryCount, token]);

  if (loading) return (
    <Container fluid className="p-3 text-center">
      <p>Loading students...</p>
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
              fetchStudents();
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
      <h2 className="mb-4">Enrolled Students</h2>
      {students.length === 0 && !error && (
        <p>No students enrolled in your courses.</p>
      )}
      {students.length > 0 && (
        <Table striped bordered hover className="table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={`${student.email}-${index}`}>
                <td>{index + 1}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.semester}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StudentList;