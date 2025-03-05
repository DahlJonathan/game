import React from "react";

const EndScreen = ({onQuit }) => {
    return (
        <div>
            <div className="flex flex-col border-2 border-black text-white bg-gray-800 p-10 rounded-lg">
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