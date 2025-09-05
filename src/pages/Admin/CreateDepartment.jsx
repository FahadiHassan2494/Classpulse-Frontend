import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    
    if (!departmentName) {
      setError("Department name is required");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7145/Admin/CreateDepartment", 
        { departmentName },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
    
      setSuccess("Department created successfully!");
      setError(null);
      navigate("/admin/view-departments");
    
    } catch (err) {
      setError("Error creating department. Please try again.");
      setSuccess(null);
    }
  };

return (
  <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
   

    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
      <Card
        className="p-4"
        style={{
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          backgroundColor: "#ffffff"
        }}
      >
        <Card.Body>
          <Card.Title className="text-center mb-4">Create New Department</Card.Title>

          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="departmentName">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Create Department
            </Button>
          </Form>

          {error && <p className="text-danger mt-3 text-center">{error}</p>}
          {success && <p className="text-success mt-3 text-center">{success}</p>}
        </Card.Body>
      </Card>
    </div>
  </div>
);

};

export default CreateDepartment;
