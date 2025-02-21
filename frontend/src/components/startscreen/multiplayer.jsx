import React from "react";

const MultiPlayer = ({ onGameStart, selectedRoom, onGameRoomSelect, onBack}) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="font-bold text-2xl mb-6">Join Game Room!</h1>
                <div className="flex flex-col items-center justify-center border-2 border-black rounded-lg p-10 bg-gray-800">
                    <button
                        onClick={() => onGameRoomSelect("Room 1")} 
                        className={`px-6 py-1 mb-2 ${
                            selectedRoom === "Room 1" ? "bg-blue-500" : "bg-red-500"
                        } hover:bg-red-700 text-white font-bold rounded-lg transition`}
                    >
                        Game Room 1
                    </button>

                    <button
                        onClick={() => onGameRoomSelect("Room 2")} 
                        className={`px-6 py-1 mb-2 ${
                            selectedRoom === "Room 2" ? "bg-blue-500" : "bg-red-500"
                        } hover:bg-red-700 text-white font-bold rounded-lg transition`}
                    >
                        Game Room 2
                    </button>

                    <button
                        onClick={() => onGameRoomSelect("Room 3")} 
                        className={`px-6 py-1 mb-2 ${
                            selectedRoom === "Room 3" ? "bg-blue-500" : "bg-red-500"
                        } hover:bg-red-700 text-white font-bold rounded-lg transition`}
                    >
                        Game Room 3
                    </button>
                   
                    <button
                        onClick={onGameStart} 
                        className="px-6 py-3 bg-green-400 hover:bg-green-700 text-white font-bold rounded-lg transition"
                    >
                        Start Game
                    </button>
                    <button
                        onClick={onBack}
                        className="px-3 py-1 mt-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition"
                    >
                        Back
                    </button>
                </div>
        </div>
    );
}

export default MultiPlayer;
