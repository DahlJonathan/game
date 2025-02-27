import React from "react";

function Scoreboard({ players }) {
    const colors = ["green", "blue", "red", "yellow"];

    return (
        <div className="w-full bg-gray-800 text-white text-2xl p-4 shadow-lg flex justify-center items-center gap-4 rounded-lg">
            {players.map((player, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
                    <span>{player.name}: {player.points}</span>
                </div>
            ))}
        </div>
    );
}

export default Scoreboard;