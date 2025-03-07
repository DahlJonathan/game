import React, { useEffect, useState } from "react";
import ws from "../../../public/websocket";
import EndScreen from "../endscreen/endscreen";

function Timer({ children, isPaused, onTimeUp, onQuit, onRestart, winnerName, winnerPoints, draw, drawPlayers }) {
    const [timer, setTimer] = useState(500);
    const [gameStartTimer, setGameStartTimer] = useState(1);  
    const [gameStartedNow, setGameStartedNow] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeUp, setTimeUp] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameStartTimer > 0) {
                setGameStartTimer((prev) => prev - 1);
                ws.send(JSON.stringify({ type: "waitForStart" }));
            } else if (!gameStartedNow) {
                setGameStartedNow(true);
                setGameStarted(true);  
                ws.send(JSON.stringify({ type: "startGame" }));
            }

            if (gameStartTimer === 0) {
                setGameStartTimer(null); 
            }

            if (gameStartedNow && timer > 0 &&!isPaused &&!timeUp) {
                setTimer((prev) => prev - 1);
            } else if (gameStartedNow && timer === 0 &&!isPaused &&!timeUp) {
                onTimeUp();
                console.log("Time up");
                setTimeUp(true);
                clearInterval(interval);
                ws.send(JSON.stringify({ type: "endGame" }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [gameStartTimer, gameStartedNow, timer, gameStarted, isPaused, timeUp]);

    return (
        <div>
            {gameStartTimer!== null && (
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
            {timeUp && (
                <EndScreen onQuit={onQuit} onRestart={onRestart} winnerName={winnerName} winnerPoints={winnerPoints} draw={draw} drawPlayers={drawPlayers}/>
        )}
        </div>
    );
}

export default Timer;