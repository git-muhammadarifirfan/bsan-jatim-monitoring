/**
 * @module features/peta/pages
 * @description Halaman Peta Geospasial Interaktif Kecamatan & Titik Lokasi Sekolah Jawa Timur
 */

import React, { useState } from 'react';
import { Map, School as SchoolIcon, Sparkles } from 'lucide-react';
import SchoolMap from '../components/SchoolMap';

export default function KecamatanMapPage() {
  const [activeTab, setActiveTab] = useState<'schools' | 'overview'>('schools');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Tab Switch Bar */}
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-card">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('schools')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schools'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <SchoolIcon className="h-4 w-4" />
            <span>Peta Titik Sekolah Asli (GIS Leaflet)</span>
          </button>
        </div>

        <span className="text-xs text-text-tertiary hidden sm:inline-flex items-center gap-1 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          CARTO Voyager Tile & Geolocation Real-time
        </span>
      </div>

      {/* Main Content Render */}
      <SchoolMap />
    </div>
  );
}
