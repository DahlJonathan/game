import React, { useState, useEffect } from "react";
import StartScreen from "./components/startscreen/startScreen.jsx";
import SinglePlayer from "./components/startscreen/singlePlayer.jsx";
import MultiPlayer from "./components/startscreen/multiPlayer.jsx";
import ws from "../public/websocket.js";
import PauseScreen from "./components/pausescreen/pauseScreen.jsx";
import HowToPlay from "./components/startscreen/howToPlay.jsx";
import LeaveGame from "./components/gameinfo/leaveGame.jsx";
import RestartScreen from "./components/pausescreen/restartScreen.jsx";
import audio from "./audio.js";

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
  });
  const [scoreboard, setScoreboard] = useState([]);
  const [winnerName, setWinnerName] = useState("");
  const [winnerPoints, setWinnerPoints] = useState(0);
  const [draw, setDraw] = useState(false);
  const [drawPlayers, setDrawPlayers] = useState([]);
  const [restartScreen, setRestartScreen] = useState(false);
  const [restartPlayer, setRestartPlayer] = useState("");
  const [gameKey, setGameKey] = useState(0);
  const [restartTimer, setRestartTimer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [onlyPlayer, setOnlyPlayer] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

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
    audio.stopSound("background"); // Stop the background audio
    setRestartScreen(false);
    ws.send(JSON.stringify({ type: "quitGame" }));
  };

  const back = () => {
    setGameMode(null);
    setSelectedRoom(null);
    setPlayers([]);
    setStartGame(false);
    setIsPaused(false);
    setShowPauseScreen(false);
    audio.stopSound("background"); // Stop the background audio
  };

  const restart = () => {
    setShowPauseScreen(false);
    setIsPaused(false);
    setReset(true);
    audio.stopSound("background"); // Stop the background audio
    setTimeout(() => {
      setReset(false);
    }, 100);
  };

  const handleStartGame = () => {
    ws.send(JSON.stringify({ type: "startGame" }));
  };

  const handleRestart = () => {
    setGameKey((prev) => prev + 1);
    setRestartScreen(true);
    ws.send(JSON.stringify({ type: "restartRequest", player: playerName }));
  };

  const handleClose = () => {
    setRestartScreen(false);
    ws.send(JSON.stringify({ type: "closeRestart" }));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audio.muteAll(!isMuted);
  };

  useEffect(() => {
    const isPlayerInGame = players.some((p) => p.name === playerName);
    if (!isPlayerInGame) {
      setStartGame(false);
      setIsWaiting(true);
      return;
    }

    const handleEscKey = (e) => {
      if (e.key === "Escape" && startGame) {
        if (isPaused) {
          if (playerName === pausedPlayer || !pausedPlayer || playerLeft) {
            console.log("Unpause game");
            setIsPaused(false);
            setShowPauseScreen(false);
            ws.send(
              JSON.stringify({ type: "unPause", pausedPlayer: playerName })
            );
          }
        } else {
          console.log("Pause game");
          setIsPaused(true);
          setShowPauseScreen(true);
          ws.send(JSON.stringify({ type: "pause", pausedPlayer: playerName }));
        }
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [startGame, pausedPlayer, isPaused, playerName, playerLeft, players, isWaiting]);

  const handleContinue = () => {
    if (playerName !== pausedPlayer) return;
    setIsPaused(false);
    setShowPauseScreen(false);
    ws.send(JSON.stringify({ type: "unPause" }));
  };

  useEffect(() => {
    const handleMessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "update") {
        const playersData = data.state.players;
        const updatedScoreboard = Object.entries(playersData).map(
          ([id, playerData]) => ({
            name: playerData.name || id,
            points: playerData.points,
            character: playerData.playerImage,
          })
        );
        setPlayers(updatedScoreboard);
        setScoreboard(updatedScoreboard);
        setWinnerName("");
        setWinnerPoints(0);
        setDraw(false);
        setDrawPlayers([]);
        setLeftGame(false);
        setPlayerLeft("");
        setRestartTimer(false);
        setEndGame(false);
        setStartGame(true);
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
        const playersData = data.state.players;
        const updatedScoreboard = Object.entries(playersData).map(
          ([id, playerData]) => ({
            name: playerData.name || id,
            points: playerData.points,
            character: playerData.playerImage,
          })
        );
        setScoreboard(updatedScoreboard);
        setLeftGame(true);
        setPlayerLeft(data.playerName);
      }
      if (data.type === "gameOver") {
        setEndGame(true);
        setWinnerName(data.winner);
        setWinnerPoints(data.points);
        audio.stopSound("background");
      }
      if (data.type === "draw") {
        setDraw(true);
        setDrawPlayers(data.players);
      }
      if (data.type === "restart") {
        setRestartScreen(true);
        setRestartPlayer(data.restartPlayer);
        const updatedPlayers = Object.values(data.state.players);
        setPlayers(updatedPlayers);
      }
      if (data.type === "closeRematch") {
        setRestartScreen(false);
        setRestartPlayer("");
        setIsPaused(false);
        setShowPauseScreen(false);
        setPausedPlayer("");
      }
      if (data.type === "initRestart") {
        setGameKey((prev) => prev + 1);
        setRestartTimer(true);
        setIsPaused(false);
        setEndGame(false);
        setRestartScreen(false);
        setRestartPlayer("");
        audio.playSound("background");
      }
      if (data.type === "endGame") {
        setOnlyPlayer(true);
        setEndGame(true);
        setGameStarted(false);
      }
      if (data.type === "collectableCollected") {
        audio.playSound("gempoint"); // Play collectable sound
      }

      if (data.type === "diamondCollected") {
        audio.playSound("diapoint"); // Play diamond sound
      }
      if (data.type === "jump") {
        audio.playSound("jump"); // Play jump sound
      }
      if (data.type === "powerupCollected") {
        audio.playSound("powerup"); // Play powerup sound
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [players, playerName]);

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
          {isPaused && startGame && !endGame && playerName && (
            <div className="absolute inset-0">
              <PauseScreen
                playerName={playerName}
                pausedPlayer={pausedPlayer}
                onContinue={handleContinue}
                onQuit={quit}
                onRestart={handleRestart}
                onPause={isPaused}
                onlyPlayer={onlyPlayer}
              />
            </div>
          )}
          {restartScreen && startGame && scoreboard.length >= 2 && (
            <div className="absolute inset-0">
              <RestartScreen
                player={restartPlayer}
                players={players}
                onQuit={quit}
                onRestart={handleRestart}
                onClose={handleClose}
              />
            </div>
          )}
          {leftGame && playerLeft !== "" && startGame && (
            <LeaveGame
              playerLeft={playerLeft}
              onClose={() => setLeftGame(false)}
            />
          )}
          <MultiPlayer
            onGameRoomSelect={setSelectedRoom}
            restartTimer={restartTimer}
            selectedRoom={selectedRoom}
            setPlayerName={setPlayerName}
            playerName={playerName}
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
              }
              setStartGame(true);
              setIsPaused(false);
              setRestartScreen(false);
              setEndGame(false);
              setOnlyPlayer(false);
              setIsWaiting(false);
              audio.playSound("background"); // Play the background audio when the game starts
            }}
            handleStartGame={handleStartGame}
            onBack={back}
            onQuit={quit}
            scoreboard={scoreboard}
            onPause={isPaused}
            onRestart={handleRestart}
            winnerName={winnerName}
            winnerPoints={winnerPoints}
            draw={draw}
            drawPlayers={drawPlayers}
            gameKey={gameKey}
            endGame={endGame}
            onlyPlayer={onlyPlayer}
            startGame={startGame}
            restartScreen={restartScreen}
            isWaiting={isWaiting}
          />
        </>
      )}
    </div>
  );
}

export default App;
