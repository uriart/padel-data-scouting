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

            <div className="flex justify-end mb-6 space-x-3">
                <button
                    onClick={() => setIsEditStrokesModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    Editar Golpes
                </button>
                <button
                    onClick={() => setIsEditingNames(!isEditingNames)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg shadow-md hover:from-violet-600 hover:to-violet-700 transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    {isEditingNames ? 'Guardar Nombres' : 'Editar Nombres'}
                </button>
                <button
                    onClick={() => startNewMatch(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg shadow-md hover:from-rose-600 hover:to-rose-700 transition-all duration-200 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
