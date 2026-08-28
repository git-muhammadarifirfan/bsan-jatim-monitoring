import { Map, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KecamatanMap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-surface rounded-2xl shadow-card border border-border space-y-6 max-w-2xl mx-auto my-12 animate-fade-in-up">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20">
        <Map className="h-10 w-10 animate-pulse" />
      </div>
      <div className="space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
          <Construction className="h-3.5 w-3.5" />
          <span>Under Development</span>
        </span>
        <h2 className="text-2xl font-bold font-display text-text-primary">
          Peta Kecamatan Sedang Dikembangkan
        </h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          Fitur pemetaan interaktif tingkat kecamatan sedang dalam proses integrasi data geografis wilayah mitra Jawa Timur. Halaman ini akan segera tersedia dengan fitur pencarian dan analisis geospasial yang lengkap.
        </p>
      </div>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-smooth active:scale-[0.98]"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}
