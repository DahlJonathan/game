export default class GameState {
    constructor() {
        this.players = {};
        this.collectables = [];
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
            { left: 500, top: 200, width: 10, height: 170 },//middle
            { left: 770, top: 200, width: 10, height: 170 },//middle
            { left: 500, top: 370, width: 100, height: 10 },//middle
            { left: 680, top: 370, width: 100, height: 10 },//middle
            { left: 590, top: 470, width: 100, height: 10 },//bottom middle
            { left: 590, top: 90, width: 100, height: 10 },//top middle
            { left: 600, top: 285, width: 80, height: 10 },//middle
            { left: 200, top: 285, width: 100, height: 10 },//left middle
            { left: 980, top: 285, width: 100, height: 10 },//right middle
            { left: 0, top: 185, width: 100, height: 10 },
            { left: 1180, top: 185, width: 100, height: 10 },
            { left: 0, top: 385, width: 100, height: 10 },
            { left: 1180, top: 385, width: 100, height: 10 },
        ];
    }

    generateCollectables() {
        return Array.from({ length: 3 }, () => ({
            x: Math.random() * 1200,
            y: Math.random() * 500,
            width: 15,
            height: 15,
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
        console.log("players after add:", this.players);
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
        console.log("removePlayer called")
        delete this.players[playerId];
        console.log("players after removePlayer:", this.players)
    }
    updatePlayer(playerId, input) {
        let player = this.players[playerId];
        if (!player) return;

        // Handle movement inputs
        if (input.moveLeft) player.x -= 10;
        if (input.moveRight) player.x += 10;
        if (input.jump && !player.isJumping) {
            player.isJumping = true;
            player.velocityY = -this.jumpStrength;
        }

        // Apply gravity
        player.velocityY += this.gravity;
        const newY = player.y + player.velocityY;
        let onPlatform = false;

        for (let platform of this.platforms) {
            const platformLeft = platform.left;
            const platformTop = platform.top;
            const platformRight = platform.left + platform.width;
            const platformBottom = platform.top + platform.height;

            // Check if player horizontally overlaps with the platform
            if (player.x + 35 > platformLeft && player.x < platformRight) {
                // Falling: land on the platform if player's feet cross its top boundary.
                if (
                    player.velocityY > 0 &&
                    player.y + 35 <= platformTop &&
                    newY + 35 >= platformTop
                ) {
                    player.y = platformTop - 35; // Snap onto platform
                    player.velocityY = 0;
                    player.isJumping = false;
                    onPlatform = true;
                    break; // Collision resolved; stop checking further platforms.
                }
                // Jumping: if the player's head is moving upward and will cross the platform’s bottom,
                // cancel the upward momentum so gravity takes over.
                if (
                    player.velocityY < 0 &&
                    player.y > platformBottom &&
                    newY <= platformBottom
                ) {
                    // Place player just below the platform’s bottom.
                    player.y = platformBottom + 1;
                    player.velocityY = 0;
                    break; // Resolve this collision.
                }
            }
        }

        // If no collision was detected, update the player's vertical position normally.
        if (!onPlatform) {
            player.y = newY;
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

        // Reset to ground if below it.
        if (player.y >= 531) {
            player.y = 531;
            player.velocityY = 0;
            player.isJumping = false;
        }
        if (player.x < 0) {
            player.x = 0;
        }
        if (player.x > 1242) {
            player.x = 1242;
        }
    }

    getGameState() {
        return { players: this.players, platforms: this.platforms, collectables: this.collectables };
    }
}