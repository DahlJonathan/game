import React from "react";

const StartScreen = ({ onSinglePlayer, onMultiPlayer }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">My Awesome Game</h1>
      
      <div className="flex gap-4">
        <button
          onClick={onSinglePlayer}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
          Singleplayer
        </button>

        <button
          onClick={onMultiPlayer}
          className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg transition"
        >
          Multiplayer
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
