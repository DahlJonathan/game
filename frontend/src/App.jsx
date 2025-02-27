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
  const [scoreboard, setScoreboard] = useState([]);

  const handleJoinGame = (name) => {
    if (selectedRoom && gameRooms[selectedRoom].length < 4 && !gameRooms[selectedRoom].includes(name)) {
      setGameRooms({
        ...gameRooms,
        [selectedRoom]: [...gameRooms[selectedRoom], name],
      });
      setPlayers([...gameRooms[selectedRoom], name]);
      setPlayerName(name); 
    }
    ws.send(JSON.stringify({ type: "joinLobby", playerName: name, room: selectedRoom}));
  };

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

  useEffect(() => {
    const handleMessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "update") {
        const playersData = data.state.players;
        const updatedScoreboard = Object.entries(playersData).map(([id, playerData]) => ({
          name: playerData.name || id,
          points: playerData.points,
        }));
        setScoreboard(updatedScoreboard);
      }
    };
  
    ws.addEventListener("message", handleMessage);
  
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, []);
  
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
            if (gameRooms[selectedRoom].length >= 1) {
              setStartGame(true);
            }
          }}
          onBack={back}
        />
      ) : (
        <>
          {isPaused? (
            <div className=""></div>
          ) : null}
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <GameWrapper players={gameRooms[selectedRoom] || []} pause={isPaused} reset={reset} playerName={playerName} />
            <div className="w-[60vw] max-w-[1280px]">
              <Scoreboard players={scoreboard} />
            </div>
          </div>
          {showPauseScreen && (
            <PauseScreen
              playerName={playerName}
              onContinue={handleContinue}
              onQuit={quit}
              onRestart={restart}
            />
          )}
          <Timer>
            <Fps className="absolute left-0 top-0 ml-4 mt-4 text-lg" />
          </Timer>
        </>
      )}
    </div>
  );
}

export default App;