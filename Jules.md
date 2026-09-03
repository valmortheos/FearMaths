# Jules.md — FearMaths for Jules

Halo Jules! Kamu akan mengembangkan **FearMaths** mengikuti `AGENTS.md` sebagai dasar. Dokumen ini berisi aturan tambahan yang khusus untukmu.

## 🎯 Gaya Kode & Preferensi

- Gunakan `const`/`let`, hindari `var`. Arrow function untuk callback.
- Penamaan: `camelCase` untuk variabel/fungsi, `PascalCase` untuk kelas, `UPPER_SNAKE_CASE` untuk konstanta.
- CSS: metodologi **BEM** (`Block__Element--Modifier`).
- HTML: semantik (`<main>`, `<section>`, `<article>`, `<nav>`).
- Setiap file diberi header komentar singkat yang menjelaskan fungsinya.

## 🧠 Algoritma Adaptif

**Weighted random berdasarkan riwayat jawaban:**
- Bobot soal yang dijawab salah dinaikkan 20%.
- Bobot soal yang dijawab benar diturunkan 10% (minimum 0.5).

**Formula per level:**

| Level | Rentang Angka | Operand | Catatan |
|---|---|---|---|
| `easy` | 1–10 | 2 | — |
| `normal` | 1–50 | 2–3 | — |
| `hard` | 1–100 | 3 | bisa negatif |
| `nightmare` | 1–500 | 3–4 | negatif & desimal sederhana |

**Operasi campur**: pilih operasi secara acak, masing-masing probabilitas 25%.

## 🗃️ Skema IndexedDB

**Object store `progress`:**
`id` (autoIncrement) · `timestamp` (ISO string) · `level` · `operation` · `question` · `userAnswer` · `correct` · `timeTaken` (detik)

**Object store `achievements`:**
`id` · `name` · `description` · `unlockedAt` (ISO string)

**Format ekspor biner** — header 16 byte:
- Magic number: `FEAR` (4 byte)
- Version: `1` (1 byte)
- Timestamp: UNIX epoch ms, timezone-aware (8 byte)
- Data length (4 byte) + JSON string berisi seluruh progress/achievements

## 🖌️ Detail UI

- **Bottom bar** — 4 tab: Belajar, Statistik, Pencapaian, Pengaturan.
- **Navbar** — filter level & operasi (dropdown atau toggle).
- **Timer** — di pojok atas area soal; mulai saat soal muncul, berhenti saat jawaban dikirim.
- **Alert** — pakai SweetAlert2 untuk notifikasi sukses/gagal, konfirmasi reset data, dan info ekspor/impor.

## 🚀 Langkah Implementasi

1. Buat struktur folder sesuai `AGENTS.md`.
2. Inisialisasi `index.html` (meta viewport, link CSS, script defer).
3. Implementasikan wrapper IndexedDB (open, store, get).
4. Bangun algoritma generator di `algorithm/generator.js`.
5. Buat UI renderer dan navigasi.
6. Integrasikan timer dan evaluasi jawaban.
7. Tambahkan fitur ekspor/impor.
8. Uji di berbagai ukuran layar, mulai 320px.

## 📌 Catatan Penting

- **Jangan** gunakan `alert()`/`confirm()` bawaan browser — pakai library modal/alert.
- Pastikan semua interaksi non-blocking (gunakan async/await).
- Deploy ke GitHub Pages via branch `gh-pages`.
- Jika ada file `Jules_AI.md` tambahan di root, baca dan ikuti sebagai pelengkap.

---

Selamat bekerja, Jules! FearMaths harus rilis versi 1.0 dengan pengalaman yang mulus dan desain yang memukau. 🚀
