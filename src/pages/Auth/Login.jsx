import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [userName, setUserName] = useState("");  
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7145/Auth/Login", {
        userName,
        password
      });

      const { token, role } = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      console.log(role);

      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "Coordinator") {
        navigate("/coordinator-dashboard");
      } else if (role === "Teacher") {
        navigate("/instructor");
      } else if (role === "Student") {
        navigate("/student");
      }
      else {
        setError("Invalid role assigned.");
      }

    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
  <div style={{ backgroundColor: "#1A314A", minHeight: "100vh" }} className="d-flex justify-content-center align-items-center">
    <Card
      className="p-4"
      style={{
        width: "300px",
        backgroundColor: "#f0f0f0",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderRadius: "10px"
      }}
    >
      <Card.Body className="text-center">
        <Card.Title as="h2">Class Pulse</Card.Title>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicUserName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#1A314A", border: "none" }}
          >
            Login
          </Button>

          {/* Forgot Password link */}
          <div className="mt-3">
            <a href="/forgot-password" className="text-decoration-none" style={{ color: "#1A314A", fontSize: "14px" }}>
              Forgot Password?
            </a>
          </div>
        </Form>

        {error && <p className="text-danger mt-2">{error}</p>}
      </Card.Body>
    </Card>
  </div>
);

};

export default Login;
