import React, { useState } from "react";
import GameArea from "./components/GameArea.jsx";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiplayer.jsx";

function App() {
  const [gameMode, setGameMode] = useState(null);  // Tracks selected game mode
  const [startGame, setStartGame] = useState(false);  // Tracks if the game has started

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
        <MultiPlayer onGameStart={() => setStartGame(true)} />
      ) : (
        <GameArea />
      )}    
    </div>
  );
}

export default App;