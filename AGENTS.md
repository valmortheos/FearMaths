# AGENTS.md – FearMaths Project

## 🧠 Ringkasan Proyek
FearMaths adalah web aplikasi belajar matematika interaktif, **client-side**, dengan pendekatan **mobile-first**, **vanilla**, dan **modern minimalis**. Tujuan utamanya adalah menyediakan latihan soal matematika dengan tingkat kesulitan (easy, normal, hard, nightmare) dan pilihan operasi (acak, penjumlahan, pengurangan, perkalian, pembagian, atau campuran). Setiap soal memiliki timer sendiri, dan semua progres & pencapaian disimpan di **IndexedDB** dengan dukungan ekspor/impor biner.

## 🎨 Design System (Wajib)
- **Warna** (tanpa gradasi):
  - Putih: `#F7F8F0`
  - Biru Muda: `#9CD5FF`
  - Biru Tenang: `#7AAACE`
  - Biru Sangat Tua: `#355872`
- **Responsive**: Mobile-first, gunakan media queries untuk layar ≥ 768px.
- **Tipografi**: Sans-serif, ukuran relatif (rem/em).
- **Konsistensi**: Gunakan spacing, shadow, dan border radius yang terdefinisi di CSS variables.

## 📁 Struktur & Modularitas (Multi-file)

/src
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── js/
│   ├── app.js           # entry point, routing
│   ├── algorithm/       # inti pembuatan soal (pisahkan di sini)
│   │   ├── generator.js # algoritma utama (adaptive, tidak hardcode)
│   │   ├── evaluator.js # penilaian jawaban
│   │   └── trainer.js   # logika adaptif berdasarkan IndexedDB
│   ├── db/
│   │   ├── indexedDB.js # koneksi, CRUD
│   │   └── exportImport.js # binary format dengan header timestamp
│   ├── ui/
│   │   ├── renderer.js  # DOM manipulation
│   │   ├── navigation.js # bottom bar & navbar
│   │   └── timer.js     # timer per soal
│   └── utils/
│       ├── helpers.js
│       └── constants.js
└── assets/              # icon, font (gunakan library eksternal)


- **Algoritma** wajib berada di folder terpisah agar tidak spaghetti.
- Setiap modul harus memiliki tanggung jawab tunggal.

## ⚙️ Fitur Wajib
1. **Level & Operasi**: Pilihan level dan operasi yang mempengaruhi kompleksitas soal.
2. **Timer**: Setiap soal mencatat waktu penyelesaian (detik). Tampilkan timer saat mengerjakan.
3. **IndexedDB**: Simpan data progres (riwayat jawaban, waktu, level, operasi) dan pencapaian (achievements).
4. **Ekspor/Impor Biner**: Format biner khusus FearMaths dengan header berisi `timestamp` (timezone-aware) dan metadata.
5. **Multipage**: SPA dengan routing via hash atau history API, dilengkapi bottom bar (navigasi utama) dan navbar (opsi filter).
6. **Library Pendukung**:
   - Ikon: [Font Awesome](https://fontawesome.com/) atau [Material Icons](https://fonts.google.com/icons)
   - Alert/Modal: [SweetAlert2](https://sweetalert2.github.io/) atau [Notyf](https://carlosroso.com/notyf/)
   - (Gunakan CDN, jangan bundle besar).

## 🧪 Algoritma Pembuatan Soal
- **Jangan hardcode** daftar soal. Gunakan algoritma generatif yang menghasilkan soal berdasarkan:
  - Level (rentang angka, jumlah operand, jenis operasi)
  - Operasi yang dipilih (tunggal/campur)
  - Riwayat performa user (adaptive): soal yang sering salah akan muncul lebih sering.
- Algoritma harus **scalable** dan mudah ditambah variasi soal di masa depan.

## 📦 Deployment
- Hosting di **GitHub Pages** (atau platform static lainnya).
- Pastikan semua aset di-load secara relatif.
- Tidak perlu build tools (vanilla).

## 🤖 Instruksi untuk AI Agents
- **Semua kode** harus vanilla (ES6+), tidak menggunakan framework.
- **Modularitas** adalah prioritas: pisahkan logika, UI, dan data.
- **Komentari** fungsi kompleks dengan JSDoc.
- **Gunakan** `async/await` untuk operasi IndexedDB.
- **Responsif** diuji dengan emulator mobile (320px ke atas).
- Jika ada file `Jules_AI.md` atau `$*_AI.md` di repository, ikuti panduan spesifik di sana.
- **Jangan** menyertakan file biner atau library yang tidak diperlukan.
- **Testing** minimal: cek konsol tidak ada error dan IndexedDB berjalan.

---

**Referensi**: Proyek ini dikembangkan oleh **valmortheos**.
