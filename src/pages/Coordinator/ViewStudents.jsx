import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Table, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";


const ViewStudents = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Semester mapping from AddStudent.jsx
 

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
        // Fetch students
        const studentResponse = await axios.get("https://localhost:7145/Coordinator/ViewStudents", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Students API response:", studentResponse.data);
        setStudents(studentResponse.data || []);

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

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    setLoading(true);
    setError(null);
    try {
      await axios.delete(`https://localhost:7145/Coordinator/DeleteStudent/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((student) => student.studentId !== studentId));
      console.log(`Student ${studentId} deleted`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete student."
      );
      console.error("Delete student error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      <div className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Container fluid className="p-3 d-flex justify-content-center align-items-start">
          <div className="w-100">
            <h2 className="text-dark mb-3 text-center">View Students</h2>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {loading && <Alert variant="info" className="mb-3">Loading...</Alert>}
            <div className="p-3 bg-white rounded shadow-sm">
              <Table bordered hover size="sm" responsive>
                <thead>
                  <tr>
                    <th>Student#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Current Semester</th>
                    <th>Department</th>
                    <th>CNIC</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student,index) => (
                      <tr key={student.studentId} style={{ fontWeight: "normal" }}>
                        <td>{index+1}</td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        {console.log("Semester value:", student.currentSemester)}
                        <td>{student.currentSemester }</td>
                        <td>{departments.find(d => d.departmentId === student.departmentId)?.departmentName || "N/A"}</td>
                        <td>{student.cnic}</td>
                        <td>
                          <Button
                            className="btn btn-warning btn-sm me-2"
                            as={Link}
                            to="/coordinator/add-student"
                            state={{ student }}
                          >
                            Edit
                          </Button>
                          <Button
                             className="btn btn-danger btn-sm me-2"
                            onClick={() => handleDelete(student.studentId)}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No students found.
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

export default ViewStudents;