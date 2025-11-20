import React, { useEffect, useRef, useState } from "react";

const Classroom = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // store active stream
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    if (cameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream; // save stream so we can stop it later
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera permission denied:", err);
        });
    } else {
      // stop camera stream when turned off
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraOn]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f5f6fa" }}>
      {/* Main Area */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Main Video Section */}
        <div style={{ flex: 3, display: "flex", flexDirection: "column", padding: "10px" }}>
          <div
            style={{
              flex: 1,
              backgroundColor: "#000",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "18px",
              position: "relative",
            }}
          >
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover" }}
              />
            ) : (
              "Instructor Video Stream"
            )}
          </div>

          {/* Participant Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr))",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <div style={studentBox}>Student 1</div>
            <div style={studentBox}>Student 2</div>
            <div style={studentBox}>Student 3</div>
             <div style={studentBox}>Student 4</div>
            <div style={studentBox}>Student 5</div>
            <div style={studentBox}>Student 6</div>
          
          </div>
        </div>

        {/* Sidebar */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderLeft: "1px solid #ddd",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h4>Classroom Sidebar</h4>
          <p>Participants, Chat, Engagement Analytics, etc. will go here.</p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        style={{
          backgroundColor: "#1A314A",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <button style={controlBtn} onClick={() => setCameraOn((prev) => !prev)}>
          <i className="bi bi-camera-video"></i> {cameraOn ? "Stop Camera" : "Start Camera"}
        </button>
        <button style={controlBtn}>
          <i className="bi bi-mic-mute"></i> Mute
        </button>
        <button style={controlBtn}>
          <i className="bi bi-display"></i> Share Screen
        </button>
        <button style={{ ...controlBtn, backgroundColor: "red", color: "white" }}>
          <i className="bi bi-box-arrow-right"></i> Leave
        </button>
      </div>
    </div>
  );
};

// Reusable styles
const studentBox = {
  backgroundColor: "#222",
  borderRadius: "8px",
  height: "150px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
};

const controlBtn = {
  backgroundColor: "white",
  border: "none",
  borderRadius: "8px",
  padding: "8px 15px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export default Classroom;
