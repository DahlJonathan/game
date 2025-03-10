import React, { useEffect } from "react";

function RestartScreen({ player, onQuit }) {
    useEffect(() => {

    }, [])

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative z-20 border-2 bg-gray-900 rounded-lg p-10 text-center shadow-lg text-white">
                <h1 className="mb-5 text-xl text-white">{player} wants to restart!</h1>
                <button
                    onClick={() => {
                        console.log("Accept")
                    }}
                    className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg transition m-2"
                >
                    Accept
                </button>

                <button
                    onClick={onQuit}
                    className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition m-2"
                >
                    Decline
                </button>
            </div>
        </div>
    )
}

export default RestartScreen;