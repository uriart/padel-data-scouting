import React from 'react';
import { Scoreboard } from './Scoreboard';
import { TeamSection } from './TeamSection';

export function MatchView({
    score,
    players,
    openModal,
    isEditingNames,
    setIsEditingNames,
    handlePlayerNameChange,
    matchHasEnded,
    startNewMatch,
    handleNeutralPoint,
    setIsEditStrokesModalOpen
}) {
    return (
        <div>
            <Scoreboard score={score} matchHasEnded={matchHasEnded} />

            <div className="flex justify-end mb-4 space-x-2">
                <button
                    onClick={() => setIsEditStrokesModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    Editar Golpes
                </button>
                <button
                    onClick={() => setIsEditingNames(!isEditingNames)}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    {isEditingNames ? 'Guardar Nombres' : 'Editar Nombres'}
                </button>
                <button
                    onClick={() => startNewMatch(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Nuevo Partido
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TeamSection
                    team="team1"
                    teamName="Equipo 1"
                    players={players.team1}
                    openModal={openModal}
                    isEditing={isEditingNames}
                    onNameChange={handlePlayerNameChange}
                    onNeutralPoint={handleNeutralPoint}
                />
                <TeamSection
                    team="team2"
                    teamName="Equipo 2"
                    players={players.team2}
                    openModal={openModal}
                    isEditing={isEditingNames}
                    onNameChange={handlePlayerNameChange}
                    onNeutralPoint={handleNeutralPoint}
                />
            </div>
        </div>
    );
}
