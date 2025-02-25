import React, { useState } from "react";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiPlayer.jsx";
import GameWrapper from "./GameWrapper.jsx";
import ws from "../public/websocket.js";
import Scoreboard from "./components/gameinfo/scoreboard.jsx";
import Timer from "./components/gameinfo/timer.jsx";

function App(playerName) {
  const [gameMode, setGameMode] = useState(null);  
  const [startGame, setStartGame] = useState(false);  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  const handleJoinGame = (playerName) => {
    const joinMessage = {
      type: "joinLobby",
      room: selectedRoom,
      playerName,
    };

    ws.send(JSON.stringify(joinMessage));
    
    // Optimistically update the local player list (not working yet)
    setPlayers((prevPlayers) => [...prevPlayers, playerName]);
  };

  return (
    <div>
      {!gameMode? (
        <StartScreen
          onSinglePlayer={() => setGameMode("single")}
          onMultiPlayer={() => setGameMode("multi")}
        />
      ) : gameMode === "single"? (       
        <SinglePlayer onBack={() => setGameMode(null)} />
      ) :!startGame? (
        <MultiPlayer 
          onGameRoomSelect={setSelectedRoom}
          selectedRoom={selectedRoom}
          players={players}
          onJoinGame={handleJoinGame}
          onGameStart={() => selectedRoom && setStartGame(true)} 
          onBack={() => {
            setGameMode(null);
            setSelectedRoom(null);
          }}
        />
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div id="game-container" style={{ height: '720px', width: '1280px', border: '2px solid black', overflow: 'hidden', backgroundColor: 'lightblue' }} className="mx-auto">
              <GameWrapper playerName={playerName || ""}/>
            </div>
            <div className="scoreboard-container mt-8 w-full bg-gray-800 text-white text-2xl p-4 shadow-lg z-10 flex justify-center gap-4">
              <Scoreboard players={["Player 1", "Player 2", "Player 3", "Player 4"]} />
            </div>
            <Timer />
          </div>
        </div>
      )}    
    </div>
  );
}

export default App;