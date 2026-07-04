# SIMORA DPRD MANGGARAI - TESTING GUIDE

## 🧪 Panduan Pengujian Offline & Fungsional

Dokumen ini berisi checklist lengkap untuk menguji semua fitur aplikasi SIMORA sebelum deployment ke DPRD.

---

## 📋 PRE-TEST CHECKLIST

### File Integrity Check
- [ ] Semua folder ada: `css/`, `js/`, `assets/`
- [ ] File HTML: `index.html` (1 file)
- [ ] CSS files: `styles.css`, `vintage.css` (2 files)
- [ ] JS files: `utils.js`, `database.js`, `auth.js`, `ui.js`, `app.js` (5 files)
- [ ] Assets folder berisi `fonts/`, `photos/default/`
- [ ] README.md ada dan lengkap

### Browser Preparation
- [ ] Matikan Wi-Fi sepenuhnya (jangan hanya disconnect)
- [ ] Tutup semua browser tabs lain
- [ ] Buka DevTools Console untuk monitor errors (F12)
- [ ] Jangan block localStorage/IndexedDB di browser settings

---

## 🧬 FUNCTIONAL TESTING

### Test 1: Application Launch
**Objective**: Aplikasi bisa dibuka tanpa error  
**Steps**:
1. Navigasi ke folder SIMORA
2. Double-click `index.html`
3. Browser buka dan menampilkan halaman login

**Expected Results**:
- [ ] Loading screen tampil 1-3 detik
- [ ] Halaman login muncul dengan slideshow background
- [ ] Tanggal dan jam ditampilkan live
- [ ] Tidak ada error di DevTools Console

**Fail Criteria**:
- ❌ Error di console (IndexedDB tidak bisa diakses)
- ❌ Page putih atau blank
- ❌ Form login tidak muncul

---

### Test 2: Login Functionality
**Objective**: Sistem autentikasi bekerja dengan benar

**Test Case 2a: Valid Login**
```
Username: Staf
PIN: 1234
```

**Steps**:
1. Buka aplikasi
2. Masukkan username "Staf"
3. Masukkan PIN "1234"
4. Klik "Login"

**Expected Results**:
- [ ] Muncul modal "Ubah PIN - Login Pertama Kali"
- [ ] Tidak ada error di console

**Test Case 2b: Invalid Username**
```
Username: InvalidUser
PIN: 1234
```

**Steps**:
1. Masukkan username yang tidak ada
2. Masukkan PIN apa saja
3. Klik "Login"

**Expected Results**:
- [ ] Error message: "Nama pengguna tidak ditemukan"
- [ ] Tetap di halaman login

**Test Case 2c: Invalid PIN**
```
Username: Staf
PIN: 9999
```

**Steps**:
1. Masukkan username yang benar
2. Masukkan PIN salah
3. Klik "Login"

**Expected Results**:
- [ ] Error message: "PIN salah"

---

### Test 3: PIN Change (First Login)
**Objective**: Pengguna harus ubah PIN saat login pertama kali

**Steps**:
1. Setelah login dengan PIN "1234", modal "Ubah PIN" tampil
2. Isi "PIN Lama": 1234
3. Isi "PIN Baru": 2024 (atau PIN baru apapun)
4. Isi "Konfirmasi PIN": 2024
5. Klik "Simpan"

**Expected Results**:
- [ ] PIN berhasil diubah
- [ ] Dashboard muncul
- [ ] Message: "PIN berhasil diubah"

**Fail Criteria**:
- ❌ PIN lama tidak cocok → error
- ❌ PIN baru < 4 atau > 6 digit → error
- ❌ Konfirmasi tidak cocok → error

---

### Test 4: Dashboard Navigation
**Objective**: Semua menu dapat diakses

**Steps**:
1. Setelah login, klik setiap menu di top navigation
2. Verifikasi konten berubah

**Expected Results** (Pengguna Biasa):
- [ ] Dashboard / Summary muncul dengan ringkasan data
- [ ] Realisasi [Tahun-1] tabel muncul
- [ ] Perubahan [Tahun] tabel muncul
- [ ] Anggaran [Tahun+1] tabel muncul
- [ ] Monitoring DPRD tabel muncul
- [ ] Kelola File menu muncul
- [ ] "Log Aktivitas" TIDAK tampil (hanya untuk Super Admin)
- [ ] "Pengaturan" TIDAK tampil (hanya untuk Super Admin)

**Expected Results** (Super Admin - login ulang dengan "Staf"):
- [ ] **Semua menu di atas tampil**
- [ ] Log Aktivitas menu tampil
- [ ] Pengaturan menu tampil
- [ ] Tombol "+ Tambah Baris" muncul di setiap tabel
- [ ] Tombol "+ Unggah File" muncul

---

### Test 5: Year Auto-Calculation
**Objective**: Tahun otomatis dihitung sesuai aturan spesifik

**Verification**:
1. Lihat judul di setiap menu:
   - Realisasi & Pertanggungjawaban Anggaran **[tahun sekarang - 1]**
   - Perubahan Anggaran **[tahun sekarang]**
   - Anggaran Murni **[tahun sekarang + 1]**

**Expected Results**:
- [ ] Jika tahun sistem 2026:
  - Realisasi: 2025 ✓
  - Perubahan: 2026 ✓
  - Anggaran: 2027 ✓

---

### Test 6: Table Operations (Super Admin Only)

**Test Case 6a: Add Row**
```
Menu: Realisasi & Pertanggungjawaban Anggaran
```

**Steps**:
1. Login sebagai Super Admin (username: Staf, PIN baru yang sudah diubah)
2. Buka menu "Realisasi [Tahun-1]"
3. Klik "+ Tambah Baris"
4. Isi form modal:
   - Uraian: "Program Pendidikan"
   - Anggaran: 50000000
   - Realisasi: 45000000
   - Keterangan: "Sesuai rencana"
5. Klik "Simpan"

**Expected Results**:
- [ ] Baris baru muncul di tabel
- [ ] Persentase otomatis dihitung: 90%
- [ ] Sisa Anggaran otomatis dihitung: 5000000
- [ ] Total row muncul dengan sum otomatis
- [ ] Message: "Data berhasil diperbarui"

**Test Case 6b: Edit Row**
**Steps**:
1. Di baris yang baru ditambah, klik "✎ Edit"
2. Ubah "Realisasi" menjadi 50000000
3. Klik "Simpan"

**Expected Results**:
- [ ] Persentase berubah menjadi 100%
- [ ] Sisa menjadi 0
- [ ] Log aktivitas tercatat
- [ ] Modal tertutup

**Test Case 6c: Delete Row**
**Steps**:
1. Di baris yang sudah diedit, klik "🗑 Hapus"
2. Konfirmasi dialog: "Yakin hapus baris ini?"
3. Klik "Hapus"

**Expected Results**:
- [ ] Baris dihapus dari tabel
- [ ] Total row update otomatis
- [ ] Log tercatat: delete action
- [ ] Message: "Data berhasil dihapus"

---

### Test 7: Search & Filter
**Objective**: Pencarian dan filter berfungsi

**Steps**:
1. Tambahkan beberapa baris data di menu Realisasi
2. Di kotak "Cari program...", ketik "Pendidikan"
3. Lihat tabel filter otomatis

**Expected Results**:
- [ ] Hanya baris dengan "Pendidikan" yang tampil
- [ ] Clear search field, semua baris muncul lagi

**Test 7b: Sort**
**Steps**:
1. Di dropdown "Urutkan...", pilih "Anggaran Tertinggi"

**Expected Results**:
- [ ] Baris diurutkan berdasarkan anggaran (descending)

---

### Test 8: File Upload & Download

**Test Case 8a: Upload File (Super Admin)**
**Steps**:
1. Login Super Admin
2. Buka menu "Kelola File"
3. Area upload visible
4. Pilih file test (~1 MB, format: PDF, DOCX, XLSX, dsb)
5. Pilih kategori: "Realisasi & Pertanggungjawaban"
6. Klik "Unggah"

**Expected Results**:
- [ ] Progress bar tampil
- [ ] File berhasil uploaded
- [ ] Muncul di daftar file dengan icon, nama, ukuran, tanggal
- [ ] Message: "File berhasil diunggah"

**Test Case 8b: Download File**
**Steps** (bisa sebagai Pengguna Biasa):
1. Lihat daftar file yang uploaded
2. Klik "📥 Unduh" pada salah satu file
3. File otomatis download

**Expected Results**:
- [ ] File download ke folder Downloads browser
- [ ] Nama file sama dengan original
- [ ] Message: "File berhasil diunduh"

**Test Case 8c: File Size Validation**
**Steps**:
1. Coba upload file > 10 MB

**Expected Results**:
- [ ] Error message: "Ukuran file melebihi 10 MB..."
- [ ] File NOT uploaded

---

### Test 9: Slideshow & Background Photos

**Test Case 9a: Slideshow Auto-Change**
**Steps**:
1. Kembali ke halaman login (logout atau di browser buka tab baru dengan aplikasi)
2. Amati background slideshow selama 20 detik

**Expected Results**:
- [ ] Background photo berubah setiap 8 detik
- [ ] Transisi fade smooth (tidak cut tajam)
- [ ] Minimal 2 photo placeholder muncul

**Test Case 9b: Manage Photos (Super Admin)**
**Steps**:
1. Login Super Admin
2. Menu "Pengaturan" → "Kelola Foto Background"
3. Lihat daftar foto

**Expected Results**:
- [ ] Minimal 2 placeholder photos ada
- [ ] Tombol "+ Tambah Foto" visible

---

### Test 10: Backup & Restore

**Test Case 10a: Export Data**
**Steps**:
1. Login Super Admin
2. Menu "Pengaturan" → "Backup & Restore"
3. Klik "Ekspor Seluruh Data"

**Expected Results**:
- [ ] File `.json` download (format: SIMORA_Backup_[timestamp].json)
- [ ] Buka file dengan text editor, verifikasi berisi JSON data lengkap
- [ ] Data structure terlihat jelas (users, tables, files, logs, dll)

**Test Case 10b: Import Data**
**Steps**:
1. Masuk ke menu yang sama
2. Klik "Impor Data"
3. Pilih file backup JSON yang baru didownload
4. Konfirmasi (data akan ditimpa)

**Expected Results**:
- [ ] Import berhasil
- [ ] Page refresh otomatis
- [ ] Data kembali seperti sebelum import (tentunya sama, karena import file yang baru diexport)

---

### Test 11: Log Aktivitas (Super Admin Only)

**Steps**:
1. Lakukan beberapa aksi: login, tambah data, edit, delete, upload, download
2. Buka menu "Log Aktivitas"

**Expected Results**:
- [ ] Semua aksi tercatat dengan timestamp
- [ ] Entry log: waktu, aksi, username, detail
- [ ] Urutan: newest first (descending)
- [ ] Filter options tersedia (by user, action, date)

---

### Test 12: Session Timeout

**Steps**:
1. Login
2. Tunggu 30 menit tanpa melakukan aktivitas apapun
3. Coba klik tombol atau menu

**Expected Results**:
- [ ] Setelah 30 menit inactivity: logout otomatis
- [ ] Redirect ke halaman login
- [ ] Message: "Sesi Anda berakhir karena tidak ada aktivitas"

---

### Test 13: Pagination & Large Data

**Steps**:
1. Tambahkan 100+ baris data ke satu tabel
2. Coba search, filter, sort

**Expected Results**:
- [ ] Aplikasi tetap responsive (tidak freeze)
- [ ] Search/filter berfungsi pada 100+ baris
- [ ] Sort berfungsi dengan cepat

---

## 🌐 OFFLINE VERIFICATION

**Critical Test**: Aplikasi harus 100% offline

**Steps**:
1. Pastikan Wi-Fi **sudah MATI** (atau disconnect dari router)
2. Buka aplikasi SIMORA
3. Lakukan operasi normal (login, add data, upload file, dll)
4. Monitor Network tab di DevTools (F12)

**Expected Results**:
- [ ] **ZERO network requests** (Network tab empty)
- [ ] Aplikasi berfungsi penuh tanpa internet
- [ ] Semua fitur accessible
- [ ] File upload/download bekerja local

**Fail Criteria**:
- ❌ Ada request ke external CDN (Google Fonts, Bootstrap CDN, API, dll)
- ❌ Any 404 atau network error
- ❌ Browser showing "offline" icon

---

## 🔒 SECURITY TESTING

### Test 1: PIN Validation
- [ ] PIN < 4 digit: rejected
- [ ] PIN > 6 digit: rejected
- [ ] PIN tidak pure numeric: rejected (jika rule diterapkan)

### Test 2: Authorization
- [ ] Pengguna Biasa tidak bisa see "Log Aktivitas" menu: ✓
- [ ] Pengguna Biasa tidak bisa see "Pengaturan" menu: ✓
- [ ] Pengguna Biasa tidak bisa see tombol "+Tambah" di tabel: ✓
- [ ] Pengguna Biasa tidak bisa see tombol "+Unggah File": ✓

### Test 3: Confirmation Dialogs
- [ ] Klik "Hapus" baris → konfirmasi dialog
- [ ] Jika click "Batal" → tidak ada yang terhapus
- [ ] Jika click "Hapus" → terhapus dan tercatat

---

## 🎨 UI/UX TESTING

### Test 1: Responsive Design
- [ ] Test di desktop (1920x1080): layout ok
- [ ] Test di tablet (768px): layout ok
- [ ] Test di mobile (375px): layout responsive
- [ ] Table scrollable di mobile
- [ ] Font readable di semua ukuran

### Test 2: Vintage Aesthetic
- [ ] Color palette sesuai spec (cream, dark brown, brick red, moss green, turmeric)
- [ ] Double border pada card & modal
- [ ] Font serif untuk header
- [ ] Stempel-style decoration (dashed borders)
- [ ] No modern rounded corners (max 2-4px radius)

### Test 3: Accessibility
- [ ] Form labels clearly associated
- [ ] Button text jelas dan descriptive
- [ ] Error message visible & understandable
- [ ] Links vs buttons properly styled

---

## 📊 DATA INTEGRITY TESTING

### Test 1: Calculation Accuracy
- [ ] Persentase realisasi: (realisasi / anggaran) * 100 ✓
- [ ] Sisa anggaran: anggaran - realisasi ✓
- [ ] Selisih perubahan: anggaran_baru - anggaran_awal ✓
- [ ] Total row sums correctly ✓

### Test 2: Data Persistence
- [ ] Tambah data → refresh browser → data still ada ✓
- [ ] Login berbeda user → dapat see data yang ditambah user lain ✓
- [ ] Data tidak hilang setelah close & reopen aplikasi ✓

### Test 3: Timestamps
- [ ] Setiap record punya `created_at` & `updated_at` ✓
- [ ] Timestamps otomatis, user tidak bisa manual override ✓
- [ ] Log entry punya timestamp akurat ✓

---

## 🧪 STRESS TESTING

### Test 1: Large Dataset
- [ ] Add 500 rows ke satu tabel
- [ ] Aplikasi masih responsive
- [ ] Export/Import tetap berfungsi
- [ ] Search tetap cepat

### Test 2: Large File Upload
- [ ] Upload file 9 MB
- [ ] Upload file 9.99 MB (just under limit)
- [ ] Verify both work

---

## ✅ FINAL APPROVAL CHECKLIST

Jika SEMUA test di atas **PASS**, aplikasi siap untuk deployment:

- [ ] **Functional**: Semua fitur bekerja sesuai spec
- [ ] **Offline**: 0% network dependency
- [ ] **Secure**: PIN & authorization berfungsi
- [ ] **Reliable**: Data persist & backup berfungsi
- [ ] **Performant**: Tidak lag/freeze bahkan dengan banyak data
- [ ] **Accessible**: User interface jelas dan navigasi mudah
- [ ] **Vintage**: Design aesthetic sesuai requirement

---

## 📋 DEPLOYMENT CHECKLIST

Sebelum hand-over ke DPRD:

- [ ] Semua file sudah di-copy ke target folder (C:\SIMORA\ atau lokasi final)
- [ ] Wi-Fi dimatikan → aplikasi tested 100% offline
- [ ] Default users sudah preset (40 pengguna)
- [ ] Super Admin PIN sudah diubah dari default
- [ ] README.md sudah dibaca oleh administrator
- [ ] First backup sudah dibuat & tersimpan aman
- [ ] Backup procedure documented & dijelaskan ke admin
- [ ] Troubleshooting guide sudah disiapkan
- [ ] Support contact sudah didaftarkan
- [ ] User training session sudah dijadwalkan

---

## 📝 TEST RESULTS TEMPLATE

**Date**: ___________  
**Tester**: ___________  
**Browser**: ___________  
**System**: ___________  
**Network**: ☐ Online ☐ Offline  

| Test Case | Status | Notes |
|-----------|--------|-------|
| Application Launch | ☐ PASS ☐ FAIL | |
| Login - Valid | ☐ PASS ☐ FAIL | |
| Login - Invalid | ☐ PASS ☐ FAIL | |
| Dashboard Navigation | ☐ PASS ☐ FAIL | |
| Add/Edit/Delete Data | ☐ PASS ☐ FAIL | |
| File Upload/Download | ☐ PASS ☐ FAIL | |
| Backup/Restore | ☐ PASS ☐ FAIL | |
| Log Aktivitas | ☐ PASS ☐ FAIL | |
| Offline Mode | ☐ PASS ☐ FAIL | |
| Security/Authorization | ☐ PASS ☐ FAIL | |

**Overall Status**: ☐ APPROVED ☐ NEEDS FIXES  
**Critical Issues**: _________________  
**Recommendations**: _________________

---

**Date Tested**: _________  
**Approved By**: _________  
**Deployment Date**: _________

