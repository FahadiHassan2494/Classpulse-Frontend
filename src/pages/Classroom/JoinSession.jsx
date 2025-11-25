import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JoinSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
   sessionStorage.setItem("joinRoomId", sessionId);
   navigate(`/login?role=student`);


    // Navigate to login page for student
    navigate(`/login?role=student`);
  }, [sessionId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Redirecting to login...</h3>
    </div>
  );
};

export default JoinSession;
