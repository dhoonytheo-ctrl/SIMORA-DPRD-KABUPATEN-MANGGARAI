/* ============================================
   SIMORA - MAIN APPLICATION LOGIC
   ============================================ */

// ============================================
// APPLICATION INITIALIZATION
// ============================================

async function initializeApp() {
    try {
        // Show loading screen
        document.getElementById('loadingScreen').style.display = 'flex';
        
        // Initialize database
        await initDatabase();
        log('Database initialized');
        
        // Initialize default data
        await initializeDefaultData();

        // Initialize Firebase sync if config present
        if (typeof initFirebaseFromSettings === 'function') {
            const ok = await initFirebaseFromSettings();
            if (ok && typeof pullFromFirebase === 'function') {
                // Merge remote data into local DB (safe merge)
                await pullFromFirebase();
                // Start periodic sync to remote
                if (typeof startAutoSync === 'function') startAutoSync(5 * 60 * 1000);
            }
        }
        
        // Show app container
        document.getElementById('appContainer').style.display = 'block';
        document.getElementById('loadingScreen').style.display = 'none';
        
        // Check if user is already logged in
        if (isUserLoggedIn()) {
            startSessionTimeout();
            await showDashboardPage();
        } else {
            showLoginPage();
        }
        
    } catch (err) {
        error('App initialization error:', err);
        alert('Terjadi kesalahan saat menginisialisasi aplikasi: ' + err.message);
    }
}

// ============================================
// SUMMARY DASHBOARD DATA
// ============================================

async function loadSummaryData() {
    try {
        const summaryGrid = document.getElementById('summaryGrid');
        const editSummaryBtn = document.getElementById('editSummaryBtn');
        const tahun = getTahunAnggaran();
        
        // Clear current content
        summaryGrid.innerHTML = '<div class="loading-row">Memuat ringkasan...</div>';
        
        // Load data for all tables
        const realisasiData = await getRecordsByYear('realisasi_pertanggungjawaban', tahun.realisasi);
        const perubahanData = await getRecordsByYear('perubahan_anggaran', tahun.perubahan);
        const anggaranData = await getRecordsByYear('anggaran_murni', tahun.anggaran);
        const monitoringData = await getAllRecords('monitoring_dprd');
        const summaryOverrides = await getSetting('summary_overrides') || {};
        
        // Calculate summaries
        const realisasiTotal = realisasiData.reduce((sum, r) => sum + (parseInt(r.realisasi) || 0), 0);
        const anggaranTotal = realisasiData.reduce((sum, r) => sum + (parseInt(r.anggaran) || 0), 0);
        const realisasiPersen = anggaranTotal > 0 ? Math.round((realisasiTotal / anggaranTotal) * 100) : 0;
        
        const perubahanCount = perubahanData.length;
        const anggaranCount = anggaranData.length;
        const monitoringSelesai = monitoringData.filter(m => m.status === 'Selesai').length;
        
        const realisasiTitle = summaryOverrides.realisasiTitle || `Realisasi Anggaran ${tahun.realisasi}`;
        const realisasiValue = summaryOverrides.realisasiValue || `${realisasiPersen}%`;
        const realisasiLabel1 = summaryOverrides.realisasiLabel1 || `Dari ${formatCurrency(anggaranTotal)}`;
        const realisasiLabel2 = summaryOverrides.realisasiLabel2 || `Terealisasi: ${formatCurrency(realisasiTotal)}`;
        
        const perubahanTitle = summaryOverrides.perubahanTitle || `Perubahan Anggaran ${tahun.perubahan}`;
        const perubahanValue = summaryOverrides.perubahanValue || `${perubahanCount}`;
        const perubahanLabel = summaryOverrides.perubahanLabel || 'Total Perubahan';
        
        const anggaranTitle = summaryOverrides.anggaranTitle || `Anggaran ${tahun.anggaran}`;
        const anggaranValue = summaryOverrides.anggaranValue || `${anggaranCount}`;
        const anggaranLabel = summaryOverrides.anggaranLabel || 'Program Diusulkan';
        
        const monitoringTitle = summaryOverrides.monitoringTitle || 'Monitoring DPRD';
        const monitoringValue = summaryOverrides.monitoringValue || `${monitoringSelesai}`;
        const monitoringLabel = summaryOverrides.monitoringLabel || `Dari ${monitoringData.length} Kegiatan Selesai`;
        
        // Create summary cards
        summaryGrid.innerHTML = `
            <div class="summary-card">
                <h3>${realisasiTitle}</h3>
                <div class="summary-value">${realisasiValue}</div>
                <div class="summary-label">${realisasiLabel1}</div>
                <div class="summary-label">${realisasiLabel2}</div>
            </div>
            <div class="summary-card">
                <h3>${perubahanTitle}</h3>
                <div class="summary-value">${perubahanValue}</div>
                <div class="summary-label">${perubahanLabel}</div>
            </div>
            <div class="summary-card">
                <h3>${anggaranTitle}</h3>
                <div class="summary-value">${anggaranValue}</div>
                <div class="summary-label">${anggaranLabel}</div>
            </div>
            <div class="summary-card">
                <h3>${monitoringTitle}</h3>
                <div class="summary-value">${monitoringValue}</div>
                <div class="summary-label">${monitoringLabel}</div>
            </div>
        `;
        
        if (editSummaryBtn) {
            if (isSuperAdmin()) {
                show(editSummaryBtn);
            } else {
                hide(editSummaryBtn);
            }
        }
        
        // Show notification if user is not Super Admin and there's new data
        if (!isSuperAdmin()) {
            const lastCheckTime = localStorage.getItem('SIMORA_LAST_DATA_CHECK');
            const newDataExists = realisasiData.some(r => new Date(r.updated_at) > new Date(lastCheckTime || 0)) ||
                                 perubahanData.some(r => new Date(r.updated_at) > new Date(lastCheckTime || 0));
            
            if (newDataExists) {
                const notificationBox = document.getElementById('notificationBox');
                notificationBox.style.display = 'block';
                document.getElementById('notificationText').textContent = 'Ada pembaruan data baru. Silakan refresh halaman untuk melihat data terbaru.';
            }
            
            localStorage.setItem('SIMORA_LAST_DATA_CHECK', getISOTimestamp());
        }
        
    } catch (err) {
        error('Failed to load summary data:', err);
    }
}

async function openEditSummaryModal() {
    try {
        const tahun = getTahunAnggaran();
        const summaryOverrides = await getSetting('summary_overrides') || {};

        const form = document.createElement('form');
        form.id = 'summaryEditForm';
        form.innerHTML = `
            <div class="form-grid">
                <h4>Realisasi Anggaran</h4>
            </div>
        `;

        form.appendChild(createFormField('text', 'realisasiTitle', 'Judul', summaryOverrides.realisasiTitle || `Realisasi Anggaran ${tahun.realisasi}`, { required: true }));
        form.appendChild(createFormField('text', 'realisasiValue', 'Nilai', summaryOverrides.realisasiValue || `${Math.round((summaryOverrides.realisasiValue || 0))}%`, { required: true }));
        form.appendChild(createFormField('text', 'realisasiLabel1', 'Label 1', summaryOverrides.realisasiLabel1 || `Dari ${formatCurrency(await getRecordsByYear('realisasi_pertanggungjawaban', tahun.realisasi).then(data => data.reduce((sum, r) => sum + (parseInt(r.anggaran) || 0), 0)))}`));
        form.appendChild(createFormField('text', 'realisasiLabel2', 'Label 2', summaryOverrides.realisasiLabel2 || `Terealisasi: ${formatCurrency(await getRecordsByYear('realisasi_pertanggungjawaban', tahun.realisasi).then(data => data.reduce((sum, r) => sum + (parseInt(r.realisasi) || 0), 0)))}`));

        form.appendChild(createFormField('text', 'perubahanTitle', 'Judul Perubahan', summaryOverrides.perubahanTitle || `Perubahan Anggaran ${tahun.perubahan}`, { required: true }));
        form.appendChild(createFormField('text', 'perubahanValue', 'Nilai Perubahan', summaryOverrides.perubahanValue || `${(await getRecordsByYear('perubahan_anggaran', tahun.perubahan)).length}`, { required: true }));
        form.appendChild(createFormField('text', 'perubahanLabel', 'Label Perubahan', summaryOverrides.perubahanLabel || 'Total Perubahan'));

        form.appendChild(createFormField('text', 'anggaranTitle', 'Judul Anggaran', summaryOverrides.anggaranTitle || `Anggaran ${tahun.anggaran}`, { required: true }));
        form.appendChild(createFormField('text', 'anggaranValue', 'Nilai Anggaran', summaryOverrides.anggaranValue || `${(await getRecordsByYear('anggaran_murni', tahun.anggaran)).length}`, { required: true }));
        form.appendChild(createFormField('text', 'anggaranLabel', 'Label Anggaran', summaryOverrides.anggaranLabel || 'Program Diusulkan'));

        form.appendChild(createFormField('text', 'monitoringTitle', 'Judul Monitoring', summaryOverrides.monitoringTitle || 'Monitoring DPRD', { required: true }));
        form.appendChild(createFormField('text', 'monitoringValue', 'Nilai Monitoring', summaryOverrides.monitoringValue || `${(await getAllRecords('monitoring_dprd')).filter(m => m.status === 'Selesai').length}`, { required: true }));
        form.appendChild(createFormField('text', 'monitoringLabel', 'Label Monitoring', summaryOverrides.monitoringLabel || `Dari ${(await getAllRecords('monitoring_dprd')).length} Kegiatan Selesai`));

        openModal('Edit Dashboard Ringkasan', form.outerHTML);

        setSaveModalDataCallback(async () => {
            const editForm = document.getElementById('summaryEditForm');
            if (!editForm) return;

            const formData = new FormData(editForm);

            const overrides = {
                realisasiTitle: formData.get('realisasiTitle'),
                realisasiValue: formData.get('realisasiValue'),
                realisasiLabel1: formData.get('realisasiLabel1'),
                realisasiLabel2: formData.get('realisasiLabel2'),
                perubahanTitle: formData.get('perubahanTitle'),
                perubahanValue: formData.get('perubahanValue'),
                perubahanLabel: formData.get('perubahanLabel'),
                anggaranTitle: formData.get('anggaranTitle'),
                anggaranValue: formData.get('anggaranValue'),
                anggaranLabel: formData.get('anggaranLabel'),
                monitoringTitle: formData.get('monitoringTitle'),
                monitoringValue: formData.get('monitoringValue'),
                monitoringLabel: formData.get('monitoringLabel')
            };

            await setSetting('summary_overrides', overrides);
            closeModal();
            await loadSummaryData();
            showToast('Ringkasan berhasil disimpan', 'success');
        });
    } catch (err) {
        error('Failed to open edit summary modal:', err);
        showToast('Tidak dapat membuka form edit ringkasan', 'error');
    }
}

// ============================================
// REALISASI & PERTANGGUNGJAWABAN ANGGARAN
// ============================================

async function loadRealisasiData() {
    try {
        const tahun = getTahunAnggaran().realisasi;
        const data = await getRecordsByYear('realisasi_pertanggungjawaban', tahun);
        
        const columns = [
            { field: 'uraian', label: 'Uraian/Program' },
            { field: 'anggaran', label: 'Anggaran (Rp)', type: 'currency' },
            { field: 'realisasi', label: 'Realisasi (Rp)', type: 'currency' },
            { field: 'persentase', label: 'Persentase (%)', type: 'percentage' },
            { field: 'sisa', label: 'Sisa Anggaran (Rp)', type: 'currency' },
            { field: 'keterangan', label: 'Keterangan' }
        ];
        
        // Calculate derived fields
        data.forEach(row => {
            const anggaran = parseInt(row.anggaran) || 0;
            const realisasi = parseInt(row.realisasi) || 0;
            row.persentase = calculatePercentage(realisasi, anggaran);
            row.sisa = anggaran - realisasi;
        });
        
        renderTable('realisasiTableBody', data, columns, {
            onEdit: (row) => editRealisasiRow(row),
            onDelete: (row) => deleteRealisasiRow(row),
            onHistory: (row) => showRowHistory('realisasi_pertanggungjawaban', row.id),
            showTotal: true
        });
        
        setupTableSearch('realisasiSearch', 'realisasiTableBody', ['uraian']);
        setupTableSort('realisasiSort', 'realisasiTableBody', data, sorted => {
            const sortedRows = sorted.map((row, index) => ({ ...row, order: index + 1 }));
            renderTable('realisasiTableBody', sortedRows, columns, {
                onEdit: (row) => editRealisasiRow(row),
                onDelete: (row) => deleteRealisasiRow(row),
                onHistory: (row) => showRowHistory('realisasi_pertanggungjawaban', row.id),
                showTotal: true
            });
        });
        
    } catch (err) {
        error('Failed to load realisasi data:', err);
    }
}

function editRealisasiRow(row) {
    let html = `
        <form id="realisasiForm">
            <input type="hidden" id="rowId" value="${row.id}">
            ${createFormField('text', 'uraian', 'Uraian/Program', row.uraian, { required: true }).outerHTML}
            ${createFormField('number', 'anggaran', 'Anggaran (Rp)', row.anggaran, { required: true }).outerHTML}
            ${createFormField('number', 'realisasi', 'Realisasi (Rp)', row.realisasi, { required: true }).outerHTML}
            ${createFormField('textarea', 'keterangan', 'Keterangan', row.keterangan, { rows: 3 }).outerHTML}
        </form>
    `;
    
    openModal('Edit Realisasi & Pertanggungjawaban', html);
    
    document.getElementById('modalSaveBtn').onclick = async () => {
        const form = document.getElementById('realisasiForm');
        const formData = new FormData(form);
        
        const updated = {
            ...row,
            uraian: formData.get('uraian'),
            anggaran: parseInt(formData.get('anggaran')),
            realisasi: parseInt(formData.get('realisasi')),
            keterangan: formData.get('keterangan')
        };
        
        await updateDataRecord('realisasi_pertanggungjawaban', updated);
        await logActivity('edit', { table: 'realisasi_pertanggungjawaban', row_id: row.id });
        
        closeModal();
        loadRealisasiData();
        showToast('Data berhasil diperbarui', 'success');
    };
}

async function deleteRealisasiRow(row) {
    showConfirmDialog('Yakin hapus baris ini? Tindakan tidak bisa dibatalkan', async () => {
        await deleteDataRecord('realisasi_pertanggungjawaban', row.id);
        await logActivity('delete', { table: 'realisasi_pertanggungjawaban', row_id: row.id });
        
        loadRealisasiData();
        showToast('Data berhasil dihapus', 'success');
    });
}

// ============================================
// ANGGARAN MURNI
// ============================================

async function loadAnggaranData() {
    try {
        const tahun = getTahunAnggaran().anggaran;
        const data = await getRecordsByYear('anggaran_murni', tahun);
        
        const columns = [
            { field: 'uraian', label: 'Uraian/Program' },
            { field: 'pagu', label: 'Pagu Anggaran (Rp)', type: 'currency' },
            { field: 'sumber_dana', label: 'Sumber Dana' },
            { field: 'status', label: 'Status' },
            { field: 'keterangan', label: 'Keterangan' }
        ];
        
        renderTable('anggaranTableBody', data, columns, {
            onEdit: (row) => editAnggaranRow(row),
            onDelete: (row) => deleteAnggaranRow(row),
            onHistory: (row) => showRowHistory('anggaran_murni', row.id),
            showTotal: false
        });
        
        setupTableSearch('anggaranSearch', 'anggaranTableBody', ['uraian']);
        setupTableSort('anggaranSort', 'anggaranTableBody', data, sorted => {
            renderTable('anggaranTableBody', sorted, columns, {
                onEdit: (row) => editAnggaranRow(row),
                onDelete: (row) => deleteAnggaranRow(row),
                onHistory: (row) => showRowHistory('anggaran_murni', row.id),
                showTotal: false
            });
        });
        
    } catch (err) {
        error('Failed to load anggaran data:', err);
    }
}

function editAnggaranRow(row) {
    let html = `
        <form id="anggaranForm">
            <input type="hidden" id="rowId" value="${row.id}">
            ${createFormField('text', 'uraian', 'Uraian/Program', row.uraian, { required: true }).outerHTML}
            ${createFormField('number', 'pagu', 'Pagu Anggaran (Rp)', row.pagu, { required: true }).outerHTML}
            ${createFormField('text', 'sumber_dana', 'Sumber Dana', row.sumber_dana, { required: true }).outerHTML}
            ${createFormField('select', 'status', 'Status', row.status, {
                choices: [
                    { value: 'Diajukan', label: 'Diajukan' },
                    { value: 'Disetujui', label: 'Disetujui' },
                    { value: 'Dibahas', label: 'Dibahas' }
                ]
            }).outerHTML}
            ${createFormField('textarea', 'keterangan', 'Keterangan', row.keterangan, { rows: 3 }).outerHTML}
        </form>
    `;
    
    openModal('Edit Anggaran Murni', html);
    
    document.getElementById('modalSaveBtn').onclick = async () => {
        const form = document.getElementById('anggaranForm');
        const formData = new FormData(form);
        
        const updated = {
            ...row,
            uraian: formData.get('uraian'),
            pagu: parseInt(formData.get('pagu')),
            sumber_dana: formData.get('sumber_dana'),
            status: formData.get('status'),
            keterangan: formData.get('keterangan'),
            tahun: getTahunAnggaran().anggaran
        };
        
        await updateDataRecord('anggaran_murni', updated);
        await logActivity('edit', { table: 'anggaran_murni', row_id: row.id });
        
        closeModal();
        loadAnggaranData();
        showToast('Data berhasil diperbarui', 'success');
    };
}

async function deleteAnggaranRow(row) {
    showConfirmDialog('Yakin hapus baris ini? Tindakan tidak bisa dibatalkan', async () => {
        await deleteDataRecord('anggaran_murni', row.id);
        await logActivity('delete', { table: 'anggaran_murni', row_id: row.id });
        
        loadAnggaranData();
        showToast('Data berhasil dihapus', 'success');
    });
}

// ============================================
// FILES MANAGEMENT
// ============================================

async function loadFilesData() {
    try {
        const files = await getAllFiles();
        const filesList = document.getElementById('filesList');
        
        if (files.length === 0) {
            filesList.innerHTML = '<div class="loading-row">Tidak ada file yang diunggah</div>';
            return;
        }
        
        filesList.innerHTML = '';
        
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            fileItem.innerHTML = `
                <div class="file-item-header">
                    <div class="file-item-icon">${getFileIcon(file.name)}</div>
                    <div>
                        <div class="file-item-name">${file.name}</div>
                        <div class="file-item-meta">Kategori: ${file.category || 'Umum'}</div>
                        <div class="file-item-meta">Ukuran: ${formatFileSize(file.size)}</div>
                        <div class="file-item-meta">Diunggah: ${formatDateTime(file.uploaded_at)}</div>
                    </div>
                </div>
                <div class="file-item-actions">
                    <button class="btn btn-sm btn-action btn-primary" onclick="downloadFileData('${file.id}')">📥 Unduh</button>
                    ${isSuperAdmin() ? `<button class="btn btn-sm btn-action btn-danger" onclick="deleteFileData('${file.id}')">🗑 Hapus</button>` : ''}
                </div>
            `;
            
            filesList.appendChild(fileItem);
        });
        
        // Setup upload area for Super Admin
        if (isSuperAdmin()) {
            setupFileUpload();
        }
        
    } catch (err) {
        error('Failed to load files data:', err);
    }
}

async function importPaguIndikatifFromExcel(file) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetNames = workbook.SheetNames;
    if (!sheetNames || sheetNames.length === 0) {
        throw new Error('File Excel tidak memiliki sheet yang dapat dibaca');
    }

    const targetSheetName = sheetNames.find(name => /pagu|rapbd|kua|ppas|struktur/i.test(name)) || sheetNames[0];
    const worksheet = workbook.Sheets[targetSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    if (rows.length === 0) {
        throw new Error('Sheet Excel kosong');
    }

    let headerRowIndex = rows.findIndex(row => row.some(cell => typeof cell === 'string' && /perangkat|opd|program|kegiatan|pagu/i.test(cell.toLowerCase())));
    if (headerRowIndex === -1) {
        headerRowIndex = 0;
    }

    const headerRow = rows[headerRowIndex].map(cell => (typeof cell === 'string' ? cell.trim().toLowerCase() : ''));
    const colMap = {
        opd: -1,
        program: -1,
        pagu_usulan: -1,
        pagu_disetujui: -1,
        catatan: -1,
        status: -1
    };

    headerRow.forEach((header, index) => {
        if (colMap.opd === -1 && /perangkat|opd|unit|skpd|dinas|bidang/.test(header)) {
            colMap.opd = index;
        }
        if (colMap.program === -1 && /program|kegiatan|uraian|keterangan|judul/.test(header)) {
            colMap.program = index;
        }
        if (colMap.pagu_usulan === -1 && /usul|indik|pagu.*usul|pagu indikatif|pagu.*indik/.test(header)) {
            colMap.pagu_usulan = index;
        }
        if (colMap.pagu_disetujui === -1 && /disetuji|hasil.*pembahasan|pembahasan|pagu.*setujui|pagu.*disetujui|pagu disetujui/.test(header)) {
            colMap.pagu_disetujui = index;
        }
        if (colMap.catatan === -1 && /catatan|keterangan|note|remark/.test(header)) {
            colMap.catatan = index;
        }
        if (colMap.status === -1 && /status/.test(header)) {
            colMap.status = index;
        }
    });

    const imported = [];
    const tahun = getTahunAnggaran().perubahan;
    const createdBy = getCurrentUserId();
    const timestamp = getISOTimestamp();

    rows.slice(headerRowIndex + 1).forEach((row) => {
        const opd = String(row[colMap.opd] ?? '').trim();
        const program = String(row[colMap.program] ?? '').trim();
        const paguUsulanRaw = String(row[colMap.pagu_usulan] ?? '');
        const paguDisetujuiRaw = String(row[colMap.pagu_disetujui] ?? '');
        const catatan = String(row[colMap.catatan] ?? '').trim();
        const statusValue = String(row[colMap.status] ?? '').trim();

        const pagu_usulan = parseCurrency(paguUsulanRaw);
        const pagu_disetujui = parseCurrency(paguDisetujuiRaw);

        if (!opd && !program && !pagu_usulan && !pagu_disetujui) {
            return;
        }

        imported.push({
            id: generateUUID(),
            opd: opd || 'Tidak Terdefinisi',
            program: program || 'Tidak Terdefinisi',
            pagu_usulan,
            pagu_disetujui,
            catatan: catatan || 'Diimpor dari dokumen KUA PPAS',
            status: statusValue || (pagu_disetujui > 0 ? 'Disetujui' : 'Diajukan'),
            tahun,
            created_by: createdBy,
            created_at: timestamp,
            updated_at: timestamp
        });
    });

    if (imported.length === 0) {
        throw new Error('Tidak ada data perangkat daerah yang valid ditemukan dalam file Excel');
    }

    for (const record of imported) {
        await putRecord(STORES.pagu_indikatif, record);
    }

    return imported.length;
}

function setupFileUpload() {
    const dropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadConfirmBtn = document.getElementById('uploadConfirmBtn');
    let selectedFile = null;
    
    dropZone.onclick = () => fileInput.click();
    
    fileInput.onchange = (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            updateDropZoneStatus(selectedFile.name);
        }
    };
    
    dropZone.ondragover = (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    };
    
    dropZone.ondragleave = () => {
        dropZone.classList.remove('drag-over');
    };
    
    dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        selectedFile = e.dataTransfer.files[0];
        if (selectedFile) {
            updateDropZoneStatus(selectedFile.name);
        }
    };
    
    uploadConfirmBtn.onclick = async () => {
        if (!selectedFile) {
            showToast('Pilih file terlebih dahulu', 'warning');
            return;
        }
        
        const category = document.getElementById('fileCategory').value;
        if (!category) {
            showToast('Pilih kategori file', 'warning');
            return;
        }
        
        if (!validateFileSize(selectedFile.size, 10)) {
            showToast(`Ukuran file melebihi 10 MB. Ukuran file: ${formatFileSize(selectedFile.size)}`, 'error');
            return;
        }
        
        try {
            if (category === 'perubahan' && ['xls', 'xlsx'].includes(getFileExtension(selectedFile.name))) {
                const count = await importPaguIndikatifFromExcel(selectedFile);
                showToast(`Data Pagu Indikatif berhasil diimpor (${count} baris)`, 'success');
            }

            await uploadFile(selectedFile, category);
            await logActivity('upload', { filename: selectedFile.name, category: category });
            
            selectedFile = null;
            fileInput.value = '';
            document.getElementById('fileCategory').value = '';
            dropZone.classList.remove('drag-over');
            dropZone.innerHTML = '<div class="drop-icon">📁</div><p>Drag & drop file di sini</p><p class="text-muted">atau klik untuk memilih</p>';
            
            loadFilesData();
            showToast('File berhasil diunggah', 'success');
            
            if (category === 'perubahan') {
                loadPaguIndikatifData();
            }
        } catch (err) {
            error('File upload error:', err);
            showToast('Gagal mengunggah file: ' + err.message, 'error');
        }
    };
}

function updateDropZoneStatus(filename) {
    const dropZone = document.getElementById('fileDropZone');
    dropZone.innerHTML = `<div class="drop-icon">✓</div><p>File dipilih: <strong>${filename}</strong></p><p class="text-muted">Klik ubah atau drop file lain</p>`;
}

async function downloadFileData(fileId) {
    try {
        const file = await getFile(fileId);
        if (!file) {
            showToast('File tidak ditemukan', 'error');
            return;
        }
        
        const link = document.createElement('a');
        link.href = file.content;
        link.download = file.name;
        link.click();
        
        await logActivity('download', { filename: file.name });
        showToast('File berhasil diunduh', 'success');
    } catch (err) {
        error('File download error:', err);
        showToast('Gagal mengunduh file', 'error');
    }
}

async function deleteFileData(fileId) {
    showConfirmDialog('Yakin hapus file ini?', async () => {
        try {
            const file = await getFile(fileId);
            await deleteFile(fileId);
            await logActivity('delete_file', { filename: file.name });
            
            loadFilesData();
            showToast('File berhasil dihapus', 'success');
        } catch (err) {
            error('File deletion error:', err);
            showToast('Gagal menghapus file', 'error');
        }
    });
}

// ============================================
// LOG ACTIVITY
// ============================================

async function loadLogData() {
    try {
        const logs = await getAllActivityLogs();
        const logList = document.getElementById('logList');
        
        if (logs.length === 0) {
            logList.innerHTML = '<div class="loading-row">Tidak ada aktivitas</div>';
            return;
        }
        
        logList.innerHTML = '';
        
        // Sort logs by timestamp (newest first)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        logs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            
            logEntry.innerHTML = `
                <div class="log-time">${formatDateTime(log.timestamp)}</div>
                <div class="log-action">${log.action.toUpperCase()}</div>
                <div class="log-user">User: ${log.user_name}</div>
                <div class="log-details">${log.details ? JSON.stringify(log.details) : '-'}</div>
            `;
            
            logList.appendChild(logEntry);
        });
        
    } catch (err) {
        error('Failed to load log data:', err);
    }
}

function applyLogFilters() {
    showToast('Fitur filter log akan diimplementasikan', 'info');
}

// ============================================
// SETTINGS & CONFIGURATION
// ============================================

async function loadSettings() {
    try {
        if (!isSuperAdmin()) return;
        
        // Load users list
        const users = await getAllUsers();
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';
        
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div>
                    <strong>${user.username}</strong>
                    <div class="text-muted">${user.role === 'superadmin' ? 'Super Admin' : 'Pengguna Biasa'}</div>
                </div>
                <div>
                    <button class="btn btn-sm" onclick="editUserSettings('${user.id}')">✎ Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUserSettings('${user.id}')">🗑 Hapus</button>
                </div>
            `;
            usersList.appendChild(userItem);
        });
        
        // Load photos list
        const photos = await getAllBackgroundPhotos();
        const photosList = document.getElementById('photosList');
        photosList.innerHTML = '';
        
        photos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `
                <div>
                    <strong>${photo.name}</strong>
                    <div class="text-muted">Urutan: ${photo.order + 1}</div>
                </div>
                <div>
                    <button class="btn btn-sm" onclick="deletePhotoSettings('${photo.id}')">🗑 Hapus</button>
                </div>
            `;
            photosList.appendChild(photoItem);
        });
        
        // Load lock status
        const locks = await getAllLocks();
        const lockManagement = document.getElementById('lockManagement');
        lockManagement.innerHTML = '';
        
        const tahun = getTahunAnggaran();
        const tables = [
            { name: 'realisasi_pertanggungjawaban', label: 'Realisasi ' + tahun.realisasi },
            { name: 'perubahan_anggaran', label: 'Perubahan ' + tahun.perubahan },
            { name: 'anggaran_murni', label: 'Anggaran ' + tahun.anggaran },
            { name: 'monitoring_dprd', label: 'Monitoring' }
        ];
        
        tables.forEach(table => {
            const lock = locks.find(l => l.table === table.name);
            const isLocked = lock && lock.locked === true;
            
            const lockStatus = document.createElement('div');
            lockStatus.className = 'lock-status';
            lockStatus.innerHTML = `
                <div>
                    <strong>${table.label}</strong>
                    <div class="text-muted">${isLocked ? '🔒 Terkunci' : '🔓 Terbuka'}</div>
                </div>
                <button class="btn btn-sm" onclick="toggleDataLock('${table.name}')">
                    ${isLocked ? 'Buka' : 'Kunci'}
                </button>
            `;
            lockManagement.appendChild(lockStatus);
        });
        
    } catch (err) {
        error('Failed to load settings:', err);
    }
}

async function toggleDataLock(tableName) {
    try {
        const tahun = getTahunAnggaran();
        let year = tahun.realisasi;
        
        if (tableName === 'perubahan_anggaran') year = tahun.perubahan;
        if (tableName === 'anggaran_murni') year = tahun.anggaran;
        
        const isLocked = await isDataLocked(tableName, year);
        
        if (isLocked) {
            await unlockData(tableName, year);
            showToast('Data berhasil dibuka', 'success');
        } else {
            await lockData(tableName, year);
            showToast('Data berhasil dikunci', 'success');
        }
        
        loadSettings();
    } catch (err) {
        error('Toggle lock error:', err);
    }
}

function showChangePinModal(username) {
    const html = `
        <form id="changePinForm">
            ${createFormField('password', 'oldPin', 'PIN Lama', '', { required: true }).outerHTML}
            ${createFormField('password', 'newPin', 'PIN Baru (4-6 digit)', '', { required: true, placeholder: '1234' }).outerHTML}
            ${createFormField('password', 'confirmPin', 'Konfirmasi PIN Baru', '', { required: true }).outerHTML}
        </form>
    `;
    
    openModal('Ubah PIN - Login Pertama Kali', html);
    
    document.getElementById('modalSaveBtn').onclick = async () => {
        const form = document.getElementById('changePinForm');
        const formData = new FormData(form);
        
        const result = await changePin(
            username,
            formData.get('oldPin'),
            formData.get('newPin'),
            formData.get('confirmPin')
        );
        
        if (result.success) {
            closeModal();
            document.getElementById('loginForm').reset();
            await showDashboardPage();
            showToast(result.message, 'success');
        } else {
            showToast(result.message, 'error');
        }
    };
}

function editUserSettings(userId) {
    showToast('Fitur edit pengguna akan diimplementasikan', 'info');
}

async function deleteUserSettings(userId) {
    showConfirmDialog('Yakin hapus pengguna ini?', async () => {
        try {
            await deleteUser(userId);
            loadSettings();
            showToast('Pengguna berhasil dihapus', 'success');
        } catch (err) {
            showToast('Gagal menghapus pengguna', 'error');
        }
    });
}

async function deletePhotoSettings(photoId) {
    showConfirmDialog('Yakin hapus foto ini?', async () => {
        try {
            await deleteBackgroundPhoto(photoId);
            loadSettings();
            showToast('Foto berhasil dihapus', 'success');
        } catch (err) {
            showToast('Gagal menghapus foto', 'error');
        }
    });
}

function addNewUser() {
    showToast('Fitur tambah pengguna akan diimplementasikan', 'info');
}

function addNewPhoto() {
    showToast('Fitur tambah foto akan diimplementasikan', 'info');
}

async function handleExportAllData() {
    try {
        const backup = await exportAllData();
        exportToJSON(backup, `SIMORA_Backup_${new Date().getTime()}.json`);
        await logActivity('export', { type: 'full_backup' });
        showToast('Data berhasil diexport', 'success');
    } catch (err) {
        error('Export error:', err);
        showToast('Gagal mengexport data', 'error');
    }
}

function importDataUI() {
    const input = document.getElementById('importFileInput');
    input.click();
    
    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const backup = JSON.parse(event.target.result);
                if (confirm('Ini akan menimpa semua data yang ada. Lanjutkan?')) {
                    await importData(backup);
                    await logActivity('import', { type: 'full_backup' });
                    showToast('Data berhasil diimport', 'success');
                    location.reload();
                }
            } catch (err) {
                error('Import error:', err);
                showToast('File backup tidak valid', 'error');
            }
        };
        reader.readAsText(file);
    });
}

// ============================================
// ROW HISTORY
// ============================================

function showRowHistory(tableName, rowId) {
    showToast('Fitur riwayat perubahan akan diimplementasikan', 'info');
}

// ============================================
// TABLE SORT HELPER
// ============================================

function setupTableSort(selectId, tableBodyId, data, renderCallback) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.onchange = (e) => {
        const sortBy = e.target.value;
        let sorted = [...data];

        if (!sortBy) {
            if (renderCallback) {
                renderCallback(sorted);
            }
            return;
        }

        switch (sortBy) {
            case 'nama':
                sorted = sortArray(sorted, 'uraian', 'asc');
                break;
            case 'anggaran':
                sorted = sortArray(sorted, 'anggaran', 'desc');
                break;
            case 'realisasi':
                sorted = sortArray(sorted, 'realisasi', 'desc');
                break;
            case 'persentase':
                sorted = sortArray(sorted, 'persentase', 'asc');
                break;
            case 'tanggal':
                sorted = sortArray(sorted, 'tanggal_perubahan', 'desc');
                break;
            case 'pagu':
                sorted = sortArray(sorted, 'pagu', 'desc');
                break;
            case 'pagu_usulan':
                sorted = sortArray(sorted, 'pagu_usulan', 'desc');
                break;
            case 'pagu_disetujui':
                sorted = sortArray(sorted, 'pagu_disetujui', 'desc');
                break;
            case 'status':
                sorted = sortArray(sorted, 'status', 'asc');
                break;
            default:
                break;
        }

        if (renderCallback) {
            renderCallback(sorted);
        } else {
            const columns = [];
            renderTable(tableBodyId, sorted, columns);
        }
    };
}

// ============================================
// MODAL SAVE DATA HANDLER
// ============================================

let saveModalDataCallback = null;

function setSaveModalDataCallback(callback) {
    saveModalDataCallback = callback;
}

function saveModalData() {
    if (saveModalDataCallback) {
        saveModalDataCallback();
    }
}

// ============================================
// START APPLICATION
// ============================================

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Prevent accidental page unload if there's unsaved data
window.addEventListener('beforeunload', (e) => {
    // Optional: Add logic to detect unsaved changes
    // if (hasUnsavedChanges) {
    //     e.preventDefault();
    //     e.returnValue = '';
    // }
});
