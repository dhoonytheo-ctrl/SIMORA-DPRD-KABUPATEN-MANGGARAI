# QUICK START GUIDE - SIMORA DPRD MANGGARAI

**⏱️ Estimasi waktu: 5 menit untuk setup awal**

---

## 🚀 START HERE

### Step 1: Buka Aplikasi (30 detik)
1. Cari folder `SIMORA` di PC Anda
2. Double-click file `index.html`
3. Browser akan membuka aplikasi

### Step 2: Login Pertama Kali (2 menit)
1. **Untuk Super Admin (Staf):**
   - Nama: `Staf`
   - PIN: `1234`
2. **Untuk Pengguna Biasa:**
   - Gunakan nama Anda (cek daftar nama di README.md)
   - PIN: `1234`

3. Klik "Login"

### Step 3: Ubah PIN Anda (1 menit)
- Aplikasi akan meminta ubah PIN saat login pertama
- Masukkan PIN lama: `1234`
- Masukkan PIN baru: pilih PIN 4-6 digit (contoh: `2024`)
- Konfirmasi PIN baru
- Klik "Simpan"

### Step 4: Masuk Dashboard (1 menit)
- Dashboard loading...
- Anda sudah bisa mulai menggunakan aplikasi!

---

## 📍 POSISI ANDA DI APLIKASI

```
┌─ LOGIN PAGE ────────────────────────┐
│  [Slideshow Background]             │
│  ┌─ LOGIN CARD ────────────────────┐│
│  │ SIMORA DPRD MANGGARAI            ││
│  │ Tanggal: Jumat, 26 Juni 2026     ││
│  │ Jam: 14:32:45                    ││
│  │                                  ││
│  │ [Nama Pengguna] ━━━━━━━━━━━━━━ ││
│  │ [PIN] ━━━━━━━━━━━━━━━━━━━━━━ ││
│  │                                  ││
│  │ [LOGIN Button] ━━━━━━━━━━━━━━ ││
│  └──────────────────────────────────┘│
└─────────────────────────────────────┘

        ↓ AFTER LOGIN ↓

┌─ DASHBOARD PAGE ─────────────────────────┐
│ ┌─────────────────────────────────────────│
│ │ SIMORA DPRD │ [Date/Time] │ User | Logout
│ └─────────────────────────────────────────
│ ┌─ NAVIGATION MENU ─────────────────────┐
│ │ [Dashboard] [Realisasi] [Perubahan]   │
│ │ [Anggaran] [Monitoring] [Files] [Log] │
│ │ [Settings]                             │
│ └───────────────────────────────────────┘
│
│ ┌─ CONTENT AREA ───────────────────────┐
│ │                                       │
│ │ [Dashboard]    [Realisasi]           │
│ │ [Perubahan]    [Anggaran]            │
│ │ [Monitoring]   [Files]               │
│ │ [Log]          [Settings]            │
│ │                                       │
│ └───────────────────────────────────────┘
└────────────────────────────────────────────┘
```

---

## 👤 PERAN ANDA

### Anda Pengguna Biasa (39 orang)?
✅ Lihat data di 4 menu (read-only)  
✅ Unduh file  
✅ Filter, cari, urutkan data  
❌ Tidak bisa tambah/edit/hapus data  
❌ Tidak bisa unggah file  

**Action Items:**
1. Login dengan nama & PIN Anda
2. Ubah PIN jika login pertama kali
3. Explore menu-menu: klik Dashboard, Realisasi, Perubahan, Anggaran, Monitoring
4. Download file dari menu "Kelola File" jika diperlukan

---

### Anda Super Admin (Staf)?
✅ Kontrol PENUH semua data  
✅ Tambah/edit/hapus baris di setiap tabel  
✅ Unggah & kelola file (max 10 MB)  
✅ Kelola pengguna & reset PIN  
✅ Kelola foto background  
✅ Kunci/buka data tahun  
✅ Lihat log aktivitas  
✅ Backup/restore data  

**Critical Action Items:**
1. ⚠️ **IMMEDIATELY**: Backup data setelah setup (menu Pengaturan → Backup & Restore → Ekspor)
2. 📅 **EVERY WEEK**: Setup schedule backup rutin
3. 👥 **FIRST WEEK**: Pastikan semua 40 pengguna sudah ubah PIN mereka
4. 📸 **OPTIONAL**: Upload foto wisata Manggarai untuk background slideshow
5. 💾 **ONGOING**: Lakukan backup sebelum long weekend / hari libur

---

## 📊 MENU QUICK REFERENCE

| Menu | Apa isi? | Edit? | Super Admin Only? |
|------|----------|-------|------------------|
| Dashboard | Ringkasan all 4 tabel | ❌ | ❌ |
| Realisasi | Tahun lalu yang sudah selesai | ✅ | ✅ |
| Perubahan | Tahun ini yang sedang berjalan | ✅ | ✅ |
| Anggaran | Tahun depan dalam persiapan | ✅ | ✅ |
| Monitoring | Kegiatan monitoring DPRD | ✅ | ✅ |
| Kelola File | Download/upload dokumen | ✅ file | ✅ upload |
| Log Aktivitas | Riwayat semua aksi pengguna | ❌ | ✅ |
| Pengaturan | User, foto, kunci, backup | ✅ | ✅ |

---

## 🎯 COMMON TASKS

### Tugas 1: Lihat Data Realisasi Tahun Lalu
```
1. Klik menu "Realisasi"
2. Lihat tabel dengan kolom: No, Uraian, Anggaran, Realisasi, %, Sisa, Keterangan
3. Cari program: ketik di kotak "Cari program..."
4. Sort: pilih di dropdown "Urutkan..."
5. Export: klik "Export CSV" → dapatkan Excel file
```

### Tugas 2: Tambah Program Baru (Super Admin)
```
1. Buka menu (Realisasi / Perubahan / Anggaran / Monitoring)
2. Klik "+ Tambah Baris"
3. Isi form modal sesuai field
4. Klik "Simpan"
→ Data muncul di tabel + log tercatat
```

### Tugas 3: Edit/Hapus Data (Super Admin)
```
Edit:
1. Klik "✎ Edit" pada baris
2. Ubah nilai di modal
3. Klik "Simpan"

Hapus:
1. Klik "🗑 Hapus" pada baris
2. Konfirmasi: "Yakin hapus?"
3. Klik "Hapus"
→ Data terhapus + log tercatat
```

### Tugas 4: Unggah File (Super Admin)
```
1. Buka menu "Kelola File"
2. Drag & drop file ke area upload
   ATAU klik area untuk browse
3. Pilih kategori file
4. Klik "Unggah"
→ File tersimpan, bisa diunduh semua pengguna
```

### Tugas 5: Unduh File (Semua Pengguna)
```
1. Buka menu "Kelola File"
2. Cari file yang diinginkan
3. Klik "📥 Unduh"
→ File download otomatis ke folder Downloads
```

### Tugas 6: Lihat Riwayat Perubahan (Super Admin)
```
1. Di baris yang ingin dilihat history-nya
2. Klik "📋 Riwayat"
3. Pop-up muncul dengan riwayat perubahan
```

### Tugas 7: Backup Data (Super Admin - CRITICAL!)
```
1. Menu "Pengaturan" → "Backup & Restore"
2. Klik "Ekspor Seluruh Data"
3. File .json download
4. **Simpan di lokasi aman** (USB / Cloud)
5. **Labeli dengan tanggal**: SIMORA_Backup_20260626.json

🔥 JANGAN TUNDA - Backup adalah satu-satunya penyelamat!
```

### Tugas 8: Kunci Data Tahun (Super Admin)
```
1. Menu "Pengaturan" → "Kunci Data Tahun"
2. Klik tombol "Kunci" pada menu yang ingin dikunci
3. Data terkunci: tidak bisa diedit tapi tetap visible

Untuk buka:
→ Klik tombol "Buka" di menu yang terkunci
```

---

## ⚙️ SETTINGS & CONFIGURATION

### Ubah PIN Sendiri
```
Belum ada menu khusus di aplikasi (future enhancement)
Sementara ini: hubungi Super Admin untuk reset PIN
```

### Super Admin: Reset PIN Pengguna Lain
```
1. Menu "Pengaturan" → "Kelola Pengguna"
2. Cari pengguna yang PIN-nya lupa
3. Klik "Reset PIN"
4. Masukkan PIN baru (temporary, beri tahu pengguna)
```

### Super Admin: Upload Foto Background
```
1. Menu "Pengaturan" → "Kelola Foto Background"
2. Klik "+ Tambah Foto"
3. Pilih foto wisata Manggarai (JPG/PNG, max 5 MB)
4. Foto otomatis masuk slideshow login
```

---

## 📱 FILTER & SEARCH FEATURES

### Cari Data di Tabel
- Ketik di kotak "Cari program..." (atau nama lokasi untuk Monitoring)
- Tabel filter otomatis real-time

### Urutkan Data
- Dropdown "Urutkan...":
  - Nama (A-Z)
  - Anggaran Tertinggi / Realisasi Tertinggi
  - Tanggal Terbaru
  - Persentase Terendah
  - Status

### Filter Monitoring by Status
- Dropdown "Semua Status" → pilih: Selesai / Proses / Belum

### Filter Monitoring by Tanggal
- Isi "Dari tanggal" dan "Sampai tanggal"

---

## 🔐 SECURITY TIPS

✅ **DO:**
- Ubah PIN dari default `1234` segera setelah login pertama
- Gunakan PIN yang mudah diingat tapi tidak mudah ditebak
- Logout saat meninggalkan PC (atau sistem logout otomatis 30 menit)
- Backup data rutin (minimal mingguan)

❌ **DON'T:**
- Bagikan PIN dengan orang lain
- Clear browser cache/data (akan hapus semua data!)
- Matikan PC tanpa logout (jarang masalah, tapi best practice)
- Tunda backup (data hilang = tidak bisa dipulihkan)

---

## 🆘 BANTUAN CEPAT

| Masalah | Solusi Cepat |
|---------|--------------|
| Lupa PIN | Hubungi Super Admin untuk reset |
| Data tidak muncul | Refresh browser (Ctrl+R) |
| File gagal upload | File > 10 MB? Kompres dulu |
| Session timeout | Logout after 30 min idle - login lagi |
| Data hilang | 😱 Restore dari backup (jika ada) |

---

## 📞 SUPPORT CONTACTS

**Super Admin / Administrator:**  
Hubungi untuk: Reset PIN, Setup, Backup, Troubleshooting

**IT Department (if available):**  
Hubungi untuk: Technical issues, Browser problems

**In Trouble?**  
☎️ Jangan panik → Check TESTING_GUIDE.md → Ask for help

---

## 📋 FIRST-TIME CHECKLIST

Jika Anda adalah Super Admin (Staf), lakukan ini ASAP:

- [ ] Login dengan PIN default (1234)
- [ ] Ubah PIN ke PIN baru yang aman
- [ ] Buat data test (1-2 baris) di setiap menu
- [ ] Upload 1 file test
- [ ] **BACKUP DATA** (menu Pengaturan → Backup & Restore)
- [ ] Simpan backup file di USB / Cloud
- [ ] Test login dengan akun Pengguna Biasa (cek nama di README.md)
- [ ] Verifikasi Pengguna Biasa bisa lihat data tapi tidak bisa edit
- [ ] Jika ada Pengguna Biasa yang login pertama: mereka akan ubah PIN

---

## 🎓 TRAINING MATERIALS

**Untuk presentasi ke 40 pengguna:**

1. **Super Admin Training** (Staf):
   - Demo menu settings
   - Prosedur backup (CRITICAL!)
   - Troubleshooting

2. **Regular User Training** (39 orang):
   - Login & PIN change
   - Navigasi 4 menu
   - Cari, filter, sort data
   - Download file
   - Meaning of setiap field/kolom

---

## ✨ YOU'RE ALL SET!

Selamat menggunakan **SIMORA DPRD MANGGARAI** 🎉

Untuk dokumentasi lengkap: **baca README.md**  
Untuk testing detail: **baca TESTING_GUIDE.md**  
Untuk troubleshooting: **cek README.md → Troubleshooting section**

---

**Next Steps:**
1. ✅ Buka aplikasi & explore
2. ✅ Test semua menu
3. ✅ Buat data sample
4. ✅ Backup data
5. ✅ Train pengguna lain
6. ✅ Go live! 🚀

---

**Created**: 26 Juni 2026  
**For**: DPRD Kabupaten Manggarai  
**Version**: 1.0 - Production Ready  
**Status**: Fully Offline - No Internet Required ✨
