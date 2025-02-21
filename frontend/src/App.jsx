import React, { useState } from "react";
import GameArea from "./components/GameArea.jsx";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiplayer.jsx";

function App() {
  const [gameMode, setGameMode] = useState(null);  
  const [startGame, setStartGame] = useState(false);  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  const handleJoinGame = (playerName) => {
    if (players.length < 4) {
      setPlayers([...players, playerName]);
    }
  }

  return (
    <div>
      {!gameMode? (
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
        onGameStart={() => players.length > 1 && setStartGame(true)} 
        onBack={() => {
          setGameMode(null);
          setSelectedRoom(null);
          setPlayers([]);
        }}
        />
      ) : (
        <GameArea players={players}/>
      )}    
    </div>
  );
}

export default App;