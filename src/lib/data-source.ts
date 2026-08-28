import realSchoolsData from './real-schools.json';

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
      const filtered = schoolsData.filter(s => {
        let match = true;
        if (filters?.kabupaten && s.kabupaten !== filters.kabupaten) match = false;
        if (filters?.kecamatan && s.kecamatan !== filters.kecamatan) match = false;
        return match;
      });
      
      const total = filtered.length || 1;
      const sudahCount = filtered.filter(s => s.status === 'sudah').length;
      const rate = Math.round((sudahCount / total) * 100);

      const progressList: ModulProgress[] = [
        { id: 'm1', nama: 'Modul 1: Literasi & Numerasi', progres: Math.min(100, rate + 18), totalPertanyaan: 12, terisi: 10 },
        { id: 'm2', nama: 'Modul 2: Pengembangan Karakter', progres: Math.min(100, rate + 10), totalPertanyaan: 15, terisi: 11 },
        { id: 'm3', nama: 'Modul 3: Kepemimpinan Instruksional', progres: Math.min(100, rate + 4), totalPertanyaan: 10, terisi: 6 },
        { id: 'm4', nama: 'Modul 4: Lingkungan Belajar', progres: Math.max(20, rate - 8), totalPertanyaan: 8, terisi: 4 },
        { id: 'm5', nama: 'Modul 5: Kemitraan Orang Tua', progres: Math.max(15, rate - 15), totalPertanyaan: 10, terisi: 3 },
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


  getRadarBenchmarkingData: async (schoolId: string): Promise<RadarPoint[]> => {
    return new Promise((resolve) => {
      // Mock radar data comparing a school to its district average
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
