import React from 'react';

export function Scoreboard({ score, matchHasEnded }) {
    const formatPoint = (p) => (p === 'AD' ? 'AD' : p);

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-6 text-center border border-gray-100 dark:border-gray-700">
            <div className="flex justify-center items-center space-x-4 md:space-x-8">
                <div className="w-1/3 text-right font-semibold text-sm md:text-base text-gray-700 dark:text-gray-300">EQUIPO 1</div>
                <div className="w-1/3 flex flex-col items-center">
                   <div className="flex space-x-2 text-lg md:text-xl font-bold">
                        {score.sets.map((set, i) => (
                            <div key={i} className={`px-2 ${i === score.currentSet ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{set.team1}</div>
                        ))}
                    </div>
                    <div className="text-3xl md:text-5xl font-bold my-1 text-gray-900 dark:text-gray-100">{score.isTieBreak ? score.points.team1 : formatPoint(score.points.team1)}</div>
                </div>
                <div className="w-1/3 flex flex-col items-center">
                    <div className="flex space-x-2 text-lg md:text-xl font-bold">
                        {score.sets.map((set, i) => (
                            <div key={i} className={`px-2 ${i === score.currentSet ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{set.team2}</div>
                        ))}
                    </div>
                    <div className="text-3xl md:text-5xl font-bold my-1 text-gray-900 dark:text-gray-100">{score.isTieBreak ? score.points.team2 : formatPoint(score.points.team2)}</div>
                </div>
                <div className="w-1/3 text-left font-semibold text-sm md:text-base text-gray-700 dark:text-gray-300">EQUIPO 2</div>
            </div>
            <div className="flex justify-center items-center space-x-4 md:space-x-8 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-1/3 text-right"></div>
                <div className="w-1/3 text-center">{score.games.team1}</div>
                <div className="w-1/3 text-center">{score.games.team2}</div>
                <div className="w-1/3 text-left"></div>
            </div>
            {matchHasEnded && <div className="mt-4 text-lg font-bold text-emerald-600 dark:text-emerald-400">PARTIDO FINALIZADO</div>}
            {score.isTieBreak && <div className="mt-2 text-sm font-bold text-amber-600 dark:text-amber-400 animate-pulse">TIE-BREAK</div>}
        </div>
    );
}
