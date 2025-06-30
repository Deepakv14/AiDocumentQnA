const express = require("express");
const axios = require("axios");
const multer = require("multer");
const { extractTextFromPDF } = require('../utils/pdfProcessor.js');
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const router = express.Router();
const upload = multer();

const conversations = {}; // sessionId -> { pdfText, messages[] }

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const sessionId = uuidv4();
    const fileBuffer = req.file.buffer;
    const text = await extractTextFromPDF(fileBuffer);

    conversations[sessionId] = {
      pdfText: text,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Answer only using the content of the document unless otherwise necessary.",
        },
      ],
    };

    res.json({ sessionId, message: "PDF processed successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/ask", async (req, res) => {
  const { question, sessionId } = req.body;
  if (!question || !sessionId || !conversations[sessionId]) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const { pdfText, messages } = conversations[sessionId];

  messages.push({ role: "user", content: question });

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "meta-llama/Llama-3-8b-chat-hf",
        messages: [
          ...messages.slice(0, 1), // system prompt
          {
            role: "user",
            content: `Use the following document:\n\n${pdfText}\n\nQuestion: ${question}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    messages.push({ role: "assistant", content: answer });

    res.json({ answer, history: messages.slice(1) }); // exclude system
  } catch (err) {
    res.status(500).json({ error: "AI response failed", details: err.message });
  }
});

module.exports = router;
