"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import "./dashboard.css";

export default function Dashboard() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [agentQuery, setAgentQuery] = useState("");
  const [agentResponse, setAgentResponse] = useState(null);
  const [showAgentInfo, setShowAgentInfo] = useState(false);
  const router = useRouter(); // Initialize the router

  function handleUploadClick() {
    document.getElementById("uploadInput").click();
  }

  function handleCaptureClick() {
    document.getElementById("captureInput").click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  }

  function handleGetSummary() {
    router.push("/summary"); // Navigate to /summary
  }

  function handleConvertToText() {
    router.push("/convert"); // Navigate to /convert
  }

  async function handleAgentQuery() {
    if (!agentQuery.trim()) return;
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: agentQuery }),
      });
      
      const data = await response.json();
      setAgentResponse(data);
      setShowAgentInfo(true);
    } catch (error) {
      setAgentResponse({ 
        error: 'Failed to get agent information',
        answer: 'Sorry, I cannot process your query right now.' 
      });
      setShowAgentInfo(true);
    }
  }

  async function getAgentInfo() {
    try {
      const response = await fetch('/api/agent');
      const data = await response.json();
      setAgentResponse(data);
      setShowAgentInfo(true);
    } catch (error) {
      setAgentResponse({ 
        error: 'Failed to get agent information',
        name: 'SaarLekh AI Agent',
        description: 'I am an AI agent specialized in document processing.' 
      });
      setShowAgentInfo(true);
    }
  }

  return (
    <div className="frame-fullpage">
      <Image
        src="/images/1355218.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-20"
      />
      <header className="frame-header">
        <span className="frame-logo">
          Saar
          <span style={{ color: "#00ffff" }}>Lekh</span>
        </span>
        <div className="header-controls">
          <button
            className="frame-info-button"
            onClick={getAgentInfo}
            style={{
              background: 'linear-gradient(45deg, #ff00cc, #00ffff)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              marginRight: '10px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Agent Info
          </button>
          <button
            className="frame-logout"
            onClick={() => (window.location.href = "/login")}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="frame-main">
        {showAgentInfo && (
          <div className="agent-info-modal" style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000'
          }}>
            <div style={{
              backgroundColor: '#1a1a2e',
              border: '2px solid #ff00cc',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              color: 'white',
              boxShadow: '0 0 30px rgba(255, 0, 204, 0.5)'
            }}>
              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <button 
                  onClick={() => setShowAgentInfo(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ff00cc',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              
              {agentResponse && (
                <div>
                  <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>
                    {agentResponse.name || 'Agent Information'}
                  </h2>
                  
                  {agentResponse.answer ? (
                    <div>
                      <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                        <strong>Query:</strong> {agentResponse.question}
                      </p>
                      <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                        <strong>Response:</strong> {agentResponse.answer}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                        <strong>Type:</strong> {agentResponse.type}
                      </p>
                      <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                        {agentResponse.description}
                      </p>
                      <p style={{ marginBottom: '10px', color: '#00ffff' }}>
                        <strong>Capabilities:</strong>
                      </p>
                      <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                        {agentResponse.capabilities?.map((capability, index) => (
                          <li key={index} style={{ marginBottom: '5px' }}>{capability}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {agentResponse.capabilities && agentResponse.answer && (
                    <div>
                      <p style={{ marginBottom: '10px', color: '#00ffff' }}>
                        <strong>My Capabilities:</strong>
                      </p>
                      <ul style={{ marginLeft: '20px' }}>
                        {agentResponse.capabilities.map((capability, index) => (
                          <li key={index} style={{ marginBottom: '5px' }}>{capability}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                <input
                  type="text"
                  placeholder="Ask me: 'currently you are which agent?'"
                  value={agentQuery}
                  onChange={(e) => setAgentQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAgentQuery()}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ff00cc',
                    backgroundColor: '#0f1533',
                    color: 'white',
                    marginBottom: '10px'
                  }}
                />
                <button
                  onClick={handleAgentQuery}
                  style={{
                    background: 'linear-gradient(45deg, #ff00cc, #00ffff)',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Ask Agent
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!uploadedImage ? (
          <div className="frame-actions">
            <div className="frame-action" onClick={handleUploadClick}>
              Upload a
              <br />
              picture
              <input
                id="uploadInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
            <div className="frame-action" onClick={handleCaptureClick}>
              Capture a
              <br />
              picture
              <input
                id="captureInput"
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
          </div>
        ) : (
          <div className="uploaded-image-container">
            <Image
              width={720}
              height={480}
              src={uploadedImage}
              alt="Uploaded Preview"
              className="uploaded-image"
            />
            <div className="frame-actions mt-10">
              
              <button className="frame-action-button" onClick={handleGetSummary}>
                Get Summary
              </button>
              <button className="frame-action-button" onClick={handleConvertToText}>
                Convert to Text
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}