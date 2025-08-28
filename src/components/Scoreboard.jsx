import React from 'react';

export function Scoreboard({ score, matchHasEnded }) {
    const formatPoint = (p) => (p === 'AD' ? 'AD' : p);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6 text-center">
            <div className="flex justify-center items-center space-x-4 md:space-x-8">
                <div className="w-1/3 text-right font-semibold text-sm md:text-base">EQUIPO 1</div>
                <div className="w-1/3 flex flex-col items-center">
                   <div className="flex space-x-2 text-lg md:text-xl font-bold">
                        {score.sets.map((set, i) => (
                            <div key={i} className={`px-2 ${i === score.currentSet ? 'text-blue-500' : ''}`}>{set.team1}</div>
                        ))}
                    </div>
                    <div className="text-3xl md:text-5xl font-bold my-1">{score.isTieBreak ? score.points.team1 : formatPoint(score.points.team1)}</div>
                </div>
                <div className="w-1/3 flex flex-col items-center">
                    <div className="flex space-x-2 text-lg md:text-xl font-bold">
                        {score.sets.map((set, i) => (
                            <div key={i} className={`px-2 ${i === score.currentSet ? 'text-blue-500' : ''}`}>{set.team2}</div>
                        ))}
                    </div>
                    <div className="text-3xl md:text-5xl font-bold my-1">{score.isTieBreak ? score.points.team2 : formatPoint(score.points.team2)}</div>
                </div>
                <div className="w-1/3 text-left font-semibold text-sm md:text-base">EQUIPO 2</div>
            </div>
            <div className="flex justify-center items-center space-x-4 md:space-x-8 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-1/3 text-right"></div>
                <div className="w-1/3 text-center">{score.games.team1}</div>
                <div className="w-1/3 text-center">{score.games.team2}</div>
                <div className="w-1/3 text-left"></div>
            </div>
            {matchHasEnded && <div className="mt-4 text-lg font-bold text-green-500">PARTIDO FINALIZADO</div>}
            {score.isTieBreak && <div className="mt-2 text-sm font-bold text-red-500 animate-pulse">TIE-BREAK</div>}
        </div>
    );
}
