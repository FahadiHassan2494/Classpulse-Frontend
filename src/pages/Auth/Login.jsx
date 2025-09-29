import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const token = "dummy-token";
    const role = "Teacher";
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    navigate("/instructor");
  };

  return (
    <div
      style={{
        backgroundImage: "url('/logos/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)", 
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          color: "white",
          textAlign: "center"
        }}
      >
        <img
          src="/logos/finalbg.png"
          alt="ClassPulse Logo"
          style={{
            width: "120px",
            height: "120px",         
            marginBottom: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.2)", 
            borderRadius: "50%",             
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)", 
            objectFit: "cover"     
          }}
        />

        <h3 style={{ marginBottom: "20px" }}>Welcome Back</h3>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              style={{
                borderRadius: "12px",
                padding: "12px",
                border: "none"
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "12px",
                padding: "12px",
                border: "none"
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              borderRadius: "12px",
              padding: "10px",
              backgroundColor: "#1A314A",
              border: "none",
              fontWeight: "bold"
            }}
          >
            Login
          </Button>

          <div className="mt-3">
            <a
              href="/forgot-password"
              className="text-decoration-none"
              style={{ color: "#fff", fontSize: "14px" }}
            >
              Forgot Password?
            </a>
          </div>
        </Form>

        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
