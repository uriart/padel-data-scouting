const DB_NAME = 'PadelDataScoutingDB';
const DB_VERSION = 1;
const STORE_NAME = 'match_events';

let db;

// Function to initialize the database
export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const dbInstance = event.target.result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                const store = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('match_id', 'match_id', { unique: false });
                store.createIndex('player_id', 'player_id', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database initialized successfully');
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
};

// Function to add an event to the database
export const addEventToDB = (event) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(event);

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
};

// Function to get all events for a specific match
export const getEventsFromDB = (matchId) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('match_id');
        const request = index.getAll(matchId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

// Function to delete all data (for starting a new match)
export const clearDB = () => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('DB not initialized');
            return;
        }
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
};
