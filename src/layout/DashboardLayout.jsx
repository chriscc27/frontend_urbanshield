import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Home, PlusCircle, FileText, Bell, User, Settings, HelpCircle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import TopHeader from '../components/common/TopHeader';

const citizenLinks = [
  { path: '/dashboard', label: 'Panel Principal', icon: Home, exact: true },
  { path: '/report/new', label: 'Nuevo Reporte', icon: PlusCircle, exact: false },
  { path: '/reports', label: 'Mis Reportes', icon: FileText, exact: false },
  { path: '/notifications', label: 'Notificaciones', icon: Bell, exact: false },
  { path: '/profile', label: 'Mi Perfil', icon: User, exact: false },
  { path: '/settings', label: 'Configuración', icon: Settings, exact: false },
  { path: '/help', label: 'Ayuda', icon: HelpCircle, exact: false },
];

const pageTitles = {
  '/dashboard': 'Panel Ciudadano',
  '/report/new': 'Crear Reporte',
  '/reports': 'Mis Reportes',
  '/notifications': 'Notificaciones',
  '/profile': 'Mi Perfil',
  '/settings': 'Configuración',
  '/help': 'Centro de Ayuda',
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith('/reports/')) return 'Detalles del Reporte';
    return 'UrbanShield';
  };

  return (
    <div className="flex h-screen bg-primary-bg overflow-hidden" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
      <Sidebar links={citizenLinks} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        <TopHeader onMenuClick={() => setIsSidebarOpen(true)} title={getTitle()} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
