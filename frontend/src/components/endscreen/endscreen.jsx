import React from "react";

const EndScreen = ({onQuit, onRestart, playerName}) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
      {/* Dark Overlay */}
      <div className="absolute inset-0"></div>

      {/* Pause menu */}
      <div className="relative z-10 border-2 bg-gray-900 rounded-lg p-10 text-center shadow-lg">
        <h1 className="mb-5 text-3xl text-white">{playerName}</h1>
        <h1 className="mb-5 text-xl text-white">Collected most coins!</h1>
        <button
          onClick={onQuit}
          className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition m-2"
        >
          Quit
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg transition m-2"
        >
          Restart
        </button>
      </div>
    </div>
    );
};

export default EndScreen;