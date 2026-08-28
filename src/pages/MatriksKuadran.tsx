import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { database, KABUPATEN_LIST } from '../lib/data-source';
import type { MatrixPoint } from '../lib/data-source';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';
import { Grid3X3, Building2, Award, X, Sparkles, AlertTriangle, Search } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

interface MatriksKuadranProps {
  activeKecamatan: string | null;
}

export default function MatriksKuadran({ activeKecamatan }: MatriksKuadranProps) {
  const [selectedKab, setSelectedKab] = useState<string>('');
  const [selectedPoint, setSelectedPoint] = useState<MatrixPoint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: matrixData = [], isLoading } = useQuery({
    queryKey: ['matrixData', selectedKab, activeKecamatan],
    queryFn: () => database.getMatriksKuadranData({ kabupaten: selectedKab || undefined, kecamatan: activeKecamatan || undefined })
  });

  // Calculate Quadrant Counts
  const q1 = matrixData.filter(p => p.implementation >= 60 && p.readiness >= 60).length;
  const q2 = matrixData.filter(p => p.implementation < 60 && p.readiness >= 60).length;
  const q3 = matrixData.filter(p => p.implementation >= 60 && p.readiness < 60).length;
  const q4 = matrixData.filter(p => p.implementation < 60 && p.readiness < 60).length;

  const getPointColor = (p: MatrixPoint) => {
    if (p.implementation >= 60 && p.readiness >= 60) return '#2FB344'; // Q1: Mandiri
    if (p.implementation < 60 && p.readiness >= 60) return '#6C7AE0'; // Q2: Potensial
    if (p.implementation >= 60 && p.readiness < 60) return '#F5A623'; // Q3: Tantangan
    return '#E5484D'; // Q4: Pendampingan Khusus
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-surface p-6 shadow-card border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary">Matriks Evaluasi 4 Kuadran BSAN</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Menentukan posisi kesiapan (X) vs tingkat implementasi (Y) sekolah sasaran di Sidoarjo, Batu, dan Tuban.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Cari NPSN atau Nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-primary transition-smooth"
            />
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
      </div>

      {/* Quadrant Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-status-sudah/20 shadow-card">
          <span className="text-[10px] font-bold text-status-sudah uppercase tracking-wider">Kuadran I (Mandiri)</span>
          <h3 className="text-2xl font-bold font-display text-status-sudah mt-1">
            <AnimatedCounter value={q1} suffix=" SD" />
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">Implementasi & Kesiapan Tinggi</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-accent/20 shadow-card">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Kuadran II (Potensial)</span>
          <h3 className="text-2xl font-bold font-display text-accent mt-1">
            <AnimatedCounter value={q2} suffix=" SD" />
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">Kesiapan Tinggi, Impl. Sedang</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-status-sebagian/20 shadow-card">
          <span className="text-[10px] font-bold text-status-sebagian uppercase tracking-wider">Kuadran III (Perlu Sarana)</span>
          <h3 className="text-2xl font-bold font-display text-status-sebagian mt-1">
            <AnimatedCounter value={q3} suffix=" SD" />
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">Impl. Tinggi, Perangkat Kurang</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-status-belum/20 shadow-card">
          <span className="text-[10px] font-bold text-status-belum uppercase tracking-wider">Kuadran IV (Intervensi)</span>
          <h3 className="text-2xl font-bold font-display text-status-belum mt-1">
            <AnimatedCounter value={q4} suffix=" SD" />
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">Perlu Pendampingan Khusus</p>
        </div>
      </div>

      {/* Main Scatter Matrix Chart */}
      <div className="rounded-2xl bg-surface p-6 shadow-card border border-border space-y-4 relative">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-base font-bold text-text-primary font-display flex items-center space-x-2">
            <Grid3X3 className="h-5 w-5 text-primary" />
            <span>Plot Matriks Posisi Sekolah</span>
          </h3>
          <span className="text-xs text-text-secondary">Klik pada titik untuk detail sekolah</span>
        </div>

        {isLoading ? (
          <div className="h-96 flex items-center justify-center text-sm text-text-secondary animate-pulse">
            Memuat matriks kuadran...
          </div>
        ) : (
          <div className="h-[420px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  type="number"
                  dataKey="readiness"
                  name="Kesiapan (X)"
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: 'Tingkat Kesiapan Sarana (X)', position: 'bottom', offset: 0, fontSize: 11, fill: 'var(--color-text-secondary)' }}
                />
                <YAxis
                  type="number"
                  dataKey="implementation"
                  name="Implementasi (Y)"
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: 'Tingkat Implementasi Modul (Y)', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'var(--color-text-secondary)' }}
                />
                <ZAxis range={[50, 50]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: 'var(--shadow-card)'
                  }}
                  formatter={(value: any, name: any) => [
                    `${value}%`,
                    name === 'readiness' ? 'Kesiapan' : 'Implementasi'
                  ]}
                  labelFormatter={() => ''}
                />
                <Scatter
                  name="Sekolah"
                  data={matrixData}
                  onClick={(p) => setSelectedPoint(p as unknown as MatrixPoint)}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {matrixData.map((entry, index) => {
                    const isMatched = searchTerm && entry.name.toLowerCase().includes(searchTerm.toLowerCase());
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getPointColor(entry)} 
                        stroke={isMatched ? 'var(--color-primary)' : 'none'}
                        strokeWidth={isMatched ? 3 : 0}
                        opacity={searchTerm ? (isMatched ? 1 : 0.2) : 1}
                        className="cursor-pointer transition-all duration-300"
                        r={isMatched ? 6 : 4}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Selected School Detail Popup */}
        {selectedPoint && (
          <div className="p-4 rounded-xl bg-bg border border-primary/30 shadow-lg flex justify-between items-start text-xs animate-scale-in">
            <div className="space-y-1">
              <span className="font-bold text-primary flex items-center space-x-1">
                <Building2 className="h-4 w-4" />
                <span>{selectedPoint.name}</span>
              </span>
              <p className="text-text-secondary">Kecamatan: {selectedPoint.kecamatan}</p>
              <div className="flex space-x-4 pt-1 font-semibold text-text-primary">
                <span>Kesiapan: {selectedPoint.readiness}%</span>
                <span>Implementasi: {selectedPoint.implementation}%</span>
              </div>
            </div>
            <button onClick={() => setSelectedPoint(null)} className="text-text-secondary hover:text-text-primary">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
