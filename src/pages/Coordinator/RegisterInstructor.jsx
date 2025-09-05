
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const RegisterInstructor = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const token = sessionStorage.getItem("token");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7145/Auth/RegisterTeacher",
        {
          userName: username,
          email,
          password,
          isActive: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Instructor registered successfully!");
      navigate("/coordinator-dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response?.status === 401) {
        setError("Unauthorized: Please log in as a coordinator.");
        navigate("/");
      } else if (error.response?.status === 404) {
        setError("API endpoint not found. Please check the backend configuration.");
      } else if (error.response?.status === 400) {
        setError(error.response.data || "Invalid input. Check username or email.");
      } else {
        setError(error.message || "Failed to register instructor.");
      }
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="w-100 px-3" style={{ maxWidth: "500px", padding: "20px" }}>
          <h2 className="mb-4 text-dark text-center">Register Instructor</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
            >
              Register
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstructor;
