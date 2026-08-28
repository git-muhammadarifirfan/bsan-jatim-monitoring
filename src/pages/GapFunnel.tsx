import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { database, KABUPATEN_LIST } from '../lib/data-source';
import { Filter, Layers, HelpCircle, ArrowDownRight, CheckCircle, AlertCircle, Info } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

interface GapFunnelProps {
  activeKecamatan: string | null;
}

export default function GapFunnel({ activeKecamatan }: GapFunnelProps) {
  const [selectedKab, setSelectedKab] = useState<string>('');
  const [selectedKec, setSelectedKec] = useState<string>('');

  const { data: funnelSteps = [], isLoading } = useQuery({
    queryKey: ['funnelData', selectedKab, selectedKec, activeKecamatan],
    queryFn: () => database.getGapFunnelData({ kabupaten: selectedKab || undefined, kecamatan: selectedKec || activeKecamatan || undefined })
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-surface p-6 shadow-card border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary">Analisis Gap Funnel Implementasi BSAN</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Memonitor konversi & rasio penyusutan (drop-off) dari total sasaran sekolah hingga kriteria mutu utama.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Kabupaten Filter */}
          <select
            value={selectedKab}
            onChange={(e) => { setSelectedKab(e.target.value); setSelectedKec(''); }}
            className="rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none transition-smooth"
          >
            <option value="">Semua Wilayah</option>
            {KABUPATEN_LIST.map(k => <option key={k.id} value={k.name}>{k.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Funnel Chart Card */}
        <div className="lg:col-span-2 rounded-2xl bg-surface p-6 shadow-card border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-base font-bold text-text-primary font-display flex items-center space-x-2">
              <Layers className="h-5 w-5 text-primary" />
              <span>Diagram Corong Konversi (Gap Funnel)</span>
            </h3>
            <span className="text-xs font-semibold text-text-secondary">
              Target: 1.238 SD
            </span>
          </div>

          {isLoading ? (
            <div className="h-80 flex items-center justify-center text-sm text-text-secondary animate-pulse">
              Memuat data corong...
            </div>
          ) : (
            <div key={`funnel-${selectedKab}-${selectedKec}`} className="space-y-4 pt-2">
              {funnelSteps.map((step, idx) => {
                const widthPercent = Math.max(35, 100 - idx * 14);
                const prevStep = idx > 0 ? funnelSteps[idx - 1] : null;
                const dropOff = prevStep ? Math.round(((prevStep.schools - step.schools) / prevStep.schools) * 100) : 0;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-44 text-right text-xs font-semibold text-text-primary leading-tight">
                        {step.name}
                      </div>

                      <div className="flex-1">
                        <div
                          className="relative flex h-11 items-center justify-between px-4 rounded-xl text-white font-bold text-xs shadow-sm transition-all duration-500 hover:brightness-105"
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor:
                              idx === 0 ? 'var(--color-primary-dark)' :
                              idx === 1 ? 'var(--color-primary)' :
                              idx === 2 ? 'var(--color-accent)' :
                              idx === 3 ? 'var(--status-sebagian)' :
                              'var(--status-sudah)'
                          }}
                        >
                          <span className="truncate">
                            <AnimatedCounter key={`f-sch-${idx}`} value={step.schools} suffix=" Sekolah" />
                          </span>
                          <span>
                            <AnimatedCounter key={`f-pct-${idx}`} value={step.percentage} suffix="%" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Drop-off rate indicator */}
                    {idx > 0 && (
                      <div className="flex items-center pl-48 text-[10px] text-status-belum font-semibold space-x-1">
                        <ArrowDownRight className="h-3 w-3" />
                        <span>Penyusutan (Drop-off): {dropOff}% dari tahap sebelumnya</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actionable Recommendations */}
        <div className="rounded-2xl bg-surface p-6 shadow-card border border-border space-y-5">
          <h3 className="text-base font-bold text-text-primary font-display flex items-center space-x-2 border-b border-border pb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span>Rekomendasi Tindak Lanjut</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-primary/8 border border-primary/20 space-y-1">
              <p className="font-bold text-primary flex items-center space-x-1">
                <Info className="h-4 w-4" />
                <span>Intervensi Tahap 1 & 2:</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                Prioritaskan reminder ke 280+ sekolah di Sidoarjo & Tuban yang belum menyelesaikan pengisian kuesioner.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-status-sebagian/8 border border-status-sebagian/20 space-y-1">
              <p className="font-bold text-status-sebagian flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>Pendampingan Modul 3:</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                Adakan sosialisasi KKG khusus mengenai supervisi klinis kepala sekolah.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-status-sudah/8 border border-status-sudah/20 space-y-1">
              <p className="font-bold text-status-sudah flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Apresiasi Kategori Utama:</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                Sekolah yang lulus kategori utama diberikan piagam penghargaan BSAN dari Dinas Pendidikan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
