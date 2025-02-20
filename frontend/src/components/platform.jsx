// src/components/Platform.jsx
import React from "react";

const Platform = ({ x, y, width, height }) => {
  return (
    <div
      className="bg-green-500"
      style={{
        position: "absolute",
        left: `${x}px`,
        bottom: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    ></div>
  );
};

export default Platform;
