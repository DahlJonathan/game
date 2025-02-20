/*
// src/utils/PlatformLogic.js

export const platform = {
  x: 200, // Platform position from left
  y: 350, // Platform height (Y position)
  width: 200, // Platform width
  height: 20, // Platform height
};

export const checkCollisionWithPlatform = (position, jumpHeight, setPosition, setJumpHeight, setIsJumping) => {
  const playerBottom = position.y - jumpHeight + 10; // Adjusting for player's size (10px height)
  
  if (
    playerBottom >= platform.y && // Check if player's bottom is touching platform
    playerBottom <= platform.y + platform.height &&
    position.x + 10 >= platform.x && // Check if player is within platform's X bounds
    position.x <= platform.x + platform.width
  ) {
    setJumpHeight(0); // Reset jump height (player lands on the platform)
    setPosition((prev) => ({
      ...prev,
      y: platform.y - 10, // Set player y position to be on top of the platform
    }));
    setIsJumping(false); // Player has landed
  }
};*/

// src/utils/PlatformLogic.js
export function createPlatforms(gameArea) {
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

      gameArea.appendChild(platform);
  });
}