import React, { useEffect, useRef, useState } from "react";
import "./Classroom.css";

export default function Classroom() {
  const [myStream, setMyStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  // For dynamic participant videos
  const [participants, setParticipants] = useState([
    { id: "me", name: "Instructor (You)", stream: null },
    { id: "1", name: "Student A", stream: null },
    { id: "2", name: "Student B", stream: null },
  ]);

  const myVideoRef = useRef(null);

  // Request Camera + Microphone Permissions
  useEffect(() => {
    async function enableMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setMyStream(stream);

        // Attach stream to instructor's video element
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        // Update participants list with instructor stream
        setParticipants((prev) =>
          prev.map((p) => (p.id === "me" ? { ...p, stream } : p))
        );
      } catch (error) {
        alert("Camera/Microphone access denied.");
        console.error("Permission Error:", error);
      }
    }

    enableMedia();
  }, []);

  // Toggle Microphone
  const toggleMic = () => {
    if (!myStream) return;
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setMicOn(!micOn);
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (!myStream) return;
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setCameraOn(!cameraOn);
  };

  return (
    <div className="meeting-container d-flex">

      {/* Sidebar */}
      <div className="sidebar d-none d-md-flex flex-column p-3 shadow-sm">
        <h5 className="fw-bold mb-3">Participants</h5>
        {participants.map((p) => (
          <div key={p.id} className="participant-item d-flex align-items-center mb-2">
            <div className="circle me-2"></div>
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      {/* Main Area */}
      <div className="flex-grow-1 d-flex flex-column">

        {/* Top Bar */}
        <div className="top-bar shadow-sm px-3 py-2 d-flex justify-content-between align-items-center">
          <h5 className="fw-semibold m-0">Classroom Session</h5>
          <button className="btn btn-outline-danger btn-sm">End Session</button>
        </div>

        {/* Video Grid */}
        <div className="video-area flex-grow-1">
          <div className="video-grid">
            {participants.map((p) => (
              <div key={p.id} className="video-box shadow-sm">
                {p.stream ? (
                  <video
                    autoPlay
                    playsInline
                    muted={p.id === "me"} // instructor muted self
                    ref={(el) => {
                      if (el) el.srcObject = p.stream;
                    }}
                  />
                ) : (
                  <div className="fake-video" />
                )}
                <p className="video-name">{p.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="controls-bar d-flex justify-content-center gap-4 py-3">
          <button
            className="control-btn btn btn-light shadow-sm p-3 rounded-circle"
            onClick={toggleMic}
          >
            {micOn ? "🎤" : "🔇"}
          </button>

          <button
            className="control-btn btn btn-light shadow-sm p-3 rounded-circle"
            onClick={toggleCamera}
          >
            {cameraOn ? "🎥" : "🚫"}
          </button>

          <button className="control-btn btn btn-light shadow-sm p-3 rounded-circle">
            📺
          </button>
        </div>

      </div>
    </div>
  );
}
