import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Shared Layout Components
import Sidebar from '../shared/components/Sidebar';
import Topbar from '../shared/components/Topbar';

// Feature Pages
import Login from '../features/auth/pages/LoginPage';
import Dashboard from '../features/dashboard/pages/DashboardPage';
import KecamatanMap from '../features/peta/pages/KecamatanMapPage';
import Kuisioner from '../features/kuisioner/pages/KuisionerPage';
import DataResponden from '../features/responden/pages/DataRespondenPage';
import DataSatuanPendidikan from '../features/sekolah/pages/DataSekolahPage';
import ModulBsan from '../features/analisis/pages/ModulBsanPage';
import ProporsiModul from '../features/analisis/pages/ProporsiModulPage';
import GapFunnel from '../features/analisis/pages/GapFunnelPage';
import MatriksKuadran from '../features/analisis/pages/MatriksKuadranPage';
import TantanganImplementasi from '../features/analisis/pages/TantanganPage';
import ObservasiSEL from '../features/sel/pages/ObservasiSELPage';
import AnalisisSEL from '../features/sel/pages/AnalisisSELPage';
import KelolaFormSEL from '../features/sel/pages/KelolaFormSELPage';
import SuaraResponden from '../features/suara/pages/SuaraRespondenPage';
import LaporanEkspor from '../features/laporan/pages/LaporanEksporPage';
import Setting from '../features/setting/pages/SettingPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 1000 * 60 * 5 } },
});

// A wrapper to handle the sidebar auto-close on navigation
function AppContent({
  userRole,
  sidebarOpen,
  setSidebarOpen,
  activeKecamatan,
  setActiveKecamatan,
  searchTerm,
  setSearchTerm,
  handleSwitchRole,
  handleLogout
}: any) {
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans text-text-primary antialiased">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole={userRole} 
        onLogout={handleLogout}
      />
      <div className="flex flex-col flex-1 min-w-0 transition-[padding] duration-300 lg:pl-[260px]">
        <Topbar 
          onMenuClick={() => setSidebarOpen(true)} 
          activeKecamatan={activeKecamatan}
          onClearKecamatan={() => setActiveKecamatan(null)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          userRole={userRole}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto w-full">
            <Routes>
              {userRole === 'admin' ? (
                <>
                  <Route path="/" element={<Dashboard activeKecamatan={activeKecamatan} setActiveKecamatan={setActiveKecamatan} userRole={userRole} />} />
                  <Route path="/map" element={<KecamatanMap />} />
                  <Route path="/kuisioner" element={<Kuisioner userRole={userRole} />} />
                  <Route path="/responden" element={<DataResponden activeKecamatan={activeKecamatan} setActiveKecamatan={setActiveKecamatan} searchTerm={searchTerm} onSearchChange={setSearchTerm} />} />
                  <Route path="/sekolah" element={<DataSatuanPendidikan userRole={userRole} />} />
                  <Route path="/modul" element={<ModulBsan />} />
                  <Route path="/proporsi" element={<ProporsiModul />} />
                  <Route path="/funnel" element={<GapFunnel activeKecamatan={activeKecamatan} />} />
                  <Route path="/matriks" element={<MatriksKuadran activeKecamatan={activeKecamatan} />} />
                  <Route path="/tantangan" element={<TantanganImplementasi activeKecamatan={activeKecamatan} />} />
                  <Route path="/suara" element={<SuaraResponden activeKecamatan={activeKecamatan} userRole={userRole} />} />
                  <Route path="/laporan" element={<LaporanEkspor />} />
                  <Route path="/observasi-sel" element={<ObservasiSEL userRole="admin" />} />
                  <Route path="/kelola-form-sel" element={<KelolaFormSEL />} />
                  <Route path="/analisis-sel" element={<AnalisisSEL />} />
                  <Route path="/setting" element={<Setting />} />
                  <Route path="*" element={<Dashboard activeKecamatan={activeKecamatan} setActiveKecamatan={setActiveKecamatan} userRole={userRole} />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Dashboard activeKecamatan={activeKecamatan} setActiveKecamatan={setActiveKecamatan} userRole={userRole} />} />
                  <Route path="/map" element={<KecamatanMap />} />
                  <Route path="/kuisioner" element={<Kuisioner userRole={userRole} />} />
                  <Route path="/sekolah" element={<DataSatuanPendidikan userRole={userRole} />} />
                  <Route path="/suara" element={<SuaraResponden activeKecamatan={activeKecamatan} userRole={userRole} />} />
                  <Route path="/observasi-sel" element={<ObservasiSEL userRole="school" />} />
                  <Route path="/setting" element={<Setting />} />
                  <Route path="*" element={<Dashboard activeKecamatan={activeKecamatan} setActiveKecamatan={setActiveKecamatan} userRole={userRole} />} />
                </>
              )}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('bsan_logged_in') === 'true';
  });

  const [userRole, setUserRole] = useState<'admin' | 'school'>(() => {
    return (localStorage.getItem('bsan_user_role') as 'admin' | 'school') || 'admin';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKecamatan, setActiveKecamatan] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSwitchRole = (role: 'admin' | 'school') => {
    setUserRole(role);
    localStorage.setItem('bsan_user_role', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('bsan_logged_in');
  };

  const handleLogin = (_email: string, role: 'admin' | 'school') => {
    setUserRole(role);
    setIsLoggedIn(true);
    localStorage.setItem('bsan_logged_in', 'true');
    localStorage.setItem('bsan_user_role', role);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent 
          userRole={userRole}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeKecamatan={activeKecamatan}
          setActiveKecamatan={setActiveKecamatan}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSwitchRole={handleSwitchRole}
          handleLogout={handleLogout}
        />
      </Router>
    </QueryClientProvider>
  );
}
