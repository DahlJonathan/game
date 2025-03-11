import React, { useEffect, useState } from "react";
import ws from "../../../public/websocket";

function RestartScreen({ player, players: initialPlayers, onQuit, onClose }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [isReady, setIsReady] = useState(false);
  const [allReady, setAllReady] = useState(false);

  const onAccept = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    ws.send(JSON.stringify({ type: "accept", isReady: newReadyState }));
  };

  useEffect(() => {
    setPlayers(initialPlayers);
  }, [initialPlayers]);

  useEffect(() => {
    const handleMessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "rematchUpdate") {
        setPlayers(Object.values(data.state.players));
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (players.every((p) => p.isReady)) {
      setAllReady(true);
      console.log("All players ready, should start rematch...");
      ws.send(JSON.stringify({ type: "restartGame" }));
    }
  }, [players]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative z-20 bg-gray-900 rounded-lg p-10 text-center shadow-lg text-white">
        <h1 className="mb-5 text-xl text-white">{player} wants a rematch!</h1>
        <ul className="mb-4">
          {players.map((player, index) => (
            <li key={index} className="text-lg">
              {player.name} {player.isReady ? "(R)" : ""}
            </li>
          ))}
        </ul>
        <button
          onClick={onAccept}
          className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg transition m-2"
        >
          {!isReady ? "Ready" : "Unready"}
        </button>

        <button
          onClick={onQuit}
          className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition m-2"
        >
          Leave Game
        </button>

        <button
          onClick={onClose}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-lg transition m-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default RestartScreen;
