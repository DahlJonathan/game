const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { updateGameState, getInitialGameState } = require('./gameLogic');
const { PORT } = require('./config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

let gameState = getInitialGameState();

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'init', state: gameState }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'move') {
            gameState = updateGameState(gameState, data);
            broadcast(gameState);
        }
    });

    ws.on('close', () => {
        // Handle player disconnect
    });
});

function broadcast(state) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'update', state }));
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});