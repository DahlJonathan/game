import React from "react";

const MultiPlayer = ({ onGameStart, onGameRoom1 }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
            <h1 className="font-bold text-2xl mb-6">Join Game Room!</h1>
            <button
                onClick={onGameRoom1}  // Starts the game when clicked
                className="px-6 py-1 mb-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition"
            >
                Game Room 1
            </button>
            <button
                onClick={onGameStart}  // Starts the game when clicked
                className="px-6 py-3 bg-green-400 hover:bg-green-700 text-white font-bold rounded-lg transition"
            >
                Start Game
            </button>
        </div>
    );
}

export default MultiPlayer;
