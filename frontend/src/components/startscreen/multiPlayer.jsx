// ./frontend/src/components/startscreen/multiplayer.jsx
import React, { useState, useEffect } from "react";
import ws from "../../../public/websocket";
import Game from "../../../public/game";

const MultiPlayer = ({ onGameRoomSelect, selectedRoom, onJoinGame, onGameStart, onBack }) => {
    const [playerName, setPlayerName] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);

    useEffect(() => {
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'lobbyUpdate') {
                setPlayers(Object.values(data.state.players));
            } else if (data.type === 'init') {
                setGameStarted(true);
                new Game();
            } else if (data.type === 'pause') {
                setGamePaused(true);
            } else if (data.type === 'unPause') {
                setGamePaused(false);
            }
        };
    }, []);

    // Add this useEffect to instantiate the Game class after the component has been rendered
    useEffect(() => {
        if (gameStarted) {
            new Game();
        }
    }, [gameStarted]);

    const handleJoin = () => {
        if (
            playerName.trim() &&
            selectedRoom &&
            players.length < 4 &&
            !players.some(player => player.name === playerName.trim())
        ) {
            ws.send(JSON.stringify({ type: 'joinLobby', playerName, room: selectedRoom }));
            setPlayerName("");
        }
    };

    const handleReady = () => {
        setIsReady(!isReady);
        ws.send(JSON.stringify({ type: 'ready', playerName, roomId: selectedRoom, isReady: !isReady }));
    };

    const handleStartGame = () => {
        ws.send(JSON.stringify({ type: 'startGame' }));
    };

    const handlePause = () => {
        ws.send(JSON.stringify({ type: 'pause' }));
    };

    const handleUnPause = () => {
        ws.send(JSON.stringify({ type: 'unPause' }));
    };

    const handleQuit = () => {
        ws.send(JSON.stringify({ type: 'quitGame' }));
        setGameStarted(false);
    };

    const handleRestart = () => {
        ws.send(JSON.stringify({ type: 'startGame' }));
    };

    if (gameStarted) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <h1 className="font-bold text-3xl mb-3">Game Started!</h1>
                <div id="game-container" className="relative w-full h-full border border-black bg-sky-100 overflow-hidden rounded-lg mt-1"></div>
                {gamePaused ? (
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50">
                        <h2 className="text-2xl mb-4">Game Paused</h2>
                        <button onClick={handleUnPause} className="px-6 py-2 mb-2 font-bold rounded-lg bg-green-500 hover:bg-green-700 text-white">Continue</button>
                        <button onClick={handleRestart} className="px-6 py-2 mb-2 font-bold rounded-lg bg-yellow-500 hover:bg-yellow-700 text-white">Restart</button>
                        <button onClick={handleQuit} className="px-6 py-2 mb-2 font-bold rounded-lg bg-red-500 hover:bg-red-700 text-white">Quit</button>
                    </div>
                ) : (
                    <button onClick={handlePause} className="absolute top-4 right-4 px-6 py-2 font-bold rounded-lg bg-yellow-500 hover:bg-yellow-700 text-white">Pause</button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="font-bold text-3xl mb-3">Join a Game Room!</h1>

            {/* Username Input */}
            <h2 className="font-bold text-xl mb-1">Enter Your Username</h2>
            <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="p-2 font-bold text-center text-black rounded-lg mb-2 bg-white"
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
                    <li key={index} className="text-lg">{player.name} {player.isReady ? '(Ready)' : ''}</li>
                ))}
            </ul>

            {/* Join Button */}
            <button
                onClick={handleJoin}
                disabled={!selectedRoom || players.length >= 4 || !playerName.trim() || players.some(player => player.name === playerName.trim())}
                className={`px-6 py-2 mb-2 font-bold rounded-lg transition ${
                    selectedRoom && players.length < 4 && playerName.trim() && !players.some(player => player.name === playerName.trim())
                        ? "bg-yellow-500 hover:bg-yellow-700"
                        : "bg-gray-500 cursor-not-allowed"
                } text-white`}
            >
                {players.length < 4 ? "Join Game" : "Room Full"}
            </button>

            {/* Ready Button */}
            <button
                onClick={handleReady}
                className={`px-6 py-2 mb-2 font-bold rounded-lg transition ${
                    isReady ? "bg-green-500 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-700"
                } text-white`}
            >
                {isReady ? "Unready" : "Ready"}
            </button>

            {/* Start Game Button */}
            <button
                onClick={handleStartGame}
                disabled={players.length < 2 || !players.every(player => player.isReady)}
                className={`px-6 py-3 font-bold rounded-lg transition ${
                    players.length >= 2 && players.every(player => player.isReady) ? "bg-green-500 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
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