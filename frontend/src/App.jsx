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
import HowToPlay from "./components/startscreen/howToPlay.jsx";

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseScreen, setShowPauseScreen] = useState(false);
  const [reset, setReset] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [pausedPlayer, setPausedPlayer] = useState("");
  const [leftGame, setLeftGame] = useState(false);
  const [playerLeft, setPlayerLeft] = useState("");
  const [gameRooms, setGameRooms] = useState({
    "room 1": [],
    "room 2": [],
    "room 3": [],
  })
  const [scoreboard, setScoreboard] = useState([]);
  const [winnerName, setWinnerName] = useState("");
  const [winnerPoints, setWinnerPoints] = useState(0);
  const [draw, setDraw] = useState(false);
  const [drawPlayers, setDrawPlayers] = useState([]);

  const handleJoinGame = (name) => {
    if (selectedRoom && gameRooms[selectedRoom].length < 4 && !gameRooms[selectedRoom].includes(name)) {
      setGameRooms({
        ...gameRooms,
        [selectedRoom]: [...gameRooms[selectedRoom], name],
      });
      setPlayers([...gameRooms[selectedRoom], name]);
      setPlayerName(name);
    }
    ws.send(JSON.stringify({ type: "joinLobby", playerName: name, room: selectedRoom }));
  };

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
    ws.send(JSON.stringify({ type: "quitGame" }));
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
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setIsPaused((prev) => {
          const newPausedState = !prev;
          setShowPauseScreen(newPausedState);
          ws.send(JSON.stringify({ type: newPausedState ? "pause" : "unPause", pausedPlayer: playerName }));
          return newPausedState;
        });
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleContinue = () => {
    console.log("unPause game")
    setIsPaused(false);
    setShowPauseScreen(false);
    ws.send(JSON.stringify({ type: "unPause" }));
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
      if (data.type === "unPauseGame") {
        setIsPaused(false);
        setShowPauseScreen(false);
        setPausedPlayer("");
        setLeftGame(false);
        setPlayerLeft("");
      }
      if (data.type === "pauseGame") {
        setIsPaused(true);
        setShowPauseScreen(true);
        setPausedPlayer(data.pausedPlayer);
      }
      if (data.type === "delete") {
        setLeftGame(true);
        setPlayerLeft(data.playerName);
      }
      if (data.type === "gameOver") {
        setWinnerName(data.winner);
        setWinnerPoints(data.points);
      }
      if (data.type === "draw") {
        setDraw(true);
        setDrawPlayers(data.players);
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="relative">
      {!gameMode ? (
        <StartScreen
          onSinglePlayer={() => setGameMode("single")}
          onMultiPlayer={() => setGameMode("multi")}
          onHowToPlay={() => setGameMode("howtoplay")}
        />
      ) : gameMode === "howtoplay" ? (
        <HowToPlay onBack={back} />
      ) : gameMode === "single" ? (
        <SinglePlayer onBack={back} />
      ) : !startGame ? (
        <>
          {isPaused ? (
            <div className="absolute inset-0">
              <PauseScreen
                playerName={playerName}
                pausedPlayer={pausedPlayer}
                playerLeft={playerLeft}
                leftGame={leftGame}
                onContinue={handleContinue}
                onQuit={quit}
                onRestart={restart}
                onPause={isPaused}
              />
            </div>
          ) : null}
          <MultiPlayer
            onGameRoomSelect={setSelectedRoom}
            selectedRoom={selectedRoom}
            players={players}
            onJoinGame={handleJoinGame}
            onGameStart={() => {
              if (gameRooms[selectedRoom].length >= 1) {
                setStartGame(true);
              }
            }}
            onBack={back}
            scoreboard={scoreboard}
            onPause={isPaused}
            onRestart={restart}
            winnerName={winnerName}
            winnerPoints={winnerPoints}
            draw={draw}
            drawPlayers={drawPlayers}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <GameWrapper players={gameRooms[selectedRoom] || []} pause={isPaused} reset={reset} playerName={playerName} />
            <div className="w-[60vw] w-[1280px]">
              <Scoreboard players={scoreboard} />
            </div>
          </div>
          <Timer onQuit={quit}>
            <Fps className="absolute left-0 top-0 ml-4 mt-4 text-lg" />
          </Timer>
        </>
      )}
    </div>
  );
}

export default App;