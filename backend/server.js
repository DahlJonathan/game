import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './config.js';
import { Server } from 'socket.io';
import { setupSocketServer } from './socket.js';
import mime from 'mime';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to set the correct MIME type for .jsx files
app.use((req, res, next) => {
  if (req.url.endsWith('.jsx')) {
    res.type(mime.getType('jsx'));
  }
  next();
});

app.use(express.static(path.join(__dirname, '../frontend/public')));

setupSocketServer(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});