import React, { useState } from "react";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiPlayer.jsx";
import GameWrapper from "./GameWrapper.jsx";
import ws from "../public/websocket.js";
import Scoreboard from "./components/gameinfo/scoreboard.jsx";
import Timer from "./components/gameinfo/timer.jsx";
import Fps from "./components/gameinfo/fps.jsx";
import PauseScreen from "./components/pausescreen/pauseScreen.jsx";

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
    <div className="relative">
      {!gameMode? (
        <StartScreen
          onSinglePlayer={() => setGameMode("single")}
          onMultiPlayer={() => setGameMode("multi")}
        />
      ) : gameMode === "single"? (       
        <SinglePlayer onBack={back} />
      ) :!startGame? (
        <MultiPlayer 
          onGameRoomSelect={setSelectedRoom}
          selectedRoom={selectedRoom}
          players={gameRooms[selectedRoom] || []}
          onJoinGame={handleJoinGame}
          onGameStart={() => {
            if (gameRooms[selectedRoom].length >= 1){
              setStartGame(true)
            }
          }} 
          onBack={back}
        />
      ) : (
        <>          
          {isPaused? (
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          ) : null}
          <GameWrapper players={gameRooms[selectedRoom] || []} pause={isPaused} reset={reset} playerName={playerName}/>     
          {showPauseScreen && (
            <PauseScreen 
              playerName={playerName}
              onContinue={handleContinue} 
              onQuit={quit}
              onRestart={restart}
            />
          )}
           <Timer />
           <Fps />
        </>
      )}    
    </div>
  );
}  

export default App;