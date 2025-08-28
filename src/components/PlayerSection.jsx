import React from 'react';

export function PlayerSection({ playerKey, team, playerName, openModal, isEditing, onNameChange }) {
    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            {isEditing ? (
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => onNameChange(team, playerKey, e.target.value)}
                    className="w-full p-2 text-lg font-semibold text-center bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md"
                />
            ) : (
                <h3 className="text-lg font-semibold text-center mb-2">{playerName}</h3>
            )}
            <div className="flex justify-around mt-2">
                <button
                    onClick={() => openModal(playerName, 'winner', team)}
                    className="w-5/12 py-3 text-sm font-bold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                    WINNER
                </button>
                <button
                    onClick={() => openModal(playerName, 'unforced_error', team)}
                    className="w-5/12 py-3 text-sm font-bold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
                >
                    ERROR NF
                </button>
            </div>
        </div>
    );
}
