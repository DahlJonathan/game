// ./frontend/src/components/startscreen/multiplayer.jsx
import React, { useState, useEffect } from "react";
import ws from "../../../public/websocket";
import GameWrapper from "../../GameWrapper";
import Scoreboard from "../gameinfo/scoreboard";
import Timer from "../gameinfo/timer";
import Fps from "../gameinfo/fps";

const MultiPlayer = ({ onGameRoomSelect, selectedRoom, onJoinGame, onGameStart, onBack, scoreboard, onPause }) => {
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
            } else if (data.type === 'pause') {
                setGamePaused(true);
            } else if (data.type === 'unPause') {
                setGamePaused(false);
            }
        };
    }, []);

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

    const handleRestart = () => {
        ws.send(JSON.stringify({ type: 'startGame' }));
    };

    if (gameStarted) {
        return (
            <>
                <div className="flex flex-col items-center justify-center h-screen w-full">
                    <GameWrapper players={players} reset={handleRestart} playerName={playerName} />
                    <div className="w-[60vw] w-[1280px]">
                    <Scoreboard players={scoreboard} />
                    </div>
                </div>
                <Timer isPaused={onPause}>
                <Fps className="absolute left-0 top-0 ml-4 mt-4 text-lg" />
                </Timer>
            </>
        )
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