# AGENTS.md — FearMaths Project

## 🧠 Ringkasan Proyek
FearMaths adalah aplikasi web belajar matematika interaktif, **client-side**, dengan pendekatan **mobile-first**, **vanilla JS**, dan desain **modern minimalis**. Aplikasi menyajikan latihan soal matematika dengan tingkat kesulitan (`easy`, `normal`, `hard`, `nightmare`) dan pilihan operasi (acak, penjumlahan, pengurangan, perkalian, pembagian, atau campuran). Setiap soal memiliki timer sendiri, dan seluruh progres serta pencapaian disimpan di **IndexedDB**, dengan dukungan ekspor/impor dalam format biner kustom.

Proyek ini dikembangkan oleh **valmortheos**.

## 🎨 Design System (Wajib)

**Palet warna** (tanpa gradasi):

| Nama | Hex |
|---|---|
| Putih | `#F7F8F0` |
| Biru Muda | `#9CD5FF` |
| Biru Tenang | `#7AAACE` |
| Biru Sangat Tua | `#355872` |

- **Responsive**: mobile-first; gunakan media query untuk layar ≥ 768px.
- **Tipografi**: sans-serif, ukuran relatif (`rem`/`em`).
- **Konsistensi**: spacing, shadow, dan border-radius didefinisikan sebagai CSS custom properties (variables), bukan nilai hardcoded di tiap komponen.

## 📁 Struktur Proyek (Multi-file, Modular)

```
/src
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── js/
│   ├── app.js               # entry point, routing
│   ├── algorithm/           # inti pembuatan soal — dipisah agar tidak spaghetti
│   │   ├── generator.js     # algoritma generatif utama (tidak hardcode)
│   │   ├── evaluator.js     # penilaian jawaban
│   │   └── trainer.js       # logika adaptif berbasis riwayat di IndexedDB
│   ├── db/
│   │   ├── indexedDB.js     # koneksi & operasi CRUD
│   │   └── exportImport.js  # format biner + header timestamp
│   ├── ui/
│   │   ├── renderer.js      # manipulasi DOM
│   │   ├── navigation.js    # bottom bar & navbar
│   │   └── timer.js         # timer per soal
│   └── utils/
│       ├── helpers.js
│       └── constants.js
└── assets/                  # ikon, font (pakai library eksternal via CDN)
```

Setiap modul memegang satu tanggung jawab tunggal (single responsibility).

## ⚙️ Fitur Wajib

1. **Level & Operasi** — memengaruhi kompleksitas soal yang dihasilkan.
2. **Timer** — mencatat waktu penyelesaian tiap soal (detik), tampil real-time saat mengerjakan.
3. **IndexedDB** — menyimpan riwayat jawaban (level, operasi, waktu, benar/salah) dan achievements.
4. **Ekspor/Impor Biner** — format kustom FearMaths dengan header berisi `timestamp` (timezone-aware) dan metadata.
5. **Multipage (SPA)** — routing via hash atau History API, dengan bottom bar (navigasi utama) dan navbar (filter/opsi).
6. **Library pendukung via CDN** (jangan bundle besar):
   - Ikon: [Font Awesome](https://fontawesome.com/) atau [Material Icons](https://fonts.google.com/icons)
   - Alert/Modal: [SweetAlert2](https://sweetalert2.github.io/) atau [Notyf](https://carlosroso.com/notyf/)

## 🧪 Algoritma Pembuatan Soal

- **Dilarang hardcode** daftar soal. Soal dibangkitkan secara generatif berdasarkan:
  - Level (rentang angka, jumlah operand, jenis operasi)
  - Operasi yang dipilih (tunggal atau campur)
  - Riwayat performa user — adaptif, soal yang sering salah muncul lebih sering
- Algoritma harus scalable dan mudah diperluas dengan variasi soal baru.

## 📦 Deployment

- Hosting: **GitHub Pages** (atau static hosting lain).
- Semua aset dimuat secara relatif.
- Tidak memerlukan build tools (murni vanilla).

## 🤖 Instruksi untuk AI Agents

- Semua kode **vanilla ES6+**, tanpa framework.
- **Modularitas** adalah prioritas: pisahkan logika, UI, dan data secara ketat.
- Komentari fungsi kompleks dengan JSDoc.
- Gunakan `async/await` untuk semua operasi IndexedDB.
- Uji responsivitas mulai dari lebar layar 320px.
- Jangan sertakan file biner atau library yang tidak diperlukan.
- Testing minimal: pastikan tidak ada error di console dan IndexedDB berfungsi normal.
- Jika ditemukan file `Jules.md` atau `*_AI.md` lain di root repo, ikuti panduan spesifik di sana sebagai tambahan (bukan pengganti) dokumen ini.
