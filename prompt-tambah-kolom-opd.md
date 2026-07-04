# Prompt: Tambah Kolom "OPD / Instansi" Setelah Kolom No

## Konteks
Ada tabel di project ini yang sudah punya kolom **No**. Tambahkan satu kolom baru **tepat setelah kolom No** (sebelum kolom-kolom lain), dengan header **"OPD / Instansi"**.

Kalau tabel ini memang tabel referensi/master data OPD dengan 31 baris, isi kolom baru itu sesuai urutan No 1–31 di daftar bawah (No 1 = OPD nomor 1, dst). Kalau kolom ini bagian dari form input (misalnya untuk memilih OPD per baris), jadikan dropdown/select dari daftar yang sama.

## Instruksi
1. Kolom "No" ini ada di file: `[isi nama file/path di sini kalau sudah tahu]`. Kalau belum tahu, telusuri dulu codebase untuk cari komponen/tabel yang punya kolom No.
2. Sisipkan kolom baru "OPD / Instansi" persis setelah kolom No.
3. Simpan daftar OPD di bawah sebagai konstanta/array terpisah yang reusable (misalnya `DAFTAR_OPD`), jangan hardcode langsung di tengah kode tampilan.
4. Ikuti style, alignment, dan responsive behavior kolom-kolom lain yang sudah ada di tabel tersebut.
5. Jangan ubah struktur atau isi kolom lain yang sudah ada — cukup sisipkan kolom baru ini.

## Daftar OPD
1. Dinas Kesehatan
2. RSUD Ruteng
3. Dinas Koperasi, Usaha Kecil Menengah dan Tenaga Kerja
4. Dinas Pekerjaan Umum dan Penataan Ruang
5. Dinas Perumahan Rakyat, Kawasan Permukiman dan Pertanahan
6. Satuan Polisi Pamong Praja dan Pemadam Kebakaran
7. Badan Penanggulangan Bencana Daerah
8. Dinas Pariwisata dan Kebudayaan
9. Badan Kesatuan Bangsa dan Politik Daerah
10. Dinas Perhubungan
11. Inspektorat Daerah
12. Dinas Pengendalian Penduduk dan Keluarga Berencana
13. Dinas Pendidikan Pemuda dan Olahraga
14. Dinas Sosial
15. Dinas Pemberdayaan Perempuan dan Perlindungan Anak
16. Dinas Lingkungan Hidup
17. Dinas Kependudukan dan Pencatatan Sipil
18. Dinas Pemberdayaan Masyarakat dan Desa
19. Dinas Pertanian dan Ketahanan Pangan
20. Dinas Perikanan
21. Badan Pendapatan Daerah
22. Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah
23. Dinas Peternakan
24. Dinas Komunikasi dan Informatika
25. Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu
26. Dinas Perdagangan dan Perindustrian
27. Bagian - Bagian
28. Kecamatan
29. Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah
30. Badan Keuangan dan Aset Daerah
31. Sekretariat DPRD

## Catatan
- 2 nama yang dobel di daftar asli (Dinas Pengendalian Penduduk & KB, dan Badan Kepegawaian & Pengembangan SDM Daerah) sudah dihapus, jadi total 31 nama unik.
- "Bagian - Bagian" dan "Kecamatan" dibiarkan apa adanya sesuai sumber asli karena itu kategori umum, bukan nama instansi spesifik. Kalau perlu dipecah per kecamatan atau per bagian di Setda, kasih tahu aku nanti dibantu rinciannya.
