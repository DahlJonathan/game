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

  return (
    <div className="flex flex-col h-screen">
      {/* Game Container */}
      <div
        id="game-container"
        className="flex-grow bg-lightblue relative"
        
      >
        {/* Your game content */}
      </div>
    </div>
  );
};

export default GameWrapper;
