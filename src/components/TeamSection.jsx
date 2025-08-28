import React from 'react';
import { PlayerSection } from './PlayerSection';

export function TeamSection({ team, teamName, players, openModal, isEditing, onNameChange, onNeutralPoint }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{teamName}</h2>
                <button
                    onClick={() => onNeutralPoint(team)}
                    className="px-3 py-1 text-sm font-bold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
                >
                    +1 Punto
                </button>
            </div>
            <div className="space-y-4">
                <PlayerSection playerKey="p1" team={team} playerName={players.p1} openModal={openModal} isEditing={isEditing} onNameChange={onNameChange} />
                <PlayerSection playerKey="p2" team={team} playerName={players.p2} openModal={openModal} isEditing={isEditing} onNameChange={onNameChange} />
            </div>
        </div>
    );
}
