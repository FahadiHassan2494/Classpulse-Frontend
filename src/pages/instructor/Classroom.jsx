import React from "react";

const Classroom = () => {
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
            }}
          >
            Instructor Video Stream
          </div>

          {/* Participant Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <div style={studentBox}>Student 1</div>
            <div style={studentBox}>Student 2</div>
            <div style={studentBox}>Student 3</div>
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
        <button style={controlBtn}>
          <i className="bi bi-mic-mute"></i> Mute
        </button>
        <button style={controlBtn}>
          <i className="bi bi-camera-video-off"></i> Stop Video
        </button>
        <button style={controlBtn}>
          <i className="bi bi-display"></i> Share Screen
        </button>
        <button style={{ ...controlBtn, backgroundColor: "red" }}>
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
