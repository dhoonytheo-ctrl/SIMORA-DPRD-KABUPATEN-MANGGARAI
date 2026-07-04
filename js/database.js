/* ============================================
   SIMORA - DATABASE MANAGEMENT
   ============================================ */

const DB_NAME = 'SIMORA_DPRD';
const DB_VERSION = 1;

const STORES = {
    users: 'users',
    realisasi: 'realisasi_pertanggungjawaban',
    perubahan: 'perubahan_anggaran',
    pagu_indikatif: 'pagu_indikatif',
    anggaran: 'anggaran_murni',
    monitoring: 'monitoring_dprd',
    opd: 'opd_list',
    files: 'uploaded_files',
    photos: 'background_photos',
    log: 'activity_log',
    locks: 'data_locks',
    settings: 'app_settings'
};

let db = null;

// ============================================
// DATABASE INITIALIZATION
// ============================================

async function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            error('Database error:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            log('Database initialized successfully');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            
            // Create object stores if they don't exist
            if (!db.objectStoreNames.contains(STORES.users)) {
                db.createObjectStore(STORES.users, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.realisasi)) {
                db.createObjectStore(STORES.realisasi, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.perubahan)) {
                db.createObjectStore(STORES.perubahan, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.pagu_indikatif)) {
                db.createObjectStore(STORES.pagu_indikatif, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.anggaran)) {
                db.createObjectStore(STORES.anggaran, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.monitoring)) {
                db.createObjectStore(STORES.monitoring, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.files)) {
                db.createObjectStore(STORES.files, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.photos)) {
                db.createObjectStore(STORES.photos, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.opd)) {
                db.createObjectStore(STORES.opd, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.log)) {
                db.createObjectStore(STORES.log, { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(STORES.locks)) {
                db.createObjectStore(STORES.locks, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.settings)) {
                db.createObjectStore(STORES.settings, { keyPath: 'key' });
            }
            
            log('Database stores created/updated');
        };
    });
}

// ============================================
// GENERIC CRUD OPERATIONS
// ============================================

async function addRecord(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function putRecord(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getRecord(storeName, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function deleteRecord(storeName, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function getAllRecords(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function getSetting(key) {
    const record = await getRecord(STORES.settings, key);
    return record ? record.value : null;
}

async function setSetting(key, value) {
    return putRecord(STORES.settings, {
        key,
        value,
        updated_at: getISOTimestamp()
    });
}

async function clearStore(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ============================================
// USER MANAGEMENT
// ============================================

async function addUser(user) {
    return putRecord(STORES.users, {
        ...user,
        id: user.id || generateUUID(),
        created_at: getISOTimestamp(),
        updated_at: getISOTimestamp()
    });
}

async function updateUser(user) {
    return putRecord(STORES.users, {
        ...user,
        updated_at: getISOTimestamp()
    });
}

async function deleteUser(userId) {
    return deleteRecord(STORES.users, userId);
}

async function getUserByUsername(username) {
    const users = await getAllRecords(STORES.users);
    return users.find(u => u.username === username);
}

async function getAllUsers() {
    return getAllRecords(STORES.users);
}

// ============================================
// DATA RECORDS (REALISASI, PERUBAHAN, ANGGARAN, MONITORING)
// ============================================

async function addDataRecord(storeName, data) {
    return putRecord(storeName, {
        ...data,
        id: data.id || generateUUID(),
        created_at: data.created_at || getISOTimestamp(),
        updated_at: getISOTimestamp(),
        created_by: data.created_by || getCurrentUserId()
    });
}

async function updateDataRecord(storeName, data) {
    return putRecord(storeName, {
        ...data,
        updated_at: getISOTimestamp()
    });
}

async function deleteDataRecord(storeName, recordId) {
    return deleteRecord(storeName, recordId);
}

async function getDataRecords(storeName) {
    return getAllRecords(storeName);
}

async function getRecordsByYear(storeName, tahun) {
    const records = await getAllRecords(storeName);
    return records.filter(r => r.tahun === tahun || !r.tahun);
}

// ============================================
// FILE MANAGEMENT
// ============================================

async function uploadFile(file, category) {
    const fileData = {
        id: generateUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        category: category,
        content: null,
        uploaded_at: getISOTimestamp(),
        uploaded_by: getCurrentUserId()
    };
    
    // Convert file to base64
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            fileData.content = reader.result;
            try {
                await putRecord(STORES.files, fileData);
                resolve(fileData);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

async function deleteFile(fileId) {
    return deleteRecord(STORES.files, fileId);
}

async function getFile(fileId) {
    return getRecord(STORES.files, fileId);
}

async function getAllFiles() {
    return getAllRecords(STORES.files);
}

async function getFilesByCategory(category) {
    const files = await getAllRecords(STORES.files);
    return category ? files.filter(f => f.category === category) : files;
}

// ============================================
// BACKGROUND PHOTOS MANAGEMENT
// ============================================

async function addBackgroundPhoto(photo) {
    return putRecord(STORES.photos, {
        ...photo,
        id: photo.id || generateUUID(),
        added_at: getISOTimestamp(),
        added_by: getCurrentUserId()
    });
}

async function deleteBackgroundPhoto(photoId) {
    return deleteRecord(STORES.photos, photoId);
}

async function getAllBackgroundPhotos() {
    const photos = await getAllRecords(STORES.photos);
    return sortArray(photos, 'order', 'asc');
}

async function updatePhotoOrder(photos) {
    const transaction = db.transaction([STORES.photos], 'readwrite');
    const store = transaction.objectStore(STORES.photos);
    
    photos.forEach((photo, index) => {
        photo.order = index;
        store.put(photo);
    });
    
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

// ============================================
// ACTIVITY LOGGING
// ============================================

async function logActivity(action, details) {
    const logEntry = {
        user_id: getCurrentUserId(),
        user_name: getCurrentUserName(),
        action: action,
        details: details,
        timestamp: getISOTimestamp()
    };
    
    return addRecord(STORES.log, logEntry);
}

async function getAllActivityLogs() {
    return getAllRecords(STORES.log);
}

async function getActivityLogsByUser(userId) {
    const logs = await getAllRecords(STORES.log);
    return logs.filter(log => log.user_id === userId);
}

async function getActivityLogsByAction(action) {
    const logs = await getAllRecords(STORES.log);
    return logs.filter(log => log.action === action);
}

async function getActivityLogsByDateRange(startDate, endDate) {
    const logs = await getAllRecords(STORES.log);
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return logs.filter(log => {
        const logDate = new Date(log.timestamp).getTime();
        return logDate >= start && logDate <= end;
    });
}

// ============================================
// DATA LOCKING
// ============================================

async function lockData(table, tahun) {
    return putRecord(STORES.locks, {
        id: `${table}_${tahun}`,
        table: table,
        tahun: tahun,
        locked: true,
        locked_at: getISOTimestamp(),
        locked_by: getCurrentUserId()
    });
}

async function unlockData(table, tahun) {
    return putRecord(STORES.locks, {
        id: `${table}_${tahun}`,
        table: table,
        tahun: tahun,
        locked: false,
        unlocked_at: getISOTimestamp(),
        unlocked_by: getCurrentUserId()
    });
}

async function isDataLocked(table, tahun) {
    const lock = await getRecord(STORES.locks, `${table}_${tahun}`);
    return lock && lock.locked === true;
}

async function getAllLocks() {
    return getAllRecords(STORES.locks);
}

// ============================================
// BACKUP & RESTORE
// ============================================

async function exportAllData() {
    const backup = {
        version: DB_VERSION,
        exportedAt: getISOTimestamp(),
        data: {}
    };
    
    for (const storeName of Object.values(STORES)) {
        backup.data[storeName] = await getAllRecords(storeName);
    }
    
    return backup;
}

async function importData(backup) {
    if (!backup || !backup.data) {
        throw new Error('Invalid backup file');
    }
    
    const transaction = db.transaction(Object.values(STORES), 'readwrite');
    
    for (const storeName of Object.values(STORES)) {
        const store = transaction.objectStore(storeName);
        await clearStore(storeName);
        
        if (backup.data[storeName]) {
            backup.data[storeName].forEach(record => {
                store.put(record);
            });
        }
    }
    
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            log('Data imported successfully');
            resolve();
        };
        transaction.onerror = () => reject(transaction.error);
    });
}

// ============================================
// SESSION MANAGEMENT (localStorage)
// ============================================

function setCurrentSession(user) {
    const session = {
        userId: user.id,
        username: user.username,
        role: user.role,
        loginTime: getISOTimestamp()
    };
    localStorage.setItem('SIMORA_SESSION', JSON.stringify(session));
    localStorage.setItem('SIMORA_LAST_ACTIVITY', getISOTimestamp());
}

function getCurrentSession() {
    const session = localStorage.getItem('SIMORA_SESSION');
    return session ? JSON.parse(session) : null;
}

function updateLastActivity() {
    localStorage.setItem('SIMORA_LAST_ACTIVITY', getISOTimestamp());
}

function getLastActivity() {
    const activity = localStorage.getItem('SIMORA_LAST_ACTIVITY');
    return activity ? new Date(activity) : null;
}

function clearSession() {
    localStorage.removeItem('SIMORA_SESSION');
    localStorage.removeItem('SIMORA_LAST_ACTIVITY');
}

function getCurrentUserId() {
    const session = getCurrentSession();
    return session ? session.userId : null;
}

function getCurrentUserName() {
    const session = getCurrentSession();
    return session ? session.username : null;
}

function getCurrentUserRole() {
    const session = getCurrentSession();
    return session ? session.role : null;
}

function isUserLoggedIn() {
    return getCurrentSession() !== null;
}

// ============================================
// THEME & PREFERENCE MANAGEMENT
// ============================================

function setTheme(theme) {
    localStorage.setItem('SIMORA_THEME', theme);
}

function getTheme() {
    return localStorage.getItem('SIMORA_THEME') || 'vintage';
}

function setFontSize(size) {
    localStorage.setItem('SIMORA_FONT_SIZE', size);
}

function getFontSize() {
    return localStorage.getItem('SIMORA_FONT_SIZE') || 'normal';
}

function setContrast(level) {
    localStorage.setItem('SIMORA_CONTRAST', level);
}

function getContrast() {
    return localStorage.getItem('SIMORA_CONTRAST') || 'normal';
}

// ============================================
// INITIALIZATION WITH DEFAULT DATA
// ============================================

async function initializeDefaultData() {
    const existingUsers = await getAllUsers();
    
    if (existingUsers.length > 0) {
        log('Default data already exists');
        return;
    }
    
    // Default users list - 40 DPRD members + staff
    const defaultUsers = [
        // Super Admin
        { username: 'Staf', pin: '1234', role: 'superadmin', pinChanged: false },
        
        // DPRD Members (35)
        { username: 'Paulus Peos', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Nobertus Edang', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Aprianto Nahat', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Maria Imakulata Moto', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Aventinus Mbejak', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Agnes Menot', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Frederikus Andi Ongkor', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Klementinus Malis', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Aleksius Armanjaya', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Largus Nala', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Rudi Rudolf Beno', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Agustinus Nancung', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Vinsensius Supriadi', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Thomas Thahir', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Adrianus Sahadun', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Yonatan Yonas Bo\'a', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Heribertus Candra', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Remigius Nalas', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Soe Flavianus', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Adrianus Nanggur', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Kanisius Jemali', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Ferdinandus Purnawan Naur', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Tarsisius Janggal', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Garung Ambrosius', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Yohanes Jebatu', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Yoakhim Yohanes Jehati', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Silvester Baeng', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Thomas Edison', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Yohanes Hardum Nonto', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Yohanes Rikardus Madu', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Ursula Anur', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Yosef Hamsi', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Hima Domi Antonius', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Siprianus Jangka', pin: '1234', role: 'user', pinChanged: false },
        { username: 'Yohanes Donbosko Mariano Gampur', pin: '1234', role: 'user', pinChanged: false },
        
        // Staff
        { username: 'Gondolpus B. Nggarang', pin: '1234', role: 'user', pinChanged: false }, // Kepala Sekretariat
        { username: 'Vinsencius R. Sama', pin: '1234', role: 'user', pinChanged: false }, // Kabag Pengawasan & Penganggaran
        { username: 'Engelbertus Sakura', pin: '1234', role: 'user', pinChanged: false } // Analis Kebijakan Transfer
    ];
    
    const defaultUserIds = defaultUsers.map(user => ({
        ...user,
        id: generateUUID()
    }));

    // Add all users
    for (const user of defaultUserIds) {
        await addUser(user);
    }
    
    log(`${defaultUserIds.length} default users created`);
    
    const superAdmin = defaultUserIds.find(u => u.role === 'superadmin');
    const creatorId = superAdmin ? superAdmin.id : null;

    // Create default placeholder photos
    const placeholderPhotos = [
        {
            id: generateUUID(),
            name: 'Placeholder 1',
            content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            order: 0,
            added_at: getISOTimestamp()
        },
        {
            id: generateUUID(),
            name: 'Placeholder 2',
            content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            order: 1,
            added_at: getISOTimestamp()
        }
    ];
    
    for (const photo of placeholderPhotos) {
        await addBackgroundPhoto(photo);
    }
    
    log('Default background photos created');

    // Default OPD list (from provided attachment) - normalized names
    const defaultOPDs = [
        'DINAS KESEHATAN',
        'RSUD RUTENG',
        'DINAS KOPERASI, USAHA KECIL MENENGAH DAN TENAGA KERJA',
        'DINAS PEKERJAAN UMUM DAN PENATAAN RUANG',
        'DINAS PERUMAHAN RAKYAT, KAWASAN PERMUKIMAN DAN PERTANAHAN',
        'SATUAN POLISI PAMONG PRAJA DAN PEMADAM KEBAKARAN',
        'BADAN PENANGGULANGAN BENCANA DAERAH',
        'DINAS PARIWISATA DAN KEBUDAYAAN',
        'BADAN KESATUAN BANGSA DAN POLITIK DAERAH',
        'DINAS PERHUBUNGAN',
        'INSPEKTORAT DAERAH',
        'DINAS PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
        'DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA',
        'DINAS SOSIAL',
        'DINAS PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK',
        'DINAS LINGKUNGAN HIDUP',
        'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL',
        'DINAS PEMBERDAYAAN MASYARAKAT DAN DESA',
        'DINAS PERTANIAN DAN KETAHANAN PANGAN',
        'DINAS PERIKANAN',
        'BADAN PENDAPATAN DAERAH',
        'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH',
        'DINAS PETERNAKAN',
        'DINAS PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
        'DINAS KOMUNIKASI DAN INFORMATIKA',
        'DINAS PENANAMAN MODAL DAN PELAYANAN TERPADU SATU PINTU',
        'DINAS PERDAGANGAN DAN PERINDUSTRIAN',
        'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH',
        'BAGIAN – BAGIAN',
        'KECAMATAN',
        'BADAN PERENCANAAN PEMBANGUNAN, RISET DAN INOVASI DAERAH',
        'BADAN KEUANGAN DAN ASET DAERAH',
        'SEKRETARIAT DPRD'
    ];

    for (const opdName of defaultOPDs) {
        await putRecord(STORES.opd, {
            id: generateUUID(),
            name: opdName,
            created_at: getISOTimestamp(),
            created_by: creatorId
        });
    }

    log(`${defaultOPDs.length} default OPD records created`);

    const sampleRecords = [
        {
            store: STORES.realisasi,
            data: {
                uraian: 'Peningkatan Infrastruktur Jalan Desa',
                anggaran: 125000000,
                realisasi: 96500000,
                keterangan: 'Realisasi pembangunan jalan penghubung dua desa',
                tahun: getTahunAnggaran().realisasi,
                created_by: creatorId
            }
        },
        {
            store: STORES.perubahan,
            data: {
                uraian: 'Perubahan Alokasi Belanja Modal',
                anggaran_awal: 85000000,
                anggaran_baru: 98000000,
                alasan: 'Penambahan ruang publik dan drainase',
                tanggal_perubahan: new Date().toISOString(),
                tahun: getTahunAnggaran().perubahan,
                created_by: creatorId
            }
        },
        {
            store: STORES.pagu_indikatif,
            data: {
                opd: 'Dinas Pekerjaan Umum',
                program: 'Pemeliharaan Jalan Kabupaten',
                pagu_usulan: 240000000,
                pagu_disetujui: 220000000,
                catatan: 'Disetujui dengan pengurangan biaya perencanaan',
                status: 'Disetujui',
                tahun: getTahunAnggaran().perubahan,
                created_by: creatorId
            }
        },
        {
            store: STORES.anggaran,
            data: {
                uraian: 'Pembentukan Unit Layanan Administrasi',
                pagu: 135000000,
                sumber_dana: 'DAU',
                status: 'Diajukan',
                keterangan: 'Usulan anggaran untuk tahun depan',
                tahun: getTahunAnggaran().anggaran,
                created_by: creatorId
            }
        },
        {
            store: STORES.monitoring,
            data: {
                tanggal: new Date().toISOString().split('T')[0],
                lokasi: 'Desa Wae Mese / Kecamatan Reok',
                temuan: 'Jalan desa banyak kerusakan dan drainase tersumbat.',
                rekomendasi: 'Segera perbaiki jalan dan bersihkan saluran air.',
                status: 'Belum Ditindaklanjuti',
                dapil: 'I',
                tahun: getTahunAnggaran().perubahan,
                created_by: creatorId
            }
        },
        {
            store: STORES.monitoring,
            data: {
                tanggal: new Date().toISOString().split('T')[0],
                lokasi: 'Desa Golo Nderu / Kecamatan Satarmese',
                temuan: 'Sarana air bersih belum berfungsi optimal.',
                rekomendasi: 'Tinjau ulang sumber air dan pompa.',
                status: 'Sedang Ditindaklanjuti',
                dapil: 'II',
                tahun: getTahunAnggaran().perubahan,
                created_by: creatorId
            }
        }
    ];

    for (const sample of sampleRecords) {
        await putRecord(sample.store, {
            ...sample.data,
            id: generateUUID(),
            created_at: getISOTimestamp(),
            updated_at: getISOTimestamp()
        });
    }

    const sampleFile = {
        id: generateUUID(),
        name: 'Pedoman SIMORA.pdf',
        size: 1024,
        type: 'application/pdf',
        category: 'umum',
        content: 'data:application/pdf;base64,JVBERi0xLjQKJcfs...',
        uploaded_at: getISOTimestamp(),
        uploaded_by: creatorId
    };

    await putRecord(STORES.files, sampleFile);
    log('Sample records and dummy file created');
}
