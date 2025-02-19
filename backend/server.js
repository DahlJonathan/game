// Importing required modules
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './config.js';

// ✅ Correct WebSocket import for ESM
import WebSocket, { WebSocketServer } from 'ws';

// Importing the WebSocket setup function
import { setupWebSocketServer } from './socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creating an Express application and HTTP server
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server }); // ✅ Should work now

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Set up the WebSocket server
setupWebSocketServer(wss);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
