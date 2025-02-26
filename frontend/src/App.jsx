import React, { useState, useEffect } from "react";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiPlayer.jsx";
import GameWrapper from "./GameWrapper.jsx";
import ws from "../public/websocket.js";
import Scoreboard from "./components/gameinfo/scoreboard.jsx";
import Timer from "./components/gameinfo/timer.jsx";
import Fps from "./components/gameinfo/fps.jsx";
import PauseScreen from "./components/pausescreen/pauseScreen.jsx";

function App() {
  const [gameMode, setGameMode] = useState(null);  
  const [startGame, setStartGame] = useState(false);  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseScreen, setShowPauseScreen] = useState(false);
  const [reset, setReset] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [gameRooms, setGameRooms] = useState({
    "room 1": [],
    "room 2": [],
    "room 3": [],
  })

  const handleJoinGame = (name) => {
    if (selectedRoom && gameRooms[selectedRoom].length < 4 && !gameRooms[selectedRoom].includes(name)) {
      setGameRooms({
        ...gameRooms,
        [selectedRoom]: [...gameRooms[selectedRoom], name],
      });
      setPlayers([...gameRooms[selectedRoom], name]);
      setPlayerName(name); 
    }
  };

  /* const handleJoinGame = (playerName) => {
    const joinMessage = {
      type: "joinLobby",
      room: selectedRoom,
      playerName,
    };

    ws.send(JSON.stringify(joinMessage));
    
    // Optimistically update the local player list (not working yet)
    setPlayers((prevPlayers) => [...prevPlayers, playerName]);
  }; */

  const handleEscKey = (e) => {
    if (e.key === "Escape") {
      setIsPaused((prev) =>!prev);
      setShowPauseScreen((prev) =>!prev);
    }
  }

  const quit = () => {
    setGameRooms((prevGameRooms) => ({
      ...prevGameRooms,
       [selectedRoom]: [],
     }));
     setPlayers([]);
     setGameMode(null);
     setStartGame(false);
     setIsPaused(false);
     setShowPauseScreen(false);
  }

  const back = () => {
    setGameMode(null);
    setSelectedRoom(null);
    setPlayers([]);
    setStartGame(false);
    setIsPaused(false);
    setShowPauseScreen(false);
  };

  const restart = () => {
    setShowPauseScreen(false);
    setIsPaused(false);
    setReset(true);
    setTimeout(() => {
      setReset(false);
    }, 100);
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
            <div className=""></div>
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
            <Scoreboard players={[playerName]} />
           <Timer />
           <Fps />
        </>
      )}    
    </div>
  );
}  

export default App;