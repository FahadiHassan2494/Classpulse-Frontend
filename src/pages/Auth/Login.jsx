import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params (role)
  const searchParams = new URLSearchParams(location.search);
  const loginAs = searchParams.get("role") || "Teacher"; // default to instructor

  // Hardcoded credentials
  const validStudents = [
    { username: "student1", password: "12345" },
    { username: "student2", password: "12345" },
  ];

  const validInstructor = { username: "instructor", password: "12345" };

  const handleLogin = (e) => {
    e.preventDefault();

    // ------------------ Student Login ------------------
    if (loginAs.toLowerCase() === "student") {
      const student = validStudents.find(
        (s) => s.username === userName && s.password === password
      );

      if (!student) {
        setError("Invalid student username or password");
        return;
      }

      sessionStorage.setItem("token", "dummy-token");
      sessionStorage.setItem("role", "Student");

      // Navigate to classroom if joined via session link
      const roomId = sessionStorage.getItem("joinRoomId");
      if (roomId) {
        navigate(`/classroom?room=${roomId}`);
        sessionStorage.removeItem("joinRoomId");
        return;
      }

      // Otherwise fallback
      navigate("/student");
    }

    // ------------------ Instructor Login ------------------
    if (loginAs.toLowerCase() === "teacher") {
      if (userName !== validInstructor.username || password !== validInstructor.password) {
        setError("Invalid instructor username or password");
        return;
      }

      sessionStorage.setItem("token", "dummy-token");
      sessionStorage.setItem("role", "Teacher");
      navigate("/instructor");
    }
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
        alignItems: "center",
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
          textAlign: "center",
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
            objectFit: "cover",
          }}
        />

        <h3 style={{ marginBottom: "20px" }}>
          {loginAs.toLowerCase() === "student" ? "Student Login" : "Instructor Login"}
        </h3>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              style={{ borderRadius: "12px", padding: "12px", border: "none" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: "12px", padding: "12px", border: "none" }}
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
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
        </Form>

        <div className="mt-3">
          <a
            href="/forgot-password"
            className="text-decoration-none"
            style={{ color: "#fff", fontSize: "14px" }}
          >
            Forgot Password?
          </a>
        </div>

        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
