# SIMORA DPRD MANGGARAI
## Sistem Informasi Monitoring dan Realisasi Anggaran

**Versi:** 1.0  
**Tahun:** 2026  
**Status:** Inovasi Latsar CPNS Provinsi NTT

---

## 📋 DAFTAR ISI

1. [Pengantar](#pengantar)
2. [Fitur Utama](#fitur-utama)
3. [Persyaratan Sistem](#persyaratan-sistem)
4. [Instalasi & Setup](#instalasi--setup)
5. [Penggunaan](#penggunaan)
6. [Panduan Pengguna](#panduan-pengguna)
7. [Super Admin Guide](#super-admin-guide)
8. [Backup & Restore](#backup--restore)
9. [Troubleshooting](#troubleshooting)
10. [Informasi Teknis](#informasi-teknis)

---

## 🎯 PENGANTAR

**SIMORA DPRD MANGGARAI** adalah sistem informasi terintegrasi yang dirancang khusus untuk menunjang aktivitas monitoring dan realisasi anggaran di tingkat legislatif daerah (DPRD Kabupaten Manggarai).

### Karakteristik Utama:
- ✅ **100% Offline**: Berjalan sepenuhnya di browser lokal tanpa memerlukan koneksi internet setelah file pertama kali dibuka
- ✅ **Single-Device**: Disimpan di satu PC/perangkat kantor dengan akses bergantian dari 40 pengguna
- ✅ **Secure**: Sistem autentikasi dengan nama + PIN (4-6 digit)
- ✅ **Transparent**: Audit trail lengkap untuk setiap perubahan data
- ✅ **Vintage Design**: Estetika dokumen kearsipan administratif era 1970-90an Indonesia

---

## ⭐ FITUR UTAMA

### 1. **4 Menu Dashboard Utama**

#### Menu 1: Realisasi & Pertanggungjawaban Anggaran [Tahun-1]
- Mencatat realisasi anggaran tahun yang baru selesai
- Kolom: No, Uraian/Program, Anggaran, Realisasi, Persentase, Sisa Anggaran, Keterangan
- Perhitungan otomatis: persentase & sisa anggaran
- Total baris otomatis

#### Menu 2: Perubahan Anggaran [Tahun Berjalan]
- Mencatat perubahan anggaran tahun berjalan
- Kolom: No, Uraian/Program, Anggaran Awal, Anggaran Setelah Perubahan, Selisih, Alasan, Tanggal
- Filter dan urutkan berdasarkan tanggal

#### Menu 3: Anggaran Murni [Tahun+1]
- Persiapan anggaran tahun depan
- Kolom: No, Uraian/Program, Pagu Anggaran, Sumber Dana, Status, Keterangan
- Status: Diajukan/Disetujui/Dibahas

#### Menu 4: Hasil Monitoring DPRD
- Pendokumentasian kegiatan monitoring lapangan
- Kolom: No, Tanggal, Lokasi/OPD, Temuan, Rekomendasi, Status Tindak Lanjut
- Filter berdasarkan status dan rentang tanggal

### 2. **Autentikasi & Hak Akses**
- **Super Admin (1 orang)**: Kontrol penuh atas semua data, file, pengguna, dan pengaturan
- **Pengguna Biasa (39 orang)**: Read-only untuk semua tabel, bisa mengunduh file, custom tampilan

### 3. **Manajemen File**
- Unggah dokumen hingga 10 MB (Super Admin only)
- Kategori file otomatis
- Download untuk semua pengguna
- Penyimpanan lokal via IndexedDB

### 4. **Background Slideshow**
- Slideshow otomatis foto wisata Manggarai (berganti setiap 8 detik)
- Kelola foto background (Super Admin)
- Transisi fade yang halus

### 5. **Audit Trail & Log Aktivitas**
- Pencatatan otomatis setiap aksi penting
- Riwayat perubahan per baris (nilai sebelum & sesudah)
- Filter log berdasarkan pengguna, aksi, dan tanggal
- Export log ke CSV

### 6. **Kunci Data per Tahun**
- Lock tabel setelah disahkan
- Terkunci tapi tetap visible
- Hanya Super Admin yang bisa buka/kunci

### 7. **Backup & Restore**
- Export seluruh data ke file JSON
- Import backup untuk restore data
- Essential untuk single-device deployment

### 8. **Tampilan & Filter Custom**
- Toggle tabel ↔ grafik
- Cari data di semua tabel
- Urutkan berdasarkan kolom tertentu
- Filter berdasarkan kriteria (status, tanggal, dll)

---

## 🖥️ PERSYARATAN SISTEM

### Hardware Minimum:
- PC/Laptop dengan RAM minimal 2 GB
- Ruang disk: ~50 MB (untuk aplikasi + data)

### Software:
- **Browser Modern** (Chrome, Firefox, Edge, Safari dengan IndexedDB support)
- **Sistem Operasi**: Windows, macOS, Linux
- Tidak perlu: Node.js, npm, atau server backend

### Konektivitas:
- **Internet**: Hanya untuk download aplikasi PERTAMA KALI
- **Saat Penggunaan**: 100% OFFLINE - tidak perlu koneksi internet

---

## 🚀 INSTALASI & SETUP

### Step 1: Unduh Aplikasi
1. Download folder `SIMORA` dari sumber yang diberikan
2. Pastikan semua file sudah lengkap (HTML, CSS, JS, assets)

### Step 2: Simpan di PC Kantor
```
C:\Program Files\SIMORA\
atau
C:\Users\[Username]\Desktop\SIMORA\
```

### Step 3: Buka Aplikasi
- **Windows**: Klik ganda `index.html`
- **macOS/Linux**: Buka `index.html` dengan browser favorit

### Step 4: First-Time Setup
1. Buka aplikasi (akan loading sebentar pertama kali)
2. Login dengan:
   - **Nama**: `Staf` (Super Admin)
   - **PIN**: `1234`
3. Ubah PIN Super Admin sesuai petunjuk
4. Setup awal selesai!

---

## 📖 PENGGUNAAN

### Login Pertama Kali
```
Halaman Login
├── Masukkan Nama Pengguna
├── Masukkan PIN (4-6 digit)
└── Klik "Login"
```

**Catatan**: 
- Saat login pertama kali, sistem akan meminta mengubah PIN
- PIN default untuk semua pengguna di setup awal adalah `1234`
- Wajib ubah PIN sebelum bisa akses dashboard

### Dashboard Ringkasan
Tampilkan sekilas:
- Total realisasi vs anggaran tahun lalu (%)
- Jumlah perubahan anggaran tahun ini
- Jumlah program anggaran tahun depan
- Status monitoring DPRD

### Akses Menu Tabel
Klik menu di top navigation:
- **Realisasi** → lihat/edit data pertanggungjawaban
- **Perubahan** → lihat/edit perubahan anggaran
- **Anggaran** → lihat/edit rencana anggaran
- **Monitoring** → lihat/edit hasil monitoring

### Unduh File
1. Buka menu "Kelola File"
2. Lihat daftar semua file yang ada
3. Klik "Unduh" pada file yang diinginkan
4. File otomatis tersimpan ke folder Download

### Logout
1. Klik tombol "Logout" di pojok kanan atas
2. Konfirmasi logout
3. Kembali ke halaman login

---

## 👨‍💼 PANDUAN PENGGUNA (Pengguna Biasa)

### Hak Akses Anda:
✅ Melihat semua data di 4 menu dashboard (read-only)  
✅ Mengunduh semua file yang tersedia  
✅ Mengubah tampilan: filter, cari, urutkan, toggle tabel↔grafik  
❌ Tidak bisa menambah/edit/hapus data  
❌ Tidak bisa mengunggah file  

### Tips Penggunaan:
1. **Cari data**: Ketik di kotak "Cari..." untuk menemukan program tertentu
2. **Urutkan**: Gunakan dropdown "Urutkan..." untuk menyusun data
3. **Filter tanggal**: Pada Monitoring DPRD, gunakan filter "Dari tanggal" dan "Sampai tanggal"
4. **Toggle tampilan**: Klik "Ubah Tampilan" untuk lihat grafik ringkas
5. **Export**: Klik "Export CSV" untuk dapatkan data dalam format Excel

### Notifikasi
- Jika ada data baru ditambahkan sejak Anda terakhir login, badge "Notifikasi" akan muncul
- Refresh halaman untuk melihat data terbaru

---

## 🛡️ SUPER ADMIN GUIDE

### Hak Akses Super Admin:
✅ Tambah/edit/hapus semua data di 4 menu  
✅ Unggah & kelola file (max 10 MB per file)  
✅ Kelola akun pengguna & reset PIN  
✅ Kelola foto background slideshow  
✅ Kunci data per tahun  
✅ Lihat & export log aktivitas lengkap  
✅ Backup/restore semua data  

### Menu Super Admin: "Pengaturan"

#### 1. **Kelola Pengguna**
- Lihat daftar semua 40 pengguna
- Edit informasi pengguna
- Reset PIN pengguna yang lupa
- Hapus akun pengguna (jika diperlukan)

**Cara reset PIN pengguna:**
1. Buka menu "Pengaturan" → "Kelola Pengguna"
2. Cari pengguna yang PIN-nya lupa
3. Klik "Reset PIN"
4. Masukkan PIN baru (disarankan PIN temporary, beri tahu pengguna untuk ubah)

#### 2. **Kelola Foto Background**
- Lihat semua foto yang sedang digunakan di slideshow login
- Tambah foto background baru (drag-drop atau browse)
- Hapus foto yang tidak dipakai
- Atur urutan tampilan foto

**Cara upload foto background:**
1. Buka menu "Pengaturan" → "Kelola Foto Background"
2. Klik "+ Tambah Foto"
3. Drag-drop atau pilih file foto (JPG/PNG, max 5 MB)
4. Klik "Upload"

#### 3. **Kunci Data Tahun**
- Lihat status kunci setiap menu
- Kunci tabel yang sudah final (tidak bisa diedit lagi)
- Buka kunci jika perlu revisi

**Kapan harus kunci data:**
- Menu 1 (Realisasi tahun lalu) → kunci setelah pertanggungjawaban disetujui
- Menu 2 (Perubahan tahun ini) → kunci setelah periode perubahan ditutup
- Menu 3 (Anggaran tahun depan) → kunci setelah anggaran final disahkan

#### 4. **Backup & Restore**

**BACKUP (Sangat Penting - Lakukan Secara Berkala!)**
1. Buka menu "Pengaturan" → "Backup & Restore"
2. Klik "Ekspor Seluruh Data"
3. File `.json` otomatis diunduh
4. **Simpan di lokasi aman** (USB flash, Google Drive, cloud storage)
5. **Lakukan backup setiap minggu minimum** atau setelah ada perubahan data besar

**RESTORE (Jika Data Hilang)**
1. Buka menu "Pengaturan" → "Backup & Restore"
2. Klik "Impor Data"
3. Pilih file backup `.json` yang sebelumnya disimpan
4. Konfirmasi (data lama akan ditimpa!)
5. Tunggu proses selesai

⚠️ **PERINGATAN**: Backup adalah satu-satunya cara untuk menyelamatkan data jika browser di-clear atau crash. Jangan pernah tunda backup!

### Menambah Data Ke Tabel

**Step-by-step untuk semua menu:**
1. Buka menu tabel (Realisasi/Perubahan/Anggaran/Monitoring)
2. Klik "+ Tambah Baris" (tombol hanya muncul untuk Super Admin)
3. Isi form modal:
   - Untuk **Realisasi**: Uraian, Anggaran, Realisasi, Keterangan
   - Untuk **Perubahan**: Uraian, Anggaran Awal, Anggaran Baru, Alasan, Tanggal
   - Untuk **Anggaran**: Uraian, Pagu, Sumber Dana, Status, Keterangan
   - Untuk **Monitoring**: Tanggal, Lokasi/OPD, Temuan, Rekomendasi, Status
4. Klik "Simpan"
5. Data otomatis tercatat di log aktivitas

### Edit & Hapus Data

**Edit:**
1. Cari baris yang ingin diedit
2. Klik tombol "✎ Edit" pada baris tersebut
3. Ubah nilai yang ingin diubah di modal
4. Klik "Simpan"
5. Perubahan tercatat otomatis (nilai lama & baru tersimpan di history)

**Hapus:**
1. Klik tombol "🗑 Hapus" pada baris yang ingin dihapus
2. Konfirmasi: "Yakin hapus baris ini? Tindakan tidak bisa dibatalkan"
3. Klik "Hapus" untuk konfirmasi
4. Baris dihapus dan tercatat di log

### Upload File

1. Buka menu "Kelola File"
2. Area upload muncul di atas (khusus Super Admin)
3. **Pilih atau drag-drop file** (JPG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT, TXT, ZIP, MP3, MP4)
4. **Pilih kategori** file dari dropdown:
   - Realisasi & Pertanggungjawaban
   - Perubahan Anggaran
   - Anggaran Murni
   - Monitoring DPRD
   - Umum
5. Klik "Unggah"
6. Tunggu proses (progress bar akan muncul)
7. File tersimpan lokal dan bisa diunduh semua pengguna

**Pembatasan:**
- Max 10 MB per file (validasi otomatis di sisi klien)
- Jika file > 10 MB, akan ditolak dengan pesan error jelas

### Lihat Log Aktivitas

1. Buka menu "Log Aktivitas" (hanya muncul untuk Super Admin)
2. Lihat riwayat semua aksi pengguna (login, logout, edit, hapus, upload, dll)
3. Setiap log mencatat: waktu, pengguna, aksi, detail
4. **Filter log:**
   - By pengguna: dropdown "Semua Pengguna" → pilih nama
   - By aksi: dropdown "Semua Aksi" → pilih jenis aksi
   - By tanggal: isi "Dari tanggal" dan "Sampai tanggal"
5. Klik "Terapkan Filter" untuk apply
6. Klik "Export CSV" untuk dapatkan log dalam Excel

---

## 💾 BACKUP & RESTORE

### Mengapa Backup Penting?
- **Single-Device Deployment**: Data hanya ada di satu PC
- **No Cloud Sync**: Tidak ada backup otomatis ke server
- **Browser Clear = Data Hilang**: Jika cache browser dihapus, semua data hilang permanent
- **Hardware Failure**: Jika PC rusak, data tidak bisa dipulihkan tanpa backup

### Strategi Backup Recommended:

**Frequency:**
- **Minimal**: 1x per minggu
- **Ideal**: 2-3x per minggu atau setelah perubahan data besar
- **Critical Days**: Sebelum hari libur panjang, sebelum maintenance IT, sebelum update browser

**Storage:**
- Simpan di **minimal 2 lokasi berbeda**:
  - USB flash drive (bawa pulang setiap hari jika mungkin)
  - Cloud storage (Google Drive, Dropbox, OneDrive)
  - External hard drive di kantor

**Naming Convention:**
```
SIMORA_Backup_YYYYMMDD.json
Contoh: SIMORA_Backup_20260626.json
```

### Prosedur Backup:
1. Buka aplikasi SIMORA
2. Login dengan akun Super Admin
3. Menu "Pengaturan" → "Backup & Restore"
4. Klik "Ekspor Seluruh Data"
5. File `.json` otomatis download ke folder Downloads
6. **Move/copy file ke lokasi backup aman**
7. Buat catatan tanggal backup di dokumen terpisah

### Prosedur Restore:
1. **BACKUP data terbaru dulu** sebelum restore (jika masih bisa)
2. Buka aplikasi SIMORA
3. Login dengan akun Super Admin
4. Menu "Pengaturan" → "Backup & Restore"
5. Klik "Impor Data"
6. Pilih file backup `.json` yang ingin di-restore
7. **Konfirmasi** (akan menimpa semua data current)
8. Tunggu proses selesai (jangan close browser)
9. Refresh halaman, data sudah kembali

---

## 🔧 TROUBLESHOOTING

### ❌ Login Failed
**Masalah**: "PIN salah" padahal PIN yang dimasukkan benar

**Solusi:**
- Pastikan CAPS LOCK tidak aktif
- PIN harus 4-6 digit angka (jangan ada spasi)
- Jika lupa PIN: Super Admin bisa reset via menu "Pengaturan"

### ❌ Data Tidak Muncul di Tabel
**Masalah**: Tabel kosong padahal sebelumnya ada data

**Solusi:**
- Refresh browser (Ctrl+R atau Cmd+R)
- Check filter: pastikan tidak ada filter aktif yang menyembunyikan data
- Check tahun: pastikan Anda membuka menu tahun yang benar
- Jika masih kosong: cek log aktivitas, mungkin data terhapus

### ❌ Slideshow Foto Tidak Muncul
**Masalah**: Halaman login hanya warna solid, tidak ada foto

**Solusi:**
- Aplikasi menggunakan placeholder jika tidak ada foto background
- Super Admin bisa tambah foto di menu "Pengaturan" → "Kelola Foto Background"
- Cek ukuran file foto (max 5 MB)

### ❌ File Upload Gagal
**Masalah**: "Ukuran file melebihi 10 MB"

**Solusi:**
- Kompres file menggunakan WinRAR, 7-Zip, atau tool kompres lainnya
- Split file besar menjadi beberapa bagian
- Hubungi IT untuk bantuan kompresi

### ❌ Data Hilang Setelah Clear Cache
**Masalah**: Semua data SIMORA hilang setelah bersihkan cache browser

**Solusi:**
- **Restore dari backup** (menu "Pengaturan" → "Backup & Restore")
- Jika tidak ada backup: data tidak bisa dipulihkan (lesson learned: backup terus!)

### ❌ Aplikasi Sangat Lambat / Not Responding
**Masalah**: Aplikasi freeze atau response lambat

**Solusi:**
- Close aplikasi (tutup tab browser)
- Clear browser cache (Ctrl+Shift+Delete)
- Buka aplikasi lagi
- Jika masih lambat: restart PC dan coba lagi
- Jika persisten: cek apakah ada file yang sangat besar yang mengblock

### ❌ Session Timeout
**Masalah**: Saat bekerja, tiba-tiba diminta login lagi

**Solusi:**
- Ini normal: setiap 30 menit tanpa aktivitas, sistem logout otomatis
- Jika sering terjadi: terus aktif klik/ketik sesuatu di aplikasi
- Untuk pekerjaan lama: plan break setiap 25-30 menit

### ❌ Download File Tidak Bekerja
**Masalah**: Klik tombol unduh tapi file tidak download

**Solusi:**
- Check browser settings: jangan block download
- Check ukuran file: pastikan < 10 MB
- Try browser lain (Chrome, Firefox, Edge)
- Jika file sangat besar: Super Admin bisa compress atau split

---

## ℹ️ INFORMASI TEKNIS

### Arsitektur Aplikasi

**Stack Teknologi:**
- **Frontend**: HTML5, CSS3, JavaScript Vanilla (ES6+)
- **Database**: IndexedDB (browser local storage)
- **Security**: PIN-based authentication, session management
- **Deployment**: Single HTML file + assets folder (fully offline)

### Struktur Folder
```
SIMORA/
├── index.html                 (entry point utama)
├── css/
│   ├── styles.css            (styling umum)
│   └── vintage.css           (styling vintage theme)
├── js/
│   ├── utils.js              (fungsi utility)
│   ├── database.js           (manajemen IndexedDB)
│   ├── auth.js               (autentikasi & login)
│   ├── ui.js                 (rendering UI)
│   └── app.js                (logika aplikasi inti)
└── assets/
    ├── fonts/                (font lokal)
    └── photos/
        └── default/          (placeholder photos)
```

### Data Schema

**User Collection:**
```json
{
  "id": "uuid-string",
  "username": "string",
  "pin": "4-6 digit",
  "role": "superadmin|user",
  "pinChanged": boolean,
  "created_at": "ISO timestamp",
  "updated_at": "ISO timestamp"
}
```

**Data Record (Realisasi/Perubahan/Anggaran/Monitoring):**
```json
{
  "id": "uuid-string",
  "tahun": number,
  "uraian": "string",
  "... field-field spesifik ...",
  "created_at": "ISO timestamp",
  "updated_at": "ISO timestamp",
  "created_by": "user-id"
}
```

**File Collection:**
```json
{
  "id": "uuid-string",
  "name": "filename",
  "size": number (bytes),
  "type": "mime-type",
  "category": "string",
  "content": "base64-encoded",
  "uploaded_at": "ISO timestamp",
  "uploaded_by": "user-id"
}
```

**Activity Log Entry:**
```json
{
  "id": auto-increment,
  "user_id": "uuid-string",
  "user_name": "string",
  "action": "login|logout|edit|delete|upload|download",
  "details": "json-object",
  "timestamp": "ISO timestamp"
}
```

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ❌ Internet Explorer (tidak support IndexedDB)

### Performance Notes
- Aplikasi optimal untuk 40 pengguna dengan rata-rata 5000 baris data
- IndexedDB limit ~50 MB per origin (cukup untuk aplikasi ini)
- Backup file typically ~2-5 MB tergantung jumlah data dan file

### Security Considerations
- PIN disimpan plain-text di localStorage (acceptable untuk single-device offline apps)
- Untuk production deployment ke jaringan: pertimbangkan encrypt PIN
- Session timeout: 30 menit tanpa aktivitas
- Log aktivitas untuk audit trail lengkap

### Offline-First Design Principles
- **No API Calls**: Semua data disimpan lokal
- **No CDN Dependencies**: Semua assets bundled lokal
- **No External Fonts**: Gunakan system fonts atau bundled fonts
- **Progressive Enhancement**: Aplikasi tetap fungsi bahkan tanpa JS module support lanjutan
- **Resilient Storage**: IndexedDB dengan fallback localStorage

### Future Enhancement Opportunities
1. Enkripsi PIN untuk keamanan lebih baik
2. 2FA (Two-Factor Authentication)
3. Multi-device sync via WebSocket lokal
4. Advanced reporting & analytics
5. Integration dengan sistem PBJ/RB daerah
6. Mobile app version dengan React Native
7. Desktop app dengan Electron
8. API wrapper untuk eventual server migration

---

## 📞 SUPPORT & CONTACT

**Pertanyaan Teknis**: Hubungi IT Department  
**Pertanyaan Fungsional**: Hubungi Staf/Super Admin  
**Masalah Data**: **JANGAN PANIC - Backup akan menyelamatkan!**

---

## 📝 CHANGELOG

### v1.0 (26 Juni 2026)
- Initial release
- 4 menu dashboard fully functional
- Authentication & authorization system
- File management dengan upload/download
- Activity logging & audit trail
- Backup/restore functionality
- Vintage UI dengan responsive design
- 40 users pre-configured

---

## ⚖️ LICENSE & COPYRIGHT

© 2026 DPRD Kabupaten Manggarai  
Dikembangkan sebagai Inovasi Latsar CPNS 2026 Provinsi Nusa Tenggara Timur

---

**Last Updated**: 26 Juni 2026  
**Maintained By**: Tim IT DPRD Manggarai  
**Status**: Production Ready - Fully Offline Capable

🎉 **Selamat menggunakan SIMORA DPRD MANGGARAI!**
