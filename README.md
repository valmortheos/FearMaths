# 😱 FearMaths

**Belajar matematika tanpa rasa takut — atau setidaknya, coba dulu.** 🧮✨

FearMaths adalah aplikasi web belajar matematika interaktif yang dirancang untuk melatih kecepatan dan ketepatan berhitung, dari level `easy` yang bersahabat sampai `nightmare` yang... namanya juga nightmare. 👻

Dibangun 100% **vanilla JavaScript**, tanpa framework, tanpa build tools, tanpa drama. Cuma HTML, CSS, JS, dan tekad. 💪

---

## 🎯 Fitur Utama

- 🎚️ **4 Level Kesulitan** — `easy`, `normal`, `hard`, `nightmare` (siap-siap ketemu angka desimal negatif di level terakhir 😈)
- ➕➖✖️➗ **Pilihan Operasi** — penjumlahan, pengurangan, perkalian, pembagian, campur, atau serahkan ke takdir (acak)
- ⏱️ **Timer per Soal** — karena mikir lama juga ada konsekuensinya
- 🧠 **Algoritma Adaptif** — sistem yang mengingat soal-soal yang bikin kamu gagal, dan dengan senang hati memberikannya lagi
- 💾 **IndexedDB** — semua progres dan pencapaian tersimpan aman di browser, offline-friendly
- 📦 **Ekspor/Impor Biner** — pindahkan progresmu ke device lain dengan format file kustom (bukan cuma JSON biasa, kami niat banget 😤)
- 📱 **Mobile-First & Responsif** — nyaman dipakai dari layar 320px sampai monitor ultrawide
- 🎨 **Desain Modern Minimalis** — palet biru menenangkan, biar stres ngitungnya nggak nambah stres liatnya

---

## 🎨 Palet Warna

| Warna | Kode | Vibe |
|---|---|---|
| 🤍 Putih | `#F7F8F0` | Bersih & lapang |
| 🩵 Biru Muda | `#9CD5FF` | Ceria |
| 💙 Biru Tenang | `#7AAACE` | Menenangkan |
| 🌌 Biru Sangat Tua | `#355872` | Serius (tapi tetap kalem) |

---

## 🚀 Menjalankan Secara Lokal

Karena FearMaths murni vanilla (tanpa `npm install` yang bikin nunggu 10 menit 🙃), cukup ikuti langkah berikut:

### 1️⃣ Clone repository

```bash
git clone https://github.com/valmortheos/FearMaths.git
cd FearMaths
```

### 2️⃣ Jalankan local server

Karena browser modern rewel soal `file://` + IndexedDB/module scripts, jalankan lewat local server ringan. Pilih salah satu:

**Opsi A — Python** (biasanya sudah terpasang) 🐍
```bash
python3 -m http.server 8000
```

**Opsi B — Node.js** (`npx`, tanpa install global) 🟢
```bash
npx serve .
```

**Opsi C — VS Code** 🧩
Install ekstensi **Live Server**, klik kanan `index.html` → **"Open with Live Server"**.

### 3️⃣ Buka di browser 🌐

```
http://localhost:8000
```

Selamat berhitung, dan semoga level `nightmare` tidak benar-benar jadi mimpi buruk. 😅

---

## 📁 Struktur Proyek

```
/src
├── index.html
├── css/          # design system: variables, base, layout, components
├── js/
│   ├── app.js           # entry point & routing
│   ├── algorithm/       # otak dari FearMaths — generator soal adaptif
│   ├── db/               # IndexedDB + ekspor/impor biner
│   ├── ui/                # rendering, navigasi, timer
│   └── utils/
└── assets/       # ikon & font (via CDN)
```

Detail lengkap arsitektur dan konvensi pengembangan ada di [`AGENTS.md`](./AGENTS.md) 📘 dan panduan khusus AI agent di [`Jules.md`](./Jules.md) 🤖.

---

## 📦 Deployment

FearMaths di-hosting statis di **GitHub Pages** — nggak perlu build step, tinggal push dan tunggu deploy selesai. ☁️✨

---

## 🤝 Kontribusi

Proyek ini dikembangkan dan dipelihara oleh **valmortheos**. Saran, laporan bug, atau ide fitur baru (termasuk level `apocalypse` kalau ada yang berani 🔥) sangat diterima lewat Issues atau Pull Request.

---

<p align="center">
  Dibuat dengan ❤️, banyak kopi ☕, dan sedikit rasa takut pada matematika itu sendiri.
</p>
