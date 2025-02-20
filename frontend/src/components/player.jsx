import React, { useState, useEffect } from "react";

const Player = () => {
  const [position, setPosition] = useState({
    x: 0,
    y: 435, // Initial Y position
  });

  const [isJumping, setIsJumping] = useState(false); // To track if the player is jumping
  const [jumpHeight, setJumpHeight] = useState(0); // Track the height of the jump
  const gravity = 5; // Simulate gravity (higher value makes the player fall faster)
  const [jumpPeak, setJumpPeak] = useState(false);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);

  const step = 10; // Horizontal movement step
  const gameAreaWidth = 600; // Game area width
  const gameAreaHeight = 480; // Game area height

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setIsMovingLeft(true);
    } else if (e.key === "ArrowRight") {
      setIsMovingRight(true);
    } else if (e.key === " " && !isJumping) { // Space bar for jumping
      setIsJumping(true); // Start jumping
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "ArrowLeft") {
      setIsMovingLeft(false);
    } else if (e.key === "ArrowRight") {
      setIsMovingRight(false);
    }
  };

  const handleJump = () => {
    if (isJumping) {
      if (!jumpPeak && jumpHeight < 100) {
        // Move player up while jumpHeight is less than the max height (100px)
        setJumpHeight((prev) => prev + 10);
      } else {
        // After reaching peak height, start falling down
        setJumpPeak(true);
        setJumpHeight((prev) => prev - gravity); // Gravity pulls player down
        if (jumpHeight <= 0) {
          // When player reaches the ground, stop jumping and reset position
          setIsJumping(false);
          setJumpHeight(0); // Reset jumpHeight
          setJumpPeak(false);
        }
      }
    }
  };

  const handleMovement = () => {
    if (isMovingLeft) {
      setPosition((prev) => ({
        ...prev,
        x: Math.max(prev.x - step, 0), // Prevent moving out of bounds
      }));
    }
    if (isMovingRight) {
      setPosition((prev) => ({
        ...prev,
        x: Math.min(prev.x + step, gameAreaWidth - 45), // Prevent moving out of bounds
      }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isJumping, jumpHeight, isMovingLeft, isMovingRight]); // Re-run effect when jump state or height changes

  useEffect(() => {
    if (isJumping) {
      const jumpInterval = setInterval(handleJump, 20); // Update every 20ms

      // Cleanup the interval when the jump ends
      return () => clearInterval(jumpInterval);
    }
  }, [isJumping, jumpHeight]); // Re-run when jumping or jump height changes

  useEffect(() => {
    const movementInterval = setInterval(handleMovement, 20); // Update every 20ms

    // Cleanup the interval when the component unmounts
    return () => clearInterval(movementInterval);
  }, [isMovingLeft, isMovingRight, position]); // Re-run when movement state or position changes

  return (
    <div
      className="w-10 h-10 bg-blue-500 border-2 border-white rounded-full"
      style={{
        position: "absolute",
        top: `${position.y - jumpHeight}px`, // Adjust Y position based on jump height
        left: `${position.x}px`,
      }}
      id="player"
    ></div>
  );
};

export default Player;