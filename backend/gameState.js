export default class GameState {
    constructor() {
        this.players = {};
        this.collectables = [];
        this.collectablesImage = 'src/images/gem.png';
        this.platformImage = 'src/images/platform.jpg';
        this.gravity = 2;
        this.jumpStrength = 25;
        this.platforms = [
            { left: 0, top: 50, width: 100, height: 10 }, //left upper corner
            { left: 1180, top: 50, width: 100, height: 10 },//right upper coorner
            { left: 150, top: 100, width: 100, height: 10 },// first left
            { left: 1030, top: 100, width: 100, height: 10 },//first right
            { left: 150, top: 470, width: 100, height: 10 },// second left
            { left: 1030, top: 470, width: 100, height: 10 },// second right
            { left: 500, top: 200, width: 100, height: 10 },//first bottom left
            { left: 680, top: 200, width: 100, height: 10 },//first bottom right
            { left: 500, top: 210, width: 10, height: 160 },//middle
            { left: 770, top: 210, width: 10, height: 160 },//middle
            { left: 500, top: 370, width: 100, height: 10 },//middle
            { left: 680, top: 370, width: 100, height: 10 },//middle
            { left: 590, top: 470, width: 100, height: 10 },//bottom middle
            { left: 590, top: 90, width: 100, height: 10 },//top middle
            { left: 600, top: 285, width: 80, height: 10 },//middle
            { left: 200, top: 285, width: 100, height: 10 },//left middle
            { left: 980, top: 285, width: 100, height: 10 },//right middle
            { left: 0, top: 185, width: 100, height: 10 },//left second from top
            { left: 1180, top: 185, width: 100, height: 10 },//right second from top
            { left: 0, top: 385, width: 100, height: 10 },//left third from top
            { left: 1180, top: 385, width: 100, height: 10 },//right third from top
        ];

        this.gameOver = false;
        this.gamePaused = false;
    }

    generateCollectables() {
        return Array.from({ length: 60 }, () => ({
            x: Math.random() * 1200,
            y: Math.random() * 500,
            width: 25,
            height: 35,
            collected: false,
        }));
    }

    resetCollectables() {
        this.collectables = this.generateCollectables();
        // console.log("Reset collectables:", this.collectables);
    }

    addPlayer(playerId, name = "") {
        this.players[playerId] = {
            name,
            x: 0,
            y: 531, // Start on the ground
            velocityY: 0,
            isJumping: false,
            points: 0,
        };
    }

    updatePlayerName(playerId, name) {
        if (this.players[playerId]) {
            this.players[playerId].name = name;
            console.log(`Updated player ${playerId} name to ${name}`);
            this.players[playerId].points = 0;
            this.collectables = [];
        }
    }

    removePlayer(playerId) {
        delete this.players[playerId];
    }

    getPlayerName(playerId) {
        return this.players[playerId].name
    }

    updatePlayer(playerId, input) {
        if (this.gameOver) return;
        if (this.gamePaused) return;

        let player = this.players[playerId];
        if (!player) return;

        // Store the old position for horizontal collision checking.
        const oldX = player.x;

        // Handle movement inputs.
        if (input.moveLeft) player.x -= 10;
        if (input.moveRight) player.x += 10;
        if (input.jump && !player.isJumping) {
            player.isJumping = true;
            player.velocityY = -this.jumpStrength;
        }

        // Apply gravity
        player.velocityY += this.gravity;
        const newY = player.y + player.velocityY;
        let verticalResolved = false;

        // Process vertical collisions
        for (let platform of this.platforms) {
            const platformLeft = platform.left;
            const platformTop = platform.top;
            const platformRight = platform.left + platform.width;
            const platformBottom = platform.top + platform.height;

            // Check horizontal overlap before vertical resolution
            if (player.x + 35 > platformLeft && player.x < platformRight) {
                // Falling: land on platform if crossing its top boundary
                if (
                    player.velocityY > 0 &&
                    player.y + 35 <= platformTop &&
                    newY + 35 >= platformTop
                ) {
                    player.y = platformTop - 35; // Snap onto platform
                    player.velocityY = 0;
                    player.isJumping = false;
                    verticalResolved = true;
                    break; // No need to check other platforms
                }
                // Jumping: hit bottom of platform
                if (
                    player.velocityY < 0 &&
                    player.y > platformBottom &&
                    newY <= platformBottom
                ) {
                    player.y = platformBottom + 1; // Place player just below
                    player.velocityY = 0;
                    verticalResolved = true;
                    break;
                }
            }
        }

        // Update vertical position if no vertical collision was resolved
        if (!verticalResolved) {
            player.y = newY;
        }

        // Handle horizontal collisions
        // Only apply if the player is moving horizontally into a platform
        for (let platform of this.platforms) {
            const platformLeft = platform.left;
            const platformRight = platform.left + platform.width;
            const platformTop = platform.top;
            const platformBottom = platform.top + platform.height;

            // Check if player and platform vertically overlap
            if (player.y + 35 >= platformTop && player.y <= platformBottom) {
                // If moving right, check for collision with the platform's left side
                if (input.moveRight && oldX + 35 <= platformLeft && player.x + 35 > platformLeft) {
                    player.x = platformLeft - 35;
                }
                // If moving left, check for collision with the platform's right side
                if (input.moveLeft && oldX >= platformRight && player.x < platformRight) {
                    player.x = platformRight;
                }
            }
        }

        // Check for collectable collisions
        this.collectables.forEach(collectable => {
            if (
                !collectable.collected &&
                player.x < collectable.x + collectable.width &&
                player.x + 35 > collectable.x &&
                player.y < collectable.y + collectable.height &&
                player.y + 35 > collectable.y
            ) {
                collectable.collected = true;
                player.points += 1;
                console.log(`Player ${player.name} (ID: ${playerId}) collected a collectable and now has ${player.points} points.`);
            }
        });

        // Stay within game-area bounds.
        if (player.y >= 531) {
            player.y = 531;
            player.velocityY = 0;
            player.isJumping = false;
        }
        if (player.y < 0) {
            player.y = 0;
            player.velocityY = 0;
        }
        if (player.x < 0) {
            player.x = 0;
        }
        if (player.x > 1242) {
            player.x = 1242;
        }
    }

    pauseGame() {
        this.gamePaused = true;
    }

    unpauseGame() {
        this.gamePaused = false;
    }

    endGame() {
        this.gameOver = true;
        const winner = Object.values(this.players).reduce((max, player) => player.points > max.points ? player : max, { points: 0 });
        console.log(`Game over! Winner: ${winner.name} with ${winner.points} points`);
        const winnerMessage = JSON.stringify({
            type: 'gameOver',
            winner: winner.name,
            points: winner.points,
        });
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(winnerMessage);
            }
        });
    }

    getGameState() {
        return { 
            players: this.players, 
            platforms: this.platforms,
            collectables: this.collectables, 
            gameOver: this.gameOver, 
            platformImage: this.platformImage, 
            collectablesImage: this.collectablesImage 
        };
    }
}