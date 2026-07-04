/* ============================================
   SIMORA - UI RENDERING & INTERACTION
   ============================================ */

// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show specific page
    const page = document.getElementById(`${pageName}Page`);
    if (page) {
        page.style.display = 'flex';
    }
}

function showLoginPage() {
    showPage('login');
    initLoginPage();
}

async function showDashboardPage() {
    showPage('dashboard');
    await renderDashboard();
}

// ============================================
// LOGIN PAGE INITIALIZATION
// ============================================

let slideshowInterval = null;
let currentPhotoIndex = 0;
let backgroundPhotos = [];
let loginDateTimeInterval = null;
let headerDateTimeInterval = null;

async function initLoginPage() {
    try {
        // Get background photos
        backgroundPhotos = await getAllBackgroundPhotos();
        
        if (backgroundPhotos.length === 0) {
            log('No background photos found, using placeholder');
            backgroundPhotos = [{
                id: 'placeholder',
                content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
            }];
        }
        
        // Start slideshow
        startSlideshow();
        
        // Set up date and time display
        updateLoginDateTime();
        if (loginDateTimeInterval) clearInterval(loginDateTimeInterval);
        loginDateTimeInterval = setInterval(updateLoginDateTime, 1000);
        
        // Set up form
        const form = document.getElementById('loginForm');
        form.onsubmit = handleLogin;

        const usernameInput = document.getElementById('loginUsername');
        usernameInput.oninput = updateLoginHint;
        updateLoginHint();
        
    } catch (err) {
        error('Failed to init login page:', err);
    }
}

function startSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    
    updateSlideshowImage();
    
    slideshowInterval = setInterval(() => {
        currentPhotoIndex = (currentPhotoIndex + 1) % backgroundPhotos.length;
        updateSlideshowImage();
    }, 8000); // Change every 8 seconds
}

function updateSlideshowImage() {
    if (backgroundPhotos.length === 0) return;
    
    const photo = backgroundPhotos[currentPhotoIndex];
    const slideshow = document.getElementById('loginSlideshow');
    
    if (slideshow) {
        slideshow.style.backgroundImage = `url('${photo.content}')`;
        slideshow.classList.add('slideshow-fade');
        
        setTimeout(() => {
            slideshow.classList.remove('slideshow-fade');
        }, 1000);
    }
}

function updateLoginDateTime() {
    const now = new Date();
    document.getElementById('dateDisplay').textContent = formatDate(now);
    document.getElementById('timeDisplay').textContent = formatTime(now);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const pin = document.getElementById('loginPin').value.trim();
    const messageBox = document.getElementById('loginMessage');
    
    // Clear previous message
    messageBox.style.display = 'none';
    
    if (!username) {
        showMessage(messageBox, 'Nama pengguna harus diisi', 'error');
        return;
    }
    
    const result = await login(username, pin);
    
    if (result.success) {
        if (result.firstLogin) {
            // Show change PIN modal
            showChangePinModal(username);
        } else {
            // Clear form and go to dashboard
            document.getElementById('loginForm').reset();
            await showDashboardPage();
        }
    } else {
        showMessage(messageBox, result.message, 'error');
    }
}

async function updateLoginHint() {
    const username = document.getElementById('loginUsername').value.trim();
    const loginHint = document.getElementById('loginHint');

    if (!loginHint) return;

    if (!username) {
        loginHint.textContent = 'Super Admin dapat login hanya dengan nama pengguna; pengguna lain tetap harus memasukkan PIN.';
        return;
    }

    const user = await getUserByUsername(username);
    if (user && user.role === 'superadmin') {
        loginHint.textContent = 'Akun Super Admin terdeteksi. PIN tidak diperlukan, cukup klik Login.';
    } else {
        loginHint.textContent = 'Masukkan PIN Anda. Hanya Super Admin yang dapat login tanpa PIN.';
    }
}

// ============================================
// DASHBOARD INITIALIZATION
// ============================================

async function renderDashboard() {
    try {
        // Update user info
        const userDisplay = document.getElementById('userDisplay');
        const userRoleElement = document.querySelectorAll('.user-role')[0];
        const currentUser = getCurrentUserName();
        const userRole = isSuperAdmin() ? 'Super Admin' : 'Pengguna';
        
        userDisplay.textContent = currentUser;
        if (userRoleElement) userRoleElement.textContent = userRole;
        
        // Update date/time in header
        updateHeaderDateTime();
        if (headerDateTimeInterval) clearInterval(headerDateTimeInterval);
        headerDateTimeInterval = setInterval(updateHeaderDateTime, 1000);
        
        // Setup navigation
        setupNavigation();
        setupDashboardTabs();
        
        // Show/hide Super Admin menu items
        const logMenuItem = document.getElementById('logMenuItem');
        const settingsMenuItem = document.getElementById('settingsMenuItem');
        const uploadFileBtn = document.getElementById('uploadFileBtn');
        const addRealisasiBtn = document.getElementById('addRealisasiBtn');
        const addPerubahanBtn = document.getElementById('addPerubahanBtn');
        const addAnggaranBtn = document.getElementById('addAnggaranBtn');
        const addPaguBtn = document.getElementById('addPaguBtn');
        const addMonitoringBtn = document.getElementById('addMonitoringBtn');
        const uploadArea = document.getElementById('uploadArea');
        
        if (isSuperAdmin()) {
            show(logMenuItem);
            show(settingsMenuItem);
            show(uploadFileBtn);
            show(addRealisasiBtn);
            show(addPerubahanBtn);
            show(addAnggaranBtn);
            if (addPaguBtn) show(addPaguBtn);
            show(addMonitoringBtn);
            show(uploadArea);
            
            // Show action columns in tables for Super Admin
            document.querySelectorAll('.action-col').forEach(col => show(col));
            
            // Initialize settings
            loadSettings();
        } else {
            hide(logMenuItem);
            hide(settingsMenuItem);
            hide(uploadFileBtn);
            hide(addRealisasiBtn);
            hide(addPerubahanBtn);
            hide(addAnggaranBtn);
            if (addPaguBtn) hide(addPaguBtn);
            hide(addMonitoringBtn);
            hide(uploadArea);
            
            // Hide action columns for regular users
            document.querySelectorAll('.action-col').forEach(col => hide(col));
        }
        
        // Setup logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = async () => {
                if (confirm('Yakin ingin logout?')) {
                    await logout();
                    showLoginPage();
                }
            };
        }

        // Quick Sync (Super Admin only)
        const quickSyncBtn = document.getElementById('quickSyncBtn');
        if (quickSyncBtn) {
            if (isSuperAdmin()) show(quickSyncBtn); else hide(quickSyncBtn);
            quickSyncBtn.onclick = async () => {
                try {
                    showToast('Menarik data dari Firebase...', 'info');
                    if (window.firebaseSync && typeof window.firebaseSync.pullFromFirebase === 'function') {
                        await window.firebaseSync.pullFromFirebase();
                        showToast('Sinkronisasi lokal selesai. Mengirim perubahan ke Firebase...', 'info');
                        await window.firebaseSync.syncToFirebase();
                        showToast('Sinkronisasi lengkap dengan Firebase berhasil', 'success');
                    } else {
                        showToast('Fungsi sinkronisasi tidak tersedia', 'warning');
                    }
                } catch (err) {
                    error('Quick Sync error:', err);
                    showToast('Sinkronisasi gagal: ' + err.message, 'error');
                }
            };
        }
        
        // Update menu titles with years
        updateMenuTitles();

        // Setup add pagu button (Super Admin only)
        if (addPaguBtn) {
            addPaguBtn.addEventListener('click', async () => {
                try {
                    const opds = await getAllRecords('opd_list');
                    const choices = opds.map(o => ({ value: o.name, label: o.name }));

                    const html = `
                        <form id="paguForm">
                            ${createFormField('select', 'opd', 'Perangkat Daerah / OPD', '', { choices }).outerHTML}
                            ${createFormField('text', 'program', 'Program / Kegiatan', '', { required: true }).outerHTML}
                            ${createFormField('number', 'pagu_usulan', 'Pagu Usulan (Rp)', '', { required: true }).outerHTML}
                            ${createFormField('number', 'pagu_disetujui', 'Pagu Disetujui (Rp)', '', { required: true }).outerHTML}
                            ${createFormField('textarea', 'catatan', 'Catatan / Keterangan', '', { rows: 3 }).outerHTML}
                            ${createFormField('select', 'status', 'Status', 'Disetujui', { choices: [
                                { value: 'Diajukan', label: 'Diajukan' },
                                { value: 'Disetujui', label: 'Disetujui' },
                                { value: 'Dibahas', label: 'Dibahas' }
                            ] }).outerHTML}
                        </form>
                    `;

                    openModal('Tambah Pagu Indikatif', html);

                    document.getElementById('modalSaveBtn').onclick = async () => {
                        const form = document.getElementById('paguForm');
                        const formData = new FormData(form);
                        const newRecord = {
                            opd: formData.get('opd'),
                            program: formData.get('program'),
                            pagu_usulan: parseInt(formData.get('pagu_usulan')) || 0,
                            pagu_disetujui: parseInt(formData.get('pagu_disetujui')) || 0,
                            catatan: formData.get('catatan'),
                            status: formData.get('status'),
                            tahun: getTahunAnggaran().perubahan,
                            created_by: getCurrentUserId()
                        };

                        await addDataRecord('pagu_indikatif', newRecord);
                        await logActivity('add', { table: 'pagu_indikatif', row: newRecord });
                        closeModal();
                        loadPaguIndikatifData();
                        showToast('Data Pagu Indikatif berhasil ditambahkan', 'success');
                    };
                } catch (err) {
                    error('Gagal menambah Pagu Indikatif:', err);
                    showToast('Gagal menambah Pagu Indikatif', 'error');
                }
            });
        }
        
    } catch (err) {
        error('Failed to render dashboard:', err);
    }
}

function setupDashboardTabs() {
    const perubahanTabs = document.querySelectorAll('#perubahanTabs .tab-item');
    perubahanTabs.forEach(tab => {
        tab.onclick = () => {
            perubahanTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.target;
            document.querySelectorAll('#perubahanContent .tab-panel').forEach(panel => {
                panel.style.display = panel.id === target ? 'block' : 'none';
            });
        };
    });

    const monitoringTabs = document.querySelectorAll('#monitoringTabs .tab-item');
    monitoringTabs.forEach(tab => {
        tab.onclick = () => {
            monitoringTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const dapil = tab.dataset.dapil;
            loadMonitoringData(dapil);
        };
    });
}

async function loadMonitoringData(dapil = 'I') {
    try {
        const allData = await getAllRecords('monitoring_dprd');
        const data = allData.filter(item => item.dapil === dapil);
        const columns = [
            { field: 'tanggal', label: 'Tanggal Monitoring', type: 'date' },
            { field: 'lokasi', label: 'Lokasi/OPD' },
            { field: 'temuan', label: 'Temuan' },
            { field: 'rekomendasi', label: 'Rekomendasi' },
            { field: 'status', label: 'Status Tindak Lanjut' }
        ];
        renderTable('monitoringTableBody', data, columns, {
            onEdit: (row) => editMonitoringRow(row),
            onDelete: (row) => deleteMonitoringRow(row),
            onHistory: (row) => showRowHistory('monitoring_dprd', row.id),
            showTotal: false
        });
        updateMonitoringSummary(dapil, allData);
    } catch (err) {
        error('Failed to load monitoring data:', err);
    }
}

function updateMonitoringSummary(dapil, allData) {
    const filtered = allData.filter(item => item.dapil === dapil);
    const total = filtered.length;
    const statusCounts = {
        'Belum Ditindaklanjuti': filtered.filter(item => item.status === 'Belum Ditindaklanjuti').length,
        'Sedang Ditindaklanjuti': filtered.filter(item => item.status === 'Sedang Ditindaklanjuti').length,
        'Sudah Ditindaklanjuti': filtered.filter(item => item.status === 'Sudah Ditindaklanjuti').length
    };
    const summary = document.getElementById('monitoringSummary');
    if (!summary) return;
    summary.innerHTML = `
        <div class="monitoring-summary-card">
            <strong>Jumlah Kegiatan</strong>
            <span>${total}</span>
        </div>
        <div class="monitoring-summary-card badge badge-danger">Belum: ${statusCounts['Belum Ditindaklanjuti']}</div>
        <div class="monitoring-summary-card badge badge-warning">Sedang: ${statusCounts['Sedang Ditindaklanjuti']}</div>
        <div class="monitoring-summary-card badge badge-success">Sudah: ${statusCounts['Sudah Ditindaklanjuti']}</div>
    `;
}

async function loadPerubahanData() {
    try {
        const tahun = getTahunAnggaran().perubahan;
        const data = await getRecordsByYear('perubahan_anggaran', tahun);
        const columns = [
            { field: 'uraian', label: 'Uraian/Program' },
            { field: 'anggaran_awal', label: 'Anggaran Awal (Rp)', type: 'currency' },
            { field: 'anggaran_baru', label: 'Anggaran Setelah Perubahan (Rp)', type: 'currency' },
            { field: 'selisih', label: 'Selisih (Rp)', type: 'currency' },
            { field: 'alasan', label: 'Alasan Perubahan' },
            { field: 'tanggal_perubahan', label: 'Tanggal Perubahan', type: 'date' }
        ];
        data.forEach(row => {
            row.selisih = (parseInt(row.anggaran_baru) || 0) - (parseInt(row.anggaran_awal) || 0);
        });
        renderTable('perubahanTableBody', data, columns, {
            onEdit: (row) => editPerubahanRow(row),
            onDelete: (row) => deletePerubahanRow(row),
            onHistory: (row) => showRowHistory('perubahan_anggaran', row.id),
            showTotal: true
        });
        setupTableSearch('perubahanSearch', 'perubahanTableBody', ['uraian']);
        setupTableSort('perubahanSort', 'perubahanTableBody', data, sorted => {
            renderTable('perubahanTableBody', sorted, columns, {
                onEdit: (row) => editPerubahanRow(row),
                onDelete: (row) => deletePerubahanRow(row),
                onHistory: (row) => showRowHistory('perubahan_anggaran', row.id),
                showTotal: true
            });
        });
        loadPaguIndikatifData();
    } catch (err) {
        error('Failed to load perubahan data:', err);
    }
}

async function loadPaguIndikatifData() {
    try {
        const tahun = getTahunAnggaran().perubahan;
        const data = await getAllRecords('pagu_indikatif');
        const filtered = data.filter(d => d.tahun === tahun);
        const columns = [
            { field: 'opd', label: 'Perangkat Daerah / OPD' },
            { field: 'program', label: 'Program / Kegiatan' },
            { field: 'pagu_usulan', label: 'Pagu Indikatif (Rp) — Diusulkan', type: 'currency' },
            { field: 'pagu_disetujui', label: 'Pagu Indikatif (Rp) — Disetujui Badan Anggaran', type: 'currency' },
            { field: 'selisih', label: 'Selisih (Rp)', type: 'currency' },
            { field: 'catatan', label: 'Catatan Pembahasan / Keterangan' },
            { field: 'status', label: 'Status' }
        ];
        filtered.forEach(row => {
            row.selisih = (parseInt(row.pagu_disetujui) || 0) - (parseInt(row.pagu_usulan) || 0);
        });
        renderTable('paguTableBody', filtered, columns, {
            onEdit: (row) => editPaguRow(row),
            onDelete: (row) => deletePaguRow(row),
            onHistory: (row) => showRowHistory('pagu_indikatif', row.id),
            showTotal: true
        });
        setupTableSearch('paguSearch', 'paguTableBody', ['opd', 'program']);
        setupTableSort('paguSort', 'paguTableBody', filtered, sorted => {
            renderTable('paguTableBody', sorted, columns, {
                onEdit: (row) => editPaguRow(row),
                onDelete: (row) => deletePaguRow(row),
                onHistory: (row) => showRowHistory('pagu_indikatif', row.id),
                showTotal: true
            });
        });
        const paguYearEl = document.getElementById('paguYear');
        if (paguYearEl) {
            paguYearEl.textContent = getTahunAnggaran().perubahan;
        }
    } catch (err) {
        error('Failed to load pagu indikator data:', err);
    }
}

function editPaguRow(row) {
    const html = `
        <form id="paguForm">
            ${createFormField('text', 'opd', 'Perangkat Daerah / OPD', row.opd, { required: true }).outerHTML}
            ${createFormField('text', 'program', 'Program / Kegiatan', row.program, { required: true }).outerHTML}
            ${createFormField('number', 'pagu_usulan', 'Pagu Usulan (Rp)', row.pagu_usulan, { required: true }).outerHTML}
            ${createFormField('number', 'pagu_disetujui', 'Pagu Disetujui (Rp)', row.pagu_disetujui, { required: true }).outerHTML}
            ${createFormField('textarea', 'catatan', 'Catatan / Keterangan', row.catatan, { rows: 3 }).outerHTML}
            ${createFormField('select', 'status', 'Status', row.status, {
                choices: [
                    { value: 'Diajukan', label: 'Diajukan' },
                    { value: 'Disetujui', label: 'Disetujui' },
                    { value: 'Dibahas', label: 'Dibahas' }
                ]
            }).outerHTML}
        </form>
    `;

    openModal('Edit Pagu Indikatif', html);
    document.getElementById('modalSaveBtn').onclick = async () => {
        const form = document.getElementById('paguForm');
        const formData = new FormData(form);
        const updated = {
            ...row,
            opd: formData.get('opd'),
            program: formData.get('program'),
            pagu_usulan: parseInt(formData.get('pagu_usulan')) || 0,
            pagu_disetujui: parseInt(formData.get('pagu_disetujui')) || 0,
            catatan: formData.get('catatan'),
            status: formData.get('status') || row.status,
            updated_at: getISOTimestamp()
        };
        await updateDataRecord('pagu_indikatif', updated);
        await logActivity('edit', { table: 'pagu_indikatif', row_id: row.id });
        closeModal();
        loadPaguIndikatifData();
        showToast('Data Pagu Indikatif berhasil diperbarui', 'success');
    };
}

function deletePaguRow(row) {
    showConfirmDialog('Yakin hapus baris Pagu Indikatif ini? Tindakan tidak bisa dibatalkan', async () => {
        await deleteDataRecord('pagu_indikatif', row.id);
        await logActivity('delete', { table: 'pagu_indikatif', row_id: row.id });
        loadPaguIndikatifData();
        showToast('Data Pagu Indikatif berhasil dihapus', 'success');
    });
}

function editMonitoringRow(row) {
    const html = `
        <form id="monitoringForm">
            ${createFormField('date', 'tanggal', 'Tanggal Monitoring', row.tanggal, { required: true }).outerHTML}
            ${createFormField('text', 'lokasi', 'Lokasi / OPD', row.lokasi, { required: true }).outerHTML}
            ${createFormField('textarea', 'temuan', 'Temuan', row.temuan, { rows: 3, required: true }).outerHTML}
            ${createFormField('textarea', 'rekomendasi', 'Rekomendasi', row.rekomendasi, { rows: 3, required: true }).outerHTML}
            ${createFormField('select', 'status', 'Status Tindak Lanjut', row.status, {
                choices: [
                    { value: 'Belum Ditindaklanjuti', label: 'Belum Ditindaklanjuti' },
                    { value: 'Sedang Ditindaklanjuti', label: 'Sedang Ditindaklanjuti' },
                    { value: 'Sudah Ditindaklanjuti', label: 'Sudah Ditindaklanjuti' }
                ]
            }).outerHTML}
            ${createFormField('text', 'dapil', 'Dapil', row.dapil, { required: true }).outerHTML}
        </form>
    `;

    openModal('Edit Monitoring DPRD', html);
    document.getElementById('modalSaveBtn').onclick = async () => {
        const form = document.getElementById('monitoringForm');
        const formData = new FormData(form);
        const updated = {
            ...row,
            tanggal: formData.get('tanggal'),
            lokasi: formData.get('lokasi'),
            temuan: formData.get('temuan'),
            rekomendasi: formData.get('rekomendasi'),
            status: formData.get('status'),
            dapil: formData.get('dapil')
        };
        await updateDataRecord('monitoring_dprd', updated);
        await logActivity('edit', { table: 'monitoring_dprd', row_id: row.id });
        closeModal();
        loadMonitoringData(updated.dapil || row.dapil);
        showToast('Data monitoring berhasil diperbarui', 'success');
    };
}

function deleteMonitoringRow(row) {
    showConfirmDialog('Yakin hapus baris monitoring ini? Tindakan tidak bisa dibatalkan', async () => {
        await deleteDataRecord('monitoring_dprd', row.id);
        await logActivity('delete', { table: 'monitoring_dprd', row_id: row.id });
        loadMonitoringData(row.dapil || 'I');
        showToast('Data monitoring berhasil dihapus', 'success');
    });
}

function updateHeaderDateTime() {
    const now = new Date();
    document.getElementById('headerDate').textContent = formatDate(now);
    document.getElementById('headerTime').textContent = formatTime(now);
}

function updateMenuTitles() {
    document.getElementById('realisasiTitle').textContent = 'Realisasi & Pertanggungjawaban Anggaran';
    document.getElementById('perubahanTitle').textContent = 'Perubahan Anggaran';
    document.getElementById('anggaranTitle').textContent = 'Anggaran Murni';
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.dataset.page;
            navigateTo(page);
        };
    });
}

function navigateTo(page) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Deactivate all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    let sectionId = '';
    let navItemSelector = '';
    
    switch(page) {
        case 'summary':
            sectionId = 'summaryContent';
            navItemSelector = '.nav-item:nth-child(1)';
            loadSummaryData();
            break;
        case 'realisasi':
            sectionId = 'realisasiContent';
            navItemSelector = '.nav-item:nth-child(2)';
            loadRealisasiData();
            break;
        case 'perubahan':
            sectionId = 'perubahanContent';
            navItemSelector = '.nav-item:nth-child(3)';
            loadPerubahanData();
            break;
        case 'anggaran':
            sectionId = 'anggaranContent';
            navItemSelector = '.nav-item:nth-child(4)';
            loadAnggaranData();
            break;
        case 'monitoring':
            sectionId = 'monitoringContent';
            navItemSelector = '.nav-item:nth-child(5)';
            loadMonitoringData();
            break;
        case 'files':
            sectionId = 'filesContent';
            navItemSelector = '.nav-item:nth-child(6)';
            loadFilesData();
            break;
        case 'log':
            sectionId = 'logContent';
            navItemSelector = '.nav-item:nth-child(7)';
            loadLogData();
            break;
        case 'settings':
            sectionId = 'settingsContent';
            navItemSelector = '.nav-item:nth-child(8)';
            loadSettings();
            break;
        case 'about':
            sectionId = 'aboutContent';
            break;
    }
    
    if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    }
    
    const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(title, content) {
    const modal = document.getElementById('editModal');
    const overlay = document.getElementById('modalOverlay');
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    
    overlay.style.display = 'block';
    modal.style.display = 'block';
}

function closeModal(type = 'edit') {
    if (type === 'edit') {
        document.getElementById('editModal').style.display = 'none';
    } else if (type === 'confirm') {
        document.getElementById('confirmModal').style.display = 'none';
    }
    document.getElementById('modalOverlay').style.display = 'none';
}

function showConfirmDialog(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const overlay = document.getElementById('modalOverlay');
    const confirmText = document.getElementById('confirmText');
    const confirmBtn = document.getElementById('confirmBtn');
    
    confirmText.textContent = message;
    
    overlay.style.display = 'block';
    modal.style.display = 'block';
    
    // Store the callback
    window.confirmCallback = onConfirm;
}

function executeConfirm() {
    if (window.confirmCallback) {
        window.confirmCallback();
    }
    closeModal('confirm');
}

// ============================================
// TABLE RENDERING HELPERS
// ============================================

function renderTable(tableBodyId, data, columns, actions = null) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="' + (columns.length + (actions ? 1 : 0)) + '" class="loading-row">Tidak ada data</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        if (row.locked) {
            tr.classList.add('locked');
        }
        
        // Number column
        const tdNo = document.createElement('td');
        tdNo.textContent = index + 1;
        tr.appendChild(tdNo);
        
        // Data columns
        columns.forEach(col => {
            const td = document.createElement('td');
            
            if (col.type === 'currency') {
                td.textContent = formatCurrency(row[col.field]);
                td.classList.add('text-right');
            } else if (col.type === 'number') {
                td.textContent = formatNumber(row[col.field]);
                td.classList.add('text-right');
            } else if (col.type === 'percentage') {
                td.textContent = row[col.field] + '%';
                td.classList.add('text-right');
            } else if (col.type === 'date') {
                td.textContent = formatDate(row[col.field]);
            } else {
                td.textContent = row[col.field] || '-';
            }
            
            tr.appendChild(td);
        });
        
        // Action column
        if (actions && canEdit()) {
            const tdAction = document.createElement('td');
            tdAction.className = 'action-col text-center';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-action btn-outline';
            editBtn.textContent = '✎ Edit';
            editBtn.onclick = () => actions.onEdit(row);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-action btn-danger';
            deleteBtn.textContent = '🗑 Hapus';
            deleteBtn.onclick = () => actions.onDelete(row);
            
            const historyBtn = document.createElement('button');
            historyBtn.className = 'btn btn-sm btn-action btn-outline';
            historyBtn.textContent = '📋 Riwayat';
            historyBtn.onclick = () => actions.onHistory(row);
            
            tdAction.appendChild(editBtn);
            tdAction.appendChild(deleteBtn);
            tdAction.appendChild(historyBtn);
            
            tr.appendChild(tdAction);
        }
        
        tbody.appendChild(tr);
    });
    
    // Add total row if applicable
    if (actions && actions.showTotal) {
        addTotalRow(tableBodyId, columns, data);
    }
}

function addTotalRow(tableBodyId, columns, data) {
    const tbody = document.getElementById(tableBodyId);
    const tr = document.createElement('tr');
    tr.style.fontWeight = 'bold';
    tr.style.borderTop = '2px solid #5C4530';
    tr.style.backgroundColor = '#E8E4DA';
    
    const tdNo = document.createElement('td');
    tdNo.textContent = 'TOTAL';
    tdNo.colSpan = 2;
    tr.appendChild(tdNo);
    
    columns.forEach(col => {
        if (col.type === 'currency' || col.type === 'number') {
            const total = data.reduce((sum, row) => {
                const val = parseInt(row[col.field]) || 0;
                return sum + val;
            }, 0);
            
            const td = document.createElement('td');
            if (col.type === 'currency') {
                td.textContent = formatCurrency(total);
            } else {
                td.textContent = formatNumber(total);
            }
            td.classList.add('text-right');
            tr.appendChild(td);
        }
    });
    
    tbody.appendChild(tr);
}

// ============================================
// FORM RENDERING HELPERS
// ============================================

function createFormField(type, name, label, value = '', options = {}) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelEl = document.createElement('label');
    labelEl.htmlFor = name;
    labelEl.textContent = label;
    group.appendChild(labelEl);
    
    let input;
    
    if (type === 'select') {
        input = document.createElement('select');
        input.id = name;
        input.name = name;
        
        if (options.placeholder) {
            const optionEl = document.createElement('option');
            optionEl.value = '';
            optionEl.textContent = options.placeholder;
            input.appendChild(optionEl);
        }
        
        if (options.choices) {
            options.choices.forEach(choice => {
                const optionEl = document.createElement('option');
                optionEl.value = choice.value;
                optionEl.textContent = choice.label;
                if (choice.value === value) optionEl.selected = true;
                input.appendChild(optionEl);
            });
        }
    } else if (type === 'textarea') {
        input = document.createElement('textarea');
        input.id = name;
        input.name = name;
        input.value = value;
        if (options.rows) input.rows = options.rows;
    } else {
        input = document.createElement('input');
        input.type = type;
        input.id = name;
        input.name = name;
        input.value = value;
        
        if (options.min) input.min = options.min;
        if (options.max) input.max = options.max;
        if (options.placeholder) input.placeholder = options.placeholder;
    }
    
    if (options.required) input.required = true;
    if (options.readonly) input.readOnly = true;
    
    group.appendChild(input);
    
    if (options.help) {
        const help = document.createElement('small');
        help.textContent = options.help;
        group.appendChild(help);
    }
    
    return group;
}

// ============================================
// TABLE VIEW TOGGLE
// ============================================

function toggleTableView(tableName) {
    const tableView = document.getElementById(`${tableName}TableView`);
    const chartView = document.getElementById(`${tableName}ChartView`);
    
    if (tableView && chartView) {
        const isTableVisible = tableView.style.display !== 'none';
        
        tableView.style.display = isTableVisible ? 'none' : '';
        chartView.style.display = isTableVisible ? 'block' : 'none';
        
        if (isTableVisible && tableName !== 'monitoring') {
            // Render chart
            renderChart(tableName);
        }
    }
}

function renderChart(tableName) {
    const chartId = `${tableName}Chart`;
    const canvas = document.getElementById(chartId);
    
    if (!canvas) return;
    
    // Placeholder chart rendering
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F2E8D5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#5C4530';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Grafik ' + tableName, canvas.width / 2, canvas.height / 2);
}

// ============================================
// DATA EXPORT
// ============================================

function exportTableCSV(tableName) {
    const tableBody = document.getElementById(`${tableName}TableBody`);
    if (!tableBody) return;

    const headers = Array.from(document.querySelectorAll(`#${tableName}TableView th`))
        .filter(th => !th.classList.contains('action-col'))
        .map(th => th.textContent.trim());

    const rows = Array.from(tableBody.querySelectorAll('tr'))
        .filter(row => !row.classList.contains('loading-row') && row.style.display !== 'none');

    const data = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td')).filter(td => !td.classList.contains('action-col'));
        const rowData = {};
        headers.forEach((header, index) => {
            rowData[header] = cells[index] ? cells[index].textContent.trim() : '';
        });
        return rowData;
    });

    if (data.length === 0) {
        showToast('Tidak ada data untuk diexport', 'warning');
        return;
    }

    exportToCSV(data, `${tableName}_export.csv`);
}

function exportLogCSV() {
    // Placeholder for log export
    showToast('Fitur export log akan diimplementasikan', 'info');
}

// ============================================
// SEARCH & FILTER
// ============================================

function setupTableSearch(inputId, tableBodyId, searchFields) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.oninput = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tbody = document.getElementById(tableBodyId);
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        const noResultsRow = tbody.querySelector('.no-results-row');
        if (noResultsRow) noResultsRow.remove();

        let visibleCount = 0;

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = searchTerm === '' || text.includes(searchTerm);
            row.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        });

        if (visibleCount === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'no-results-row';
            const table = tbody.closest('table');
            const colCount = table ? table.querySelectorAll('th').length : 1;
            emptyRow.innerHTML = `<td colspan="${colCount}" class="loading-row">Tidak ada hasil yang cocok</td>`;
            tbody.appendChild(emptyRow);
        }
    };
}
