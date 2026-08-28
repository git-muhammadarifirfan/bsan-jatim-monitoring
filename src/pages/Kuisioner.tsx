import { useState } from 'react';
import {
  BookOpen, ChevronLeft, ChevronRight, Check, Save, Send, HelpCircle,
  AlertCircle, PlayCircle, ShieldCheck, Plus, Edit2, Trash2, X, Eye, Lock
} from 'lucide-react';
import { KABUPATEN_LIST } from '../lib/data-source';

interface KuisionerProps {
  userRole: 'admin' | 'school';
}

export interface QuestionItem {
  id: string;
  sectionId: string;
  text: string;
  type: 'radio' | 'essay' | 'rating' | 'text';
  options?: string[];
  required: boolean;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  // Section 1 — Identitas Responden
  { id: 'q1', sectionId: 'sec1', text: '1. Nama Responden (Huruf Kapital)', type: 'text', required: true },
  { id: 'q2', sectionId: 'sec1', text: '2. Jenis Kelamin', type: 'radio', options: ['Laki-Laki', 'Perempuan'], required: true },
  { id: 'q3', sectionId: 'sec1', text: '3. Posisi / Jabatan Pekerjaan', type: 'radio', options: ['Kepala Sekolah', 'Guru Kelas 1', 'Guru Kelas 2', 'Guru Kelas 3', 'Guru Kelas 4', 'Guru Kelas 5', 'Guru Kelas 6', 'Guru PJOK', 'Guru PAI', 'Guru Seni & Budaya', 'Lainnya'], required: true },
  { id: 'q4', sectionId: 'sec1', text: '4. Asal Sekolah (Nama Lengkap Sekolah)', type: 'text', required: true },
  { id: 'q5', sectionId: 'sec1', text: '5. Kabupaten / Kota Wilayah', type: 'radio', options: ['Kab. Sidoarjo', 'Kota Batu', 'Kab. Tuban'], required: true },

  // Section 2 — Identifikasi Pelatihan & Pelaksanaan
  { id: 'q6', sectionId: 'sec2', text: '9. Apakah Bpk/Ibu sudah pernah mendapatkan materi modul BSAN (Budaya Sekolah Aman dan Nyaman)?', type: 'radio', options: ['Ya', 'Tidak'], required: true },
  { id: 'q7', sectionId: 'sec2', text: '10. Jika ya, siapa yang mengadakan pelatihan?', type: 'radio', options: ['INOVASI - Dinas Pendidikan', 'Diseminasi KKG / KKKS', 'Pelatihan Internal Sekolah', 'Lainnya'], required: false },
  { id: 'q8', sectionId: 'sec2', text: '11. Apakah Bpk/Ibu sudah mengimplementasikan modul BSAN?', type: 'radio', options: ['Ya, sudah seluruhnya', 'Ya, sebagian', 'Tidak'], required: true },
  { id: 'q9', sectionId: 'sec2', text: '12. Saat implementasi modul BSAN, Bpk/Ibu mengajar di kelas berapa?', type: 'radio', options: ['Kelas Awal (1 - 3)', 'Kelas Tinggi (4 - 6)', 'Kepala Sekolah / Non-Mengajar'], required: true },

  // Section 3 — Implementasi Modul Kelas Awal & Tinggi
  { id: 'q10', sectionId: 'sec3', text: '13/22. Menurut Bpk/Ibu bagian mana dari modul yang cukup mudah penerapannya?', type: 'radio', options: ['Alur 1: Mengenali Perasaan & Karakter Diri', 'Alur 2: Keunikan Diri & Persahabatan', 'Alur 3: Jaga Diri, Layar & Literasi', 'Seluruh Tema Mudah'], required: true },
  { id: 'q11', sectionId: 'sec3', text: '14/23. Menurut Bpk/Ibu bagian mana dari modul yang cukup sulit penerapannya?', type: 'radio', options: ['Alur 1: Pengelolaan Emosi Kompleks', 'Alur 2: Kampanye & Pembiasaan Publik', 'Alur 3: Refleksi & Tindak Lanjut', 'Tidak Ada yang Sulit'], required: true },
  { id: 'q12', sectionId: 'sec3', text: '15/24. Media pembelajaran apa saja yang telah Bpk/Ibu gunakan?', type: 'radio', options: ['Kartu Afirmasi & Roda Emosi', 'Video & LKPD Interaktif', 'Poster Menjaga Diri & Area Pribadi', 'Papan Ular Tangga & Puzzle Tubuhku', 'Buku Cerita & Stiker Emoji'], required: true },
  { id: 'q13', sectionId: 'sec3', text: '16/25. Keaktifan murid saat implementasi modul BSAN', type: 'radio', options: ['Lebih dari 70% siswa terlibat aktif', '50% siswa terlibat aktif', 'Kurang dari 50% siswa terlibat aktif'], required: true },

  // Section 4 — Refleksi & Kesepakatan Kelas
  { id: 'q14', sectionId: 'sec4', text: '17/28. Apakah guru melakukan refleksi dengan murid?', type: 'radio', options: ['Ya, tiap selesai alur', 'Ya, tiap selesai tema', 'Ya, tiap selesai aktivitas', 'Ya, setelah seluruhnya selesai', 'Tidak'], required: true },
  { id: 'q15', sectionId: 'sec4', text: '18/29. Jika ya, sebutkan temuan-temuan pokoknya bersama murid', type: 'essay', required: false },
  { id: 'q16', sectionId: 'sec4', text: '19/26. Apakah guru melakukan refleksi dengan guru lain (KKG)?', type: 'radio', options: ['Ya, tiap selesai alur', 'Ya, tiap selesai tema', 'Ya, tiap selesai aktivitas', 'Ya, setelah seluruhnya selesai', 'Tidak'], required: true },
  { id: 'q17', sectionId: 'sec4', text: '20/27. Jika ya, sebutkan temuan-temuan pokok refleksi sesama guru', type: 'essay', required: false },
  { id: 'q18', sectionId: 'sec4', text: '21/30. Apakah terdapat kesepakatan kelas yang telah disusun?', type: 'radio', options: ['Ya, disusun guru dengan murid', 'Ya, disiapkan guru', 'Tidak'], required: true },

  // Section 5 — Dukungan Kepsek, Rencana Aksi & Refleksi
  { id: 'q19', sectionId: 'sec5', text: '31. Apa saja dukungan kepala sekolah yang telah dilakukan dalam mewujudkan BSAN?', type: 'radio', options: ['Memimpin refleksi guru', 'Melakukan sosialisasi', 'Membangun kolaborasi antar pihak', 'Memasukkan program BSAN ke kurikulum', 'Belum ada'], required: true },
  { id: 'q20', sectionId: 'sec5', text: '32. Apa saja program sekolah yang sudah disusun dalam mendukung BSAN?', type: 'radio', options: ['Membuat kotak aduan', 'Menyusun SOP pencegahan kekerasan', 'Membentuk tim TPKK', 'Program pembiasaan karakter', 'Belum ada'], required: true },
  { id: 'q21', sectionId: 'sec5', text: '33. Ceritakan hal baik / perubahan baik selama implementasi modul BSAN', type: 'essay', required: true },
  { id: 'q22', sectionId: 'sec5', text: '34. Apa tantangan dan kendala utama dalam mewujudkan sekolah aman dan nyaman?', type: 'essay', required: true },
  { id: 'q23', sectionId: 'sec5', text: '37. No WhatsApp Responden Aktif', type: 'text', required: true }
];

const SECTIONS = [
  { id: 'sec1', title: 'Identitas Responden', desc: 'Informasi data dasar sekolah & pengisi' },
  { id: 'sec2', title: 'Pelatihan & Implementasi', desc: 'Identifikasi pelatihan & tingkat adopsi BSAN' },
  { id: 'sec3', title: 'Implementasi Modul & Media', desc: 'Evaluasi bagian mudah/sulit & media ajar' },
  { id: 'sec4', title: 'Refleksi & Kesepakatan', desc: 'Refleksi bersama murid & teman sejawat' },
  { id: 'sec5', title: 'Dukungan & Perubahan Baik', desc: 'Dukungan kepala sekolah & cerita narasi' }
];

export default function Kuisioner({ userRole }: KuisionerProps) {
  // ─── ADMIN BANK SOAL STATE (CRUD STATIC) ───
  const [questionsBank, setQuestionsBank] = useState<QuestionItem[]>(DEFAULT_QUESTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal Form State
  const [modalText, setModalText] = useState('');
  const [modalSec, setModalSec] = useState('sec1');
  const [modalType, setModalType] = useState<QuestionItem['type']>('essay');
  const [modalReq, setModalReq] = useState(true);
  const [modalOpts, setModalOpts] = useState('Ya, Belum');

  // ─── SCHOOL USER SURVEY STATE ───
  const [hasStarted, setHasStarted] = useState(false);
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: 'Budi Santoso, S.Pd.',
    q2: 'Laki-laki',
    q3: 'Guru Kelas',
    q4: '20501980',
    q5: 'Kab. Sidoarjo',
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Helper Toast
  const toast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // ─── ADMIN CRUD HANDLERS ───
  const handleOpenAddModal = () => {
    setEditingId(null);
    setModalText('');
    setModalSec('sec1');
    setModalType('essay');
    setModalReq(true);
    setModalOpts('Ya, Belum');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: QuestionItem) => {
    setEditingId(q.id);
    setModalText(q.text);
    setModalSec(q.sectionId);
    setModalType(q.type);
    setModalReq(q.required);
    setModalOpts(q.options ? q.options.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalText.trim()) return;

    const optsArray = (modalType === 'radio' && modalOpts.trim())
      ? modalOpts.split(',').map(s => s.trim())
      : undefined;

    if (editingId) {
      // Update existing
      setQuestionsBank(prev => prev.map(q => q.id === editingId ? {
        ...q,
        sectionId: modalSec,
        text: modalText,
        type: modalType,
        required: modalReq,
        options: optsArray
      } : q));
      toast('Pertanyaan berhasil diperbarui!');
    } else {
      // Create new
      const newQ: QuestionItem = {
        id: 'q_' + Date.now(),
        sectionId: modalSec,
        text: modalText,
        type: modalType,
        required: modalReq,
        options: optsArray
      };
      setQuestionsBank(prev => [...prev, newQ]);
      toast('Pertanyaan baru berhasil ditambahkan!');
    }
    setIsModalOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pertanyaan ini dari bank soal?')) {
      setQuestionsBank(prev => prev.filter(q => q.id !== id));
      toast('Pertanyaan berhasil dihapus.');
    }
  };

  // ─── SCHOOL USER VALIDATION & NAVIGATION HANDLERS ───
  const currentSec = SECTIONS[activeSecIdx];
  const currentQuestions = questionsBank.filter(q => q.sectionId === currentSec.id);

  const validateCurrentSection = (): boolean => {
    for (const q of currentQuestions) {
      if (q.required && (!answers[q.id] || answers[q.id].toString().trim() === '')) {
        setValidationError(`Harap jawab semua pertanyaan wajib (* Wajib) di bagian "${currentSec.title}" sebelum melanjutkan.`);
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const handleNextSection = () => {
    if (validateCurrentSection()) {
      if (activeSecIdx < SECTIONS.length - 1) {
        setActiveSecIdx(i => i + 1);
      }
    }
  };

  const handlePrevSection = () => {
    setValidationError(null);
    if (activeSecIdx > 0) {
      setActiveSecIdx(i => i - 1);
    }
  };

  const handleSubmitSurvey = () => {
    if (validateCurrentSection()) {
      setSubmitted(true);
    }
  };

  // ---------------------------------------------------
  // ADMIN VIEW: BANK SOAL & MANAGEMENT (CRUD STATIC)
  // ---------------------------------------------------
  if (userRole === 'admin') {
    return (
      <div className="space-y-6">
        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-xl bg-status-sudah text-white px-4 py-3 shadow-xl text-xs font-semibold">
            <Check className="h-4 w-4" />
            <span>{showToast}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="rounded-2xl bg-surface p-6 shadow-card border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold font-display text-text-primary">
              Manajemen Bank Soal Kuisioner BSAN
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Kelola struktur pertanyaan, tipe isian (Essai/Pilihan), dan status kewajiban instrumen survei.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white px-4 py-2.5 text-xs font-bold shadow-md transition-smooth cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Pertanyaan</span>
          </button>
        </div>

        {/* Sections Accordion / Table */}
        <div className="space-y-6">
          {SECTIONS.map((sec, secIdx) => {
            const secQuestions = questionsBank.filter(q => q.sectionId === sec.id);
            return (
              <div key={sec.id} className="rounded-2xl bg-surface p-6 shadow-card border border-border space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Bagian {secIdx + 1}</span>
                    <h3 className="text-sm font-bold text-text-primary font-display mt-0.5">{sec.title}</h3>
                  </div>
                  <span className="text-xs font-semibold text-text-secondary bg-bg px-2.5 py-1 rounded-full border border-border/50">
                    {secQuestions.length} Pertanyaan
                  </span>
                </div>

                <div className="space-y-3">
                  {secQuestions.map((q, qIdx) => (
                    <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-bg/50 border border-border/50 gap-3">
                      <div className="flex items-start space-x-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary mt-0.5">
                          {qIdx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-text-primary leading-snug">
                            {q.text} {q.required && <span className="text-status-belum font-bold">*</span>}
                          </p>
                          <div className="flex items-center space-x-2 text-[10px] text-text-secondary">
                            <span className="capitalize font-bold bg-border/40 px-2 py-0.5 rounded text-text-primary">
                              Tipe: {q.type === 'radio' ? 'Pilihan Ganda' : q.type === 'essay' ? 'Essai Narasi' : q.type === 'rating' ? 'Skala 1-5' : 'Teks Isian'}
                            </span>
                            <span>• {q.required ? 'Wajib Diisi' : 'Opsional'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenEditModal(q)}
                          className="flex items-center space-x-1 p-2 rounded-lg bg-surface border border-border hover:border-primary/40 text-text-secondary hover:text-primary text-xs font-semibold transition-smooth"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 rounded-lg bg-surface border border-border hover:border-status-belum/40 text-text-secondary hover:text-status-belum transition-smooth"
                          title="Hapus Pertanyaan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {secQuestions.length === 0 && (
                    <p className="text-xs text-text-secondary text-center py-4">Belum ada pertanyaan di bagian ini.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Create/Edit Question */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold font-display text-text-primary text-sm">
                  {editingId ? 'Edit Pertanyaan Bank Soal' : 'Tambah Pertanyaan Baru'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-text-secondary hover:text-text-primary">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase">Bagian Modul</label>
                  <select
                    value={modalSec}
                    onChange={(e) => setModalSec(e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                  >
                    {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase">Teks Pertanyaan</label>
                  <textarea
                    required
                    rows={3}
                    value={modalText}
                    onChange={(e) => setModalText(e.target.value)}
                    placeholder="Tulis teks pertanyaan instrumen..."
                    className="w-full rounded-xl border border-border bg-bg p-3 text-text-primary focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-text-secondary uppercase">Tipe Isian</label>
                    <select
                      value={modalType}
                      onChange={(e) => setModalType(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                    >
                      <option value="essay">Essai Narasi</option>
                      <option value="radio">Pilihan Ganda</option>
                      <option value="rating">Skala Rating 1-5</option>
                      <option value="text">Teks Singkat</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-text-secondary uppercase">Status Kewajiban</label>
                    <select
                      value={modalReq ? 'true' : 'false'}
                      onChange={(e) => setModalReq(e.target.value === 'true')}
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                    >
                      <option value="true">Wajib Diisi (*)</option>
                      <option value="false">Opsional</option>
                    </select>
                  </div>
                </div>

                {modalType === 'radio' && (
                  <div className="space-y-1">
                    <label className="font-bold text-text-secondary uppercase">Opsi Pilihan (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={modalOpts}
                      onChange={(e) => setModalOpts(e.target.value)}
                      placeholder="Contoh: Ya, Sebagian, Belum"
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border bg-bg text-text-secondary font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-md"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------
  // SCHOOL USER VIEW: FILLING SURVEY WITH STRICT VALIDATION
  // ---------------------------------------------------
  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-3xl bg-surface p-10 shadow-2xl border border-border/50 text-center space-y-8 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
          
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-white mx-auto shadow-lg shadow-primary/20 relative z-10">
            <BookOpen className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-text-primary">
              Lembar Survey Implementasi Modul BSAN
            </h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
              Budaya Sekolah Aman dan Nyaman (BSAN) : instrumen evaluasi pelaksanaan modul literasi, numerasi, karakter, dan iklim kondusif di sekolah dasar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4 border-t border-border">
            <div className="p-4 rounded-xl bg-bg border border-border/50 space-y-1">
              <p className="text-[10px] font-bold text-text-secondary uppercase">Jumlah Bagian</p>
              <p className="font-bold text-text-primary text-base">5 Modul Utama</p>
            </div>
            <div className="p-4 rounded-xl bg-bg border border-border/50 space-y-1">
              <p className="text-[10px] font-bold text-text-secondary uppercase">Tipe Isian</p>
              <p className="font-bold text-text-primary text-base">Pilihan & Narasi Essai</p>
            </div>
            <div className="p-4 rounded-xl bg-bg border border-border/50 space-y-1">
              <p className="text-[10px] font-bold text-text-secondary uppercase">Validasi Isian</p>
              <p className="font-bold text-text-primary text-base">Wajib Isi Per Tahap</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-accent/8 border border-accent/20 text-left text-xs text-text-primary space-y-2">
            <p className="font-bold flex items-center space-x-1.5 text-accent">
              <ShieldCheck className="h-4 w-4" />
              <span>Petunjuk Pengisian:</span>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary">
              <li>Isi identitas diri dan sekolah sesuai data pokok pendidikan (Dapodik).</li>
              <li>Seluruh pertanyaan bertanda bintang (<span className="text-status-belum font-bold">* Wajib</span>) harus dijawab untuk dapat melanjutkan ke bagian berikutnya.</li>
              <li>Tekan tombol "Simpan Draft" untuk menyimpan sementara isian Anda.</li>
            </ul>
          </div>

          <div className="pt-4 relative z-10">
            <button
              onClick={() => setHasStarted(true)}
              className="group inline-flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-10 py-4 text-base font-bold shadow-xl shadow-primary/30 transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <span>Mulai Pengisian Survei</span>
              <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-sudah/10 text-status-sudah">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-text-primary">Terima Kasih, Survei Berhasil Dikirim!</h2>
        <p className="text-xs text-text-secondary max-w-md">
          Jawaban instrumen modul BSAN sekolah Anda telah terverifikasi dan status pengisian menjadi <strong className="text-status-sudah">Sudah Mengisi</strong>.
        </p>
        <button
          onClick={() => { setSubmitted(false); setHasStarted(false); setActiveSecIdx(0); }}
          className="text-xs font-semibold text-primary hover:underline pt-2"
        >
          Kembali ke Lembar Depan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-xl bg-status-sudah text-white px-4 py-3 shadow-xl text-xs font-semibold">
          <Check className="h-4 w-4" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="rounded-2xl bg-surface p-6 shadow-card border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary">
            Form Instrumen Survey BSAN
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Bagian {activeSecIdx + 1} dari {SECTIONS.length}: {currentSec.title}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toast('Draft jawaban berhasil disimpan!')}
            className="flex items-center space-x-1.5 rounded-xl border border-border bg-bg hover:bg-border/40 px-3.5 py-2 text-xs font-semibold text-text-primary transition-smooth"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Simpan Draft</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation Header */}
      <div className="rounded-2xl bg-surface p-4 shadow-card border border-border overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] px-2">
          {SECTIONS.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => {
                if (idx < activeSecIdx || validateCurrentSection()) {
                  setActiveSecIdx(idx);
                }
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-smooth ${
                idx === activeSecIdx
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-bg/60 text-text-secondary hover:bg-bg'
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                idx === activeSecIdx ? 'bg-white/20 text-white' : 'bg-border text-text-secondary'
              }`}>
                {idx + 1}
              </span>
              <span className="truncate">{sec.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Alert Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-status-belum/10 border border-status-belum/20 flex items-center space-x-3 text-xs font-semibold text-status-belum">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Active Section Questions Form */}
      <div className="rounded-2xl bg-surface p-6 md:p-8 shadow-card border border-border space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-base font-bold font-display text-text-primary">{currentSec.title}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{currentSec.desc}</p>
        </div>

        <div className="space-y-6 text-xs">
          {currentQuestions.map((q, qIdx) => (
            <div key={q.id} className="space-y-2 p-4 rounded-xl bg-bg/40 border border-border/50">
              <label className="font-bold text-text-primary text-sm leading-snug flex items-start space-x-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-primary/10 text-primary text-[10px]">
                  {qIdx + 1}
                </span>
                <span>
                  {q.text} {q.required && <span className="text-status-belum font-bold">*</span>}
                </span>
              </label>

              {/* Input Render per type */}
              {q.type === 'text' && (
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => {
                    setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Ketik jawaban Anda di sini..."
                  className="w-full rounded-2xl border-2 border-border bg-surface px-4 py-3 text-sm text-text-primary focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all duration-300 placeholder-text-secondary/50"
                />
              )}

              {q.type === 'essay' && (
                <textarea
                  rows={4}
                  value={answers[q.id] || ''}
                  onChange={(e) => {
                    setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Uraikan jawaban narasi essai secara lengkap..."
                  className="w-full rounded-2xl border-2 border-border bg-surface p-4 text-sm text-text-primary focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all duration-300 resize-none placeholder-text-secondary/50"
                />
              )}

              {q.type === 'radio' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map(opt => {
                    const isSelected = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, [q.id]: opt }));
                          if (validationError) setValidationError(null);
                        }}
                        className={`group relative flex items-center p-3 rounded-2xl border-2 text-left transition-all duration-300 outline-none ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-[0_0_0_4px_rgba(74,87,196,0.1)]' 
                            : 'border-border bg-surface hover:border-primary/40 hover:bg-bg'
                        }`}
                      >
                        <div className={`mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isSelected ? 'border-primary' : 'border-text-secondary/40 group-hover:border-primary/50'
                        }`}>
                          {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary animate-scale-in" />}
                        </div>
                        <span className={`text-sm font-semibold transition-colors ${
                          isSelected ? 'text-primary' : 'text-text-primary'
                        }`}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'rating' && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {['1', '2', '3', '4', '5'].map(val => {
                    const isSelected = answers[q.id] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, [q.id]: val }));
                          if (validationError) setValidationError(null);
                        }}
                        className={`h-12 w-14 rounded-2xl text-sm font-bold border-2 transition-all duration-300 transform active:scale-90 ${
                          isSelected
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 -translate-y-1'
                            : 'bg-surface border-border text-text-secondary hover:border-primary/40 hover:bg-bg hover:text-primary'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <button
            type="button"
            disabled={activeSecIdx === 0}
            onClick={handlePrevSection}
            className="flex items-center space-x-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-bg disabled:opacity-30 transition-smooth"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-xs text-text-secondary font-medium hidden sm:inline-block">
            Bagian {activeSecIdx + 1} dari {SECTIONS.length}
          </span>

          {activeSecIdx < SECTIONS.length - 1 ? (
            <button
              type="button"
              onClick={handleNextSection}
              className="flex items-center space-x-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white px-5 py-2.5 text-xs font-bold shadow-sm transition-smooth cursor-pointer"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitSurvey}
              className="flex items-center space-x-1.5 rounded-xl bg-status-sudah hover:bg-status-sudah/90 text-white px-6 py-2.5 text-xs font-bold shadow-md transition-smooth cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Selesai & Kirim</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
