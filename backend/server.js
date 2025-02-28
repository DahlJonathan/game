// ./backend/server.js

import { WebSocketServer } from 'ws';
import { PORT } from './config.js';
import GameState from './gameState.js';

const wss = new WebSocketServer({ port: PORT });
const gameState = new GameState();

wss.on('connection', (ws) => {
    let playerId = null;

    console.log(`Player connected`);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'joinLobby') {
            playerId = Math.random().toString(36).substring(2, 11);
            gameState.addPlayer(playerId);
            console.log(`${data.playerName} joined ${data.room}!`)
            gameState.updatePlayerName(playerId, data.playerName);
            if (Object.keys(gameState.players).length === 1) {
                gameState.players[playerId].isLead = true;
            }
            const state = JSON.stringify({ type: 'lobbyUpdate', state: gameState.getGameState(), playerId });
            wss.clients.forEach(client => client.send(state));
        }
        if (data.type === 'ready') {
            gameState.players[playerId].isReady = data.isReady;
            const updateMessage = JSON.stringify({
                type: 'lobbyUpdate',
                state: gameState.getGameState(),
            });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(updateMessage);
                }
            });
        }
        if (data.type === "startGame") {
            if (gameState.players[playerId].isLead && Object.values(gameState.players).every(player => player.isReady)) {
                gameState.resetCollectables();
                const initMessage = JSON.stringify({ type: 'init', state: gameState.getGameState(), playerId });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(initMessage);
                    }
                });
                console.log("Game started, sending initial state:", gameState.getGameState());
            }
        }
        if (data.type === "input") {
            gameState.updatePlayer(playerId, data.input);
        }
        if (data.type === "pause") {
            console.log("Game paused");
            const pauseMessage = JSON.stringify({ type: 'pause' });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(pauseMessage);
                }
            });
        }
        if (data.type === "unPause") {
            console.log("Game unpaused");
            const unPauseMessage = JSON.stringify({ type: 'unPause' });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(unPauseMessage);
                }
            });
        }
        if (data.type === "quitGame") {
            gameState.removePlayer(playerId);
            console.log(`Player ${playerId} disconnected`);
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
    });

    ws.on('close', () => {
        if (playerId) {
            gameState.removePlayer(playerId);
            console.log(`Player ${playerId} disconnected`);
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
    });
});

// Send game state updates every 50ms
setInterval(() => {
    const state = JSON.stringify({ type: 'update', state: gameState.getGameState() });
    wss.clients.forEach(client => client.send(state));
    //console.log("Sending game state update:", gameState.getGameState());
}, 50);

console.log(`WebSocket server running on port ${PORT}`);