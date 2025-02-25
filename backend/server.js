// ./backend/server.js

import { WebSocketServer } from 'ws';
import { PORT } from './config.js';
import GameState from './gameState.js';

const wss = new WebSocketServer({ port: PORT });
const gameState = new GameState();

wss.on('connection', (ws) => {
    const playerId = Math.random().toString(36).substr(2, 9);
    gameState.addPlayer(playerId);

    console.log(`Player ${playerId} connected`);

    ws.send(JSON.stringify({ type: 'init', state: gameState.getGameState(), playerId }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'joinLobby') {
            console.log("joined lobby:", data)
            const updatedPlayers = data.playerName;
            const updateMessage = JSON.stringify({
                type: 'lobbyUpdate',
                room: data.room,
                players: updatedPlayers,
            });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(updateMessage);
                }
            });
        }
        if (data.type === "input") {
            gameState.updatePlayer(playerId, data.input);
        }
    });

    ws.on('close', () => {
        gameState.removePlayer(playerId);
        console.log(`Player ${playerId} disconnected`);
    });
});

// Send game state updates every 50ms
setInterval(() => {
    const state = JSON.stringify({ type: 'update', state: gameState.getGameState() });
    wss.clients.forEach(client => client.send(state));
}, 50);

console.log(`WebSocket server running on port ${PORT}`);
