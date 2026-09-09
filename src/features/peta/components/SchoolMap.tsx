/**
 * @module features/peta/components
 * @description Komponen Peta Sekolah Jawa Timur (Leaflet Real Map + Tile CARTO Positron)
 */

import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  School, 
  MapPin, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Building2, 
  Users, 
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import schoolDataRaw from '../../../shared/data/sekolah-map-data.json';
import CustomSelect from '../../../shared/components/CustomSelect';

export interface SchoolMapItem {
  id: string;
  npsn: string;
  nama: string;
  kecamatan: string;
  kabupaten: string;
  alamat: string;
  latitude: number;
  longitude: number;
  hasCoordinates: boolean;
  status: 'sudah' | 'sebagian' | 'belum';
  respondenCount: number;
  totalGuru: number;
  totalSiswa: number;
  statusSekolah: string;
}

const schoolData = schoolDataRaw as SchoolMapItem[];

// SVG Custom Marker Generator
const createCustomMarkerIcon = (status: 'sudah' | 'sebagian' | 'belum') => {
  let colorHex = '#e11d48'; // Merah (Belum)
  if (status === 'sudah') colorHex = '#10b981'; // Hijau (Sudah)
  if (status === 'sebagian') colorHex = '#f59e0b'; // Kuning (Sebagian)

  const svgHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36">
      <path fill="${colorHex}" stroke="#ffffff" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z"/>
      <circle cx="12" cy="11" r="4.5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32]
  });
};

// Helper Component untuk berpindah viewport peta
function MapFlyToController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export default function SchoolMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolMapItem | null>(null);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-7.4478, 112.7183]); // Default Sidoarjo
  const [mapZoom, setMapZoom] = useState<number>(11);

  // Separate valid vs missing coordinate schools
  const { validSchools, missingSchools, kabupatenList } = useMemo(() => {
    const valid: SchoolMapItem[] = [];
    const missing: SchoolMapItem[] = [];
    const kabSet = new Set<string>();

    schoolData.forEach((s) => {
      kabSet.add(s.kabupaten);
      if (s.hasCoordinates) {
        valid.push(s);
      } else {
        missing.push(s);
      }
    });

    return {
      validSchools: valid,
      missingSchools: missing,
      kabupatenList: Array.from(kabSet)
    };
  }, []);

  // Filtered Schools with coordinates
  const filteredValidSchools = useMemo(() => {
    return validSchools.filter((s) => {
      const matchSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.npsn.includes(searchQuery) ||
        s.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKab = selectedKabupaten === 'all' || s.kabupaten === selectedKabupaten;
      const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;

      return matchSearch && matchKab && matchStatus;
    });
  }, [searchQuery, selectedKabupaten, selectedStatus, validSchools]);

  // Status Summary Stats
  const statusStats = useMemo(() => {
    const sudah = schoolData.filter(s => s.status === 'sudah').length;
    const sebagian = schoolData.filter(s => s.status === 'sebagian').length;
    const belum = schoolData.filter(s => s.status === 'belum').length;
    return { sudah, sebagian, belum, total: schoolData.length };
  }, []);

  // Reset focus to Sidoarjo
  const handleResetFocusSidoarjo = () => {
    setMapCenter([-7.4478, 112.7183]);
    setMapZoom(11);
  };

  // Reset focus to Whole East Java Context
  const handleFocusWholeJatim = () => {
    setMapCenter([-7.6000, 112.5000]);
    setMapZoom(9);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              GIS School Mapping
            </span>
            <span className="text-xs text-text-tertiary">| Real Geolocation</span>
          </div>
          <h1 className="text-xl font-bold font-display text-text-primary">
            Peta Geografis Titik Lokasi Sekolah Jawa Timur
          </h1>
          <p className="text-xs text-text-secondary">
            Visualisasi titik lokasi asli {statusStats.total.toLocaleString('id-ID')} SD mitra BSAN berdasarkan status pengisian kuesioner.
          </p>
        </div>

        {/* Action Quick Focus Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetFocusSidoarjo}
            className="px-3.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Fokus Sidoarjo</span>
          </button>

          <button
            onClick={handleFocusWholeJatim}
            className="px-3.5 py-2 rounded-xl bg-surface-hover border border-border text-text-primary hover:bg-border text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Maximize2 className="h-3.5 w-3.5 text-text-tertiary" />
            <span>Fokus Seluruh Jatim</span>
          </button>
        </div>
      </div>

      {/* Filter & Stat Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Cari sekolah, NPSN, atau kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Custom Select Filters */}
          <div className="flex items-center gap-2">
            <div className="w-44">
              <CustomSelect
                value={selectedKabupaten}
                onChange={(val) => setSelectedKabupaten(val)}
                options={[
                  { value: 'all', label: 'Semua Kabupaten/Kota' },
                  ...kabupatenList.map(k => ({ value: k, label: k }))
                ]}
              />
            </div>

            <div className="w-40">
              <CustomSelect
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'sudah', label: 'Sudah (Lengkap)' },
                  { value: 'sebagian', label: 'Sebagian' },
                  { value: 'belum', label: 'Belum' }
                ]}
              />
            </div>
          </div>

        </div>

        {/* Legend Pills & Missing Coordinate Warning */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-text-secondary flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-primary" /> Legenda Status:
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Sudah ({statusStats.sudah})
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Sebagian ({statusStats.sebagian})
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Belum ({statusStats.belum})
            </span>
          </div>

          {/* Missing Coordinate Notification */}
          {missingSchools.length > 0 && (
            <button
              onClick={() => setShowMissingModal(true)}
              className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 transition-all"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>{missingSchools.length} Sekolah Belum Ada Koordinat</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map Box & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left 3 Columns: Leaflet Map Container */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-surface overflow-hidden shadow-card relative min-h-[550px] flex flex-col">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '550px', zIndex: 1 }}
            className="rounded-2xl"
          >
            <MapFlyToController center={mapCenter} zoom={mapZoom} />

            {/* OpenStreetMap Basemap (100% Free & No API Key Required) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Plot All Valid School Markers */}
            {filteredValidSchools.map((school) => (
              <Marker
                key={school.id}
                position={[school.latitude, school.longitude]}
                icon={createCustomMarkerIcon(school.status)}
                eventHandlers={{
                  click: () => setSelectedSchool(school)
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-1.5 text-slate-800">
                    <div className="flex items-center justify-between gap-2 border-b pb-1">
                      <span className="text-[10px] font-mono text-slate-500">NPSN: {school.npsn}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded text-white ${
                        school.status === 'sudah' ? 'bg-emerald-600' :
                        school.status === 'sebagian' ? 'bg-amber-500' : 'bg-rose-600'
                      }`}>
                        {school.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {school.nama}
                    </h4>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <p>Kec. {school.kecamatan}, {school.kabupaten}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{school.alamat}</p>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] border-t border-slate-200">
                      <span>Guru: <strong>{school.totalGuru}</strong></span>
                      <span>Siswa: <strong>{school.totalSiswa}</strong></span>
                      <span>Responden: <strong className="text-blue-600">{school.respondenCount}</strong></span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Bottom Bar Info Count */}
          <div className="p-2.5 bg-surface border-t border-border flex items-center justify-between text-xs text-text-tertiary">
            <span>Menampilkan <strong>{filteredValidSchools.length}</strong> titik sekolah di peta</span>
            <span className="font-mono text-[11px]">CARTO Voyager Basemap</span>
          </div>
        </div>

        {/* Right 1 Column: Selected School Detail Side Panel */}
        <div className="space-y-3">
          {selectedSchool ? (
            <div className="p-4 rounded-2xl bg-surface border border-border shadow-card space-y-4 animate-fade-in">
              <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Detil Sekolah Terpilih</span>
                  <h3 className="text-base font-bold font-display text-text-primary leading-tight">
                    {selectedSchool.nama}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="p-1 rounded-lg hover:bg-surface-hover text-text-tertiary"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-tertiary">NPSN:</span>
                  <span className="font-mono font-bold text-text-primary">{selectedSchool.npsn}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-tertiary">Status Survei:</span>
                  <span className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
                    selectedSchool.status === 'sudah' ? 'bg-emerald-500/10 text-emerald-600' :
                    selectedSchool.status === 'sebagian' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                  }`}>
                    {selectedSchool.status}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-tertiary">Kecamatan:</span>
                  <span className="font-medium text-text-primary">{selectedSchool.kecamatan}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-tertiary">Kabupaten/Kota:</span>
                  <span className="font-medium text-text-primary">{selectedSchool.kabupaten}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-tertiary">Koordinat Lat/Long:</span>
                  <span className="font-mono text-[11px] text-text-secondary">
                    {selectedSchool.latitude.toFixed(4)}, {selectedSchool.longitude.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-background border border-border text-center">
                  <span className="text-[10px] text-text-tertiary">Total Guru</span>
                  <p className="text-sm font-bold text-text-primary">{selectedSchool.totalGuru}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-background border border-border text-center">
                  <span className="text-[10px] text-text-tertiary">Total Siswa</span>
                  <p className="text-sm font-bold text-text-primary">{selectedSchool.totalSiswa}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMapCenter([selectedSchool.latitude, selectedSchool.longitude]);
                  setMapZoom(15);
                }}
                className="w-full py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Zoom ke Lokasi Sekolah</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-3 min-h-[220px] flex flex-col items-center justify-center">
              <Building2 className="h-8 w-8 text-text-tertiary opacity-40" />
              <p className="text-xs text-text-secondary max-w-xs">
                Klik salah satu marker titik sekolah di peta untuk melihat rincian lokasi dan status kuesioner.
              </p>
            </div>
          )}

          {/* Quick Stats Box */}
          <div className="p-4 rounded-2xl bg-surface border border-border shadow-card space-y-2 text-xs">
            <h4 className="font-bold text-text-primary uppercase tracking-wider">Cakupan Wilayah Mitra</h4>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-text-secondary">
                <span>Kab. Sidoarjo</span>
                <span className="font-mono font-bold">588 SD</span>
              </div>
              <div className="flex justify-between items-center text-text-secondary">
                <span>Kota Batu</span>
                <span className="font-mono font-bold">81 SD</span>
              </div>
              <div className="flex justify-between items-center text-text-secondary">
                <span>Kab. Tuban</span>
                <span className="font-mono font-bold">569 SD</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Missing Coordinates Checklist */}
      {showMissingModal && (
        <div className="fixed inset-0 z-[9999] bg-black/75 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-text-primary">
                  Daftar Sekolah Belum Ada Koordinat ({missingSchools.length})
                </h3>
              </div>
              <button
                onClick={() => setShowMissingModal(false)}
                className="p-1 rounded-lg hover:bg-surface-hover text-text-tertiary"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Sekolah berikut belum memiliki data Latitude & Longitude di file mentah Dapodik. Perlu diisi secara manual:
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {missingSchools.map((sch, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-background border border-border text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-text-primary">{sch.nama}</p>
                    <p className="text-[10px] text-text-tertiary">NPSN: {sch.npsn} | Kec. {sch.kecamatan}, {sch.kabupaten}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    No Lat/Long
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMissingModal(false)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Tutup Checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
