import React from "react";

const EndScreen = ({ onQuit }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex flex-col justify-center items-center">
            <div className="bg-gray-800 text-white p-10 rounded-lg">
                <h1 className="text-3xl mb-4">Game Over!</h1>
                <button
                    onClick={onQuit}
                    className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition m-2"
                >
                    Quit
                </button>
            </div>
        </div>
    )
}

export default EndScreen;