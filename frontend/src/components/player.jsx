import React, { useState, useEffect } from "react";
import { platform, checkCollisionWithPlatform } from "./platformLogic";
import PauseScreen from "./pausescreen/pauseScreen";

const Player = ({ pause, reset, index }) => {

  const initialPositions = [
    { x: 0, y: 675 },
    { x: 1230, y: 675 },
    { x: 0, y: 0 },
    { x: 1230, y: 0 },
  ];

  const [position, setPosition] = useState(initialPositions[index % initialPositions.length]);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);
  const [isFalling, setIsFalling] = useState(false);
  const [isOnPlatform, setIsOnPlatform] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [jumpKeyReleased, setJumpKeyReleased] = useState(true);
  const colors = ["green", "blue", "red", "yellow"];

  const gravity = 5;
  const step = 10;
  const jumpForce = 10;
  const maxJumpHeight = 150;
  const gameAreaWidth = 1280;
  const groundLevel = 675;

  const handleKeyDown = (e) => {
    if (pause) return;
    if (e.key === "ArrowLeft") {
      setIsMovingLeft(true);
    } else if (e.key === "ArrowRight") {
      setIsMovingRight(true);
    } else if (
      (e.key === " " || e.key === "ArrowUp") &&
      (isGrounded || isOnPlatform) &&
      jumpKeyReleased
    ) {
      setIsJumping(true);
      setJumpKeyReleased(false);
      setIsGrounded(false);
      setIsOnPlatform(false);
      setIsFalling(false);
    }
  };

  const handleKeyUp = (e) => {
    if (pause) return;
    if (e.key === "ArrowLeft") {
      setIsMovingLeft(false);
    } else if (e.key === "ArrowRight") {
      setIsMovingRight(false);
    } else if (e.key === " " || e.key === "ArrowUp") {
      setJumpKeyReleased(true);
    }
  };

  const handleJump = () => {
    if (pause) return;
    if (isJumping) {
      setJumpHeight((prev) => {
        let newJumpHeight;
        if (!isFalling) {
          if (prev + jumpForce >= maxJumpHeight) {
            setIsFalling(true);
            newJumpHeight = maxJumpHeight;
          } else {
            newJumpHeight = prev + jumpForce;
          }
        } else {
          newJumpHeight = prev - gravity;
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
    if (pause) return;
    if (isMovingLeft) {
      setPosition((prev) => ({...prev, x: Math.max(prev.x - step, 0) }));
    }
    if (isMovingRight) {
      setPosition((prev) => ({...prev, x: Math.min(prev.x + step, gameAreaWidth - 45) }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGrounded, isOnPlatform, jumpKeyReleased, isJumping, jumpHeight, position, pause]);

  useEffect(() => {
    if (pause) return;
    if (isJumping) {
      const jumpInterval = setInterval(handleJump, 20);
      return () => clearInterval(jumpInterval);
    }
  }, [isJumping, jumpHeight, isFalling, position, pause]);

  useEffect(() => {
    if (pause) return;
    const movementInterval = setInterval(handleMovement, 20);
    return () => clearInterval(movementInterval);
  }, [isMovingLeft, isMovingRight, pause]);

  useEffect(() => {
    if (pause) return;
    const downforceInterval = setInterval(() => {
      if (!isJumping) {
        setPosition((prev) => {
          const newY = Math.min(prev.y + gravity, groundLevel);

          if (checkPlatformLanding(newY, prev.x)) {
            setIsOnPlatform(true);
            return ({...prev, y: platform.y - 40 });
          }

          if (newY >= groundLevel) {
            setIsGrounded(true);
            return {...prev, y: groundLevel };
          } else {
            setIsGrounded(false);
          }

          return {...prev, y: newY };
        });
      }
    }, 20);

    return () => clearInterval(downforceInterval);
  }, [isJumping, isOnPlatform, position.y, pause]);

  const checkPlatformLanding = (newY, playerX) => {
    const playerBottom = newY + 40;
    const isWithinXBounds =
      playerX + 10 >= platform.x && playerX <= platform.x + platform.width;

    return isWithinXBounds && playerBottom >= platform.y && newY <= platform.y;
  };

  useEffect(() => {
    if (pause) return;
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
  }, [position, jumpHeight, isFalling, pause]);

  useEffect(() => {
    if (reset) {
      setPosition({ x: 0, y: 675 });
      setIsJumping(false);
      setJumpHeight(0);
      setIsFalling(false);
      setIsOnPlatform(false);
      setIsGrounded(true);
      setIsMovingLeft(false);
      setIsMovingRight(false);
      setJumpKeyReleased(true);
    }
  }, [reset]);

  return (
    <div
      className="w-10 h-10 bg-blue-500 border-2 border-white rounded-full"
      style={{
        position: "absolute",
        top: `${position.y - jumpHeight}px`,
        left: `${position.x}px`,
        backgroundColor: colors[index % colors.length]
      }}
      id="player"
    />
  );
};

export default Player;