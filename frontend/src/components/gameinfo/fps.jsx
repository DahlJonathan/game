import React, { useState, useEffect } from "react";

function Fps() {
  const [fps, setFps] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    const handleFrame = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      setFrameCount((prevFrameCount) => prevFrameCount + 1);
      setLastTime(timestamp);

      if (deltaTime >= 1000) {
        setFps(frameCount);
        setFrameCount(0);
      }

      requestAnimationFrame(handleFrame);
    };

    requestAnimationFrame(handleFrame);

    return () => {
      // Clean up any event listeners or timeouts here
    };
  }, [lastTime, frameCount]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, fontSize: 24, color: 'black', backgroundColor: 'white' }}>
      <div>FPS: {fps}</div>
    </div>
  );
}

export default Fps;