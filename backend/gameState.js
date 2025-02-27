export default class GameState {
    constructor() {
        this.players = {};
        this.collectables = [];
        this.gravity = 2;
        this.jumpStrength = 25;
        this.platforms = [
            { left: 100, top: 400, width: 200, height: 20 },
            { left: 400, top: 300, width: 200, height: 20 },
            { left: 700, top: 200, width: 200, height: 20 },
            { left: 500, top: 500, width: 200, height: 20 },
            { left: 850, top: 600, width: 200, height: 20 },
        ];
    }

    generateCollectables() {
        return Array.from({ length: 50 }, () => ({
            x: Math.random() * 1200,
            y: Math.random() * 600,
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
            y: 681, // Start on the ground
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
        delete this.players[playerId];
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
        if (player.y >= 681) {
            player.y = 681;
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