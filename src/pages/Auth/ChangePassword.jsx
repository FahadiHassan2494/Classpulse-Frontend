import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post("https://localhost:7145/Auth/ChangePassword", {
        currentPassword,
        newPassword
      },
       {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

      // If the response is successful
      console.log("Password changed successfully:", response.data);
      navigate("/"); // redirect to login
    } catch (err) {
      console.error("Password change failed:", err);
      setError("Failed to change password. Please check your inputs.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }} className="d-flex justify-content-center align-items-center">
      <Card className="p-4" style={{ width: "350px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Change Password</Card.Title>
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <Button type="submit" className="w-100" variant="primary">
              Change Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;
