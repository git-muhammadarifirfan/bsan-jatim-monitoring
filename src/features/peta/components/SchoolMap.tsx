/**
 * @module features/peta/components
 * @description Komponen Peta GIS Sekolah Jawa Timur — Ultra Clean, Minimalist & Modern SaaS Design
 */

import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { 
  School, 
  MapPin, 
  Search, 
  Filter, 
  AlertTriangle, 
  Building2, 
  Users, 
  Maximize2,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2
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

// Modern Sleek Pin Dot Marker (Clear & Distinct)
const createCustomMarkerIcon = (status: 'sudah' | 'sebagian' | 'belum') => {
  let colorHex = '#e11d48'; // Merah
  if (status === 'sudah') colorHex = '#10b981'; // Hijau
  if (status === 'sebagian') colorHex = '#f59e0b'; // Kuning

  const html = `
    <div style="
      position: relative;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    ">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: ${colorHex};
        opacity: 0.25;
        animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: ${colorHex};
        border: 2.5px solid #ffffff;
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
      ">
        <div style="
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #ffffff;
        "></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-modern-dot-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14]
  });
};

// Sleek Pill Cluster Icon Generator
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `
      <div style="
        background: #0f172a;
        color: #ffffff;
        border: 2px solid #ffffff;
        border-radius: 9999px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: #6366f1;"></span>
        <span>${count} Sekolah</span>
      </div>
    `,
    className: 'custom-sleek-cluster-icon',
    iconSize: [80, 26],
    iconAnchor: [40, 13]
  });
};

// Helper Component untuk kontrol viewport
function MapFlyToController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.0 });
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

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Top Filter & Status Bar (Minimalist Flat Layout) */}
      <div className="bg-surface p-4 rounded-2xl border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Search & Quick Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Cari sekolah, NPSN, kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border/80 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="w-44">
            <CustomSelect
              value={selectedKabupaten}
              onChange={(val) => setSelectedKabupaten(val)}
              options={[
                { value: 'all', label: 'Semua Wilayah' },
                ...kabupatenList.map(k => ({ value: k, label: k }))
              ]}
            />
          </div>

          <div className="w-36">
            <CustomSelect
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'sudah', label: 'Sudah' },
                { value: 'sebagian', label: 'Sebagian' },
                { value: 'belum', label: 'Belum' }
              ]}
            />
          </div>
        </div>

        {/* Right Region Shortcut & Missing Coordinates Badge */}
        <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border/60">
          <button
            onClick={() => {
              setMapCenter([-7.4478, 112.7183]);
              setMapZoom(11);
            }}
            className="px-3 py-1.5 rounded-xl bg-background hover:bg-surface-hover border border-border text-text-secondary text-xs font-bold transition-all"
          >
            Sidoarjo
          </button>

          <button
            onClick={() => {
              setMapCenter([-7.6000, 112.5000]);
              setMapZoom(9);
            }}
            className="px-3 py-1.5 rounded-xl bg-background hover:bg-surface-hover border border-border text-text-secondary text-xs font-bold transition-all"
          >
            Seluruh Jatim
          </button>

          {missingSchools.length > 0 && (
            <button
              onClick={() => setShowMissingModal(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{missingSchools.length} No Coord</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map Box & Floating Overlay Card */}
      <div className="relative rounded-2xl border border-border bg-surface overflow-hidden shadow-sm min-h-[580px]">
        
        {/* Leaflet Map Canvas */}
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '580px', zIndex: 1 }}
          className="rounded-2xl"
        >
          <MapFlyToController center={mapCenter} zoom={mapZoom} />

          {/* OpenStreetMap Standard Basemap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Smart Marker Cluster Group */}
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
          >
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
                  <div className="p-1 space-y-1.5 text-slate-800 max-w-xs">
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

                    <div className="pt-1.5 flex items-center justify-between text-[10px] border-t border-slate-200">
                      <span>Guru: <strong>{school.totalGuru}</strong></span>
                      <span>Siswa: <strong>{school.totalSiswa}</strong></span>
                      <span>Responden: <strong className="text-blue-600">{school.respondenCount}</strong></span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Floating Top-Left Status Summary Capsule */}
        <div className="absolute top-4 left-4 z-20 bg-surface/90 backdrop-blur-md border border-border/80 p-2.5 rounded-xl shadow-lg flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-text-secondary">Sudah:</span>
            <span className="font-bold text-text-primary">{statusStats.sudah}</span>
          </div>

          <div className="h-3 w-px bg-border" />

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="font-medium text-text-secondary">Sebagian:</span>
            <span className="font-bold text-text-primary">{statusStats.sebagian}</span>
          </div>

          <div className="h-3 w-px bg-border" />

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="font-medium text-text-secondary">Belum:</span>
            <span className="font-bold text-text-primary">{statusStats.belum}</span>
          </div>
        </div>

        {/* Floating Bottom-Left Total Indicator */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700">
          <Building2 className="h-3.5 w-3.5 text-indigo-400" />
          <span>Menampilkan <strong>{filteredValidSchools.length}</strong> Titik Sekolah</span>
        </div>

        {/* Floating Right Detail Drawer Card */}
        {selectedSchool && (
          <div className="absolute top-4 right-4 bottom-4 z-20 w-80 bg-surface/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl p-4 flex flex-col justify-between animate-fade-in overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-mono text-text-tertiary uppercase">NPSN: {selectedSchool.npsn}</span>
                  <h3 className="text-sm font-bold font-display text-text-primary leading-snug">
                    {selectedSchool.nama}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="p-1 rounded-lg hover:bg-surface-hover text-text-tertiary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-tertiary">Status Kuesioner:</span>
                  <span className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                    selectedSchool.status === 'sudah' ? 'bg-emerald-500/10 text-emerald-600' :
                    selectedSchool.status === 'sebagian' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                  }`}>
                    {selectedSchool.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-tertiary">Kecamatan:</span>
                  <span className="font-semibold text-text-primary">{selectedSchool.kecamatan}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-tertiary">Kabupaten/Kota:</span>
                  <span className="font-semibold text-text-primary">{selectedSchool.kabupaten}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-tertiary">Bentuk / Status:</span>
                  <span className="font-semibold text-text-primary">SD {selectedSchool.statusSekolah}</span>
                </div>

                <div className="pt-2">
                  <span className="text-text-tertiary block mb-1">Alamat Jalan:</span>
                  <p className="text-[11px] text-text-secondary bg-background p-2 rounded-xl border border-border/60">
                    {selectedSchool.alamat}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-background border border-border/80 text-center">
                  <span className="text-[10px] text-text-tertiary">Total Guru</span>
                  <p className="text-sm font-bold text-text-primary">{selectedSchool.totalGuru}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-background border border-border/80 text-center">
                  <span className="text-[10px] text-text-tertiary">Total Siswa</span>
                  <p className="text-sm font-bold text-text-primary">{selectedSchool.totalSiswa}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setMapCenter([selectedSchool.latitude, selectedSchool.longitude]);
                  setMapZoom(16);
                }}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Zoom ke Lokasi Sekolah</span>
              </button>
            </div>
          </div>
        )}

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
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Sekolah berikut belum memiliki data Latitude & Longitude di file mentah Dapodik:
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
