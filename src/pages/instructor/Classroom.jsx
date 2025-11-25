import React, { useEffect, useRef, useState } from "react";
import "./Classroom.css";

export default function Classroom() {
  const [myStream, setMyStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const myVideoRef = useRef(null);

  // For now static participants list — later it will come from SignalR
  const [participants, setParticipants] = useState([
    { id: "me", name: "Instructor (You)", stream: null },
    { id: "1", name: "Student A", stream: null },
    { id: "2", name: "Student B", stream: null },
  ]);

  // Step 1 — Request Camera + Microphone Permissions
  useEffect(() => {
    async function enableMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        alert("Camera/Microphone access denied.");
        console.error("Permission Error:", error);
      }
    }

    enableMedia();
  }, []);

  // ⭐ Mute/Unmute Microphone
  const toggleMic = () => {
    if (!myStream) return;
    myStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setMicOn(!micOn);
  };

  // ⭐ Turn Camera ON/OFF
  const toggleCamera = () => {
    if (!myStream) return;
    myStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
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

        {/* Dynamic Video Grid */}
        <div className="video-area flex-grow-1">
          <div
            className="video-grid"
            style={{
              gridTemplateColumns: `repeat(${Math.min(participants.length, 4)}, 1fr)`,
            }}
          >
            {/* Instructor Video */}
            <div className="video-box shadow-sm">
              <video ref={myVideoRef} autoPlay playsInline muted />
              <p className="video-name">You (Instructor)</p>
            </div>

            {/* Other Student Streams → later will use WebRTC */}
            {participants.slice(1).map((p) => (
              <div key={p.id} className="video-box shadow-sm">
                <div className="fake-video"></div>
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
