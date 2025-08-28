import React, { useMemo } from 'react';

export function StatsView({ events, players }) {
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

            //await fetch('https://api-dummy-url.com/matches', {
            //    method: 'POST',
            //    headers: {
            //        'Content-Type': 'application/json',
            //    },
            //    body: JSON.stringify(matchData)
            //});

            // Then open native share dialog
            if (navigator.share) {
                await navigator.share({
                    title: 'Partido de Pádel',
                    text: 'Mira las estadísticas de este partido de pádel',
                    url: window.location.href + "match/" + matchData.events[0].match_id
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
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        <span>Compartir</span>
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>CSV</span>
                    </button>
                </div>
            </div>
            {Object.keys(players).map(teamKey => (
                <div key={teamKey} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-bold mb-4">{teamKey === 'team1' ? 'Equipo 1' : 'Equipo 2'}</h3>
                    <div className="space-y-4">
                        {Object.keys(players[teamKey]).map(playerKey => {
                            const playerName = players[teamKey][playerKey];
                            const playerData = stats[playerName];
                            if (!playerData) return null;

                            const balance = playerData.winners - playerData.unforced_errors;

                            return (
                                <div key={playerKey} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h4 className="font-semibold mb-3">{playerName}</h4>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <p className="text-2xl font-bold text-green-500">{playerData.winners}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Winners</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-red-500">{playerData.unforced_errors}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Errores NF</p>
                                        </div>
                                        <div>
                                            <p className={`text-2xl font-bold ${balance > 0 ? 'text-blue-500' : balance < 0 ? 'text-orange-500' : ''}`}>
                                                {balance > 0 ? `+${balance}` : balance}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h5 className="font-semibold text-sm mb-2">Detalle por golpe:</h5>
                                        <ul className="text-xs space-y-1">
                                            {Object.entries(playerData.strokes).map(([stroke, data]) => (
                                                <li key={stroke} className="flex justify-between items-center p-1 bg-gray-100 dark:bg-gray-600 rounded">
                                                    <span className="font-medium capitalize">{stroke}</span>
                                                    <div className="flex space-x-2">
                                                        {data.winners > 0 &&
                                                            <span className="text-green-600 dark:text-green-400">
                                                                W: {data.winners}
                                                            </span>
                                                        }
                                                        {data.unforced_errors > 0 &&
                                                            <span className="text-red-600 dark:text-red-400">
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
