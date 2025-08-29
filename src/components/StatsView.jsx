import React, { useMemo } from 'react';

export function StatsView({ events, players }) {
    // Colors for stats
    const colors = {
        winners: 'text-emerald-600 dark:text-emerald-400',
        errors: 'text-rose-600 dark:text-rose-400',
        positive: 'text-indigo-600 dark:text-indigo-400',
        negative: 'text-amber-600 dark:text-amber-400',
        neutral: 'text-gray-600 dark:text-gray-400'
    };
    const stats = useMemo(() => {
        const allPlayers = [players.team1.p1, players.team1.p2, players.team2.p1, players.team2.p2];
        const playerStats = {};

        allPlayers.forEach(p => {
            playerStats[p] = {
                winners: 0,
                unforced_errors: 0,
                strokes: {}
            };
        });

        events.forEach(event => {
            if (!playerStats[event.player_id]) return;

            if (event.event_type === 'winner') {
                playerStats[event.player_id].winners++;
            } else if (event.event_type === 'unforced_error') {
                playerStats[event.player_id].unforced_errors++;
            }

            if (!playerStats[event.player_id].strokes[event.stroke]) {
                playerStats[event.player_id].strokes[event.stroke] = { winners: 0, unforced_errors: 0 };
            }

            if (event.event_type === 'winner') {
                playerStats[event.player_id].strokes[event.stroke].winners++;
            } else if (event.event_type === 'unforced_error') {
                playerStats[event.player_id].strokes[event.stroke].unforced_errors++;
            }
        });

        return playerStats;
    }, [events, players]);

    const handleDownloadCSV = () => {
        if (events.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const headers = ["id", "match_id", "player_id", "team_name", "event_type", "stroke", "set", "game", "point", "timestamp"];

        const getTeamName = (playerName, teamNumber) => {
            if (players.team1.p1 === playerName || players.team1.p2 === playerName) return "Equipo 1";
            if (players.team2.p1 === playerName || players.team2.p2 === playerName) return "Equipo 2";
            if (playerName === 'neutral') return teamNumber === 'team1' ? 'Equipo 1' : 'Equipo 2';
            return "N/A";
        };

        const rows = events.map(event => {
            const teamName = getTeamName(event.player_id, event.team);
            const escapeCsv = (str) => `"${String(str).replace(/"/g, '""')}"`;

            const rowData = [
                event.id,
                event.match_id,
                escapeCsv(event.player_id),
                escapeCsv(teamName),
                event.event_type,
                event.stroke,
                event.set,
                event.game,
                escapeCsv(event.point),
                event.timestamp
            ];
            return rowData.join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `padel_stats_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        try {
            // First, send data to backend
            const matchData = {
                events,
                players,
                stats
            };

            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(matchData)], { type: 'application/json' });
                navigator.sendBeacon(
                    'https://api-padel-data-scouting.loiro-8.workers.dev/save_match',
                    blob
                );
            } else {
                // fallback a fetch sin await
                fetch('https://api-padel-data-scouting.loiro-8.workers.dev/save_match', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(matchData)
                });
            }

            // Then open native share dialog
            if (navigator.share) {
                await navigator.share({
                    //title: 'Partido de Pádel',
                    //text: 'Mira las estadísticas de este partido de pádel',
                    url: `https://padel-data-scouting.loiro-8.workers.dev?match=${matchData.events[0].match_id}`
                });
            } else {
                alert('Tu navegador no soporta la función de compartir');
            }
        } catch (error) {
            console.error('Error al compartir:', error);
            alert('Error al compartir el partido');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-center flex-grow">Estadísticas del Partido</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        <span>Compartir</span>
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-md hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>CSV</span>
                    </button>
                </div>
            </div>
            {Object.keys(players).map(teamKey => (
                <div key={teamKey} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">{teamKey === 'team1' ? 'Equipo 1' : 'Equipo 2'}</h3>
                    <div className="space-y-5">
                        {Object.keys(players[teamKey]).map(playerKey => {
                            const playerName = players[teamKey][playerKey];
                            const playerData = stats[playerName];
                            if (!playerData) return null;

                            const balance = playerData.winners - playerData.unforced_errors;

                            return (
                                <div key={playerKey} className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-600 shadow-sm">
                                    <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">{playerName}</h4>
                                    <div className="grid grid-cols-3 gap-6 mb-5">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                            <p className={`text-2xl font-bold ${colors.winners}`}>{playerData.winners}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Winners</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                            <p className={`text-2xl font-bold ${colors.errors}`}>{playerData.unforced_errors}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Errores NF</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                            <p className={`text-2xl font-bold ${balance > 0 ? colors.positive : balance < 0 ? colors.negative : colors.neutral}`}>
                                                {balance > 0 ? `+${balance}` : balance}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Balance</p>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <h5 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">Detalle por golpe:</h5>
                                        <ul className="text-xs space-y-2">
                                            {Object.entries(playerData.strokes).map(([stroke, data]) => (
                                                <li key={stroke} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{stroke}</span>
                                                    <div className="flex space-x-3">
                                                        {data.winners > 0 &&
                                                            <span className={colors.winners}>
                                                                W: {data.winners}
                                                            </span>
                                                        }
                                                        {data.unforced_errors > 0 &&
                                                            <span className={colors.errors}>
                                                                E: {data.unforced_errors}
                                                            </span>
                                                        }
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
