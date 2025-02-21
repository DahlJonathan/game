import { platform } from "./GameArea";

export const checkCollisionWithPlatform = (
  position,
  jumpHeight,
  isFalling,
  setPosition,
  setJumpHeight,
  setIsJumping,
  setIsFalling,
  setIsOnPlatform,
  setIsGrounded
) => {
  // Calculate the player's top and bottom 
  const playerTop = position.y - jumpHeight;
  const playerBottom = playerTop + 40;

  // Check horizontal overlap with the platform.
  const isWithinXBounds =
    position.x + 10 >= platform.x && position.x <= platform.x + platform.width;

  if (!isWithinXBounds) {
    setIsOnPlatform(false);
    return;
  }

  // --- Descending Collision (landing on top) ---
  if (isFalling && playerBottom >= platform.y && playerTop <= platform.y) {
    setJumpHeight(0);
    setPosition((prev) => ({ ...prev, y: platform.y - 40 }));
    setIsFalling(false);
    setIsJumping(false);
    setIsOnPlatform(true);
    setIsGrounded(false);
    return;
  }

  // --- Ascending Collision (from below) ---
  if (!isFalling && playerTop <= platform.y + platform.height && playerTop > platform.y) {
    setIsFalling(true);
  }
};
