import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { database } from '../lib/data-source';
import { CheckCircle2, Layers, BarChart3 } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

export default function ModulBsan() {
  const [activeTab, setActiveTab] = useState('m1');

  const { data: progressList = [] } = useQuery({
    queryKey: ['modulProgress'],
    queryFn: () => database.getModulProgress(),
  });

  const moduleDetails: Record<string, {
    title: string;
    questions: { question: string; options: { label: string; count: number; percentage: number; color: string }[] }[];
  }> = {
    m1: {
      title: 'Modul 1: Literasi & Numerasi',
      questions: [
        {
          question: 'Apakah sekolah melakukan refleksi berkala terhadap metode pembelajaran literasi?',
          options: [
            { label: 'Ya, rutin setiap bulan', count: 72, percentage: 63.2, color: 'var(--status-sudah)' },
            { label: 'Kadang-kadang / Tidak terjadwal', count: 32, percentage: 28.1, color: 'var(--status-sebagian)' },
            { label: 'Belum pernah dilakukan', count: 10, percentage: 8.7, color: 'var(--status-belum)' },
          ],
        },
        {
          question: 'Jenis media pembelajaran yang paling sering digunakan dalam kelas awal:',
          options: [
            { label: 'Buku Cetak / LKS Tradisional', count: 58, percentage: 50.9, color: 'var(--color-primary)' },
            { label: 'Alat Peraga Fisik & Manipulatif', count: 38, percentage: 33.3, color: 'var(--color-accent)' },
            { label: 'Aplikasi Digital / Video Interaktif', count: 18, percentage: 15.8, color: 'var(--status-sebagian)' },
          ],
        },
      ],
    },
    m2: {
      title: 'Modul 2: Pengembangan Karakter',
      questions: [
        {
          question: 'Bagaimana keterlaksanaan Projek Penguatan Profil Pelajar Pancasila (P5)?',
          options: [
            { label: 'Sangat baik, 3+ projek per tahun', count: 62, percentage: 54.4, color: 'var(--status-sudah)' },
            { label: 'Cukup, 1-2 projek per tahun', count: 42, percentage: 36.8, color: 'var(--status-sebagian)' },
            { label: 'Belum terlaksana secara terstruktur', count: 10, percentage: 8.8, color: 'var(--status-belum)' },
          ],
        },
        {
          question: 'Apakah sekolah menerapkan program pembiasaan disiplin positif harian?',
          options: [
            { label: 'Ya, terintegrasi di seluruh kelas', count: 80, percentage: 70.2, color: 'var(--status-sudah)' },
            { label: 'Ya, hanya sebagian kelas / temporer', count: 28, percentage: 24.6, color: 'var(--status-sebagian)' },
            { label: 'Belum diterapkan', count: 6, percentage: 5.2, color: 'var(--status-belum)' },
          ],
        },
      ],
    },
    m3: {
      title: 'Modul 3: Kepemimpinan Instruksional',
      questions: [
        {
          question: 'Bagaimana frekuensi kepala sekolah melakukan supervisi akademik klinis ke guru?',
          options: [
            { label: 'Sangat sering (Setiap minggu)', count: 25, percentage: 21.9, color: 'var(--color-primary)' },
            { label: 'Cukup (1-2 kali per semester)', count: 70, percentage: 61.4, color: 'var(--status-sudah)' },
            { label: 'Jarang / Hanya jika dibutuhkan', count: 19, percentage: 16.7, color: 'var(--status-belum)' },
          ],
        },
      ],
    },
    m4: {
      title: 'Modul 4: Lingkungan Belajar',
      questions: [
        {
          question: 'Bagaimana rata-rata kondisi fisik ruang kelas di sekolah?',
          options: [
            { label: 'Sangat Baik & Kondusif', count: 48, percentage: 42.1, color: 'var(--status-sudah)' },
            { label: 'Layak dengan sedikit perbaikan', count: 52, percentage: 45.6, color: 'var(--status-sebagian)' },
            { label: 'Banyak kerusakan (tidak kondusif)', count: 14, percentage: 12.3, color: 'var(--status-belum)' },
          ],
        },
      ],
    },
    m5: {
      title: 'Modul 5: Kemitraan Orang Tua',
      questions: [
        {
          question: 'Apakah sekolah rutin mengadakan forum komunikasi dengan Komite / Wali Murid?',
          options: [
            { label: 'Ya, berkala setiap bagi rapor / bulanan', count: 85, percentage: 74.6, color: 'var(--status-sudah)' },
            { label: 'Hanya jika ada insiden / kebutuhan mendesak', count: 22, percentage: 19.3, color: 'var(--status-sebagian)' },
            { label: 'Tidak pernah diselenggarakan', count: 7, percentage: 6.1, color: 'var(--status-belum)' },
          ],
        },
      ],
    },
  };

  const activeModule = moduleDetails[activeTab] || moduleDetails.m1;
  const activeProg = progressList.find((p) => p.id === activeTab)?.progres || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-surface p-6 shadow-card border border-border">
        <h2 className="text-lg font-bold font-display text-text-primary">Breakdown Hasil Per Modul BSAN</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Analisis detail jawaban terstruktur sekolah responden berdasarkan modul instrumen survei.
        </p>
      </div>

      {/* Module Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-1">
        {progressList.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveTab(mod.id)}
            className={`flex-shrink-0 flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-smooth cursor-pointer ${activeTab === mod.id
                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                : 'bg-surface text-text-secondary border-border hover:bg-bg hover:text-text-primary'
              }`}
          >
            <span>{mod.nama.split(':')[0]}</span>
            <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-bold ${activeTab === mod.id ? 'bg-white/20 text-white' : 'bg-bg text-text-secondary'
              }`}>
              <AnimatedCounter value={mod.progres} suffix="%" />
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Stats sidebar */}
        <div className="lg:col-span-1 rounded-2xl bg-surface p-6 shadow-card border border-border h-fit space-y-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Detail Modul</span>
            </div>
            <h3 className="text-sm font-bold text-text-primary font-display">{activeModule.title}</h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-bg/60 border border-border/40 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-text-secondary font-medium">Progres Isian Modul</p>
                <p className="text-xl font-bold text-text-primary mt-0.5">
                  <AnimatedCounter key={`stat-${activeTab}`} value={activeProg} suffix="%" />
                </p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <div className="p-4 rounded-xl bg-bg/60 border border-border/40 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-text-secondary font-medium">Responden Selesai</p>
                <p className="text-xl font-bold text-text-primary mt-0.5">
                  <AnimatedCounter key={`count-${activeTab}`} value={114} suffix=" SD" />
                </p>
              </div>
              <Layers className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Questions breakdown */}
        <div key={`questions-tab-${activeTab}`} className="lg:col-span-2 space-y-5">
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

              <div className="space-y-3 pl-10">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-text-primary">{opt.label}</span>
                      <span className="text-text-secondary font-semibold">
                        {opt.count} Sekolah (<AnimatedCounter key={`opt-${activeTab}-${qIdx}-${oIdx}`} value={opt.percentage} decimals={1} suffix="%" />)
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-bg overflow-hidden">
                      <div
                        key={`bar-fill-${activeTab}-${qIdx}-${oIdx}`}
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
