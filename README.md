# 📄 AI-Powered Document Q\&A Web App

This project is a simple full-stack web application that allows users to:
* Upload a PDF document
* Ask questions about the document's content
* Receive real-time answers from an AI model via a chat interface

Built using **React**, **Node.js + Express**, **Socket.io**, and **Together API**.

---

## 🚀 Features

* 📤 Upload and parse PDF documents
* 💬 Real-time Q\&A chat interface
* ✅ Automatically summarizes document on upload
* 🧠 Context-aware AI responses using Together API
* ⚠️ Friendly error messages and clean UI/UX

---

## 🛠️ Tech Stack

**Frontend:**
* React
* Socket.io-client
* Axios

**Backend:**
* Node.js
* Express
* Socket.io
* Multer (for file uploads)
* pdf-parse or pdfjs (for text extraction)

**AI Integration:**
* Together API (LLM for question answering)

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Deepakv14/AiDocumentQnA.git
cd ai-doc-qa
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../ui
npm install
```

### 4. Get Together API Key

* Sign up at [https://together.ai](https://together.ai)
* Create a `.env` file in `server/` and add:

```
TOGETHER_API_KEY=tgp_v1_Y5R5NoB8SsYSGzrhJbVzf9oUaLLwKVEweeFY9ACWSIc
```

### 5. Run the App

#### In separate terminals:

```bash
# Terminal 1 - backend
cd server
npm run dev

# Terminal 2 - frontend
cd ui
npm start
```

Open `http://localhost:3000` in your browser.

---

## 📂 Project Structure

```
root/
│
├── server/         # Express + AI + PDF Parsing backend
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── ui/             # React frontend
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   └── public/
│
└── README.md
```

---

## ✅ Additional Features Implemented
* [x] Auto-scroll chat to latest message
* [x] Submit on Enter key
* [x] Disable input before PDF upload
* [x] Friendly error & success messages

## ✅ Bonus Features Implemented
* [x] Auto-summary after upload

---

## 📄 License
This project is for demo and evaluation purposes.
