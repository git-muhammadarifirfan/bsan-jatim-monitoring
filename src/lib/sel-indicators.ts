// ────────────────────────────────────────────────────────────
//  sel-indicators.ts
//  Definisi lengkap semua indikator Instrumen Observasi BSAN-SEL
//  Sesuai dokumen: [Final] Instrumen Observasi BSAN-SEL 03092026.docx
// ────────────────────────────────────────────────────────────

export type SELDimensi = 'kesadaran_diri' | 'regulasi_emosi' | 'kesadaran_sosial' | 'keterampilan_relasi' | 'tanggung_jawab';
export type SELSubjek = 'guru' | 'murid';
export type SELKonteks = 'kelas' | 'lingkungan';
export type SELSkor = 1 | 2 | 3 | 4;

export const SEL_DIMENSI_LABEL: Record<SELDimensi, string> = {
  kesadaran_diri:     'Kesadaran Diri',
  regulasi_emosi:     'Regulasi Emosi',
  kesadaran_sosial:   'Kesadaran Sosial',
  keterampilan_relasi:'Keterampilan Relasi',
  tanggung_jawab:     'Tanggung Jawab',
};

export const SEL_SKOR_LABEL: Record<SELSkor, { label: string; emoji: string; color: string }> = {
  1: { label: 'Tidak Terlihat',   emoji: '❌', color: '#EF4444' },
  2: { label: 'Kadang Terlihat',  emoji: '🌗', color: '#F59E0B' },
  3: { label: 'Sering Terlihat',  emoji: '✅', color: '#10B981' },
  4: { label: 'Konsisten Terlihat', emoji: '🌟', color: '#4A57C4' },
};

export interface SELIndikator {
  id: string;
  dimensi: SELDimensi;
  subjek: SELSubjek;
  konteks: SELKonteks;
  teks: string;
  catatan?: string; // petunjuk tambahan untuk observer
}

export const SEL_INDIKATORS: SELIndikator[] = [
  // ══════════════════════════════════════════════════
  // GURU — Kesadaran Diri
  // ══════════════════════════════════════════════════
  {
    id: 'guru_kd_kls_1',
    dimensi: 'kesadaran_diri',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru mengajak murid mengenali kekuatan dan kelemahan diri',
  },
  {
    id: 'guru_kd_kls_2',
    dimensi: 'kesadaran_diri',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru meminta murid menuliskan hal yang mereka kuasai dan hal yang perlu mereka tingkatkan',
  },
  {
    id: 'guru_kd_kls_3',
    dimensi: 'kesadaran_diri',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru memberi apresiasi atas jawaban murid di kelas',
  },
  {
    id: 'guru_kd_kls_4',
    dimensi: 'kesadaran_diri',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru memfasilitasi sesi refleksi di akhir pelajaran',
  },
  {
    id: 'guru_kd_lngk_1',
    dimensi: 'kesadaran_diri',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru memberi pujian saat murid berani mencoba hal baru (misal: maju ke depan kelas, menjadi ketua kelas, menjadi petugas upacara)',
    catatan: 'Jika selama observasi tidak ada kegiatan, bisa ditanyakan ke guru (secara umum murid, atau hanya murid tertentu)',
  },
  {
    id: 'guru_kd_lngk_2',
    dimensi: 'kesadaran_diri',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru mengajak diskusi ringan saat istirahat tentang pengalaman mereka hari itu',
    catatan: 'Wawancara guru jika tidak terjadi',
  },

  // ══════════════════════════════════════════════════
  // GURU — Regulasi Emosi
  // ══════════════════════════════════════════════════
  {
    id: 'guru_re_kls_1',
    dimensi: 'regulasi_emosi',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru mencontohkan teknik pengelolaan emosi (misal: tarik napas)',
  },
  {
    id: 'guru_re_kls_2',
    dimensi: 'regulasi_emosi',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Ketika kelas gaduh, guru mencontohkan dan mengajak murid menggunakan regulasi emosi (teknik STOP, afirmasi positif, penggunaan tepuk, dll)',
  },
  {
    id: 'guru_re_kls_3',
    dimensi: 'regulasi_emosi',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru tetap tenang saat menghadapi situasi yang tak terkendali (misal: kelas gaduh, murid tantrum)',
  },
  {
    id: 'guru_re_lngk_1',
    dimensi: 'regulasi_emosi',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru menunjukkan sikap tenang, tidak berteriak atau membentak saat ada kegaduhan di jam istirahat',
  },
  {
    id: 'guru_re_lngk_2',
    dimensi: 'regulasi_emosi',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru mengingatkan murid dengan kalimat positif saat murid melakukan kesalahan (misal: memecahkan pot, menyerobot antrian, bermain bola di lorong)',
  },
  {
    id: 'guru_re_lngk_3',
    dimensi: 'regulasi_emosi',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru memberi arahan dengan tenang (tidak memarahi atau membentak) ketika ada murid yang datang terlambat',
  },

  // ══════════════════════════════════════════════════
  // GURU — Kesadaran Sosial
  // ══════════════════════════════════════════════════
  {
    id: 'guru_ks_kls_1',
    dimensi: 'kesadaran_sosial',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru menekankan pentingnya menghargai perbedaan',
  },
  {
    id: 'guru_ks_kls_2',
    dimensi: 'kesadaran_sosial',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru bersikap terbuka dengan jawaban yang berbeda dalam diskusi',
  },
  {
    id: 'guru_ks_kls_3',
    dimensi: 'kesadaran_sosial',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru menggunakan bahasa/istilah yang netral saat memberi contoh atau penyampaian materi (GEDSI)',
    catatan: 'Netral: tidak menggunakan bahasa yang mengasosiasikan kelompok tertentu dengan sifat tertentu, misal "anak perempuan rajin, anak laki-laki nakal"',
  },
  {
    id: 'guru_ks_kls_4',
    dimensi: 'kesadaran_sosial',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru mengatur kelompok secara heterogen (keseimbangan jumlah laki-laki dan perempuan dan/atau kemampuan)',
  },
  {
    id: 'guru_ks_kls_5',
    dimensi: 'kesadaran_sosial',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru berinteraksi secara merata dengan semua gender siswa, baik perempuan maupun laki-laki',
  },
  {
    id: 'guru_ks_kls_6',
    dimensi: 'kesadaran_sosial',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru berinteraksi secara merata ke semua posisi duduk siswa (depan, tengah, belakang, kiri, dan kanan)',
  },
  {
    id: 'guru_ks_lngk_1',
    dimensi: 'kesadaran_sosial',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru menyapa semua murid tanpa membeda-bedakan status sosial maupun jenis kelamin',
  },

  // ══════════════════════════════════════════════════
  // GURU — Keterampilan Relasi
  // ══════════════════════════════════════════════════
  {
    id: 'guru_kr_kls_1',
    dimensi: 'keterampilan_relasi',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru memfasilitasi diskusi kelompok dengan aturan komunikasi positif (menggunakan kata sopan, tidak menyela, memberi kesempatan bergiliran, menghargai perbedaan pendapat)',
  },
  {
    id: 'guru_kr_kls_2',
    dimensi: 'keterampilan_relasi',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru membimbing/memberikan contoh/memfasilitasi murid dalam menyelesaikan perbedaan pendapat',
  },

  // ══════════════════════════════════════════════════
  // GURU — Tanggung Jawab
  // ══════════════════════════════════════════════════
  {
    id: 'guru_tj_kls_1',
    dimensi: 'tanggung_jawab',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru datang tepat waktu dan menyiapkan kelas dengan rapi',
  },
  {
    id: 'guru_tj_kls_2',
    dimensi: 'tanggung_jawab',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru mengingatkan murid untuk menyelesaikan tugas tepat waktu',
  },
  {
    id: 'guru_tj_kls_3',
    dimensi: 'tanggung_jawab',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru mengajak murid bekerjasama dalam menyelesaikan tugas kelompok/diskusi',
  },
  {
    id: 'guru_tj_kls_4',
    dimensi: 'tanggung_jawab',
    subjek: 'guru',
    konteks: 'kelas',
    teks: 'Guru memberikan kesempatan pada anak untuk mencoba peran dan tanggung jawab yang berbeda dalam kerja/tugas kelompok',
  },
  {
    id: 'guru_tj_lngk_1',
    dimensi: 'tanggung_jawab',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru memberikan contoh untuk ikut menjaga kebersihan lingkungan sekolah (misal: membuang sampah pada tempatnya)',
  },
  {
    id: 'guru_tj_lngk_2',
    dimensi: 'tanggung_jawab',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru menekankan pentingnya menjaga fasilitas sekolah bersama-sama',
  },
  {
    id: 'guru_tj_lngk_3',
    dimensi: 'tanggung_jawab',
    subjek: 'guru',
    konteks: 'lingkungan',
    teks: 'Guru mengajak murid ikut serta dalam kegiatan peduli lingkungan',
  },

  // ══════════════════════════════════════════════════
  // MURID — Kesadaran Diri
  // ══════════════════════════════════════════════════
  {
    id: 'murid_kd_kls_1',
    dimensi: 'kesadaran_diri',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid dapat menyebutkan/menjelaskan perasaannya saat diminta guru',
  },
  {
    id: 'murid_kd_kls_2',
    dimensi: 'kesadaran_diri',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid berani menjawab pertanyaan atau presentasi di depan kelas',
  },
  {
    id: 'murid_kd_kls_3',
    dimensi: 'kesadaran_diri',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid mau mendengarkan pendapat temannya saat diskusi',
  },
  {
    id: 'murid_kd_lngk_1',
    dimensi: 'kesadaran_diri',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid mengungkapkan perasaan kepada teman (misal: sedih saat kalah bermain, sakit ketika tak sengaja terdorong)',
  },
  {
    id: 'murid_kd_lngk_2',
    dimensi: 'kesadaran_diri',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid secara aktif menawarkan diri untuk berkontribusi sesuai kemampuannya saat kegiatan di luar jam pelajaran',
    catatan: 'Wawancara guru jika saat observasi tidak ditemukan peristiwa yang mendukung',
  },
  {
    id: 'murid_kd_lngk_3',
    dimensi: 'kesadaran_diri',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid menyapa guru dengan ramah, atau mengajak teman (termasuk anak disabilitas jika ada) bermain bersama',
  },
  {
    id: 'murid_kd_lngk_4',
    dimensi: 'kesadaran_diri',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid tahu area pribadi yang boleh disentuh dan mengingatkan temannya jika tersentuh/disentuh',
    catatan: 'Bisa ditanyakan guru jika tidak ada peristiwa mendukung',
  },

  // ══════════════════════════════════════════════════
  // MURID — Regulasi Emosi
  // ══════════════════════════════════════════════════
  {
    id: 'murid_re_kls_1',
    dimensi: 'regulasi_emosi',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid menggunakan teknik regulasi emosi saat merasa kesulitan',
    catatan: 'Jika saat observasi tidak ada peristiwa yang mendukung, bisa ditanyakan kepada murid dan/atau guru',
  },
  {
    id: 'murid_re_kls_2',
    dimensi: 'regulasi_emosi',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid tidak langsung menangis atau marah saat gagal menjawab atau kelengkapan menulisnya tidak lengkap',
    catatan: 'Jika tidak ada peristiwa yang mendukung bisa ditanyakan ke guru',
  },
  {
    id: 'murid_re_kls_3',
    dimensi: 'regulasi_emosi',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid kembali mengikuti pembelajaran setelah menenangkan diri',
    catatan: 'Bisa ditanyakan guru jika tidak ada peristiwa yang mendukung selama observasi',
  },
  {
    id: 'murid_re_lngk_1',
    dimensi: 'regulasi_emosi',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid tidak membalas ejekan teman',
  },
  {
    id: 'murid_re_lngk_2',
    dimensi: 'regulasi_emosi',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid bersikap positif saat kalah dalam bermain',
  },

  // ══════════════════════════════════════════════════
  // MURID — Kesadaran Sosial
  // ══════════════════════════════════════════════════
  {
    id: 'murid_ks_kls_1',
    dimensi: 'kesadaran_sosial',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid mendengarkan pendapat teman tanpa memotong',
  },
  {
    id: 'murid_ks_kls_2',
    dimensi: 'kesadaran_sosial',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid menerima pendapat yang berbeda tanpa mengejek atau menertawakannya',
  },
  {
    id: 'murid_ks_kls_3',
    dimensi: 'kesadaran_sosial',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid menghibur atau memberi semangat ketika temannya mengalami kesulitan atau sedih',
  },
  {
    id: 'murid_ks_lngk_1',
    dimensi: 'kesadaran_sosial',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid menenangkan teman yang menangis saat bermain',
  },
  {
    id: 'murid_ks_lngk_2',
    dimensi: 'kesadaran_sosial',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid mau bermain bersama teman yang berbeda (jenis kelamin, kelompok sosial, ras, suku, agama, termasuk anak dengan disabilitas)',
  },

  // ══════════════════════════════════════════════════
  // MURID — Keterampilan Relasi
  // ══════════════════════════════════════════════════
  {
    id: 'murid_kr_1',
    dimensi: 'keterampilan_relasi',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid tidak berteriak atau mengejek saat konflik muncul',
  },
  {
    id: 'murid_kr_2',
    dimensi: 'keterampilan_relasi',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid meminta maaf saat berselisih dengan temannya',
  },
  {
    id: 'murid_kr_3',
    dimensi: 'keterampilan_relasi',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid secara aktif menggunakan 3 kata ajaib (maaf, terima kasih, dan tolong)',
  },
  {
    id: 'murid_kr_4',
    dimensi: 'keterampilan_relasi',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid tidak membalas dorongan fisik/perilaku kekerasan fisik',
  },
  {
    id: 'murid_kr_5',
    dimensi: 'keterampilan_relasi',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid bisa berdamai setelah berselisih',
  },

  // ══════════════════════════════════════════════════
  // MURID — Tanggung Jawab
  // ══════════════════════════════════════════════════
  {
    id: 'murid_tj_kls_1',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid membawa perlengkapan belajar dengan tertib',
  },
  {
    id: 'murid_tj_kls_2',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid mengumpulkan tugas tepat waktu',
  },
  {
    id: 'murid_tj_kls_3',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid membantu teman yang kesulitan',
  },
  {
    id: 'murid_tj_kls_4',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid merapikan meja dan kursi setelah pembelajaran',
  },
  {
    id: 'murid_tj_kls_5',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'kelas',
    teks: 'Murid menggunakan seragam sesuai dan rapi',
  },
  {
    id: 'murid_tj_lngk_1',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid bisa mengatur diri sendiri untuk menaati aturan waktu istirahat dan masuk ke kelas tanpa diingatkan guru',
  },
  {
    id: 'murid_tj_lngk_2',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid menghormati area tubuh teman yang boleh disentuh dan tidak',
  },
  {
    id: 'murid_tj_lngk_3',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid menggunakan bahasa positif ketika berbicara dan bermain bersama teman',
  },
  {
    id: 'murid_tj_lngk_4',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid mengingatkan ketika ada teman yang menggunakan bahasa yang negatif atau yang bisa membuat orang lain tidak nyaman',
  },
  {
    id: 'murid_tj_lngk_5',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid menaati kesepakatan kelas dan aturan sekolah',
  },
  {
    id: 'murid_tj_lngk_6',
    dimensi: 'tanggung_jawab',
    subjek: 'murid',
    konteks: 'lingkungan',
    teks: 'Murid menjaga lingkungan sekolah (misal: membuang sampah pada tempatnya, memelihara tanaman kelas)',
  },
];

// ─── Helper Functions ───────────────────────────────────────

/** Ambil indikator berdasarkan dimensi dan/atau subjek */
export function getIndikatorsByFilter(opts: {
  dimensi?: SELDimensi;
  subjek?: SELSubjek;
  konteks?: SELKonteks;
}): SELIndikator[] {
  return SEL_INDIKATORS.filter((ind) => {
    if (opts.dimensi && ind.dimensi !== opts.dimensi) return false;
    if (opts.subjek && ind.subjek !== opts.subjek) return false;
    if (opts.konteks && ind.konteks !== opts.konteks) return false;
    return true;
  });
}

/** Hitung skor rata-rata dari record jawaban untuk satu subjek/dimensi */
export function hitungSkorRata(
  jawaban: Record<string, SELSkor | null>,
  subjek?: SELSubjek,
  dimensi?: SELDimensi,
): number {
  const ids = SEL_INDIKATORS
    .filter(ind => (!subjek || ind.subjek === subjek) && (!dimensi || ind.dimensi === dimensi))
    .map(ind => ind.id);

  const valid = ids.map(id => jawaban[id]).filter((v): v is SELSkor => v !== null && v !== undefined);
  if (valid.length === 0) return 0;
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
}

/** Hitung skor SEL per dimensi dari jawaban */
export function hitungSkorPerDimensi(
  jawaban: Record<string, SELSkor | null>,
  subjek?: SELSubjek,
): Record<SELDimensi, number> {
  const dimensiList: SELDimensi[] = ['kesadaran_diri', 'regulasi_emosi', 'kesadaran_sosial', 'keterampilan_relasi', 'tanggung_jawab'];
  return Object.fromEntries(
    dimensiList.map(d => [d, hitungSkorRata(jawaban, subjek, d)])
  ) as Record<SELDimensi, number>;
}

export const SEL_DIMENSI_ORDER: SELDimensi[] = [
  'kesadaran_diri',
  'regulasi_emosi',
  'kesadaran_sosial',
  'keterampilan_relasi',
  'tanggung_jawab',
];
