const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { extractTextFromPDF } = require('./utils/pdfProcessor');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(bodyParser.json());

const upload = multer();
const sessions = {};

app.post('/api/chat/upload', upload.single('file'), async (req, res) => {
  const sessionId = uuidv4();
  const fileBuffer = req.file.buffer;
  const text = await extractTextFromPDF(fileBuffer);

  sessions[sessionId] = {
    pdfText: text,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Answer only using the document content unless necessary.",
      },
    ],
  };

  res.json({ sessionId });
});

io.on('connection', (socket) => {
  console.log('New socket connection');

  socket.on('ask', async ({ question, sessionId }) => {
    const session = sessions[sessionId];
    if (!session) {
      socket.emit('answer', { error: 'Invalid session ID' });
      return;
    }

    session.messages.push({ role: 'user', content: question });

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-3-8b-chat-hf',
        messages: [
          ...session.messages.slice(0, 1),
          { role: 'user', content: `Document:\n${session.pdfText}\n\nQuestion: ${question}` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    session.messages.push({ role: 'assistant', content: answer });

    socket.emit('answer', {
      answer,
      history: session.messages.slice(1)
    });
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

/* Using REST-APIs
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat.js');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

*/
