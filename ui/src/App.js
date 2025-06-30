// src/App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [pdf, setPdf] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const chatWindowRef = useRef(null);

  useEffect(() => {
    socket.on("answer", (data) => {
      if (data.answer) {
        setChat((prev) => [...prev, { role: "assistant", content: data.answer }]);
        setError("");
      } else if (data.error) {
        setError(data.error);
      }
    });

    return () => socket.off("answer");
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chat]);

  const handleUpload = async () => {
    if (!pdf) {
      setError("*Please select a PDF file to upload.");
      setSuccess("");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", pdf);
      const res = await axios.post("http://localhost:5000/api/chat/upload", formData);
      setSessionId(res.data.sessionId);
      setChat([]);
      setError("");
      setSuccess("✅ PDF uploaded and processed successfully. You can now ask questions.");

      // Request summary from backend right after upload
      socket.emit("ask", {
        question: "Please summarize the uploaded document.",
        sessionId: res.data.sessionId
      });

    } catch (err) {
      setError("*Failed to upload and process PDF. Please try again.");
      setSuccess("");
    }
  };

  const handleAsk = () => {
    if (!question.trim() || !sessionId) return;
    const userMsg = { role: "user", content: question };
    setChat((prev) => [...prev, userMsg]);
    socket.emit("ask", { question, sessionId });
    setQuestion("");
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAsk();
    }
  };

  return (
    <div className="app-container">
      <h2>📄 AI Document Q&A</h2>

      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} />
        <button onClick={handleUpload}>Upload PDF</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="chat-window" ref={chatWindowRef}>
        {chat.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "user-msg" : "ai-msg"}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="ask-section">
        <input
          type="text"
          value={question}
          placeholder="Type your query..."
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!sessionId}
        />
        <button onClick={handleAsk} disabled={!sessionId}>Ask</button>
      </div>
    </div>
  );
}

export default App;
