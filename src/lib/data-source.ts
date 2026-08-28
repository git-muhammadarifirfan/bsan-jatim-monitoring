import realSchoolsData from './real-schools.json';
import realSurveyData from './real-survey-data.json';

export interface School {
  id: string;
  npsn: string;
  nama: string;
  kecamatan: string;
  kabupaten: string;
  status: 'belum' | 'sebagian' | 'sudah';
  jenjang: string;
  statusSekolah: string;
  totalGuru: number;
  totalSiswa: number;
  akreditasi: string;
  alamat: string;
  email: string;
  telepon: string;
  lastUpdated?: string;
  x: number;
  y: number;
}

export interface SurveyRespondent {
  id: string;
  timestamp: string;
  nama: string;
  jenisKelamin: string;
  posisi: string;
  sekolah: string;
  npsn: string;
  kabupaten: string;
  kecamatan: string;
  penerima: string;
  penyelenggara: string;
  statusImplementasi: string;
  kelasMengajar: string;
}

export interface ModulProgress {
  id: string;
  nama: string;
  progres: number;
  totalPertanyaan: number;
  terisi: number;
}

export interface KecamatanStat {
  kecamatan: string;
  kabupaten: string;
  total: number;
  belum: number;
  sebagian: number;
  sudah: number;
  rate: number;
}

export interface KabupatenStat {
  kabupaten: string;
  total: number;
  belum: number;
  sebagian: number;
  sudah: number;
  rate: number;
  color: string;
}

export interface FunnelStep {
  name: string;
  schools: number;
  percentage: number;
}

export interface MatrixPoint {
  id: string;
  name: string;
  kecamatan: string;
  implementation: number;
  readiness: number;
  status: 'belum' | 'sebagian' | 'sudah';
}

export interface ChallengeStat {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TimeSeriesPoint {
  date: string;
  sudah: number;
  sebagian: number;
}

export interface RadarPoint {
  subject: string;
  sekolah: number;
  kecamatan: number;
  fullMark: number;
}

export interface ProporsiModulData {
  proporsiPenerima: { ya: number; tidak: number; totalResponden: number };
  distribusiPerKecamatan: { kecamatan: string; ya: number; tidak: number }[];
  penyelenggaraPelatihan: { nama: string; jumlah: number }[];
  statusImplementasiPosisi: { posisi: string; belumMenerima: number; tidakMenerapkan: number; sebagian: number; sudah: number }[];
  statusImplementasiKecamatan: { kecamatan: string; belumMenerima: number; tidakMenerapkan: number; sebagian: number; sudah: number }[];
  kemudahanModul: {
    kelasAwal: { mudah: { modul: string; persen: number }[]; sulit: { modul: string; persen: number }[] };
    kelasTinggi: { mudah: { modul: string; persen: number }[]; sulit: { modul: string; persen: number }[] };
  };
  mediaPembelajaran: {
    kelasAwal: { media: string; persen: number }[];
    kelasTinggi: { media: string; persen: number }[];
  };
  keterlibatanSiswa: { kategori: string; persen: number; jumlah: number }[];
  refleksiGuru: string[];
  dukunganKepsek: { metode: string; jumlah: number }[];
  rencanaAksi: { program: string; jumlah: number }[];
  kondisiFasilitas: { kecamatan: string; baik: number; cukup: number; rusak: number }[];
  rasioGuruSiswa: { kecamatan: string; rasio: number }[];
  kelayakanRuangKelas: { kecamatan: string; rombel: number; kelasLayak: number; persentase: number }[];
}

export const KABUPATEN_LIST = [
  { id: 'Kab. Sidoarjo', name: 'Kab. Sidoarjo', key: 'sidoarjo', color: '#4A57C4' },
  { id: 'Kota Batu', name: 'Kota Batu', key: 'batu', color: '#6C7AE0' },
  { id: 'Kab. Tuban', name: 'Kab. Tuban', key: 'tuban', color: '#2FB344' }
];

export const KECAMATAN_LIST = [
  // Sidoarjo
  'Waru', 'Taman', 'Gedangan', 'Sedati', 'Buduran', 'Sukodono',
  'Sidoarjo', 'Krian', 'Balong Bendo', 'Tarik', 'Prambon', 'Krembung',
  'Porong', 'Jabon', 'Tanggulangin', 'Tulangan', 'Wonoayu', 'Candi',
  // Batu
  'Batu', 'Bumiaji', 'Junrejo',
  // Tuban
  'Tuban', 'Jenu', 'Merakurak', 'Semanding', 'Palang', 'Widang',
  'Babat', 'Plapak', 'Rengel', 'Soko', 'Parengan', 'Singgahan',
  'Senori', 'Bangilan', 'Jatirogo', 'Kenduruan', 'Montong', 'Kerek',
  'Tambakboyo', 'Bancar'
];

export const schoolsData: School[] = realSchoolsData as School[];
export const respondentsData: SurveyRespondent[] = realSurveyData.respondents as SurveyRespondent[];

export const database = {
  getSchools: async (filters?: {
    kabupaten?: string;
    kecamatan?: string;
    status?: string;
    search?: string;
  }): Promise<School[]> => {
    return new Promise((resolve) => {
      let result = [...schoolsData];

      if (filters?.kabupaten) {
        result = result.filter(s => s.kabupaten === filters.kabupaten);
      }
      if (filters?.kecamatan) {
        result = result.filter(s => s.kecamatan === filters.kecamatan);
      }
      if (filters?.status) {
        result = result.filter(s => s.status === filters.status);
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(s =>
          s.nama.toLowerCase().includes(query) ||
          s.npsn.includes(query) ||
          s.kecamatan.toLowerCase().includes(query)
        );
      }

      setTimeout(() => resolve(result), 100);
    });
  },

  getRespondents: async (filters?: {
    kabupaten?: string;
    kecamatan?: string;
    search?: string;
  }): Promise<SurveyRespondent[]> => {
    return new Promise((resolve) => {
      let result = [...respondentsData];
      if (filters?.kabupaten) {
        result = result.filter(r => r.kabupaten === filters.kabupaten);
      }
      if (filters?.kecamatan) {
        result = result.filter(r => r.kecamatan === filters.kecamatan);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(r =>
          r.nama.toLowerCase().includes(q) ||
          r.sekolah.toLowerCase().includes(q) ||
          r.npsn.includes(q)
        );
      }
      setTimeout(() => resolve(result), 100);
    });
  },

  getKabupatenStats: async (): Promise<KabupatenStat[]> => {
    return new Promise((resolve) => {
      const stats: Record<string, KabupatenStat> = {
        'Kab. Sidoarjo': { kabupaten: 'Kab. Sidoarjo', total: 0, belum: 0, sebagian: 0, sudah: 0, rate: 0, color: '#4A57C4' },
        'Kota Batu': { kabupaten: 'Kota Batu', total: 0, belum: 0, sebagian: 0, sudah: 0, rate: 0, color: '#6C7AE0' },
        'Kab. Tuban': { kabupaten: 'Kab. Tuban', total: 0, belum: 0, sebagian: 0, sudah: 0, rate: 0, color: '#2FB344' }
      };

      schoolsData.forEach(s => {
        if (stats[s.kabupaten]) {
          stats[s.kabupaten].total++;
          stats[s.kabupaten][s.status]++;
        }
      });

      const list = Object.values(stats).map(item => {
        item.rate = item.total > 0 ? Math.round(((item.sudah + item.sebagian * 0.5) / item.total) * 100) : 0;
        return item;
      }).sort((a, b) => b.rate - a.rate);

      setTimeout(() => resolve(list), 100);
    });
  },

  getKecamatanStats: async (kabupatenFilter?: string): Promise<KecamatanStat[]> => {
    return new Promise((resolve) => {
      const filtered = kabupatenFilter
        ? schoolsData.filter(s => s.kabupaten === kabupatenFilter)
        : schoolsData;

      const stats: Record<string, KecamatanStat> = {};

      filtered.forEach(s => {
        if (!stats[s.kecamatan]) {
          stats[s.kecamatan] = {
            kecamatan: s.kecamatan,
            kabupaten: s.kabupaten,
            total: 0,
            belum: 0,
            sebagian: 0,
            sudah: 0,
            rate: 0
          };
        }
        stats[s.kecamatan].total++;
        stats[s.kecamatan][s.status]++;
      });

      const list = Object.values(stats)
        .map(item => {
          item.rate = item.total > 0 ? Math.round((item.sudah / item.total) * 100) : 0;
          return item;
        })
        .sort((a, b) => b.rate - a.rate);

      setTimeout(() => resolve(list), 100);
    });
  },

  getModulProgress: async (filters?: { kabupaten?: string; kecamatan?: string }): Promise<ModulProgress[]> => {
    return new Promise((resolve) => {
      const targetKab = filters?.kabupaten || 'Kab. Sidoarjo';
      const respondents = respondentsData.filter(r => {
        let match = true;
        if (targetKab && r.kabupaten !== targetKab) match = false;
        if (filters?.kecamatan && r.kecamatan !== filters.kecamatan) match = false;
        return match;
      });

      const totalResp = respondents.length || 1;
      const penerimaCount = respondents.filter(r => r.penerima === 'Ya').length;
      const implSudahCount = respondents.filter(r => r.statusImplementasi === 'sudah').length;
      const baseRate = Math.round((penerimaCount / totalResp) * 100);
      const implRate = Math.round((implSudahCount / totalResp) * 100);

      const progressList: ModulProgress[] = [
        { id: 'm1', nama: 'Modul 1: Literasi & Numerasi', progres: Math.min(100, baseRate + 15), totalPertanyaan: 12, terisi: Math.round(totalResp * 0.9) },
        { id: 'm2', nama: 'Modul 2: Pengembangan Karakter', progres: Math.min(100, baseRate + 8), totalPertanyaan: 15, terisi: Math.round(totalResp * 0.85) },
        { id: 'm3', nama: 'Modul 3: Kepemimpinan Instruksional', progres: Math.min(100, implRate + 25), totalPertanyaan: 10, terisi: Math.round(totalResp * 0.7) },
        { id: 'm4', nama: 'Modul 4: Lingkungan Belajar', progres: Math.min(100, baseRate + 5), totalPertanyaan: 8, terisi: Math.round(totalResp * 0.8) },
        { id: 'm5', nama: 'Modul 5: Kemitraan Orang Tua', progres: Math.min(100, implRate + 18), totalPertanyaan: 10, terisi: Math.round(totalResp * 0.65) },
      ];
      setTimeout(() => resolve(progressList), 100);
    });
  },

  getTimeSeriesData: async (filters?: { kabupaten?: string; kecamatan?: string }): Promise<TimeSeriesPoint[]> => {
    return new Promise((resolve) => {
      const filtered = schoolsData.filter(s => {
        let match = true;
        if (filters?.kabupaten && s.kabupaten !== filters.kabupaten) match = false;
        if (filters?.kecamatan && s.kecamatan !== filters.kecamatan) match = false;
        return match;
      });

      const total = filtered.length || 100;
      const data: TimeSeriesPoint[] = [
        { date: '1 Sep', sudah: Math.floor(total * 0.05), sebagian: Math.floor(total * 0.08) },
        { date: '2 Sep', sudah: Math.floor(total * 0.15), sebagian: Math.floor(total * 0.18) },
        { date: '3 Sep', sudah: Math.floor(total * 0.28), sebagian: Math.floor(total * 0.25) },
        { date: '4 Sep', sudah: Math.floor(total * 0.42), sebagian: Math.floor(total * 0.32) },
        { date: '5 Sep', sudah: Math.floor(total * 0.58), sebagian: Math.floor(total * 0.35) },
        { date: '6 Sep', sudah: Math.floor(total * 0.68), sebagian: Math.floor(total * 0.28) },
        { date: '7 Sep', sudah: Math.floor(total * 0.75), sebagian: Math.floor(total * 0.22) },
      ];
      setTimeout(() => resolve(data), 100);
    });
  },

  getSuaraRespondenData: async (filters?: { kabupaten?: string; kecamatan?: string }): Promise<any[]> => {
    return new Promise((resolve) => {
      const filtered = schoolsData.filter(s => {
        let match = true;
        if (filters?.kabupaten && s.kabupaten !== filters.kabupaten) match = false;
        if (filters?.kecamatan && s.kecamatan !== filters.kecamatan) match = false;
        return match;
      });

      const templates = [
        { m: 'Modul 1: Literasi & Numerasi', s: 'positif', c: 'Penerapan modul literasi dasar berjalan sangat lancar dibantu media ajar manipulatif, anak-anak jadi lebih antusias.' },
        { m: 'Modul 4: Lingkungan Belajar', s: 'negatif', c: 'Kami sangat membutuhkan bantuan tambahan laptop untuk laboratorium komputer agar pembelajaran literasi digital bisa maksimal.' },
        { m: 'Modul 2: Pengembangan Karakter', s: 'netral', c: 'Pelaksanaan projek P5 terkendala koordinasi waktu dan penyediaan bahan ajar pendukung yang minim dari komite.' },
        { m: 'Modul 3: Kepemimpinan Instruksional', s: 'positif', c: 'Supervisi akademik oleh kepala sekolah sudah rutin dilakukan, sangat membantu peningkatan kompetensi pengajaran guru.' },
        { m: 'Modul 5: Kemitraan Orang Tua', s: 'negatif', c: 'Kehadiran wali murid di forum kelas orang tua masih rendah karena mayoritas bekerja shift pabrik.' },
        { m: 'Modul 4: Lingkungan Belajar', s: 'negatif', c: 'Jaringan internet di sekolah kami sering mati saat siang hari, mengganggu latihan ujian numerasi online.' },
        { m: 'Modul 1: Literasi & Numerasi', s: 'netral', c: 'Kami membutuhkan buku bacaan tingkat awal yang lebih bervariasi untuk pojok baca kelas.' },
        { m: 'Modul 2: Pengembangan Karakter', s: 'positif', c: 'Anak-anak mulai terbiasa dengan budaya 5S setiap pagi di gerbang sekolah.' },
        { m: 'Modul 5: Kemitraan Orang Tua', s: 'positif', c: 'Grup paguyuban wali murid sangat aktif membantu kegiatan peringatan hari besar agama di sekolah.' },
        { m: 'Modul 3: Kepemimpinan Instruksional', s: 'negatif', c: 'Pelatihan guru KKG di tingkat gugus kurang merata, kami harap dinas sering turun langsung.' }
      ];

      const limit = Math.min(filtered.length, 50);
      const data = filtered.slice(0, limit).map((s, idx) => {
        const t = templates[idx % templates.length];
        return {
          id: s.id,
          schoolName: s.nama,
          kecamatan: s.kecamatan,
          modul: t.m,
          comment: t.c,
          sentiment: t.s,
          date: `2026-08-${String(20 - (idx % 10)).padStart(2, '0')}`
        };
      });

      setTimeout(() => resolve(data), 100);
    });
  },

  getGapFunnelData: async (filters?: { kabupaten?: string; kecamatan?: string }): Promise<FunnelStep[]> => {
    return new Promise((resolve) => {
      const filtered = schoolsData.filter(s => {
        let match = true;
        if (filters?.kabupaten && s.kabupaten !== filters.kabupaten) match = false;
        if (filters?.kecamatan && s.kecamatan !== filters.kecamatan) match = false;
        return match;
      });

      const total = filtered.length;
      const mengisi = filtered.filter(s => s.status === 'sudah' || s.status === 'sebagian').length;
      const memenuhiM1 = Math.round(mengisi * 0.78);
      const memenuhiM2 = Math.round(memenuhiM1 * 0.70);
      const memenuhiM3 = Math.round(memenuhiM2 * 0.62);

      const funnel: FunnelStep[] = [
        { name: 'Total Sasaran Sekolah', schools: total, percentage: 100 },
        { name: 'Mengisi Survei (Aktif)', schools: mengisi, percentage: total > 0 ? Math.round((mengisi / total) * 100) : 0 },
        { name: 'Memenuhi Tahap 1 & 2', schools: memenuhiM1, percentage: total > 0 ? Math.round((memenuhiM1 / total) * 100) : 0 },
        { name: 'Memenuhi Standar Mutu', schools: memenuhiM2, percentage: total > 0 ? Math.round((memenuhiM2 / total) * 100) : 0 },
        { name: 'Lulus Kategori Utama', schools: memenuhiM3, percentage: total > 0 ? Math.round((memenuhiM3 / total) * 100) : 0 },
      ];
      setTimeout(() => resolve(funnel), 100);
    });
  },

  getMatriksKuadranData: async (filters?: { kabupaten?: string; kecamatan?: string }): Promise<MatrixPoint[]> => {
    return new Promise((resolve) => {
      const filtered = schoolsData.filter(s => {
        let match = true;
        if (filters?.kabupaten && s.kabupaten !== filters.kabupaten) match = false;
        if (filters?.kecamatan && s.kecamatan !== filters.kecamatan) match = false;
        return match;
      });

      const points: MatrixPoint[] = filtered.map((s, idx) => {
        let implementation = 0;
        let readiness = 0;
        const seed = (s.npsn ? parseInt(s.npsn) : idx) % 100;

        if (s.status === 'sudah') {
          implementation = 60 + (seed % 35);
          readiness = 65 + (seed % 30);
        } else if (s.status === 'sebagian') {
          implementation = 35 + (seed % 30);
          readiness = 40 + (seed % 35);
        } else {
          implementation = 15 + (seed % 25);
          readiness = 20 + (seed % 30);
        }

        return {
          id: s.id,
          name: s.nama,
          kecamatan: s.kecamatan,
          implementation,
          readiness,
          status: s.status
        };
      });

      setTimeout(() => resolve(points.slice(0, 150)), 100);
    });
  },

  getTantanganData: async (filters?: { kabupaten?: string; kecamatan?: string }): Promise<ChallengeStat[]> => {
    return new Promise((resolve) => {
      const list: ChallengeStat[] = [
        { category: 'Keterbatasan Perangkat Digital / Laptop', count: 348, percentage: 36.8, color: '#E5484D' },
        { category: 'Jaringan Internet Tidak Stabil', count: 236, percentage: 25.0, color: '#F5A623' },
        { category: 'Kurangnya Pelatihan Guru tentang BSAN', count: 155, percentage: 16.4, color: '#4A57C4' },
        { category: 'Bahan Ajar Cetak Belum Lengkap', count: 121, percentage: 12.8, color: '#6C7AE0' },
        { category: 'Kurang Kemitraan dari Orang Tua', count: 85, percentage: 9.0, color: '#2FB344' },
      ];
      setTimeout(() => resolve(list), 100);
    });
  },

  getRecentActivities: async (filters?: { kabupaten?: string; kecamatan?: string }): Promise<{ schoolName: string; status: string; time: string }[]> => {
    return new Promise((resolve) => {
      const filtered = schoolsData.filter(s => {
        let match = true;
        if (filters?.kabupaten && s.kabupaten !== filters.kabupaten) match = false;
        if (filters?.kecamatan && s.kecamatan !== filters.kecamatan) match = false;
        return match;
      });

      const list = filtered
        .filter(s => s.status !== 'belum')
        .slice(0, 5)
        .map((s, idx) => ({
          schoolName: s.nama,
          status: s.status,
          time: `Hari ini, 0${(idx % 8) + 8}:24 WIB`
        }));
      resolve(list);
    });
  },

  getFollowUpList: async (kabupatenFilter?: string): Promise<School[]> => {
    return new Promise((resolve) => {
      const filtered = kabupatenFilter
        ? schoolsData.filter(s => s.kabupaten === kabupatenFilter)
        : schoolsData;

      const list = filtered.filter(s => s.status === 'belum').slice(0, 20);
      resolve(list);
    });
  },

  sendReminder: async (schoolId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });
  },

  getProporsiModulData: async (kabupaten?: string): Promise<ProporsiModulData> => {
    return new Promise((resolve) => {
      const targetKab = kabupaten || 'Kab. Sidoarjo';
      const respondents = respondentsData.filter(r => r.kabupaten === targetKab);
      const totalResponden = respondents.length || (targetKab === 'Kota Batu' ? 273 : targetKab === 'Kab. Tuban' ? 715 : 113);

      const yaCount = respondents.filter(r => r.penerima === 'Ya').length;
      const tidakCount = totalResponden - yaCount;
      const yaPercent = Math.round((yaCount / totalResponden) * 100) || (targetKab === 'Kota Batu' ? 54 : targetKab === 'Kab. Tuban' ? 55 : 37);
      const tidakPercent = 100 - yaPercent;

      // Group distribution per kecamatan
      const kecMap: Record<string, { ya: number; tidak: number; total: number }> = {};
      respondents.forEach(r => {
        if (!r.kecamatan) return;
        if (!kecMap[r.kecamatan]) kecMap[r.kecamatan] = { ya: 0, tidak: 0, total: 0 };
        kecMap[r.kecamatan].total++;
        if (r.penerima === 'Ya') kecMap[r.kecamatan].ya++;
        else kecMap[r.kecamatan].tidak++;
      });

      let distribusiPerKecamatan = Object.keys(kecMap).map(k => {
        const item = kecMap[k];
        const yaP = Math.round((item.ya / item.total) * 100);
        return { kecamatan: k, ya: yaP, tidak: 100 - yaP };
      });

      if (distribusiPerKecamatan.length === 0) {
        // Fallback kecamatan list if empty
        const kecs = targetKab === 'Kota Batu' ? ['Batu', 'Bumiaji', 'Junrejo'] :
                     targetKab === 'Kab. Tuban' ? ['Tuban', 'Jenu', 'Merakurak', 'Semanding', 'Palang', 'Widang', 'Bancar'] :
                     ['Sidoarjo', 'Buduran', 'Candi', 'Porong', 'Krembung', 'Krian', 'Waru', 'Taman'];
        distribusiPerKecamatan = kecs.map((k, i) => ({
          kecamatan: k,
          ya: 45 + (i * 5) % 25,
          tidak: 55 - (i * 5) % 25
        }));
      }

      // Penyelenggara Pelatihan
      const penMap: Record<string, number> = {};
      respondents.forEach(r => {
        if (r.penyelenggara && r.penyelenggara !== '-') {
          const items = r.penyelenggara.split(/[,;]/);
          items.forEach(it => {
            const clean = it.trim();
            if (clean) penMap[clean] = (penMap[clean] || 0) + 1;
          });
        }
      });

      let penyelenggaraPelatihan = Object.keys(penMap).map(k => ({ nama: k, jumlah: penMap[k] })).sort((a, b) => b.jumlah - a.jumlah);
      if (penyelenggaraPelatihan.length === 0) {
        penyelenggaraPelatihan = [
          { nama: 'INOVASI - Dinas Pendidikan', jumlah: Math.round(totalResponden * 0.45) },
          { nama: 'Diseminasi KKG / KKKS', jumlah: Math.round(totalResponden * 0.38) },
          { nama: 'Pelatihan Internal Sekolah', jumlah: Math.round(totalResponden * 0.22) },
          { nama: 'Mandiri / Online Platform', jumlah: Math.round(totalResponden * 0.15) }
        ];
      }

      // Status Implementasi per Posisi
      const posMap: Record<string, { belumMenerima: number; tidakMenerapkan: number; sebagian: number; sudah: number; total: number }> = {};
      respondents.forEach(r => {
        const pos = r.posisi || 'Guru';
        if (!posMap[pos]) posMap[pos] = { belumMenerima: 0, tidakMenerapkan: 0, sebagian: 0, sudah: 0, total: 0 };
        posMap[pos].total++;
        if (r.penerima === 'Tidak') posMap[pos].belumMenerima++;
        else if (r.statusImplementasi === 'sudah') posMap[pos].sudah++;
        else if (r.statusImplementasi === 'sebagian') posMap[pos].sebagian++;
        else posMap[pos].tidakMenerapkan++;
      });

      let statusImplementasiPosisi = Object.keys(posMap).map(p => {
        const item = posMap[p];
        const tot = item.total || 1;
        return {
          posisi: p,
          belumMenerima: Math.round((item.belumMenerima / tot) * 100),
          tidakMenerapkan: Math.round((item.tidakMenerapkan / tot) * 100),
          sebagian: Math.round((item.sebagian / tot) * 100),
          sudah: Math.round((item.sudah / tot) * 100)
        };
      });

      if (statusImplementasiPosisi.length === 0) {
        statusImplementasiPosisi = [
          { posisi: 'Kepala Sekolah', belumMenerima: 15, tidakMenerapkan: 5, sebagian: 30, sudah: 50 },
          { posisi: 'Guru Kelas Awal (1-3)', belumMenerima: 25, tidakMenerapkan: 10, sebagian: 35, sudah: 30 },
          { posisi: 'Guru Kelas Tinggi (4-6)', belumMenerima: 30, tidakMenerapkan: 12, sebagian: 32, sudah: 26 },
          { posisi: 'Guru Mapel', belumMenerima: 40, tidakMenerapkan: 15, sebagian: 28, sudah: 17 }
        ];
      }

      // Status Implementasi per Kecamatan
      const kecImplMap: Record<string, { belumMenerima: number; tidakMenerapkan: number; sebagian: number; sudah: number; total: number }> = {};
      respondents.forEach(r => {
        if (!r.kecamatan) return;
        if (!kecImplMap[r.kecamatan]) kecImplMap[r.kecamatan] = { belumMenerima: 0, tidakMenerapkan: 0, sebagian: 0, sudah: 0, total: 0 };
        kecImplMap[r.kecamatan].total++;
        if (r.penerima === 'Tidak') kecImplMap[r.kecamatan].belumMenerima++;
        else if (r.statusImplementasi === 'sudah') kecImplMap[r.kecamatan].sudah++;
        else if (r.statusImplementasi === 'sebagian') kecImplMap[r.kecamatan].sebagian++;
        else kecImplMap[r.kecamatan].tidakMenerapkan++;
      });

      let statusImplementasiKecamatan = Object.keys(kecImplMap).map(k => {
        const item = kecImplMap[k];
        const tot = item.total || 1;
        return {
          kecamatan: k,
          belumMenerima: Math.round((item.belumMenerima / tot) * 100),
          tidakMenerapkan: Math.round((item.tidakMenerapkan / tot) * 100),
          sebagian: Math.round((item.sebagian / tot) * 100),
          sudah: Math.round((item.sudah / tot) * 100)
        };
      });

      if (statusImplementasiKecamatan.length === 0) {
        statusImplementasiKecamatan = distribusiPerKecamatan.map((d, i) => ({
          kecamatan: d.kecamatan,
          belumMenerima: d.tidak,
          tidakMenerapkan: 10,
          sebagian: 30 + (i * 3) % 15,
          sudah: Math.max(0, d.ya - 10 - ((i * 3) % 15))
        }));
      }

      const data: ProporsiModulData = {
        proporsiPenerima: { ya: yaPercent, tidak: tidakPercent, totalResponden },
        distribusiPerKecamatan,
        penyelenggaraPelatihan,
        statusImplementasiPosisi,
        statusImplementasiKecamatan,
        kemudahanModul: {
          kelasAwal: {
            mudah: [
              { modul: 'Alur 1: Tema 1-5 (Tubuhku & Karakter)', persen: 72 },
              { modul: 'Alur 2: Tema 6-7 (Keunikan & Emosi)', persen: 65 },
              { modul: 'Alur 3: Tema 8-10 (Jaga Diri & Literasi)', persen: 58 },
            ],
            sulit: [
              { modul: 'Alur 1: Tema 1-5 (Tubuhku & Karakter)', persen: 28 },
              { modul: 'Alur 2: Tema 6-7 (Keunikan & Emosi)', persen: 35 },
              { modul: 'Alur 3: Tema 8-10 (Jaga Diri & Literasi)', persen: 42 },
            ],
          },
          kelasTinggi: {
            mudah: [
              { modul: 'Alur 1: Tema 1-4 (Perasaan & Afirmasi)', persen: 68 },
              { modul: 'Alur 2: Tema 5-9 (Persahabatan & Tanggung Jawab)', persen: 62 },
              { modul: 'Alur 3: Tema 10-12 (Kampanye & Refleksi)', persen: 54 },
            ],
            sulit: [
              { modul: 'Alur 1: Tema 1-4 (Perasaan & Afirmasi)', persen: 32 },
              { modul: 'Alur 2: Tema 5-9 (Persahabatan & Tanggung Jawab)', persen: 38 },
              { modul: 'Alur 3: Tema 10-12 (Kampanye & Refleksi)', persen: 46 },
            ],
          },
        },
        mediaPembelajaran: {
          kelasAwal: [
            { media: 'Kartu Afirmasi Positif & Emosi', persen: 82 },
            { media: 'Video & LKPD Interaktif', persen: 74 },
            { media: 'Poster Menjaga Diri & Area Pribadi', persen: 68 },
            { media: 'Papan Ular Tangga & Puzzle Tubuhku', persen: 56 },
            { media: 'Stiker Emoji & Roda Emosi', persen: 48 },
          ],
          kelasTinggi: [
            { media: 'Peta Tubuh & Kartu Cerita', persen: 78 },
            { media: 'Video & Media Gambar', persen: 72 },
            { media: 'Kartu Berhenti, Berpikir & Bertindak', persen: 64 },
            { media: 'Poster Hak Anak & Kampanye', persen: 58 },
            { media: 'Buku Cerita & Stiker Pembaca', persen: 45 },
          ],
        },
        keterlibatanSiswa: [
          { kategori: 'Sangat Aktif (>70% partisipasi)', persen: 38, jumlah: Math.round(totalResponden * 0.38) },
          { kategori: 'Aktif (50-70% partisipasi)', persen: 42, jumlah: Math.round(totalResponden * 0.42) },
          { kategori: 'Kurang Aktif (<50% partisipasi)', persen: 20, jumlah: Math.round(totalResponden * 0.20) },
        ],
        refleksiGuru: [
          'Siswa menjadi jauh lebih terbuka menyampaikan emosi dan perasaan setelah penerapan media Kartu Roda Emosi.',
          'Pembiasaan kesepakatan kelas terbukti menekan angka perundungan verbal di kalangan siswa.',
          'Diperlukan pendampingan berkala bagi sekolah yang belum mengimplementasikan modul secara penuh.',
          'Refleksi rutin antara guru dan kepala sekolah meningkatkan kesepahaman strategi manajemen kelas aman.',
        ],
        dukunganKepsek: [
          { metode: 'Memimpin Refleksi Guru Berkala', jumlah: Math.round(totalResponden * 0.65) },
          { metode: 'Sosialisasi BSAN ke Wali Murid', jumlah: Math.round(totalResponden * 0.58) },
          { metode: 'Membangun Kolaborasi Pihak Luar', jumlah: Math.round(totalResponden * 0.45) },
          { metode: 'Integrasi Kurikulum BSAN', jumlah: Math.round(totalResponden * 0.40) },
        ],
        rencanaAksi: [
          { program: 'Menyusun SOP Pencegahan Kekerasan', jumlah: Math.round(totalResponden * 0.72) },
          { program: 'Membentuk Tim TPKK Sekolah', jumlah: Math.round(totalResponden * 0.68) },
          { program: 'Program Pembiasaan Karakter Harian', jumlah: Math.round(totalResponden * 0.62) },
          { program: 'Kotak Aduan & Poster Sekolah Aman', jumlah: Math.round(totalResponden * 0.55) },
        ],
        kondisiFasilitas: distribusiPerKecamatan.map((d, i) => ({
          kecamatan: d.kecamatan,
          baik: 70 + (i * 4) % 20,
          cukup: 15 + (i * 2) % 10,
          rusak: 15 - (i * 3) % 10
        })),
        rasioGuruSiswa: distribusiPerKecamatan.map((d, i) => ({
          kecamatan: d.kecamatan,
          rasio: 18 + (i * 3) % 12
        })),
        kelayakanRuangKelas: distribusiPerKecamatan.map((d, i) => ({
          kecamatan: d.kecamatan,
          rombel: 60 + i * 10,
          kelasLayak: Math.round((60 + i * 10) * (0.85 + (i % 3) * 0.04)),
          persentase: Math.round(85 + (i % 3) * 4)
        }))
      };

      setTimeout(() => resolve(data), 100);
    });
  },

  getRadarBenchmarkingData: async (schoolId: string): Promise<RadarPoint[]> => {
    return new Promise((resolve) => {
      const data: RadarPoint[] = [
        { subject: 'Literasi & Numerasi', sekolah: 85, kecamatan: 65, fullMark: 100 },
        { subject: 'Karakter', sekolah: 70, kecamatan: 75, fullMark: 100 },
        { subject: 'Kepemimpinan', sekolah: 90, kecamatan: 60, fullMark: 100 },
        { subject: 'Lingkungan', sekolah: 60, kecamatan: 80, fullMark: 100 },
        { subject: 'Kemitraan', sekolah: 80, kecamatan: 50, fullMark: 100 },
      ];
      setTimeout(() => resolve(data), 100);
    });
  }
};
