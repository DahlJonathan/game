

import React from 'react';
import Player from './player';
import Platform from './platform'; // Import Platform component

const GameArea = () => {
  const platform = {
    x: 200, // Platform position from left
    y: 50, // Platform height (Y position)
    width: 200, // Platform width
    height: 20, // Platform height
  };

  return (
    <div
      className="h-screen w-screen bg-gray-900 flex justify-center items-center"
      id="game-area"
    >
      <div
        className="h-1/2 w-1/2 bg-gray-500 border-2 border-black rounded-lg shadow-lg"
        style={{
          position: "relative",
          width: "600px",
          height: "480px",
        }}
        id="game-container"
      >
        <Player />
        <Platform 
          x={platform.x} 
          y={platform.y} 
          width={platform.width} 
          height={platform.height} 
        />
      </div>
    </div>
  );
};

export default GameArea;


/*
export default class GameArea {
  constructor() {
      this.gameArea = document.getElementById("game-area");
      this.platforms = [];
      this.createPlatforms();
  }

  createPlatforms() {
      const platformData = [
          { left: 100, top: 400, width: 200, height: 20 },
          { left: 400, top: 300, width: 200, height: 20 },
          { left: 700, top: 200, width: 200, height: 20 },
          { left: 500, top: 500, width: 200, height: 20 },
          { left: 850, top: 600, width: 200, height: 20 },
      ];

      platformData.forEach(data => {
          const platform = document.createElement("div");
          platform.classList.add("platform");
          platform.style.position = "absolute";
          platform.style.left = `${data.left}px`;
          platform.style.top = `${data.top}px`;
          platform.style.width = `${data.width}px`;
          platform.style.height = `${data.height}px`;
          platform.style.backgroundColor = "brown";

          this.gameArea.appendChild(platform);
      });
  }
}*/