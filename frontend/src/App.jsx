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
  const [pauseGame, setPauseGame] = useState(false);

  const handleJoinGame = (playerName) => {
    if (players.length < 4) {
      setPlayers([...players, playerName]);
    }
  }

  const handleEscKey = (e) => {
    if (e.key === "Escape") {
      setPauseGame((prev) => !prev);
    }
  }

  const resetGame = () => {
    setGameMode(null);
    setSelectedRoom(null);
    setPlayers([]);
    setStartGame(false);
    setPauseGame(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div className="relative">
      {!gameMode ? (
        <StartScreen
          onSinglePlayer={() => setGameMode("single")}
          onMultiPlayer={() => setGameMode("multi")}
        />
      ) : gameMode === "single" ? (       
        <SinglePlayer onBack={resetGame} />
      ) : !startGame ? (
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
          <GameArea players={players} />         
          {pauseGame && (
            <PauseScreen 
              onContinue={() => setPauseGame(false)} 
              onQuit={resetGame}  
            />
          )}
        </>
      )}    
    </div>
  );
}  

export default App;
