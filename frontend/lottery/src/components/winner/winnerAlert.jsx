import { useEffect, useState } from "react";
import Winner from "./winner";

const WinnerAlert = ({ show, onClose }) => {
    useEffect(() => {
        if (show) {
            alert("You are the winner!");
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg animate-bounce">
                <Winner />
                <h2 className="text-2xl font-bold text-green-600">🎉 Congratulations! 🎉</h2>
                <p className="mt-2">You have won the raffle!</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};


export default WinnerAlert;