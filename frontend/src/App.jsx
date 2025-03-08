import React, { useState, useEffect } from "react";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiPlayer.jsx";
import ws from "../public/websocket.js";
import PauseScreen from "./components/pausescreen/pauseScreen.jsx";
import HowToPlay from "./components/startscreen/howToPlay.jsx";
import LeaveGame from "./components/gameinfo/leaveGame.jsx";

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("Server 1");
  const [players, setPlayers] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseScreen, setShowPauseScreen] = useState(false);
  const [reset, setReset] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [pausedPlayer, setPausedPlayer] = useState("");
  const [leftGame, setLeftGame] = useState(false);
  const [playerLeft, setPlayerLeft] = useState("");
  const [gameRooms, setGameRooms] = useState({
    "Server 1": [],
  })
  const [scoreboard, setScoreboard] = useState([]);
  const [winnerName, setWinnerName] = useState("");
  const [winnerPoints, setWinnerPoints] = useState(0);
  const [draw, setDraw] = useState(false);
  const [drawPlayers, setDrawPlayers] = useState([]);

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
      if (e.key === "Escape" && startGame) {
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
  }, [startGame]);

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
        setWinnerName("");
        setWinnerPoints(0);
        setDraw(false);
        setDrawPlayers([]);
        setLeftGame(false);
        setPlayerLeft("");
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
      ) : (
        <>
          {isPaused && startGame && (
            <div className="absolute inset-0">
              <PauseScreen
                playerName={playerName}
                pausedPlayer={pausedPlayer}
                onContinue={handleContinue}
                onQuit={quit}
                onRestart={restart}
                onPause={isPaused}
              />
            </div>
          )}
          {leftGame && playerLeft !== "" && startGame && (
            <LeaveGame playerLeft={playerLeft} onClose={() => setLeftGame(false)} />
          )}
          <MultiPlayer
            onGameRoomSelect={setSelectedRoom}
            selectedRoom={selectedRoom}
            players={players}
            onJoinGame={(name) => {
              setGameRooms({
                ...gameRooms,
                [selectedRoom]: [...gameRooms[selectedRoom], name],
              });
              setPlayers([...gameRooms[selectedRoom], name]);
              setPlayerName(name);
            }}
            onGameStart={() => {
              if (!selectedRoom || !gameRooms[selectedRoom]) {
                console.error("No valid room selected.");
                return;
              }
              setStartGame(true);
            }}
            onBack={back}
            onQuit={quit}
            scoreboard={scoreboard}
            onPause={isPaused}
            onRestart={restart}
            winnerName={winnerName}
            winnerPoints={winnerPoints}
            draw={draw}
            drawPlayers={drawPlayers}
          />
        </>
      )}
    </div>
  );
}

export default App;