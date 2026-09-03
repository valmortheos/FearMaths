/**
 * indexedDB.js — FearMaths Database Manager
 * Handles connection, schema setup, and CRUD operations for IndexedDB.
 */

const DB_NAME = 'FearMathsDB';
const DB_VERSION = 1;

export const STORES = {
  PROGRESS: 'progress',
  ACHIEVEMENTS: 'achievements'
};

/**
 * Opens and initializes the IndexedDB connection.
 * @returns {Promise<IDBDatabase>}
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Object Store: progress
      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        const progressStore = db.createObjectStore(STORES.PROGRESS, {
          keyPath: 'id',
          autoIncrement: true
        });
        progressStore.createIndex('timestamp', 'timestamp', { unique: false });
        progressStore.createIndex('level', 'level', { unique: false });
        progressStore.createIndex('correct', 'correct', { unique: false });
      }

      // Object Store: achievements
      if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
        const achievementStore = db.createObjectStore(STORES.ACHIEVEMENTS, {
          keyPath: 'id'
        });
        achievementStore.createIndex('unlockedAt', 'unlockedAt', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`IndexedDB Error: ${event.target.error}`);
    };
  });
}

/**
 * Saves a progress entry into IndexedDB.
 * @param {Object} progressRecord
 * @returns {Promise<number>} Inserted ID
 */
export async function saveProgress(progressRecord) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS, 'readwrite');
    const store = tx.objectStore(STORES.PROGRESS);
    const recordWithTime = {
      timestamp: new Date().toISOString(),
      ...progressRecord
    };
    const request = store.add(recordWithTime);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves all progress entries from IndexedDB.
 * @returns {Promise<Array>}
 */
export async function getAllProgress() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS, 'readonly');
    const store = tx.objectStore(STORES.PROGRESS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves or updates an achievement in IndexedDB.
 * @param {Object} achievement
 * @returns {Promise<string>}
 */
export async function saveAchievement(achievement) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.ACHIEVEMENTS, 'readwrite');
    const store = tx.objectStore(STORES.ACHIEVEMENTS);
    const recordWithTime = {
      unlockedAt: new Date().toISOString(),
      ...achievement
    };
    const request = store.put(recordWithTime);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves all unlocked achievements from IndexedDB.
 * @returns {Promise<Array>}
 */
export async function getAllAchievements() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.ACHIEVEMENTS, 'readonly');
    const store = tx.objectStore(STORES.ACHIEVEMENTS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Resets all data in IndexedDB (clears both stores).
 * @returns {Promise<void>}
 */
export async function resetAllData() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.PROGRESS, STORES.ACHIEVEMENTS], 'readwrite');
    tx.objectStore(STORES.PROGRESS).clear();
    tx.objectStore(STORES.ACHIEVEMENTS).clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
