import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { database, KECAMATAN_LIST } from '../lib/data-source';
import { Search, Filter, ChevronLeft, ChevronRight, Send, Users, Check, X, Download, Eye, Building2 } from 'lucide-react';

interface DataRespondenProps {
  activeKecamatan: string | null;
  setActiveKecamatan: (kec: string | null) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

interface School {
  id: string;
  npsn: string;
  nama: string;
  kecamatan: string;
  kabupaten: string;
  status: string;
  akreditasi: string;
  lastUpdated?: string;
  alamat?: string;
  totalSiswa?: number;
  totalGuru?: number;
  telepon?: string;
  email?: string;
}

export default function DataResponden({ activeKecamatan, setActiveKecamatan, searchTerm, onSearchChange }: DataRespondenProps) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [remindedSchools, setRemindedSchools] = useState<Record<string, boolean>>({});
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [activeModalTab, setActiveModalTab] = useState('modul1');
  const perPage = 15;

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools', activeKecamatan, statusFilter, searchTerm],
    queryFn: () => database.getSchools({
      kecamatan: activeKecamatan || undefined,
      status: statusFilter || undefined,
      search: searchTerm || undefined,
    }),
  });

  const totalPages = Math.max(1, Math.ceil(schools.length / perPage));
  const paged = schools.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setCurrentPage(1);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      sudah: { label: 'Lengkap', cls: 'bg-status-sudah/10 text-status-sudah' },
      sebagian: { label: 'Sebagian', cls: 'bg-status-sebagian/10 text-status-sebagian' },
      belum: { label: 'Belum Mengisi', cls: 'bg-status-belum/10 text-status-belum' },
    };
    const s = map[status] || map.belum;
    return <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${s.cls}`}>{s.label}</span>;
  };

  const getPageRange = () => {
    const range: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  // Mock answers generator for single school export & preview
  const generateMockAnswers = (sch: School) => {
    return [
      {
        tabId: 'modul1',
        title: 'Modul 1: Literasi & Numerasi',
        questions: [
          { q: 'Apakah sekolah melakukan refleksi berkala terhadap metode pembelajaran?', a: 'Ya, rutin setiap bulan melalui rapat guru kelas.' },
          { q: 'Jenis media pembelajaran yang paling sering digunakan dalam kelas awal:', a: 'Alat Peraga Fisik & Manipulatif' }
        ]
      },
      {
        tabId: 'modul2',
        title: 'Modul 2: Pengembangan Karakter',
        questions: [
          { q: 'Bagaimana keterlaksanaan Projek Penguatan Profil Pelajar Pancasila (P5)?', a: 'Sangat baik, 3 projek per tahun bertema kearifan lokal.' },
          { q: 'Apakah sekolah menerapkan program pembiasaan disiplin positif harian?', a: 'Ya, terintegrasi di seluruh kelas dengan pembiasaan budaya 5S.' }
        ]
      },
      {
        tabId: 'modul3',
        title: 'Modul 3: Kepemimpinan Instruksional',
        questions: [
          { q: 'Bagaimana frekuensi kepala sekolah melakukan supervisi akademik klinis ke guru?', a: 'Cukup (1-2 kali per semester)' }
        ]
      },
      {
        tabId: 'modul4',
        title: 'Modul 4: Lingkungan Belajar',
        questions: [
          { q: 'Bagaimana rata-rata kondisi fisik ruang kelas di sekolah?', a: 'Sangat Baik & Kondusif' }
        ]
      },
      {
        tabId: 'modul5',
        title: 'Modul 5: Kemitraan Orang Tua',
        questions: [
          { q: 'Apakah sekolah rutin mengadakan forum komunikasi dengan Komite / Wali Murid?', a: 'Ya, berkala setiap bagi rapor / bulanan' }
        ]
      }
    ];
  };

  const handleExportSingleCSV = (sch: School) => {
    const modules = generateMockAnswers(sch);
    const headers = 'Modul,Pertanyaan,Jawaban\n';
    let rows = '';
    modules.forEach(m => {
      m.questions.forEach(q => {
        rows += `"${m.title}","${q.q}","${q.a}"\n`;
      });
    });
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hasil_Survei_BSAN_${sch.nama.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header + Filters */}
      <div className="rounded-2xl bg-surface p-6 shadow-card border border-border animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold font-display text-text-primary">Data Responden Survei</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Daftar sekolah sasaran beserta status pengisian instrumen BSAN.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-text-primary">{schools.length} sekolah</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama sekolah atau NPSN..."
              value={searchTerm}
              onChange={(e) => { onSearchChange(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-xl border border-border bg-bg/60 py-2.5 pl-9 pr-4 text-sm text-text-primary placeholder-text-secondary/60 focus:border-primary/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/10 transition-smooth"
            />
          </div>
          <div className="relative">
            <select
              value={activeKecamatan || ''}
              onChange={(e) => handleFilterChange(v => setActiveKecamatan(v || null))(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-bg/60 px-3 py-2.5 pr-8 text-sm text-text-primary focus:border-primary/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/10 transition-smooth"
            >
              <option value="">Semua Kecamatan</option>
              {KECAMATAN_LIST.map((k) => <option key={k} value={`Kec. ${k}`}>Kec. {k}</option>)}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-bg/60 px-3 py-2.5 pr-8 text-sm text-text-primary focus:border-primary/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/10 transition-smooth"
            >
              <option value="">Semua Status</option>
              <option value="sudah">Sudah Mengisi</option>
              <option value="sebagian">Sebagian Mengisi</option>
              <option value="belum">Belum Mengisi</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface shadow-card border border-border overflow-hidden animate-fade-in-up delay-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/60 border-b border-border">
                <th className="text-left py-3.5 px-5 text-[10px] font-bold text-text-secondary uppercase tracking-wider">NPSN</th>
                <th className="text-left py-3.5 px-5 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Nama Sekolah</th>
                <th className="text-left py-3.5 px-5 text-[10px] font-bold text-text-secondary uppercase tracking-wider hidden md:table-cell">Kecamatan</th>
                <th className="text-left py-3.5 px-5 text-[10px] font-bold text-text-secondary uppercase tracking-wider hidden lg:table-cell">Akreditasi</th>
                <th className="text-center py-3.5 px-5 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="text-center py-3.5 px-5 text-[10px] font-bold text-text-secondary uppercase tracking-wider hidden lg:table-cell">Terakhir</th>
                <th className="text-center py-3.5 px-5 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-text-secondary animate-pulse">Memuat data...</td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-text-secondary">Tidak ditemukan sekolah.</td>
                </tr>
              ) : (
                paged.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-border/40 table-row-hover animate-fade-in-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="py-3 px-5 font-mono text-xs font-semibold text-primary">{s.npsn}</td>
                    <td className="py-3 px-5">
                      <p className="font-semibold text-text-primary text-xs truncate max-w-[200px]">{s.nama}</p>
                    </td>
                    <td className="py-3 px-5 text-xs text-text-secondary hidden md:table-cell">{s.kecamatan}</td>
                    <td className="py-3 px-5 text-xs text-text-secondary hidden lg:table-cell">{s.akreditasi}</td>
                    <td className="py-3 px-5 text-center">{statusBadge(s.status)}</td>
                    <td className="py-3 px-5 text-[10px] text-text-secondary text-center hidden lg:table-cell">
                      {s.lastUpdated ? new Date(s.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'N/A'}
                    </td>
                    <td className="py-3 px-5 text-center">
                      {s.status === 'belum' ? (
                        remindedSchools[s.id] ? (
                          <span className="inline-flex items-center space-x-1 rounded-lg bg-status-sudah/10 text-status-sudah px-2.5 py-1.5 text-[10px] font-bold">
                            <Check className="h-3 w-3" />
                            <span>Sudah Terkirim</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setRemindedSchools(p => ({ ...p, [s.id]: true }))}
                            className="inline-flex items-center space-x-1 rounded-lg bg-primary/8 hover:bg-primary text-primary hover:text-white px-2.5 py-1.5 text-[10px] font-bold transition-smooth active:scale-95 cursor-pointer"
                          >
                            <Send className="h-3 w-3" />
                            <span>Kirim Reminder</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => { setSelectedSchool(s); setActiveModalTab('modul1'); }}
                          className="inline-flex items-center space-x-1.5 rounded-lg bg-accent/8 hover:bg-accent hover:text-white text-accent px-2.5 py-1.5 text-[10px] font-bold transition-smooth active:scale-95 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Lihat Jawaban</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/50 bg-bg/30">
            <p className="text-[10px] text-text-secondary font-medium">
              Hal. {currentPage} dari {totalPages} ({schools.length} total)
            </p>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-bg disabled:opacity-30 transition-smooth"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {getPageRange().map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition-smooth ${
                    currentPage === p ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-bg'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-bg disabled:opacity-30 transition-smooth"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Answer Preview Modal Dialog */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-3xl w-full border border-border flex flex-col h-[85vh] animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border bg-bg/50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm">{selectedSchool.nama}</h3>
                  <p className="text-[10px] text-text-secondary font-medium">NPSN: {selectedSchool.npsn} • {selectedSchool.kecamatan}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-border/40 transition-smooth"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Tabs Navigation */}
            <div className="flex overflow-x-auto space-x-1.5 px-5 py-2.5 bg-bg/20 border-b border-border">
              {[
                { id: 'modul1', label: 'Modul 1' },
                { id: 'modul2', label: 'Modul 2' },
                { id: 'modul3', label: 'Modul 3' },
                { id: 'modul4', label: 'Modul 4' },
                { id: 'modul5', label: 'Modul 5' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-smooth ${
                    activeModalTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:bg-bg'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-bg/10">
              {generateMockAnswers(selectedSchool)
                .filter(m => m.tabId === activeModalTab)
                .map((m) => (
                  <div key={m.tabId} className="space-y-4">
                    <h4 className="font-bold text-xs text-primary uppercase tracking-wider">{m.title}</h4>
                    <div className="space-y-3.5">
                      {m.questions.map((q, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-surface border border-border/80 space-y-2">
                          <p className="font-semibold text-text-primary text-xs flex items-start space-x-2">
                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{q.q}</span>
                          </p>
                          <div className="p-3 bg-bg/40 rounded-lg border border-border/50 text-[11px] text-text-primary leading-relaxed whitespace-pre-wrap font-medium">
                            {q.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-border bg-bg/30 flex justify-end space-x-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedSchool(null)}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-text-secondary text-xs font-semibold hover:bg-bg transition-smooth"
              >
                Tutup
              </button>
              <button
                onClick={() => handleExportSingleCSV(selectedSchool)}
                className="flex items-center space-x-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white px-4 py-2 text-xs font-bold shadow-md transition-smooth active:scale-95 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Ekspor Jawaban CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
