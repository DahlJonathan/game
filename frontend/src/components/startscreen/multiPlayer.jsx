// ./frontend/src/components/startscreen/multiplayer.jsx
import React, { useState } from "react";

const MultiPlayer = ({ onGameRoomSelect, selectedRoom, players = [], onJoinGame, onGameStart, onBack }) => {
    const [playerName, setPlayerName] = useState("");

    const handleJoin = () => {
      if (
        playerName.trim() &&
        selectedRoom &&
        players.length < 4 &&
        !players.includes(playerName.trim())
      ) {
        onJoinGame(playerName.trim());
        setPlayerName("");
      }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="font-bold text-3xl mb-3">Join a Game Room!</h1>

            {/* Username Input */}
            <h2 className="font-bold text-xl mb-1">Enter Your Username</h2>
            <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="p-2 font-bold text-center text-black rounded-lg mb-2"
                placeholder="Username"
            />

            {/* Game Room Selection */}
            <div className="mb-6">
                {["room 1", "room 2", "room 3"].map((room) => (
                    <button
                        key={room}
                        onClick={() => onGameRoomSelect(room)}
                        className={`px-3 py-1 m-2 font-bold rounded-lg transition ${
                            selectedRoom === room ? "bg-blue-500" : "bg-red-500 hover:bg-red-700"
                        } text-white`}
                    >
                        {room}
                    </button>
                ))}
            </div>

            {/* Player List */}
            <h2 className="text-xl mb-2">Players in Room: {players.length}/4</h2>
            <ul className="mb-4">
                {players.map((player, index) => (
                    <li key={index} className="text-lg">{player}</li>
                ))}
            </ul>

            {/* Join Button */}
            <button
                onClick={handleJoin}
                disabled={!selectedRoom || players.length >= 4 || !playerName.trim() || players.includes(playerName.trim())}
                className={`px-6 py-2 mb-2 font-bold rounded-lg transition ${
                    selectedRoom && players.length < 4 && playerName.trim() && !players.includes(playerName.trim())
                        ? "bg-yellow-500 hover:bg-yellow-700"
                        : "bg-gray-500 cursor-not-allowed"
                } text-white`}
            >
                {players.length < 4 ? "Join Game" : "Room Full"}
            </button>

            {/* Start Game Button */}
            <button
                onClick={onGameStart}
                disabled={players.length < 1}
                className={`px-6 py-3 font-bold rounded-lg transition ${
                    players.length >= 1 ? "bg-green-500 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
                } text-white`}
            >
                Start Game
            </button>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="px-3 py-2 mt-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition"
            >
                Back
            </button>
        </div>
    );
};

export default MultiPlayer;