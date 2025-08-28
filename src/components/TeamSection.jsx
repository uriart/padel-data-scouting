import React from 'react';
import { PlayerSection } from './PlayerSection';

export function TeamSection({ team, teamName, players, openModal, isEditing, onNameChange, onNeutralPoint }) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{teamName}</h2>
                <button
                    onClick={() => onNeutralPoint(team)}
                    className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    +1 Punto
                </button>
            </div>
            <div className="space-y-5">
                <PlayerSection playerKey="p1" team={team} playerName={players.p1} openModal={openModal} isEditing={isEditing} onNameChange={onNameChange} />
                <PlayerSection playerKey="p2" team={team} playerName={players.p2} openModal={openModal} isEditing={isEditing} onNameChange={onNameChange} />
            </div>
        </div>
    );
}
