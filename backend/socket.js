import WebSocket from 'ws'; // Importing WebSocket
import { updateGameState, getInitialGameState } from './gameLogic.js'; // Importing game logic functions
import { generateUniqueId } from './idGenerator.js'; // Importing ID generation function

let gameState = getInitialGameState();
let players = {};

export function setupWebSocketServer(wss) {
    // Handling WebSocket connections
    wss.on('connection', (ws) => {
        const playerId = generateUniqueId(); // Generate a unique ID for the player
        console.log(`socket.js -  Player connected: ${playerId}`); // Debug: Player connection
        players[playerId] = { ws, name: `Player ${Object.keys(players).length + 1}` }; // Add player to the players object
        gameState.players[playerId] = { x: 0, y: 0, score: 0 }; // Initialize player state

        // Send initial game state to the connected player
        ws.send(JSON.stringify({ type: 'init', state: gameState, playerId }));

        // Handle incoming messages from the player
        ws.on('message', (message) => {
            console.log(`socket.js - Received message from ${playerId}: ${message}`); // Debug: WebSocket message
            const data = JSON.parse(message);
            if (data.type === 'move') {
                gameState = updateGameState(gameState, data); // Update game state based on player action
                console.log(`socket.js -  Updated game state: ${JSON.stringify(gameState)}`); // Debug: Updated game state
                broadcast(gameState); // Broadcast updated game state to all players
            }
        });

        // Handle player disconnection
        ws.on('close', () => {
            console.log(`socket.js -  Player disconnected: ${playerId}`); // Debug: Player disconnection
            delete players[playerId]; // Remove player from players object
            delete gameState.players[playerId]; // Remove player state from game state
            broadcast(gameState); // Broadcast updated game state to all players
        });
    });

    // Function to broadcast game state to all connected clients
    function broadcast(state) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', state }));
            }
        });
    }
}