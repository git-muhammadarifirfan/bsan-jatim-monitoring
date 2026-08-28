import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { database, KABUPATEN_LIST } from '../lib/data-source';
import { AlertTriangle, ShieldAlert, Cpu, Wifi, BookOpen, Users, CheckCircle2, Sparkles } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

interface TantanganImplementasiProps {
  activeKecamatan: string | null;
}

export default function TantanganImplementasi({ activeKecamatan }: TantanganImplementasiProps) {
  const [selectedKab, setSelectedKab] = useState<string>('');

  const { data: challengeData = [], isLoading } = useQuery({
    queryKey: ['challengeData', selectedKab, activeKecamatan],
    queryFn: () => database.getTantanganData({ kabupaten: selectedKab || undefined, kecamatan: activeKecamatan || undefined })
  });

  const getCategoryIcon = (category: string) => {
    if (category.includes('Perangkat')) return Cpu;
    if (category.includes('Internet')) return Wifi;
    if (category.includes('Pelatihan')) return BookOpen;
    if (category.includes('Bahan')) return BookOpen;
    return Users;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-surface p-6 shadow-card border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary">Analisis Tantangan & Kendala Lapangan</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Ringkasan hambatan teknis & manajerial yang dilaporkan oleh sekolah dasar di Sidoarjo, Batu, dan Tuban.
          </p>
        </div>

        <select
          value={selectedKab}
          onChange={(e) => setSelectedKab(e.target.value)}
          className="rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none transition-smooth"
        >
          <option value="">Semua Wilayah</option>
          {KABUPATEN_LIST.map(k => <option key={k.id} value={k.name}>{k.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Challenge Bar Progress List */}
        <div className="lg:col-span-2 rounded-2xl bg-surface p-6 shadow-card border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-base font-bold text-text-primary font-display flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-status-belum" />
              <span>Kategori Kendala Terbanyak</span>
            </h3>
            <span className="text-xs text-text-secondary">Berdasarkan 944+ Laporan</span>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-sm text-text-secondary animate-pulse">
              Memuat data tantangan...
            </div>
          ) : (
            <>
              <div key={`challenges-${selectedKab}`} className="space-y-5 pb-6 border-b border-border">
                {challengeData.map((item, idx) => {
                  const Icon = getCategoryIcon(item.category);
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-text-primary">{item.category}</span>
                        </div>
                        <span className="font-bold text-text-secondary">
                          {item.count} Laporan (<AnimatedCounter value={item.percentage} decimals={1} suffix="%" />)
                        </span>
                      </div>

                      <div className="h-3 w-full rounded-full bg-bg overflow-hidden">
                        <div
                          key={`c-bar-${selectedKab}-${idx}`}
                          className="h-full rounded-full progress-bar-fill"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* AI Insight Box */}
              <div className="pt-2">
                <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-5 shadow-inner">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <h4 className="text-sm font-bold text-text-primary font-display">AI Insight & Rekomendasi</h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    Berdasarkan analisis data sentimen dari {challengeData[0]?.count || 0} laporan teratas, 
                    <strong className="text-primary"> {challengeData[0]?.category} </strong> 
                    merupakan hambatan terbesar di lapangan. Rekomendasi tindakan prioritas untuk 
                    Dinas Pendidikan {selectedKab || 'Provinsi'} adalah segera melakukan alokasi ulang anggaran BOS Kinerja 
                    untuk penguatan infrastruktur digital, serta menggandeng CSR perusahaan lokal.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Strategy Solution Cards */}
        <div className="rounded-2xl bg-surface p-6 shadow-card border border-border space-y-5">
          <h3 className="text-base font-bold text-text-primary font-display flex items-center space-x-2 border-b border-border pb-4">
            <ShieldAlert className="h-5 w-5 text-accent" />
            <span>Strategi Solusi Dinas</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-bg border border-border/50 space-y-1">
              <p className="font-bold text-text-primary flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-status-sudah" />
                <span>Pengadaan Chromebook & Perangkat</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                Pengusulan bantuan hibah TIK untuk 85 SD di wilayah perkampungan Sidoarjo & Tuban.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-bg border border-border/50 space-y-1">
              <p className="font-bold text-text-primary flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-status-sudah" />
                <span>Bimbingan Teknis KKG Berkala</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                Pelatihan intensif 5 modul BSAN terintegrasi dalam forum rutin K3S / KKG kecamatan.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-bg border border-border/50 space-y-1">
              <p className="font-bold text-text-primary flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-status-sudah" />
                <span>Forum Komite & Parenting</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                Mengaktifkan kelas orang tua untuk memperkuat keterlibatan wali murid dalam pembiasaan karakter di rumah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
