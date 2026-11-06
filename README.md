# Pemandu Topik Tesis MTI

Aplikasi web untuk membantu mahasiswa Magister Teknologi Informasi memilih klasifikasi penelitian berdasarkan usulan judul atau uraian masalah. Memuat **3 rumpun, 9 subrumpun, 36 bidang fokus, dan 108 contoh judul**.

## Fitur
- Input judul/permasalahan bebas dalam bahasa Indonesia.
- Rekomendasi sampai tiga bidang fokus, dengan alasan berupa kata kunci yang cocok.
- Penjelasan rumpun, subrumpun, contoh judul, dan ukuran evaluasi.
- Filter rumpun, katalog 36 bidang, contoh input, dan salin hasil.
- Responsif; tidak membutuhkan akun, basis data, backend, LLM, API key, atau layanan AI.
- Semua teks diproses **di peramban pengguna** tanpa pengiriman ke server.

## Cara menjalankan
Syarat: Python 3 untuk server lokal; Node.js hanya untuk menjalankan pengujian (opsional).

```bash
python3 -m http.server 5173 --directory public
```

Buka alamat lokal yang ditampilkan (umumnya `http://localhost:5173`).

```bash
npm test
```

## Deploy via GitHub → Vercel
1. Buat repositori GitHub baru, misalnya `pemandu-topik-tesis-mti`.
2. Unggah semua isi folder proyek (tidak termasuk `node_modules` dan `.env`).
3. Pada Vercel, pilih **Add New → Project → Import Git Repository**.
4. Pilih repositori tersebut. Framework preset **Other**, tanpa build command, output directory `public` (tercantum juga pada `vercel.json`).
5. Klik **Deploy**. Tidak perlu environment variables.
6. Push perubahan ke branch utama untuk memicu deployment berikutnya.

Alternatif melalui CLI: `npx vercel` dari folder proyek, ikuti petunjuk login dan deploy.

## Aturan klasifikasi
- Normalisasi huruf, tanda baca, dan padanan istilah Indonesia–Inggris.
- Bobot frasa pencocokan tepat lebih tinggi daripada satu kata.
- Penyesuaian ringan berdasarkan kata di nama bidang fokus, deskripsi, dan contoh judul.
- Menampilkan maksimal tiga hasil dengan skor relevansi tertinggi.
- Tidak menggunakan algoritma ML terlatih, LLM, embedding, web search, atau pemrosesan di server.
- **Tidak mengukur kebaruan penelitian**, kelayakan data, atau mutu tesis. Validasi akademik oleh dosen tetap diperlukan.

## Mengubah taksonomi
- `public/data/catalog.json`: 36 kategori, deskripsi, contoh judul, metrik, dan `keywords`.
- `public/matcher.js`: aturan dan bobot pencocokan.
- `public/src.js`: tampilan dan interaksi.
- `public/style.css`: desain antarmuka.
- `build_catalog.py`: skrip yang digunakan penyusun untuk mengambil katalog dari dokumen Word sumber; **tidak diperlukan** untuk menjalankan aplikasi, dan hanya relevan pada lingkungan yang menyimpan dokumen asal.

Setelah mengubah data atau aturan, jalankan `npm test` dan buka situs lokal sebelum publikasi.

## Referensi taksonomi
Klasifikasi lokal diadaptasi dari panduan penelitian MTI yang telah disusun. Acuan akademik: [ACM Curricula](https://www.acm.org/education/curricula-recommendations), [CS2023 Knowledge Areas](https://csed.acm.org/knowledge-areas/), dan [profil Magister TI UDB](https://pascasarjana.udb.ac.id/prodi/magister-teknologi-informasi).

Proyek ini bukan situs resmi universitas kecuali telah disetujui dan diadopsi oleh institusi.
