import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JoinSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login with student role and roomId
    navigate(`/login?role=student&room=${sessionId}`);
  }, [sessionId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Redirecting to login...</h3>
    </div>
  );
};

export default JoinSession;
