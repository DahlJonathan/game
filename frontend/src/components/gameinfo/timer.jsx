import React, { useEffect, useState } from "react";
import ws from "../../../public/websocket";

function Timer({ children, setTimeEnd, reset, isPaused }) {
    const [timer, setTimer] = useState(10);
    const [gameStartTimer, setGameStartTimer] = useState(3);  
    const [gameStartedNow, setGameStartedNow] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && timer === 0) {
                clearInterval(interval);
                setTimeEnd(true);
            } else if (gameStartTimer > 0) {
                setGameStartTimer((prev) => prev - 1);
                ws.send(JSON.stringify({ type: "waitForStart" }));
            } else if (!gameStartedNow) {
                setGameStartedNow(true);
                setGameStarted(true);  
                ws.send(JSON.stringify({ type: "startGame" }));
            } else if (gameStartTimer === 0) {
                setGameStartTimer(null); 
            } else if (gameStartedNow && timer > 0 && !isPaused) {
                setTimer((prev) => prev - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [gameStartTimer, gameStartedNow, timer, gameStarted, setTimeEnd, isPaused]);


    useEffect(() => {
        if (reset) {
            setTimer(60);
            setGameStartTimer(10);
            setGameStartedNow(false);
        }
    })

    return (
        <div>
            {gameStartTimer !== null && (
                <div className="absolute flex flex-col rounded-lg p-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto bg-gray-800 text-white text-5xl p-4 shadow-lg flex justify-center items-center">
                    <p className="mb-3">Game starts in</p>
                    <p>{gameStartTimer}</p>
                </div>
            )}
            <div className="absolute top-0 w-[90vw] max-w-[1280px] h-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-5xl p-4 shadow-lg flex justify-center items-center gap-2 rounded-lg">
                {children}
                <p>Game time</p>
                <p>{timer}</p>
                <p>sec</p>
            </div>
        </div>
    );
}

export default Timer;
