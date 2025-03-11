// filepath: /home/student/web-game/backend/server.js
import express from 'express';
import { WebSocketServer } from 'ws';
import { PORT } from './config.js';
import GameState from './gameState.js';
import path from 'path';

const app = express();
const wss = new WebSocketServer({ noServer: true });
const gameState = new GameState();
let gameInterval = null;
let gameEnded = false;

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

const server = app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', (ws) => {
    let playerId = null;

    console.log(`Player connected`);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'joinLobby') {
            const existingPlayer = Object.values(gameState.players).find(player => player.name === data.playerName.trim());
            if (existingPlayer) {
                ws.send(JSON.stringify({ type: 'error', message: 'Player name already exists' }));
                return;
            }

            playerId = Math.random().toString(36).substring(2, 11);
            gameState.addPlayer(playerId);
            console.log(`${data.playerName} joined the game!`)
            gameState.updatePlayerName(playerId, data.playerName);
            if (Object.keys(gameState.players).length === 1) {
                gameState.players[playerId].isLeader = true;
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
        if (data.type === 'characterSelect') {
            const player = gameState.players[playerId];
            if (player) {
                gameState.updatePlayerCharacter(playerId, data.characterId);
                player.playerImage = `src/images/${data.characterId}.png`;
            }
        }
        if (data.type === "startGame") {
            if (gameState.players[playerId].isLeader && Object.values(gameState.players).every(player => player.isReady)) {
                gameEnded = false;
                gameState.startGame();
                gameState.resetCollectables();
                gameState.resetPowerUp();

                let playerIds = Object.keys(gameState.players);
                playerIds.forEach((id, index) => {
                    gameState.initializePlayerPos(id, index);
                });

                const initMessage = JSON.stringify({ type: 'init', state: gameState.getGameState(), playerId });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(initMessage);
                    }
                });
                gameState.unpauseGame();
                startGameLoop();
            }
        }
        if (data.type === "endGame") {
            const topPlayers = gameState.endGame();
            if (topPlayers.length > 1) {
                const drawMessage = JSON.stringify({
                    type: 'draw',
                    players: topPlayers.map(player => player.name)
                });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(drawMessage);
                    }
                });
            } else {
                const winnerMessage = JSON.stringify({
                    type: 'gameOver',
                    winner: topPlayers.name,
                    points: topPlayers.points,
                });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(winnerMessage);
                    }
                });
            }
            gameEnded = true;
            stopGameLoop();
        };
        if (data.type === "input") {
            gameState.updatePlayer(playerId, data.input);
        }
        if (data.type === "pause" && !gameEnded) {
            let playerName = gameState.getPlayerName(playerId);
            gameState.pauseGame();
            stopGameLoop();
            const pauseMessage = JSON.stringify({ type: 'pauseGame', pausedPlayer: playerName });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(pauseMessage);
                }
            });
        }
        if (data.type === "unPause" && !gameEnded) {
            gameState.unpauseGame();
            startGameLoop();
            const unPauseMessage = JSON.stringify({ type: 'unPauseGame', pausedPlayer: "" });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(unPauseMessage);
                }
            });
        }
        if (data.type === "quitGame" || data.type === "leaveLobby") {
            let playerName = gameState.getPlayerName(playerId);
            gameState.removePlayer(playerId);
            console.log(`Player ${playerName} disconnected`);
            const deleteMessage = JSON.stringify({
                type: 'delete',
                state: gameState.getGameState(),
                playerId,
                playerName,
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
            let playerName = gameState.getPlayerName(playerId);
            gameState.removePlayer(playerId);
            console.log(`Player ${playerId} disconnected`);

            // Assign a new leader if the current leader leaves
            const remainingPlayerIds = Object.keys(gameState.players);
            if (remainingPlayerIds.length > 0) {
                const newLeaderId = remainingPlayerIds[0]; // First remaining player becomes leader
                gameState.players[newLeaderId].isLeader = true;
            }

            const lobbyUpdateMessage = JSON.stringify({
                type: 'lobbyUpdate',
                state: gameState.getGameState(),
            });

            const deleteMessage = JSON.stringify({
                type: 'delete',
                state: gameState.getGameState(),
                playerId,
                playerName,
            })

            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(lobbyUpdateMessage);
                    client.send(deleteMessage);
                }
            });
        }
    });

});

function startGameLoop() {
    if (!gameInterval) {
        gameInterval = setInterval(() => {
            const state = JSON.stringify({ type: 'update', state: gameState.getGameState() });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(state);
                }
            });
        }, 50);
    }
}

function stopGameLoop() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

console.log(`WebSocket server running on port ${PORT}`);