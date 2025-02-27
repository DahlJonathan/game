// ./backend/server.js

import { WebSocketServer } from 'ws';
import { PORT } from './config.js';
import GameState from './gameState.js';

const wss = new WebSocketServer({ port: PORT });
const gameState = new GameState();

wss.on('connection', (ws) => {
    const playerId = Math.random().toString(36).substr(2, 9);

    console.log(`Player ${playerId} connected`);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'joinLobby') {
            gameState.addPlayer(playerId);
            console.log(`${data.playerName} joined ${data.room}!`)
            gameState.updatePlayerName(playerId, data.playerName);
            const state = JSON.stringify({ type: 'update', state: gameState.getGameState() });
            wss.clients.forEach(client => client.send(state));
        }
        // New: handle startGame message
        if (data.type === "startGame") {
            gameState.resetCollectables();
            ws.send(JSON.stringify({ type: 'init', state: gameState.getGameState(), playerId }));
            // console.log("Game started, sending initial state:", gameState.getGameState());
        }
        if (data.type === "waitForStart") {
            console.log("Waiting for countdown to end...")
        }
        if (data.type === "input") {
            gameState.updatePlayer(playerId, data.input);
        }
        if (data.type === "quitGame") {
            gameState.removePlayer(playerId);
            console.log(`Player ${playerId} disconnected from game`);
            const deleteMessage = JSON.stringify({
                type: 'delete',
                state: gameState.getGameState(),
                playerId,
            });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(deleteMessage);
                }
            });
        }
        if (data.type === "unPause") {
            console.log("unPause")
        }
        if (data.type === "pause") {
            console.log("pause")
        }
       
    });

    ws.on('close', () => {
        gameState.removePlayer(playerId);
        console.log(`Player ${playerId} disconnected from socket`);
        const deleteMessage = JSON.stringify({
            type: 'delete',
            state: gameState.getGameState(),
            playerId,
        });
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(deleteMessage);
            }
        });
    });

});

// Send game state updates every 50ms
setInterval(() => {
    const state = JSON.stringify({ type: 'update', state: gameState.getGameState() });
    wss.clients.forEach(client => client.send(state));
    //console.log("Sending game state update:", gameState.getGameState());
}, 50);

console.log(`WebSocket server running on port ${PORT}`);