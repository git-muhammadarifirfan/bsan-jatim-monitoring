# Design System — Sistem Survey Sekolah (BSAN Sidoarjo)

Referensi visual: dashboard "Smart" (indigo/royal blue, card putih, ring-chart, sidebar gelap).
Filosofi diadaptasi 1:1 dari layout referensi, isi navigasi & komponen disesuaikan ke domain survei sekolah.

---

## 1. Palet Warna

| Token | Hex | Peran |
|---|---|---|
| `--color-primary` | `#4A57C4` | Sidebar, tombol utama, brand |
| `--color-primary-dark` | `#333F91` | Hover/gradient sidebar, header banner |
| `--color-accent` | `#6C7AE0` | Chart bar, ring chart, elemen interaktif sekunder |
| `--color-bg` | `#F4F5FB` | Background halaman (di luar card) |
| `--color-surface` | `#FFFFFF` | Card, panel, tabel |
| `--color-border` | `#E8E9F5` | Garis pembatas, divider |
| `--color-text-primary` | `#1C1B33` | Judul, teks utama |
| `--color-text-secondary` | `#8A8FA8` | Label, teks pendukung, placeholder |

**Warna status survei** (dipakai konsisten di seluruh chart, badge, peta choropleth):

| Token | Hex | Arti |
|---|---|---|
| `--status-belum` | `#E5484D` | Belum menerima / belum mengisi |
| `--status-sebagian` | `#F5A623` | Sebagian menerima / sebagian isi |
| `--status-sudah` | `#2FB344` | Sudah menerima / lengkap mengisi |
| `--status-netral` | `#C7CBDE` | Tidak ada data / belum tersentuh |

Aturan: warna status ini **tidak berubah-ubah di seluruh sistem** — dashboard, peta, tabel, badge semua pakai 3 warna yang sama supaya orang langsung asosiasi warna = kondisi tanpa baca label.

## 2. Tipografi

- Display/Heading: **Inter** atau **Plus Jakarta Sans**, weight 600–700 — dipakai di judul halaman & angka KPI besar
- Body: **Inter**, weight 400–500 — teks umum, label, tabel
- Data/angka besar (KPI, persentase): weight 700, tabular numbers biar rata di tabel

## 3. Layout

```
┌─────────┬──────────────────────────────────────────┬───────────┐
│ Sidebar │  Topbar (search, notif, profil)           │           │
│ (fixed) ├──────────────────────────────────────────┤  Panel    │
│         │  Hero banner (ringkasan/greeting)         │  kanan    │
│ Grup    ├──────────────────────────────────────────┤  (peta    │
│ menu    │  Grid KPI card (4 kolom)                  │  mini /   │
│         ├──────────────────────────────────────────┤  aktivitas│
│         │  Chart utama (2 kolom: bar + ring)         │  terbaru) │
│         ├──────────────────────────────────────────┤           │
│ Logout  │  Tabel / daftar detail                    │           │
└─────────┴──────────────────────────────────────────┴───────────┘
```

Card radius: `16px`, shadow lembut (`0 4px 20px rgba(28,27,51,0.06)`), padding internal `24px`.

## 4. Navigasi (Information Architecture)

Sidebar dikelompokkan dengan label grup kecil (huruf kapital, abu-abu, 11px) — beda dari referensi yang flat, karena menu kita lebih banyak:

```
RINGKASAN
  ▸ Dashboard
  ▸ Peta Kecamatan

DATA & INPUT
  ▸ Kuisioner
  ▸ Data Responden
  ▸ Data Satuan Pendidikan

ANALISIS
  ▸ Modul BSAN
  ▸ Analisis Gap Funnel
  ▸ Matriks 4 Kuadran
  ▸ Tantangan Implementasi

INSIGHT  (Fase 2)
  ▸ Suara Responden

LAPORAN
  ▸ Laporan & Ekspor

SISTEM
  ▸ Setting

─────────────
  ⏻ Log Out
```

Item aktif: background putih di atas sidebar indigo + teks indigo (persis pola referensi). Icon pakai satu family (lucide-react) konsisten 20px.

## 5. Komponen Kunci

**KPI Card** — angka besar (bold, 32px) + label kecil di bawah + delta kecil opsional ("+12 minggu ini"). Dipakai untuk: Total Sekolah, Sudah Mengisi, Belum Mengisi, Response Rate.

**Ring Chart (donut progress)** — persis gaya "My visit" di referensi (92%, 83%, dst). Dipakai untuk: progres tiap Modul BSAN (5 ring untuk 5 modul).

**Bar Chart Vertikal** — persis gaya "Performance" di referensi. Dipakai untuk: perbandingan response rate antar kecamatan/kabupaten.

**Peta Interaktif (Peta Kecamatan)**
- Base: choropleth 18 kecamatan Sidoarjo, warna fill = tingkat partisipasi (gradasi dari `--status-belum` → `--status-sudah`)
- Hover: highlight wilayah + tooltip (nama kecamatan, jumlah sekolah, X/Y sudah isi, %)
- Klik: drill-down → filter seluruh dashboard ke kecamatan itu (breadcrumb muncul di topbar: "Sidoarjo > Waru ✕")
- Library: `react-simple-maps` (SVG, ringan, cocok untuk data statis) + file GeoJSON batas kecamatan Sidoarjo

**Tabel Data** — header sticky, kolom status pakai badge warna (bukan teks polos), search + filter kabupaten/kecamatan di atas tabel, pagination di bawah.

**Empty/Belum Ada Data** — untuk kecamatan/sekolah yang belum mengisi: bukan tabel kosong polos, tampilkan pesan aksi ("Belum ada data — kirim reminder ke sekolah ini") sesuai prinsip empty state = ajakan bertindak.

## 6. Catatan Implementasi

- Word Cloud & klasifikasi AI narasi **sengaja tidak masuk desain Fase 1** (sesuai keputusan — dikesampingkan dulu). Menu "Suara Responden" tetap ada di IA sebagai placeholder Fase 2, tapi non-aktif/badge "Segera".
- Semua warna didefinisikan sebagai CSS variables di root, supaya migrasi tema atau penyesuaian gampang tanpa cari-cari hex di seluruh kode.
