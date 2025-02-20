import React from "react";

const SinglePlayer = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="font-bold text-2xl mb-6">Coming Soon!!!</h1>
      
      <button
        onClick={onBack}
        className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition"
      >
        Back
      </button>
    </div>
  );
};

export default SinglePlayer;
