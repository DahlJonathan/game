// GameWrapper.jsx
import { useEffect } from "react";

const GameWrapper = () => {
  useEffect(() => {
    const gameContainer = document.getElementById("game-container");
    
    if (!gameContainer) {
      console.error("Game container not found!");
      return;
    }

    const script = document.createElement("script");
    script.type = "module"; // Ensures ES module support
    script.src = "./app.js"; // Adjust path if necessary
    script.async = true;
    
    // Append script inside the game container
    gameContainer.appendChild(script);

    return () => {
      gameContainer.removeChild(script);
    };
  }, []);

  return <div id="game-container" style={{ minHeight: "100vh" }}></div>;
};

export default GameWrapper;
