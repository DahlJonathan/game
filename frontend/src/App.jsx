import React, { useState } from "react";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiPlayer.jsx";
import GameWrapper from "./GameWrapper.jsx";
import ws from "../public/websocket.js";

function App() {
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
      {!gameMode ? (
        <StartScreen
          onSinglePlayer={() => setGameMode("single")}
          onMultiPlayer={() => setGameMode("multi")}
        />
      ) : gameMode === "single" ? (       
        <SinglePlayer onBack={() => setGameMode(null)} />
      ) : !startGame ? (
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
        <GameWrapper />
      )}    
    </div>
  );
}

export default App;
