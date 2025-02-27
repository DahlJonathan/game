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
    <div className="">
      <div
        id="game-container"
        className="relative w-[60vw] max-w-[1280px] h-auto aspect-[16/9] border border-black bg-sky-100 overflow-hidden rounded-lg mt-1"
      >
        <div id="game-area" className="absolute inset-0 w-auto"></div>
      </div>
    </div>
  );
  
};

export default GameWrapper;
