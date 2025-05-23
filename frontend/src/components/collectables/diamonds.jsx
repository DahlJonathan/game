import React from "react";

const Diamonds = ({ x, y, width, height, diamondsImage }) => {
  console.log("Rendering diamonds at:", { x, y, width, height });
  return (
    <div
      className="diamonds"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${diamondsImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    ></div>
  );
};

export default Diamonds;