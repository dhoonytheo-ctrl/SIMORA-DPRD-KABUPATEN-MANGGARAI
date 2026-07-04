/* ============================================
   SIMORA - FIREBASE SYNC HELPERS (Client)
   ============================================ */

// Placeholder for Firebase app and Firestore references
let firebaseApp = null;
let firestore = null;
let autoSyncInterval = null;

async function initFirebase(config) {
    try {
        // allow config from parameter, settings, or global variable
        const cfg = config || (window && window.firebaseConfig) || await getSetting('firebase_config');
        if (!cfg || !cfg.apiKey) {
            console.warn('Firebase config not provided or invalid');
            return false;
        }

        // Use compat CDN (index.html must include firebase scripts)
        try {
            firebaseApp = firebase.initializeApp(cfg);
            firestore = firebase.firestore();
        } catch (e) {
            // firebase already initialized? try getting app
            try { firebaseApp = firebase.app(); firestore = firebase.firestore(); } catch (err) { throw err; }
        }

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
            // perform a safe merge instead of blind replace
            await mergeImport(backup);
            log('Data pulled from Firebase and merged');
        }
    } catch (err) {
        error('Error pulling from Firebase:', err);
    }
}

async function mergeImport(backup) {
    if (!backup || !backup.data) return;
    try {
        for (const storeName of Object.keys(backup.data)) {
            const remoteRecords = backup.data[storeName] || [];
            const localRecords = await getAllRecords(storeName);
            const localMap = {};
            localRecords.forEach(r => { if (r && r.id) localMap[r.id] = r; });

            for (const remote of remoteRecords) {
                if (!remote || !remote.id) continue;
                const local = localMap[remote.id];
                if (!local) {
                    // add missing record
                    try { await putRecord(storeName, remote); } catch (e) { console.warn('merge add failed', storeName, e); }
                } else {
                    // if remote is newer, replace
                    const remoteUpdated = remote.updated_at ? new Date(remote.updated_at).getTime() : 0;
                    const localUpdated = local.updated_at ? new Date(local.updated_at).getTime() : 0;
                    if (remoteUpdated > localUpdated) {
                        try { await putRecord(storeName, remote); } catch (e) { console.warn('merge update failed', storeName, e); }
                    }
                }
            }
        }
    } catch (err) {
        error('mergeImport error:', err);
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
