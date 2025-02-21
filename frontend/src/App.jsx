import React, { useState } from "react";
import GameArea from "./components/GameArea.jsx";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiplayer.jsx";

function App() {
  const [gameMode, setGameMode] = useState(null);  
  const [startGame, setStartGame] = useState(false);  
  const [selectedRoom, setSelectedRoom] = useState(null);

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
        onGameStart={() => selectedRoom && setStartGame(true)} 
        onBack={() => {
          setGameMode(null);
          setSelectedRoom(null);
        }}
        />
      ) : (
        <GameArea />
      )}    
    </div>
  );
}

export default App;