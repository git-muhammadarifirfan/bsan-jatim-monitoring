import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { database, KABUPATEN_LIST } from '../lib/data-source';
import { CheckCircle2, Layers, BarChart3, ChevronDown } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

export default function ModulBsan() {
  const [activeTab, setActiveTab] = useState('m1');
  const [kabupaten, setKabupaten] = useState('Kab. Sidoarjo');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: progressList = [] } = useQuery({
    queryKey: ['modulProgress', kabupaten],
    queryFn: () => database.getModulProgress({ kabupaten }),
  });

  const moduleDetails: Record<string, {
    title: string;
    questions: { question: string; options: { label: string; count: number; percentage: number; color: string }[] }[];
  }> = {
    m1: {
      title: 'Modul 1: Literasi & Numerasi',
      questions: [
        {
          question: 'Apakah sekolah sudah menerima dan menyosialisasikan materi Modul 1 (Literasi & Numerasi)?',
          options: [
            { label: 'Ya, sudah terlaksana secara menyeluruh', count: 185, percentage: 62.5, color: 'var(--status-sudah)' },
            { label: 'Sebagian guru / temporer', count: 82, percentage: 27.7, color: 'var(--status-sebagian)' },
            { label: 'Belum sosialisasi', count: 29, percentage: 9.8, color: 'var(--status-belum)' },
          ],
        },
        {
          question: 'Jenis media pembelajaran yang paling sering digunakan dalam kelas awal:',
          options: [
            { label: 'Kartu Afirmasi & Roda Emosi', count: 142, percentage: 48.0, color: 'var(--color-primary)' },
            { label: 'Alat Peraga Manipulatif & Puzzle', count: 98, percentage: 33.1, color: 'var(--color-accent)' },
            { label: 'Video & Buku Cerita Digital', count: 56, percentage: 18.9, color: 'var(--status-sebagian)' },
          ],
        },
      ],
    },
    m2: {
      title: 'Modul 2: Pengembangan Karakter',
      questions: [
        {
          question: 'Bagaimana keterlaksanaan Projek Penguatan Profil Pelajar Pancasila (P5) & Karakter?',
          options: [
            { label: 'Sangat baik, terintegrasi di seluruh kelas', count: 172, percentage: 58.1, color: 'var(--status-sudah)' },
            { label: 'Cukup, 1-2 projek per tahun', count: 95, percentage: 32.1, color: 'var(--status-sebagian)' },
            { label: 'Belum terlaksana secara terstruktur', count: 29, percentage: 9.8, color: 'var(--status-belum)' },
          ],
        },
        {
          question: 'Apakah sekolah menerapkan kesepakatan kelas dan budaya disiplin positif harian?',
          options: [
            { label: 'Ya, disusun guru bersama murid', count: 210, percentage: 70.9, color: 'var(--status-sudah)' },
            { label: 'Ya, hanya disiapkan oleh guru', count: 68, percentage: 23.0, color: 'var(--status-sebagian)' },
            { label: 'Belum disusun kesepakatan', count: 18, percentage: 6.1, color: 'var(--status-belum)' },
          ],
        },
      ],
    },
    m3: {
      title: 'Modul 3: Kepemimpinan Instruksional',
      questions: [
        {
          question: 'Bagaimana frekuensi kepala sekolah melakukan supervisi & refleksi bersama guru?',
          options: [
            { label: 'Rutin memimpin refleksi & observasi kelas', count: 165, percentage: 55.7, color: 'var(--color-primary)' },
            { label: 'Cukup (1-2 kali per semester)', count: 98, percentage: 33.1, color: 'var(--status-sudah)' },
            { label: 'Belum terlaksana rutin', count: 33, percentage: 11.2, color: 'var(--status-belum)' },
          ],
        },
      ],
    },
    m4: {
      title: 'Modul 4: Lingkungan Belajar',
      questions: [
        {
          question: 'Bagaimana rata-rata iklim keamanan & kondisi fisik ruang kelas di sekolah?',
          options: [
            { label: 'Sangat Kondusif & Bebas Kekerasan', count: 158, percentage: 53.4, color: 'var(--status-sudah)' },
            { label: 'Layak dengan sedikit perbaikan fasilitas', count: 112, percentage: 37.8, color: 'var(--status-sebagian)' },
            { label: 'Membutuhkan intervensi fasilitas cepat', count: 26, percentage: 8.8, color: 'var(--status-belum)' },
          ],
        },
      ],
    },
    m5: {
      title: 'Modul 5: Kemitraan Orang Tua',
      questions: [
        {
          question: 'Apakah sekolah rutin mengadakan sosialisasi & forum komunikasi BSAN dengan Wali Murid?',
          options: [
            { label: 'Ya, berkala setiap bagi rapor / bulanan', count: 188, percentage: 63.5, color: 'var(--status-sudah)' },
            { label: 'Hanya jika ada insiden / kebutuhan mendesak', count: 84, percentage: 28.4, color: 'var(--status-sebagian)' },
            { label: 'Belum pernah diselenggarakan', count: 24, percentage: 8.1, color: 'var(--status-belum)' },
          ],
        },
      ],
    },
  };

  const activeModule = moduleDetails[activeTab] || moduleDetails.m1;
  const activeProg = progressList.find((p) => p.id === activeTab)?.progres || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-surface p-6 shadow-card border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary">Breakdown Hasil Per Modul BSAN</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Analisis detail jawaban terstruktur responden berdasarkan modul instrumen survei real.
          </p>
        </div>

        {/* Kabupaten filter */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-bg border border-border text-xs font-bold text-text-primary hover:border-primary/40 transition-all cursor-pointer min-w-[200px]"
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: KABUPATEN_LIST.find(k => k.id === kabupaten)?.color || 'var(--color-primary)' }} />
            <span>{kabupaten}</span>
            <ChevronDown className={`h-4 w-4 ml-auto text-text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-30 w-full rounded-xl bg-surface border border-border shadow-card-hover py-1.5">
              {KABUPATEN_LIST.map((k) => (
                <button
                  key={k.id}
                  onClick={() => { setKabupaten(k.id); setDropdownOpen(false); }}
                  className={`flex items-center gap-2.5 w-full px-4 py-2 text-xs text-left font-semibold transition-all cursor-pointer ${
                    kabupaten === k.id ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-bg hover:text-text-primary'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: k.color }} />
                  {k.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-1 custom-scrollbar">
        {progressList.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveTab(mod.id)}
            className={`flex-shrink-0 flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold border transition-all cursor-pointer ${activeTab === mod.id
                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-102'
                : 'bg-surface text-text-secondary border-border hover:bg-bg hover:text-text-primary'
              }`}
          >
            <span>{mod.nama.split(':')[0]}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-md font-bold ${activeTab === mod.id ? 'bg-white/20 text-white' : 'bg-bg text-text-secondary'
              }`}>
              <AnimatedCounter value={mod.progres} suffix="%" />
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stats sidebar */}
        <div className="lg:col-span-1 rounded-2xl bg-surface p-6 shadow-card border border-border h-fit space-y-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Detail Modul</span>
            </div>
            <h3 className="text-base font-bold text-text-primary font-display">{activeModule.title}</h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-bg/60 border border-border/40 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Progres Penerapan Modul</p>
                <p className="text-2xl font-bold text-text-primary mt-0.5 font-display">
                  <AnimatedCounter key={`stat-${activeTab}-${kabupaten}`} value={activeProg} suffix="%" />
                </p>
              </div>
              <CheckCircle2 className="h-7 w-7 text-accent" />
            </div>
            <div className="p-4 rounded-xl bg-bg/60 border border-border/40 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Wilayah Survei</p>
                <p className="text-base font-bold text-text-primary mt-0.5">
                  {kabupaten}
                </p>
              </div>
              <Layers className="h-7 w-7 text-primary" />
            </div>
          </div>
        </div>

        {/* Questions breakdown */}
        <div key={`questions-tab-${activeTab}-${kabupaten}`} className="lg:col-span-2 space-y-5">
          {activeModule.questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="rounded-2xl bg-surface p-6 shadow-card border border-border space-y-4"
            >
              <div className="flex items-start space-x-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary mt-0.5">
                  {qIdx + 1}
                </span>
                <h4 className="font-bold text-text-primary text-sm leading-snug">{q.question}</h4>
              </div>

              <div className="space-y-3.5 pl-10">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">{opt.label}</span>
                      <span className="text-text-secondary font-bold font-display">
                        <AnimatedCounter key={`opt-${activeTab}-${qIdx}-${oIdx}-${kabupaten}`} value={opt.percentage} decimals={1} suffix="%" />
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-bg overflow-hidden">
                      <div
                        key={`bar-fill-${activeTab}-${qIdx}-${oIdx}-${kabupaten}`}
                        className="h-full rounded-full progress-bar-fill"
                        style={{ width: `${opt.percentage}%`, backgroundColor: opt.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
