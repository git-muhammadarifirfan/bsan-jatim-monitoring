import { useState } from 'react';
import { SEL_INDIKATORS, SEL_DIMENSI_ORDER, SEL_DIMENSI_LABEL } from '../lib/sel-indicators';
import type { SELIndikator, SELDimensi, SELSubjek, SELKonteks } from '../lib/sel-indicators';
import {
  FileText, Plus, Edit3, Trash2, Search, Filter, Save, X, CheckCircle2,
  AlertCircle, GraduationCap, Users, Building2, Trees, Settings2, HelpCircle,
  XCircle, Clock, CheckCircle, Sparkles, Layers, Sliders
} from 'lucide-react';

export interface CustomSkorOption {
  value: 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

export default function KelolaFormSEL() {
  const [indikatorList, setIndikatorList] = useState<SELIndikator[]>(SEL_INDIKATORS);
  const [selectedDimensi, setSelectedDimensi] = useState<string>('');
  const [selectedSubjek, setSelectedSubjek] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // ─── CUSTOM RESPONSES / SKOR OPTIONS STATE ───
  const [skorOptions, setSkorOptions] = useState<CustomSkorOption[]>([
    { value: 1, label: 'Tidak Terlihat', color: '#EF4444' },
    { value: 2, label: 'Kadang Terlihat', color: '#F59E0B' },
    { value: 3, label: 'Sering Terlihat', color: '#10B981' },
    { value: 4, label: 'Konsisten', color: '#4A57C4' },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkorModalOpen, setIsSkorModalOpen] = useState(false);
  const [editingInd, setEditingInd] = useState<SELIndikator | null>(null);

  // Form State for Indicator Modal
  const [formTeks, setFormTeks] = useState('');
  const [formDimensi, setFormDimensi] = useState<SELDimensi>('kesadaran_diri');
  const [formSubjek, setFormSubjek] = useState<SELSubjek>('guru');
  const [formKonteks, setFormKonteks] = useState<SELKonteks>('kelas');
  const [formCatatan, setFormCatatan] = useState('');

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingInd(null);
    setFormTeks('');
    setFormDimensi('kesadaran_diri');
    setFormSubjek('guru');
    setFormKonteks('kelas');
    setFormCatatan('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ind: SELIndikator) => {
    setEditingInd(ind);
    setFormTeks(ind.teks);
    setFormDimensi(ind.dimensi);
    setFormSubjek(ind.subjek);
    setFormKonteks(ind.konteks);
    setFormCatatan(ind.catatan || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus butir indikator pengamatan ini?')) {
      setIndikatorList(prev => prev.filter(i => i.id !== id));
      showToast('Indikator berhasil dihapus');
    }
  };

  const handleSaveIndikator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTeks.trim()) return;

    if (editingInd) {
      setIndikatorList(prev =>
        prev.map(i =>
          i.id === editingInd.id
            ? {
                ...i,
                teks: formTeks,
                dimensi: formDimensi,
                subjek: formSubjek,
                konteks: formKonteks,
                catatan: formCatatan || undefined,
              }
            : i
        )
      );
      showToast('Muatan indikator berhasil diperbarui!');
    } else {
      const newId = `${formSubjek}_${formDimensi.substring(0, 2)}_${Date.now()}`;
      const newInd: SELIndikator = {
        id: newId,
        teks: formTeks,
        dimensi: formDimensi,
        subjek: formSubjek,
        konteks: formKonteks,
        catatan: formCatatan || undefined,
      };
      setIndikatorList(prev => [newInd, ...prev]);
      showToast('Indikator baru berhasil ditambahkan!');
    }

    setIsModalOpen(false);
  };

  const handleSaveSkorOption = (val: 1 | 2 | 3 | 4, newLabel: string) => {
    setSkorOptions(prev => prev.map(o => o.value === val ? { ...o, label: newLabel } : o));
    showToast(`Opsi Respon Skor ${val} diperbarui menjadi "${newLabel}"`);
  };

  // Filtered List
  const filteredList = indikatorList.filter(ind => {
    if (selectedDimensi && ind.dimensi !== selectedDimensi) return false;
    if (selectedSubjek && ind.subjek !== selectedSubjek) return false;
    if (search && !ind.teks.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-3 shadow-xl text-xs font-semibold animate-scale-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          {toast}
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary via-[#5a6bd4] to-accent p-6 text-white shadow-lg relative overflow-hidden animate-slide-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner">
              <Settings2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">Manajemen Form Observasi SEL (Advance Builder)</h2>
              <p className="text-white/70 text-xs mt-0.5">
                Kelola butir indikator, pilihan skala respon, dan struktur form observasi secara bebas & dinamis
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsSkorModalOpen(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm text-xs font-bold transition-smooth cursor-pointer border border-white/30"
            >
              <Sliders className="h-4 w-4" /> Pengaturan Skala Respon
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary hover:bg-white/90 text-xs font-bold shadow-md transition-smooth cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Tambah Pertanyaan / Indikator
            </button>
          </div>
        </div>
      </div>

      {/* Skala Respon Live Preview Card */}
      <div className="rounded-2xl bg-surface border border-border p-5 shadow-card animate-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">Pilihan Skala Respon Form Saat Ini</h3>
          </div>
          <button
            onClick={() => setIsSkorModalOpen(true)}
            className="text-[11px] font-semibold text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="h-3 w-3" /> Edit Label Respon
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {skorOptions.map(opt => (
            <div key={opt.value} className="p-3 rounded-xl border border-border bg-bg/50 flex flex-col items-center gap-1 text-center">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: opt.color }}>
                Skor {opt.value}
              </span>
              <span className="text-xs font-bold text-text-primary mt-1">{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between rounded-xl bg-surface border border-border p-4 shadow-card animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-wrap gap-2.5 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari muatan indikator..."
              className="pl-9 pr-3 py-2 rounded-xl border border-border bg-bg text-xs text-text-primary focus:border-primary focus:outline-none w-full sm:w-64"
            />
          </div>
          <select
            value={selectedDimensi}
            onChange={e => setSelectedDimensi(e.target.value)}
            className="rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="">Semua Dimensi SEL</option>
            {SEL_DIMENSI_ORDER.map(d => (
              <option key={d} value={d}>
                {SEL_DIMENSI_LABEL[d]}
              </option>
            ))}
          </select>
          <select
            value={selectedSubjek}
            onChange={e => setSelectedSubjek(e.target.value)}
            className="rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="">Semua Subjek</option>
            <option value="guru">Guru</option>
            <option value="murid">Murid</option>
          </select>
        </div>
        <div className="text-xs text-text-secondary font-medium">
          Total <strong>{filteredList.length}</strong> Butir Pertanyaan / Indikator
        </div>
      </div>

      {/* Table List of Indicators */}
      <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '150ms' }}>
        <div className="p-4 border-b border-border bg-bg/30 flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary font-display flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Daftar Muatan Form Observasi
          </h3>
          <span className="text-[11px] text-text-secondary">Kelola teks pertanyaan, subjek & catatan pembimbing</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[750px]">
            <thead>
              <tr className="bg-bg/50 border-b border-border">
                <th className="py-3 px-4 text-left text-[10px] font-bold text-text-secondary uppercase">Subjek & Konteks</th>
                <th className="py-3 px-4 text-left text-[10px] font-bold text-text-secondary uppercase">Dimensi SEL</th>
                <th className="py-3 px-4 text-left text-[10px] font-bold text-text-secondary uppercase">Teks Indikator Pengamatan</th>
                <th className="py-3 px-4 text-left text-[10px] font-bold text-text-secondary uppercase">Petunjuk Observer</th>
                <th className="py-3 px-3 text-center text-[10px] font-bold text-text-secondary uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-secondary">
                    Tidak ada indikator yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((ind, idx) => (
                  <tr key={ind.id} className="border-b border-border/40 hover:bg-bg/30 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 20}ms` }}>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded w-max ${
                            ind.subjek === 'guru' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {ind.subjek === 'guru' ? <GraduationCap className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                          {ind.subjek === 'guru' ? 'Guru' : 'Murid'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] text-text-secondary font-medium px-1.5 py-0.5 rounded bg-bg border border-border/50 w-max">
                          {ind.konteks === 'kelas' ? <Building2 className="h-3 w-3" /> : <Trees className="h-3 w-3" />}
                          {ind.konteks === 'kelas' ? 'Kelas' : 'Lingkungan'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-text-primary">{SEL_DIMENSI_LABEL[ind.dimensi]}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-text-primary leading-relaxed">{ind.teks}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {ind.catatan ? (
                        <p className="text-[11px] text-text-secondary italic flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-text-secondary/70 shrink-0" /> {ind.catatan}
                        </p>
                      ) : (
                        <span className="text-text-secondary/40">Tidak ada petunjuk</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(ind)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-smooth cursor-pointer"
                          title="Edit Indikator"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ind.id)}
                          className="p-1.5 rounded-lg text-status-belum hover:bg-status-belum/10 transition-smooth cursor-pointer"
                          title="Hapus Indikator"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Indicator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-2xl border border-border w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-text-primary text-base font-display">
                  {editingInd ? 'Edit Pertanyaan / Indikator' : 'Tambah Pertanyaan / Indikator Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-border/40 transition-smooth cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIndikator} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Subjek Pengamatan</label>
                  <select
                    value={formSubjek}
                    onChange={e => setFormSubjek(e.target.value as SELSubjek)}
                    className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-text-primary font-semibold focus:border-primary focus:outline-none"
                  >
                    <option value="guru">Guru</option>
                    <option value="murid">Murid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Konteks Area</label>
                  <select
                    value={formKonteks}
                    onChange={e => setFormKonteks(e.target.value as SELKonteks)}
                    className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-text-primary font-semibold focus:border-primary focus:outline-none"
                  >
                    <option value="kelas">Dalam Kelas</option>
                    <option value="lingkungan">Lingkungan Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Dimensi SEL</label>
                <select
                  value={formDimensi}
                  onChange={e => setFormDimensi(e.target.value as SELDimensi)}
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-text-primary font-semibold focus:border-primary focus:outline-none"
                >
                  {SEL_DIMENSI_ORDER.map(d => (
                    <option key={d} value={d}>
                      {SEL_DIMENSI_LABEL[d]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Teks Indikator Pengamatan *</label>
                <textarea
                  rows={3}
                  value={formTeks}
                  onChange={e => setFormTeks(e.target.value)}
                  placeholder="Contoh: Guru mengajak murid mengenali kekuatan dan kelemahan diri..."
                  required
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-text-primary focus:border-primary focus:outline-none leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Petunjuk Observer (Opsional)</label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={e => setFormCatatan(e.target.value)}
                  placeholder="Contoh: Wawancara guru jika saat observasi tidak ditemukan peristiwa..."
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-text-primary focus:border-primary focus:outline-none leading-relaxed resize-none"
                />
              </div>

              <div className="border-t border-border pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-text-secondary font-semibold hover:bg-bg transition-smooth cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-sm hover:bg-primary-dark transition-smooth flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" /> Simpan Indikator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Skala Respon */}
      {isSkorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-2xl border border-border w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-text-primary text-base font-display">Kustomisasi Label Skala Respon</h3>
              </div>
              <button
                onClick={() => setIsSkorModalOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-border/40 transition-smooth cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-text-secondary leading-relaxed">
                Ubah label teks untuk masing-masing opsi rating skor (1–4) yang akan muncul pada form pengisian user:
              </p>
              <div className="space-y-3">
                {skorOptions.map(opt => (
                  <div key={opt.value} className="space-y-1">
                    <label className="font-bold uppercase text-[10px] flex items-center gap-1.5" style={{ color: opt.color }}>
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: opt.color }} />
                      Skor {opt.value} Label
                    </label>
                    <input
                      type="text"
                      value={opt.label}
                      onChange={e => handleSaveSkorOption(opt.value, e.target.value)}
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-text-primary font-semibold focus:border-primary focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSkorModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-sm hover:bg-primary-dark transition-smooth cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
