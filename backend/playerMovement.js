// Function to update player position based on direction
export function updatePlayerPosition(player, direction) {
    const step = 10;
    const gameAreaWidth = 1280; // Width of the game area
    const gameAreaHeight = 570; // Height of the game area

    switch (direction) {
        case 'ArrowRight':
            if (player.x + step < gameAreaWidth - player.width) {
                player.x += step;
            }
            break;
        case 'ArrowLeft':
            if (player.x - step >= 0) {
                player.x -= step;
            }
            break;
        case 'ArrowDown':
            if (player.y + step < gameAreaHeight - player.height) {
                player.y += step;
            }
            break;
        case 'ArrowUp':
            if (player.y - step >= 0) {
                player.y -= step;
            }
            break;
    }
    // console.log(`PlayerMovement -  Player moved to: (${player.x}, ${player.y})`); // Debug: Player movement
}