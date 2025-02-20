// Importing the player movement function
import { updatePlayerPosition } from './frontend/src/components/playerMovement.js';

// Function to get the initial game state
export function getInitialGameState() {
    return {
        players: {},
        scores: {},
        timer: 0,
    };
}

// Function to update the game state based on player actions
export function updateGameState(state, data) {
    const { playerId, direction } = data;
    const player = state.players[playerId];

    // Check if the player exists in the game state
    if (!player) {
        console.error(`GameLogic - Player with ID ${playerId} does not exist in the game state`); // Debug: Player not found
        return state;
    }

    // Ensure player has width and height properties
    player.width = player.width || 35;
    player.height = player.height || 35;

    updatePlayerPosition(player, direction); // Update player position

    // Update score or other game logic here
    state.scores[playerId] = (state.scores[playerId] || 0) + 1;
    
    console.log(`GameLogic - Game state updated for player ${playerId}: ${JSON.stringify(state)}`); // Debug: Game state update

    return state;
}