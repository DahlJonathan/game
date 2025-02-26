// ./frontend/public/app.js
import Game from "./game.js";
import ws from "./websocket.js";

function initGame() {
    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) return;

    const game = new Game();
    console.log("Game initialized");

    // Request game initialization from the server
    // ws.send(JSON.stringify({ type: "startGame" }));

    // Handle WebSocket messages
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'init') {
            console.log("init");
        }
        if (message.type === "input") {
            console.log("message:", message);
        }
    };

    // Send player movement to the server
    document.addEventListener('keydown', (event) => {
        const direction = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(direction)) {
            ws.send(JSON.stringify({ type: 'move', playerId: game.playerId, direction }));
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
} else {
    initGame();
}
