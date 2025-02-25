import React, { useEffect, useState } from "react";

function Timer({ gameStarted, setGameStarted }) {
    const [timer, setTimer] = useState(60);
    const [gameStartTimer, setGameStartTimer] = useState(10);  
    const [gameStartedNow, setGameStartedNow] = useState(gameStarted);

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameStartTimer > 0) {
                setGameStartTimer((prev) => prev - 1);
            } else if (!gameStartedNow) {
                setGameStartedNow(true);
                setGameStarted(true);  
            }

            if (gameStartTimer === 0) {
                setGameStartTimer(null); 
            }

            if (gameStartedNow && timer > 0) {
                setTimer((prev) => prev - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [gameStartTimer, gameStartedNow, timer, setGameStarted]);

    return (
        <div>
            {gameStartTimer !== null && (
                <div className="absolute flex flex-col rounded-lg p-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto bg-gray-800 text-white text-5xl p-4 shadow-lg flex justify-center items-center">
                    <p className="mb-3">Game starts in</p>
                    <p>{gameStartTimer}</p>
                </div>
            )}
            <div className="absolute top-0 gap-20 h-16 left-0 w-full bg-gray-800 text-white text-5xl p-4 shadow-lg flex justify-center items-center gap-4">
                <p>Game time</p>
                <p>{timer}</p>
                <p>sec</p>
            </div>
        </div>
    );
}

export default Timer;
