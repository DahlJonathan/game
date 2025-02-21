import React, { useState, useEffect } from "react";
import { checkCollisionWithPlatform } from "./platformLogic";
import { platform } from "./GameArea";

const Player = () => {
  const [position, setPosition] = useState({ x: 0, y: 675 });
  const [isJumping, setIsJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);
  const [isFalling, setIsFalling] = useState(false);
  const [isOnPlatform, setIsOnPlatform] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [jumpKeyReleased, setJumpKeyReleased] = useState(true);

  const gravity = 5;
  const step = 10;
  const jumpForce = 10;
  const maxJumpHeight = 150;
  const gameAreaWidth = 1280;
  const groundLevel = 675;

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setIsMovingLeft(true);
    } else if (e.key === "ArrowRight") {
      setIsMovingRight(true);
    } else if (
      (e.key === " " || e.key === "ArrowUp") &&
      (isGrounded || isOnPlatform) &&
      jumpKeyReleased
    ) {
      // Reset the jump baseline:
      // Update the base position to the current rendered position:
      // rendered position = position.y - jumpHeight.
      setPosition((prev) => ({ ...prev, y: prev.y - jumpHeight }));
      // Reset jumpHeight so the new jump starts at 0.
      setJumpHeight(0);

      // Initiate the jump.
      setIsJumping(true);
      setJumpKeyReleased(false);
      setIsGrounded(false);
      setIsOnPlatform(false);
      setIsFalling(false); // Start by rising.
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "ArrowLeft") {
      setIsMovingLeft(false);
    } else if (e.key === "ArrowRight") {
      setIsMovingRight(false);
    } else if (e.key === " " || e.key === "ArrowUp") {
      // Allow jump initiation again once the key is released.
      setJumpKeyReleased(true);
    }
  };

  // Jump logic that distinguishes rising from falling.
  const handleJump = () => {
    if (isJumping) {
      setJumpHeight((prev) => {
        let newJumpHeight;
        if (!isFalling) {
          // Ascending phase.
          if (prev + jumpForce >= maxJumpHeight) {
            setIsFalling(true);
            newJumpHeight = maxJumpHeight;
          } else {
            newJumpHeight = prev + jumpForce;
          }
        } else {
          // Descending phase.
          newJumpHeight = prev - gravity;
          // Once the arc is complete, cancel the jump so gravity can take over.
          if (newJumpHeight <= 0) {
            newJumpHeight = 0;
            setIsJumping(false);
            setIsFalling(false);
          }
        }
        return newJumpHeight;
      });
    }
  };

  const handleMovement = () => {
    if (isMovingLeft) {
      setPosition((prev) => ({ ...prev, x: Math.max(prev.x - step, 0) }));
    }
    if (isMovingRight) {
      setPosition((prev) => ({ ...prev, x: Math.min(prev.x + step, gameAreaWidth - 45) }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGrounded, isOnPlatform, jumpKeyReleased, isJumping, jumpHeight, position]);

  // Use an interval to update jump state.
  useEffect(() => {
    if (isJumping) {
      const jumpInterval = setInterval(handleJump, 20);
      return () => clearInterval(jumpInterval);
    }
  }, [isJumping, jumpHeight, isFalling, position]);

  useEffect(() => {
    const movementInterval = setInterval(handleMovement, 20);
    return () => clearInterval(movementInterval);
  }, [isMovingLeft, isMovingRight]);

  // Downforce / Gravity: when not jumping and not on a platform,
  // always pull the player down to the ground.
  useEffect(() => {
    const downforceInterval = setInterval(() => {
      if (!isJumping) {
        setPosition((prev) => {
          const newY = Math.min(prev.y + gravity, groundLevel);

          // Check for landing on the platform before applying gravity
          if (checkPlatformLanding(newY, prev.x)) {
            setIsOnPlatform(true);
            return ({ ...prev, y: platform.y - 40 }); // Land on platform
          }

          // Otherwise, continue falling
          if (newY >= groundLevel) {
            setIsGrounded(true);
            return { ...prev, y: groundLevel };
          } else {
            setIsGrounded(false);
          }

          return { ...prev, y: newY };
        });
      }
    }, 20);

    return () => clearInterval(downforceInterval);
  }, [isJumping, isOnPlatform, position.y]);

  // Helper to check for platform landing
  const checkPlatformLanding = (newY, playerX) => {
    const playerBottom = newY + 40;
    const isWithinXBounds =
      playerX + 10 >= platform.x && playerX <= platform.x + platform.width;

    return isWithinXBounds && playerBottom >= platform.y && newY <= platform.y;
  };

  // Run collision detection on every update.
  useEffect(() => {
    checkCollisionWithPlatform(
      position,
      jumpHeight,
      isFalling,
      setPosition,
      setJumpHeight,
      setIsJumping,
      setIsFalling,
      setIsOnPlatform,
      setIsGrounded
    );
  }, [position, jumpHeight, isFalling]);

  return (
    <div
      className="w-10 h-10 bg-blue-500 border-2 border-white rounded-full"
      style={{
        position: "absolute",
        top: `${position.y - jumpHeight}px`,
        left: `${position.x}px`,
      }}
      id="player"
    ></div>
  );
};

export default Player;