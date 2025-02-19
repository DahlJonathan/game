import Game from "./game.js"; 
import ws from "./websocket.js";

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game(); 

    // Handle WebSocket messages
    ws.onmessage = (event) => {
        console.log('App.js - Received WebSocket message:', event.data);
        const message = JSON.parse(event.data);
        if (message.type === 'init') {
            game.setPlayerId(message.playerId);
        }
    };

    // Send player movement to the server
    document.addEventListener('keydown', (event) => {
        const direction = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(direction)) {
            console.log(`App.js -  Player moved: ${direction}`); // Debug: Player movement
            ws.send(JSON.stringify({ type: 'move', playerId: game.playerId, direction }));
        }
    });
});