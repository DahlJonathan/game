// src/utils/GameArea.jsx

import React from 'react';
import Player from './player';
import Platform from './platform'; // Import Platform component
import { platform } from './platformLogic';

const GameArea = ({ players, pause, reset }) => {
  return (
    <div
      className="h-screen w-screen bg-gray-900 flex justify-center items-center"
      id="game-area"
    >
      <div
        className="h-1/2 w-1/2 bg-gray-500 border-2 border-black rounded-lg shadow-lg"
        style={{
          position: "relative",
          width: "1280px",
          height: "720px",
        }}
        id="game-container"
      >
        {players.map((player, index) => (
          <Player key={index} pause={pause} reset={reset} index={index} />
        ))}
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