import React from "react";

const HowToPlay = ({ onBack }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Panic Point Sprint</h1>
            <p className="text-lg text-center max-w-md">
                Panic Point Sprint is a fast-paced multiplayer game where you and your friends compete to collect as many points as possible in a limited time. The player with the most points at the end of the game wins.
            </p>
            <div className="text-lg text-center max-w-md mt-4 mb-4">
                <p>Use the arrow keys to move:</p>
                <div className="flex justify-center space-x-4">
                    <div className="flex flex-col items-center">
                        <span className="font-bold">⬅️</span>
                        <p>Left</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold">⬆️</span>
                        <p>Jump</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold">➡️</span>
                        <p>Right</p>
                    </div>
                </div>
                <div className="text-lg text-center max-w-md mt-4 mb-4">
                    <p>Long jump</p>
                    <div className="flex justify-center">
                        <img src="src/images/longjump.png" alt="longjump"/>
                    </div>
                </div>
               
                
                
                <div className="text-lg text-center max-w-md mb-4"></div>
                <p>Collect the green and pink diamonds to earn points.</p>
                <div className="flex justify-center items-center mt-2 space-x-5">
                    <img src="src/images/gem.png" alt="collectables" />
                    <img src="src/images/pink.png" alt="collectables" />
                </div>
                <div className="flex justify-center items-center mt-2 space-x-5">
                        <p>1 point</p>
                        <p>5 point</p>
                </div>              
            </div>
            <button
                onClick={onBack}
                className="px-3 py-2 mt-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition"
            >
                Back
            </button>
        </div>
    );
}

export default HowToPlay;