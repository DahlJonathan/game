import React, { useState, useEffect } from "react";
import GameArea from "./components/GameArea.jsx";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiplayer.jsx";
import PauseScreen from "./components/pausescreen/pauseScreen.jsx";

function App() {
  const [gameMode, setGameMode] = useState(null);  
  const [startGame, setStartGame] = useState(false);  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseScreen, setShowPauseScreen] = useState(false);

  const handleJoinGame = (playerName) => {
    if (players.length < 4) {
      setPlayers([...players, playerName]);
    }
  }

  const handleEscKey = (e) => {
    if (e.key === "Escape") {
      setIsPaused((prev) =>!prev);
      setShowPauseScreen((prev) =>!prev);
    }
  }

  const resetGame = () => {
    setGameMode(null);
    setSelectedRoom(null);
    setPlayers([]);
    setStartGame(false);
    setIsPaused(false);
    setShowPauseScreen(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleContinue = () => {
    setIsPaused(false);
    setShowPauseScreen(false);
  };

  return (
    <div className="relative">
      {!gameMode? (
        <StartScreen
          onSinglePlayer={() => setGameMode("single")}
          onMultiPlayer={() => setGameMode("multi")}
        />
      ) : gameMode === "single"? (       
        <SinglePlayer onBack={resetGame} />
      ) :!startGame? (
        <MultiPlayer 
          onGameRoomSelect={setSelectedRoom}
          selectedRoom={selectedRoom}
          players={players}
          onJoinGame={handleJoinGame}
          onGameStart={() => players.length > 1 && setStartGame(true)} 
          onBack={resetGame}
        />
      ) : (
        <>          
          {isPaused? (
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          ) : null}
          <GameArea players={players} pause={isPaused} />         
          {showPauseScreen && (
            <PauseScreen 
              onContinue={handleContinue} 
              onQuit={resetGame}  
            />
          )}
        </>
      )}    
    </div>
  );
}  

export default App;