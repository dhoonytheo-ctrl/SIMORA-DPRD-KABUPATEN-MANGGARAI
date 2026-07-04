# Panduan Sederhana: Upload proyek SIMORA ke GitHub (Untuk Pemula)

Ini panduan singkat dan sangat sederhana agar kamu bisa mengunggah seluruh folder `SIMORA` ke GitHub tanpa perlu latar belakang IT.

Opsi 1 — Cara paling mudah (GitHub web, tanpa install apa pun)
1. Buka https://github.com dan masuk ke akunmu.
2. Klik tombol **+ → New repository**.
3. Isi `Repository name` : `SIMORA` (atau nama lain), pilih **Public** atau **Private**, lalu klik **Create repository**.
4. Setelah repo dibuat, buka folder `SIMORA` di File Explorer.
5. Pilih semua file dan folder (Ctrl+A), lalu seret (drag) ke halaman repo GitHub di browser — area yang bertuliskan "Drag files here to add them to your repository".
6. Tunggu unggah selesai, tulis pesan commit (mis. "Initial upload") lalu klik **Commit changes**.

Catatan: Jika jumlah file besar, web upload mungkin lebih lambat. Jika gagal, gunakan GitHub Desktop (lihat Opsi 2).


Opsi 2 — Menggunakan GitHub Desktop (direkomendasikan jika ada banyak file)
1. Download dan install GitHub Desktop: https://desktop.github.com/
2. Buka GitHub Desktop dan sign in ke akun GitHub.
3. Pilih **File → Add local repository... → Choose...** lalu pilih folder `SIMORA`.
4. Di bagian bawah, tulis pesan commit (contoh: "Initial commit") lalu klik **Commit to main**.
5. Klik tombol **Publish repository** dan pastikan nama repo benar lalu klik **Publish repository**.


Opsi 3 — Gunakan skrip ZIP lalu upload ke Release (jika ingin satu file ZIP)
1. Di Windows PowerShell, buka folder `SIMORA`:
```powershell
cd "C:\Users\Lenovo\Documents\latsar doni\SIMORA"
```
2. Jalankan skrip `create_zip.ps1` yang sudah ada di folder (lihat file `create_zip.ps1`):
```powershell
.\create_zip.ps1
```
3. Hasilnya akan membuat file `SIMORA_v1.0.zip` di folder atasnya. Buka halaman GitHub repo → pilih **Releases → Draft a new release → Attach binaries by dragging & dropping** → unggah `SIMORA_v1.0.zip`.


FAQ singkat
- Apakah saya perlu mengerti Git? Tidak, langkah Opsi 1 dan Opsi 2 tidak mengharuskan pengetahuan Git.
- Saya diminta upload satu per satu file. Apa yang harus saya lakukan? Gunakan GitHub Desktop atau ZIP (Opsi 2/3) untuk lebih mudah.
- Saya ingin repo private. Pilih **Private** saat membuat repository di langkah awal.


Jika mau, saya bisa:
- Membuatkan `create_zip.ps1` (sudah tersedia),
- Membuatkan panduan dengan gambar (teks saja), atau
- Membuatkan video script singkat untuk rekam layar (instruksi).

Pilih mana yang Anda mau.
