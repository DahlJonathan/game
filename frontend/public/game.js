import ws from "./websocket.js";

export default class Game {
    constructor() {
        this.ws = ws; // Connect to WebSocket server
        this.playerId = null;
        this.players = {};
        this.platforms = [];
        this.collectables = [];
        this.activeKeys = {}; // Track active keys
        this.inputInterval = null; // Timer for sending inputs

        this.gameContainer = document.getElementById("game-container");
        if (!this.gameContainer) return;
        this.gameContainer.style.width = "1280px";
        this.gameContainer.style.height = "570px";

        this.gameArea = document.createElement("div");
        this.gameArea.id = "game-area";
        this.gameArea.style.top = "0px";
        this.gameArea.style.left = "0px";
        this.gameArea.style.width = "100%";
        this.gameArea.style.maxHeight = "570px";
        this.gameContainer.appendChild(this.gameArea);

        this.lastRenderTime = 0;
        this.fpsInterval = 1000 / 60; // 60 FPS

        this.boundKeyDown = (event) => this.handleKeyChange(event, true);
        this.boundKeyUp = (event) => this.handleKeyChange(event, false);
        document.addEventListener("keydown", this.boundKeyDown);
        document.addEventListener("keyup", this.boundKeyUp);

        this.ws.addEventListener("message", (event) => this.handleServerMessage(event));

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    handleKeyChange(event, isPressed) {
        const key = event.key === " " ? "Spacebar" : event.key;
        this.activeKeys[key] = isPressed;

        // Start sending inputs at a fixed interval if not already running
        if (!this.inputInterval) {
            this.inputInterval = setInterval(() => this.sendInputs(), 50);
        }
    }

    sendInputs() {
        if (!this.playerId) return;

        const input = {
            moveLeft: this.activeKeys["ArrowLeft"] || false,
            moveRight: this.activeKeys["ArrowRight"] || false,
            jump: this.activeKeys["ArrowUp"] || false,
        };

        this.ws.send(JSON.stringify({ type: "input", input }));

        if (!input.moveLeft && !input.moveRight && !input.jump && this.players[this.playerId]?.isGrounded) {
            clearInterval(this.inputInterval);
            this.inputInterval = null;
        }
    }

    handleServerMessage(event) {
        const data = JSON.parse(event.data);

        if (data.type === "init") {
            this.playerId = data.playerId;
            this.platforms = data.state.platforms;
            this.platformImage = data.state.platformImage;
            this.collectables = data.state.collectables;
            this.collectablesImage = data.state.collectablesImage;
            this.playerImage = data.state.playerImage; // Add player image URL
            console.log("Received initial game state:", data.state);
        } else if (data.type === "update") {
            for (const [id, playerData] of Object.entries(data.state.players)) {
                if (!this.players[id]) {
                    this.players[id] = { x: playerData.x, y: playerData.y, lastX: playerData.x, lastY: playerData.y, points: playerData.points };
                } else {
                    this.players[id].lastX = this.players[id].x;
                    this.players[id].lastY = this.players[id].y;
                    this.players[id].x = playerData.x;
                    this.players[id].y = playerData.y;
                    this.players[id].points = playerData.points;
                    this.players[id].timestamp = Date.now();
                }
            }
            this.collectables = data.state.collectables;
        } else if (data.type === "delete") {
            const idToDelete = data.playerId;
            delete this.players[idToDelete];
            document.querySelectorAll(`.player-${idToDelete}`).forEach(el => el.remove());
        }
    }

    destroy() {
        if (this.inputInterval) {
            clearInterval(this.inputInterval);
            this.inputInterval = null;
        }

        document.removeEventListener("keydown", this.boundKeyDown);
        document.removeEventListener("keyup", this.boundKeyUp);

        this.ws.removeEventListener("message", this.handleServerMessage);

        if (this.gameArea) {
            this.gameArea.remove();
            this.gameArea = null;
        }

        this.players = {};
    }

    gameLoop(timestamp) {
        const elapsed = timestamp - this.lastRenderTime;

        if (elapsed > this.fpsInterval) {
            this.lastRenderTime = timestamp - (elapsed % this.fpsInterval);
            this.render();
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    render() {
        const gameArea = document.getElementById("game-area");
        if (!gameArea) {
            this.destroy();
            return;
        }

        // Clear all players, platforms, and collectables
        document.querySelectorAll('.player').forEach(el => el.remove());
        document.querySelectorAll(".platform").forEach(el => el.remove());
        document.querySelectorAll(".collectable").forEach(el => el.remove());

        // Render platforms
        this.platforms.forEach(platform => {
            let platformEl = document.createElement("div");
            platformEl.classList.add("platform");
            platformEl.style.position = "absolute";
            platformEl.style.left = `${platform.left}px`;
            platformEl.style.top = `${platform.top}px`;
            platformEl.style.width = `${platform.width}px`;
            platformEl.style.height = `${platform.height}px`;
            platformEl.style.backgroundImage = `url(${this.platformImage})`;
            platformEl.style.backgroundSize = "cover";
            gameArea.appendChild(platformEl);
        });

        // Render collectables
        this.collectables.forEach(collectable => {
            if (!collectable.collected) {
                let collectableEl = document.createElement("div");
                collectableEl.classList.add("collectable");
                collectableEl.style.position = "absolute";
                collectableEl.style.left = `${collectable.x}px`;
                collectableEl.style.top = `${collectable.y}px`;
                collectableEl.style.width = `${collectable.width}px`;
                collectableEl.style.height = `${collectable.height}px`;
                collectableEl.style.backgroundImage = `url(${this.collectablesImage})`;
                collectableEl.style.backgroundSize = "cover";
                gameArea.appendChild(collectableEl);
            }
        });

        const now = Date.now();
        // Render each player
        for (const [index, [id, player]] of Object.entries(Object.entries(this.players))) {
            let playerEl = document.createElement("div");
            // Add a generic class plus a unique one
            playerEl.classList.add("player", `player-${id}`);
            playerEl.style.position = "absolute";
            playerEl.style.width = "35px";
            playerEl.style.height = "35px";
            playerEl.style.backgroundImage = `url(${this.playerImage})`; // Set player image
            playerEl.style.backgroundSize = "cover";
            playerEl.style.backgroundPosition = "center";
            //playerEl.style.backgroundRepeat = "no-repeat";

            let t = Math.min((now - player.timestamp) / 50, 1);
            let interpolatedX = player.lastX + (player.x - player.lastX) * t;
            let interpolatedY = player.lastY + (player.y - player.lastY) * t;

            playerEl.style.left = `${interpolatedX}px`;
            playerEl.style.top = `${interpolatedY}px`;

            gameArea.appendChild(playerEl);
        }
    }
}