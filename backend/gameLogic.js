function getInitialGameState() {
    return {
        players: {},
        scores: {},
        timer: 0,
    };
}

function updateGameState(state, data) {
    const { playerId, direction } = data;
    const player = state.players[playerId];

    switch (direction) {
        case 'ArrowRight':
            player.x += 10;
            break;
        case 'ArrowLeft':
            player.x -= 10;
            break;
        case 'ArrowDown':
            player.y += 10;
            break;
        case 'ArrowUp':
            player.y -= 10;
            break;
    }

    return state;
}

module.exports = { getInitialGameState, updateGameState };