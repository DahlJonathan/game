//./frontend/public/app.js
import Game from "./game.js";
import ws from "./websocket.js";

function initGame() {
    if (window.__gameInitialized) {
        return;
    }
    window.__gameInitialized = true;

    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) return;

    if (window.currentGame) {
        window.currentGame.destroy();
    }

    window.currentGame = new Game();

    // Send player movement to the server
    document.addEventListener('keydown', (event) => {
        const direction = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(direction)) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type:'move', playerId: window.currentGame.playerId, direction }));
            } else {
                console.log('WebSocket connection is not open');
            }
        }
    });
}

initGame();

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "delete") {
        window.__gameInitialized = false;
    }
}