/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * API CLIENT ADAPTER — BSAN JAWA TIMUR MONITORING SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Interface layanan untuk komunikasi dengan Backend API (Express.js / NestJS / Next.js)
 * yang terhubung langsung ke Database MySQL.
 * 
 * Saat aplikasi dialihkan dari static/mock ke Live MySQL:
 * Import `apiClient` ini untuk menggantikan `database` di `src/lib/data-source.ts`.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('bsan_auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  // ── Auth Services ────────────────────────────────────────────────────────
  auth: {
    login: (credentials: { email: string; password: string; role?: string }) =>
      fetchJson<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    logout: () => fetchJson<{ success: boolean }>('/auth/logout', { method: 'POST' }),
    getProfile: () => fetchJson<any>('/auth/me')
  },

  // ── Dashboard Services ───────────────────────────────────────────────────
  dashboard: {
    getSummary: (filters?: { kabupaten_id?: number; kecamatan_id?: number }) => {
      const params = new URLSearchParams(filters as any).toString();
      return fetchJson<any>(`/dashboard/summary?${params}`);
    },
    getRegionalStats: (kabupatenId?: number) =>
      fetchJson<any[]>(`/dashboard/regional-stats${kabupatenId ? `?kabupaten_id=${kabupatenId}` : ''}`),
    getActivityLog: (limit = 10) => fetchJson<any[]>(`/dashboard/activities?limit=${limit}`)
  },

  // ── Analisis Services ────────────────────────────────────────────────────
  analisis: {
    getModulProgress: (kabupatenId?: number) =>
      fetchJson<any[]>(`/analisis/modul-progress${kabupatenId ? `?kabupaten_id=${kabupatenId}` : ''}`),
    getProporsiModul: (kabupatenId?: number) =>
      fetchJson<any>(`/analisis/proporsi${kabupatenId ? `?kabupaten_id=${kabupatenId}` : ''}`),
    getGapFunnel: (kabupatenId?: number) =>
      fetchJson<any>(`/analisis/funnel${kabupatenId ? `?kabupaten_id=${kabupatenId}` : ''}`),
    getMatriksKuadran: (kabupatenId?: number) =>
      fetchJson<any[]>(`/analisis/matriks${kabupatenId ? `?kabupaten_id=${kabupatenId}` : ''}`),
    getTantangan: (kabupatenId?: number) =>
      fetchJson<any[]>(`/analisis/tantangan${kabupatenId ? `?kabupaten_id=${kabupatenId}` : ''}`)
  },

  // ── Survey / Kuisioner Services ──────────────────────────────────────────
  kuisioner: {
    getPertanyaan: () => fetchJson<any[]>('/kuisioner/pertanyaan'),
    submitJawaban: (payload: { responden: any; jawaban: Record<string, any> }) =>
      fetchJson<{ success: boolean; responden_id: number }>('/kuisioner/jawaban', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    saveDraft: (payload: { user_id: number; draft: any }) =>
      fetchJson<{ success: boolean }>('/kuisioner/draft', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    getDraft: (userId: number) => fetchJson<any>(`/kuisioner/draft/${userId}`)
  },

  // ── Master Data Sekolah & Responden Services ──────────────────────────────
  sekolah: {
    getAll: (params?: { kecamatan_id?: number; search?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchJson<{ data: any[]; total: number }>(`/sekolah?${query}`);
    },
    getById: (id: number) => fetchJson<any>(`/sekolah/${id}`),
    update: (id: number, data: any) =>
      fetchJson<any>(`/sekolah/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  },

  responden: {
    getAll: (params?: { kabupaten_id?: number; kecamatan_id?: number; search?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchJson<{ data: any[]; total: number }>(`/responden?${query}`);
    }
  },

  // ── Observasi SEL Services ───────────────────────────────────────────────
  sel: {
    getIndikator: () => fetchJson<any[]>('/sel/indikator'),
    createIndikator: (data: any) =>
      fetchJson<any>('/sel/indikator', { method: 'POST', body: JSON.stringify(data) }),
    updateIndikator: (id: number, data: any) =>
      fetchJson<any>(`/sel/indikator/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteIndikator: (id: number) =>
      fetchJson<{ success: boolean }>(`/sel/indikator/${id}`, { method: 'DELETE' }),

    submitSesiObservasi: (payload: { sesi: any; jawaban: any[] }) =>
      fetchJson<{ success: boolean; sesi_id: number }>('/sel/sesi', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    getAnalisisHeatmap: () => fetchJson<any[]>('/sel/analisis/heatmap'),
    getRadarData: (sekolahId: number) => fetchJson<any>(`/sel/analisis/radar/${sekolahId}`)
  },

  // ── Suara Responden Services ─────────────────────────────────────────────
  suara: {
    getAll: (params?: { sentimen?: string; modul_id?: number; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchJson<{ data: any[]; total: number }>(`/suara?${query}`);
    },
    submitFeedback: (feedback: { sekolah_id: number; modul_id?: number; komentar: string; sentimen: string }) =>
      fetchJson<{ success: boolean }>('/suara', {
        method: 'POST',
        body: JSON.stringify(feedback)
      })
  },

  // ── Laporan & Export Services ────────────────────────────────────────────
  laporan: {
    generateReport: (options: { tipe: 'pdf' | 'excel' | 'docx'; filter: any }) =>
      fetchJson<{ downloadUrl: string; reportId: number }>('/laporan/generate', {
        method: 'POST',
        body: JSON.stringify(options)
      }),
    getHistory: () => fetchJson<any[]>('/laporan/history')
  },

  // ── Settings Services ────────────────────────────────────────────────────
  setting: {
    getPreferences: () => fetchJson<any>('/setting/preferences'),
    updatePreferences: (prefs: any) =>
      fetchJson<{ success: boolean }>('/setting/preferences', {
        method: 'PUT',
        body: JSON.stringify(prefs)
      }),
    getNotifications: () => fetchJson<any[]>('/setting/notifikasi'),
    markNotificationRead: (id: number) =>
      fetchJson<{ success: boolean }>(`/setting/notifikasi/${id}/read`, { method: 'PUT' })
  }
};
