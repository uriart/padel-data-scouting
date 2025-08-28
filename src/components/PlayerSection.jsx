import React from 'react';

export function PlayerSection({ playerKey, team, playerName, openModal, isEditing, onNameChange }) {
    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
            {isEditing ? (
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => onNameChange(team, playerKey, e.target.value)}
                    className="w-full p-2 text-lg font-semibold text-center bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
            ) : (
                <h3 className="text-lg font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">{playerName}</h3>
            )}
            <div className="flex justify-around mt-3 gap-3">
                <button
                    onClick={() => openModal(playerName, 'winner', team)}
                    className="w-5/12 py-3 text-sm font-bold text-white bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-102 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    WINNER
                </button>
                <button
                    onClick={() => openModal(playerName, 'unforced_error', team)}
                    className="w-5/12 py-3 text-sm font-bold text-white bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg shadow-md hover:from-rose-600 hover:to-rose-700 transition-all duration-200 transform hover:scale-102 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    ERROR NF
                </button>
            </div>
        </div>
    );
}
