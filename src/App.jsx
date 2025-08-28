import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MatchView } from './components/MatchView';
import { StatsView } from './components/StatsView';
import { Modal } from './components/Modal';
import { EditStrokesModal } from './components/EditStrokesModal';
import { initDB, addEventToDB, getEventsFromDB, clearDB, loadSharedMatch } from './db/indexedDB';
// Importamos el nombre del store
let db;
const STORE_NAME = 'match_events';
const POINT_SEQUENCE = [0, 15, 30, 40];

function App() {
    const [view, setView] = useState('match');
    const [matchId, setMatchId] = useState(null);
    const [events, setEvents] = useState([]);
    const [players, setPlayers] = useState({
        team1: { p1: 'Jugador 1A', p2: 'Jugador 1B' },
        team2: { p1: 'Jugador 2A', p2: 'Jugador 2B' },
    });
    const [score, setScore] = useState({
        sets: [{ team1: 0, team2: 0 }, { team1: 0, team2: 0 }, { team1: 0, team2: 0 }],
        games: { team1: 0, team2: 0 },
        points: { team1: 0, team2: 0 },
        currentSet: 0,
        isTieBreak: false
    });
    const [modal, setModal] = useState({ isOpen: false, player: null, eventType: null, team: null });
    const [isEditingNames, setIsEditingNames] = useState(false);
    const [history, setHistory] = useState([]);
    const [isEditStrokesModalOpen, setIsEditStrokesModalOpen] = useState(false);

    const defaultStrokes = ['Drive', 'Revés', 'Volea', 'Bandeja', 'Víbora', 'Smash', 'Saque', 'Resto', 'Contrapared', 'Chiquita', 'Globo', 'Salida de pared'];
    const [strokeTypes, setStrokeTypes] = useState(() => {
        try {
            const storedStrokes = localStorage.getItem('strokeTypes');
            return storedStrokes ? JSON.parse(storedStrokes) : defaultStrokes;
        } catch (error) {
            console.error("Error parsing stroke types from localStorage", error);
            return defaultStrokes;
        }
    });

    // Initialize DB and load data on component mount
    useEffect(() => {
        const initialize = async () => {
            const dbInstance = await initDB();
            db = dbInstance;

            // Check if we're loading a shared match
            const urlParams = new URLSearchParams(window.location.search);
            const matchUuid = urlParams.get('match');

            if (matchUuid) {
                try {
                    // Loading shared match from API
                    const matchData = await loadSharedMatch(matchUuid);
                    setMatchId(matchData.matchId);
                    setEvents(matchData.events);
                    setPlayers(matchData.players);
                    recalculateStateFromEvents(matchData.events);
                    setView('stats'); // Automatically show stats for shared matches
                } catch (error) {
                    console.error('Error loading shared match:', error);
                    alert('No se pudo cargar el partido compartido. Iniciando nuevo partido...');
                    await startNewMatch(true);
                }
            } else {
                // Normal app initialization
                const storedMatchId = localStorage.getItem('currentMatchId');
                if (storedMatchId) {
                    setMatchId(storedMatchId);
                    const storedEvents = await getEventsFromDB(storedMatchId);
                    setEvents(storedEvents);
                    recalculateStateFromEvents(storedEvents);

                    const storedPlayers = localStorage.getItem('players');
                    if (storedPlayers) {
                        setPlayers(JSON.parse(storedPlayers));
                    }
                } else {
                    await startNewMatch(true);
                }
            }
        };
        initialize();
    }, []);

    // Save players to localStorage whenever they change
    useEffect(() => {
        if(matchId) {
            localStorage.setItem('players', JSON.stringify(players));
        }
    }, [players, matchId]);

    // Save strokeTypes to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('strokeTypes', JSON.stringify(strokeTypes));
    }, [strokeTypes]);

    const recalculateStateFromEvents = (allEvents) => {
        let tempScore = {
            sets: [{ team1: 0, team2: 0 }, { team1: 0, team2: 0 }, { team1: 0, team2: 0 }],
            games: { team1: 0, team2: 0 },
            points: { team1: 0, team2: 0 },
            currentSet: 0,
            isTieBreak: false
        };

        let tempHistory = [];

        allEvents.forEach(event => {
            let pointWinnerTeam;
            if (event.event_type === 'neutral_point') {
                pointWinnerTeam = event.team;
            } else {
                pointWinnerTeam = (event.event_type === 'winner' && event.team === 'team1') || (event.event_type === 'unforced_error' && event.team === 'team2') ? 'team1' : 'team2';
            }
            tempHistory.push({ score: JSON.parse(JSON.stringify(tempScore)), event });
            tempScore = calculateNewScore(tempScore, pointWinnerTeam);
        });

        setScore(tempScore);
        setHistory(tempHistory);
    };

    const handlePlayerNameChange = async (team, player, name) => {
        const oldName = players[team][player];
        
        // Update players state
        setPlayers(prev => ({
            ...prev,
            [team]: { ...prev[team], [player]: name }
        }));

        // Update all events with the new player name
        const updatedEvents = events.map(event => {
            if (event.player_id === oldName) {
                const updatedEvent = {
                    ...event,
                    player_id: name
                };
                
                // Update in IndexedDB
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                store.put(updatedEvent);
                
                return updatedEvent;
            }
            return event;
        });

        // Update events state
        setEvents(updatedEvents);

        // Update history with new player names
        const updatedHistory = history.map(historyItem => ({
            ...historyItem,
            event: historyItem.event.player_id === oldName ? 
                { ...historyItem.event, player_id: name } : 
                historyItem.event
        }));
        
        setHistory(updatedHistory);
    };

    const startNewMatch = async (isInitialLoad = false) => {
        const start = isInitialLoad ? true : window.confirm('¿Estás seguro de que quieres empezar un nuevo partido? Se borrarán todos los datos del partido actual.');

        if (start) {
            await clearDB();
            const newMatchId = crypto.randomUUID();
            localStorage.setItem('currentMatchId', newMatchId);
            localStorage.removeItem('players');

            setMatchId(newMatchId);
            setEvents([]);
            setScore({
                sets: [{ team1: 0, team2: 0 }, { team1: 0, team2: 0 }, { team1: 0, team2: 0 }],
                games: { team1: 0, team2: 0 },
                points: { team1: 0, team2: 0 },
                currentSet: 0,
                isTieBreak: false
            });
            setPlayers({
                team1: { p1: 'Jugador 1A', p2: 'Jugador 1B' },
                team2: { p1: 'Jugador 2A', p2: 'Jugador 2B' },
            });
            setHistory([]);
            setView('match');
        }
    };

    const undoLastPoint = useCallback(async () => {
        if (history.length === 0) {
            alert("No hay acciones para deshacer.");
            return;
        }

        const lastState = history[history.length - 1];
        const lastEvent = lastState.event;

        const newHistory = history.slice(0, -1);
        const newEvents = events.filter(e => e.id !== lastEvent.id);
        setHistory(newHistory);
        setEvents(newEvents);
        setScore(lastState.score);

        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.delete(lastEvent.id);
        } catch (error) {
            console.error("Error al deshacer el punto en la BD:", error);
            setHistory(history);
            setEvents(events);
            setScore(score);
        }
    }, [history, events, score]);

    const calculateNewScore = (currentScore, pointWinnerTeam) => {
        let newScore = JSON.parse(JSON.stringify(currentScore));
        const opponentTeam = pointWinnerTeam === 'team1' ? 'team2' : 'team1';

        if (newScore.isTieBreak) {
            newScore.points[pointWinnerTeam]++;
            const pointsT1 = newScore.points.team1;
            const pointsT2 = newScore.points.team2;

            if ((pointsT1 >= 7 && pointsT1 >= pointsT2 + 2) || (pointsT2 >= 7 && pointsT2 >= pointsT1 + 2)) {
                newScore.games[pointWinnerTeam]++;
                newScore.sets[newScore.currentSet][pointWinnerTeam] = newScore.games[pointWinnerTeam];
                newScore.sets[newScore.currentSet][opponentTeam] = newScore.games[opponentTeam];
                newScore.currentSet++;
                newScore.games = { team1: 0, team2: 0 };
                newScore.points = { team1: 0, team2: 0 };
                newScore.isTieBreak = false;
            }
            return newScore;
        }

        if (newScore.points[pointWinnerTeam] === 40) {
            if (newScore.points[opponentTeam] === 40) {
                newScore.points[pointWinnerTeam] = 'AD';
            } else if (newScore.points[opponentTeam] === 'AD') {
                newScore.points[opponentTeam] = 40;
            } else {
                newScore.games[pointWinnerTeam]++;
                newScore.points = { team1: 0, team2: 0 };
            }
        } else if (newScore.points[pointWinnerTeam] === 'AD') {
            newScore.games[pointWinnerTeam]++;
            newScore.points = { team1: 0, team2: 0 };
        } else {
            const currentPointIndex = POINT_SEQUENCE.indexOf(newScore.points[pointWinnerTeam]);
            newScore.points[pointWinnerTeam] = POINT_SEQUENCE[currentPointIndex + 1];
        }

        const gamesT1 = newScore.games.team1;
        const gamesT2 = newScore.games.team2;

        if ((gamesT1 >= 6 && gamesT1 >= gamesT2 + 2) || (gamesT2 >= 6 && gamesT2 >= gamesT1 + 2)) {
            const setWinner = gamesT1 > gamesT2 ? 'team1' : 'team2';
            newScore.sets[newScore.currentSet].team1 = gamesT1;
            newScore.sets[newScore.currentSet].team2 = gamesT2;
            newScore.currentSet++;
            newScore.games = { team1: 0, team2: 0 };
        } else if (gamesT1 === 6 && gamesT2 === 6) {
            newScore.isTieBreak = true;
        }
        return newScore;
    };

    const handleEvent = async (stroke) => {
        const { player, eventType, team } = modal;
        const pointWinnerTeam = (eventType === 'winner' && team === 'team1') || (eventType === 'unforced_error' && team === 'team2') ? 'team1' : 'team2';

        const newEvent = {
            id: crypto.randomUUID(),
            match_id: matchId,
            player_id: player,
            team: team,
            event_type: eventType,
            stroke: stroke,
            set: score.currentSet + 1,
            game: score.games.team1 + score.games.team2 + 1,
            point: `${score.points.team1}-${score.points.team2}`,
            timestamp: new Date().toISOString()
        };

        try {
            await addEventToDB(newEvent);
            setHistory(prev => [...prev, { score: JSON.parse(JSON.stringify(score)), event: newEvent }]);
            setEvents(prev => [...prev, newEvent]);
            setScore(calculateNewScore(score, pointWinnerTeam));
        } catch (error) {
            console.error("Failed to save event:", error);
            alert("Error al guardar el evento. Inténtalo de nuevo.");
        } finally {
            setModal({ isOpen: false, player: null, eventType: null, team: null });
        }
    };

    const handleNeutralPoint = async (team) => {
        if (matchHasEnded) {
            alert("El partido ha terminado.");
            return;
        }

        const newEvent = {
            id: crypto.randomUUID(),
            match_id: matchId,
            player_id: 'neutral',
            team: team,
            event_type: 'neutral_point',
            stroke: 'n/a',
            set: score.currentSet + 1,
            game: score.games.team1 + score.games.team2 + 1,
            point: `${score.points.team1}-${score.points.team2}`,
            timestamp: new Date().toISOString()
        };

        try {
            await addEventToDB(newEvent);
            setHistory(prev => [...prev, { score: JSON.parse(JSON.stringify(score)), event: newEvent }]);
            setEvents(prev => [...prev, newEvent]);
            setScore(calculateNewScore(score, team));
        } catch (error) {
            console.error("Failed to save neutral point event:", error);
            alert("Error al guardar el punto. Inténtalo de nuevo.");
        }
    };

    const openModal = (player, eventType, team) => {
        if (matchHasEnded) {
            alert("El partido ha terminado.");
            return;
        }
        setModal({ isOpen: true, player, eventType, team });
    };

    const matchHasEnded = useMemo(() => {
        if (!score || !score.sets) return false;
        if (score.currentSet >= 3) return true;
        const team1Sets = score.sets.reduce((acc, set) => acc + (set.team1 > set.team2 && (set.team1 >= 6 || set.team2 >= 6) ? 1 : 0), 0);
        const team2Sets = score.sets.reduce((acc, set) => acc + (set.team2 > set.team1 && (set.team1 >= 6 || set.team2 >= 6) ? 1 : 0), 0);
        return team1Sets >= 2 || team2Sets >= 2;
    }, [score]);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <span className="text-2xl mr-2 transform hover:scale-110 transition-transform cursor-default">🎾</span>
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 text-transparent bg-clip-text">
                        Padel Data Scouting
                    </span>
                </h1>
                <div className="flex items-center space-x-3">
                    {view === 'match' && (
                        <button 
                            onClick={undoLastPoint} 
                            className="p-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                    <button 
                        onClick={() => setView(v => v === 'match' ? 'stats' : 'match')} 
                        className="p-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md transition-all duration-200"
                    >
                        {view === 'match' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4">
                {view === 'match' ? (
                    <MatchView
                        score={score}
                        players={players}
                        openModal={openModal}
                        isEditingNames={isEditingNames}
                        setIsEditingNames={setIsEditingNames}
                        handlePlayerNameChange={handlePlayerNameChange}
                        matchHasEnded={matchHasEnded}
                        startNewMatch={startNewMatch}
                        handleNeutralPoint={handleNeutralPoint}
                        setIsEditStrokesModalOpen={setIsEditStrokesModalOpen}
                    />
                ) : (
                    <StatsView events={events} players={players} />
                )}
            </main>

            {modal.isOpen && (
                <Modal
                    onSelectStroke={handleEvent}
                    onClose={() => setModal({ ...modal, isOpen: false })}
                    strokeTypes={strokeTypes}
                />
            )}

            {isEditStrokesModalOpen && (
                <EditStrokesModal
                    strokeTypes={strokeTypes}
                    setStrokeTypes={setStrokeTypes}
                    onClose={() => setIsEditStrokesModalOpen(false)}
                />
            )}
        </div>
    );
}

export default App;
