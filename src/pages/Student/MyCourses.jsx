import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Spinner } from "react-bootstrap";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.warn("No token found in session storage.");
      setLoading(false);
      return;
    }

    axios
      .get("https://localhost:7145/Student/courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, [token]);

  return (
    <Container className="py-5">
      <h3 className="text-center mb-4">Your Enrolled Courses</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : courses.length === 0 ? (
        <p className="text-center text-muted">
          No courses found or you're not enrolled in any.
        </p>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="shadow-sm"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          <thead className="table-primary">
            <tr>
              <th style={{ width: "10%" }}>#</th>
              <th>Course Title</th>
              <th style={{ width: "20%" }}>Credit Hours</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td className="align-middle text-center">{index + 1}</td>
                <td className="align-middle">{course.courseTitle}</td>
                <td className="align-middle text-center">{course.creditHours}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyCourses;
