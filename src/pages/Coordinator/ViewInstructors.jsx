import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewInstructors = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    const fetchInstructors = async () => {
      try {
        const response = await axios.get("https://localhost:7145/Coordinator/ViewTeachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInstructors(response.data);
        console.log("Fetched instructors:", response.data);
      } catch (err) {
        console.error("Fetch instructors error:", err);
        setError("Failed to fetch instructors.");
      }
    };
    fetchInstructors();
  }, [navigate, token]);

  const handleEdit = (instructor) => {
    navigate("/coordinator/add-instructor", {
      state: { isEdit: true, instructor },
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this Instructor?`)) {
      return;
    }

    try {
      await axios.delete(`https://localhost:7145/Coordinator/DeleteTeacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstructors(instructors.filter(instructor => instructor.teacherId !== id));
      console.log(`Deleted instructor: ${id}`);
    } catch (err) {
      console.error("Delete instructor error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete instructor."
      );
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "1rem" }}>
      {/* Center container with max width */}
      <div style={{ maxWidth: "900px", width: "100%" }} className="container-fluid">
        <h2 className="text-dark mb-4">View Instructors</h2>

        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        {instructors.length === 0 ? (
          <p>No instructors found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Teacher #</th>
                  <th>Name</th>
                  <th>CNIC</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor, index) => (
                  <tr key={instructor.teacherId}>
                    <td>{index + 1}</td>
                    <td>{instructor.firstName} {instructor.lastName}</td>
                    <td>{instructor.cnic}</td>
                    <td>{instructor.email}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(instructor)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(instructor.teacherId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewInstructors;
