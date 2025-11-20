import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Spinner } from "react-bootstrap";

const MyTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.warn("No token found in session storage.");
      setLoading(false);
      return;
    }

    axios
      .get("https://localhost:7145/Student/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTeachers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setLoading(false);
      });
  }, [token]);

  return (
    <Container className="py-5">
      <h3 className="text-center mb-4 text-success fw-bold">Your Course Instructors</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="success" />
        </div>
      ) : teachers.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No instructors found or you're not enrolled in any courses.
        </div>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="shadow-sm"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          <thead className="table-success">
            <tr>
              <th style={{ width: "10%" }}>#</th>
              <th>Name</th>
              <th style={{ width: "30%" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={index}>
                <td className="align-middle text-center">{index + 1}</td>
                <td className="align-middle">{teacher.firstName} {teacher.lastName}</td>
                <td className="align-middle">{teacher.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyTeachers;
