"use client";
import React from "react";
import "./dashboard.css";

export default function Dashboard() {
  function handleUploadClick() {
    document.getElementById("uploadInput").click();
  }
  function handleCaptureClick() {
    document.getElementById("captureInput").click();
  }

  return (
    <div className="frame-fullpage">
      <header className="frame-header">
        <span className="frame-logo">SaarLekh</span>
        <button
          className="frame-logout"
          onClick={() => (window.location.href = "/login")}
        >
          Logout
        </button>
      </header>
      <main className="frame-main">
        <div className="frame-actions">
          <div className="frame-action" onClick={handleUploadClick}>
            Upload a<br />picture
            <input
              id="uploadInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <div className="frame-action" onClick={handleCaptureClick}>
            Capture a<br />picture
            <input
              id="captureInput"
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}