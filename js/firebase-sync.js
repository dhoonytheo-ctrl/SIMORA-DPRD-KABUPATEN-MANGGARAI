/* ============================================
   SIMORA - FIREBASE SYNC HELPERS (Client)
   ============================================ */

// Placeholder for Firebase app and Firestore references
let firebaseApp = null;
let firestore = null;
let autoSyncInterval = null;

async function initFirebase(config) {
    try {
        if (!config || !config.apiKey) {
            console.warn('Firebase config not provided or invalid');
            return false;
        }

        // Use compat CDN (index.html must include firebase scripts)
        firebaseApp = firebase.initializeApp(config);
        firestore = firebase.firestore();

        log('Firebase initialized');
        return true;
    } catch (err) {
        error('Firebase init error:', err);
        return false;
    }
}

async function setFirebaseConfig(config) {
    await setSetting('firebase_config', config);
    return initFirebase(config);
}

async function initFirebaseFromSettings() {
    try {
        const cfg = await getSetting('firebase_config');
        if (cfg) {
            await initFirebase(cfg);
        }
    } catch (err) {
        error('initFirebaseFromSettings error:', err);
    }
}

async function syncToFirebase() {
    if (!firestore) {
        log('Firestore not initialized; skipping sync');
        return;
    }

    try {
        const backup = await exportAllData();
        const docRef = firestore.collection('simora_backups').doc('latest');
        await docRef.set(backup);
        log('Data synced to Firebase');
    } catch (err) {
        error('Error syncing to Firebase:', err);
    }
}

async function pullFromFirebase() {
    if (!firestore) return;
    try {
        const doc = await firestore.collection('simora_backups').doc('latest').get();
        if (!doc.exists) {
            log('No remote backup found');
            return;
        }
        const backup = doc.data();
        if (backup) {
            await importData(backup);
            log('Data pulled from Firebase and imported');
        }
    } catch (err) {
        error('Error pulling from Firebase:', err);
    }
}

function startAutoSync(intervalMs = 5 * 60 * 1000) {
    if (autoSyncInterval) clearInterval(autoSyncInterval);
    autoSyncInterval = setInterval(syncToFirebase, intervalMs);
}

function stopAutoSync() {
    if (autoSyncInterval) clearInterval(autoSyncInterval);
    autoSyncInterval = null;
}

// Expose some functions globally for quick use in console
window.firebaseSync = {
    initFirebase,
    setFirebaseConfig,
    syncToFirebase,
    pullFromFirebase,
    startAutoSync,
    stopAutoSync
};
