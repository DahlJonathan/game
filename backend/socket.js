
import { generateUniqueId } from './idGenerator.js';

let gameRooms = {};

export function setupSocketServer(io) {
    io.on('connection', (socket) => {
        let playerId;
        let roomId;

        socket.on('join', (data) => {
            playerId = generateUniqueId();
            roomId = data.roomId;

            if (!gameRooms[roomId]) {
                gameRooms[roomId] = {
                    players: {},
                    gameState: getInitialGameState(),
                    gameStarted: false,
                    readyPlayers: new Set(),
                };
            }

            if (Object.keys(gameRooms[roomId].players).length < 4) {
                gameRooms[roomId].players[playerId] = { socket, name: data.name };
                socket.emit('joined', { playerId, roomId, players: Object.values(gameRooms[roomId].players).map(p => p.name) });
                broadcast(roomId, { type: 'playerList', players: Object.values(gameRooms[roomId].players).map(p => p.name) });
            } else {
                socket.emit('roomFull');
            }
        });

        socket.on('start', () => {
            if (gameRooms[roomId]) {
                gameRooms[roomId].readyPlayers.add(playerId);
                if (gameRooms[roomId].readyPlayers.size === Object.keys(gameRooms[roomId].players).length) {
                    gameRooms[roomId].gameStarted = true;
                    broadcast(roomId, { type: 'start' });
                }
            } else {
                console.error(`Room with ID ${roomId} does not exist`);
            }
        });

        socket.on('move', (data) => {
            if (gameRooms[roomId]) {
                gameRooms[roomId].gameState = updateGameState(gameRooms[roomId].gameState, data);
                broadcast(roomId, { type: 'update', state: gameRooms[roomId].gameState });
            } else {
                console.error(`Room with ID ${roomId} does not exist`);
            }
        });

        socket.on('leave', () => {
            if (gameRooms[roomId]) {
                delete gameRooms[roomId].players[playerId];
                gameRooms[roomId].readyPlayers.delete(playerId);
                broadcast(roomId, { type: 'playerList', players: Object.values(gameRooms[roomId].players).map(p => p.name) });
                if (Object.keys(gameRooms[roomId].players).length === 0) {
                    delete gameRooms[roomId];
                }
            } else {
                console.error(`Room with ID ${roomId} does not exist`);
            }
        });

        socket.on('disconnect', () => {
            if (roomId && playerId && gameRooms[roomId]) {
                delete gameRooms[roomId].players[playerId];
                gameRooms[roomId].readyPlayers.delete(playerId);
                broadcast(roomId, { type: 'playerList', players: Object.values(gameRooms[roomId].players).map(p => p.name) });
                if (Object.keys(gameRooms[roomId].players).length === 0) {
                    delete gameRooms[roomId];
                }
            }
        });
    });

    function broadcast(roomId, message) {
        if (gameRooms[roomId]) {
            Object.values(gameRooms[roomId].players).forEach(player => {
                player.socket.emit(message.type, message);
            });
        } else {
            console.error(`Room with ID ${roomId} does not exist`);
        }
    }
}