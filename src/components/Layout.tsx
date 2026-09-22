import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, LogOut, Menu, X, Users, GraduationCap, Calendar, BarChart3, Mail, Settings, FileText, AlertTriangle, Home, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { currentUser, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getMenuItems = () => {
    if (!currentUser) return [];
    switch (currentUser.role) {
      case 'parent':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'children', label: 'Anak Saya', icon: Users },
          { id: 'absence', label: 'Daftar Ketidakhadiran', icon: AlertTriangle },
          { id: 'calendar', label: 'Kalendar', icon: Calendar },
          { id: 'mail', label: 'Mail Inbox', icon: Mail },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'students', label: 'Senarai Pelajar', icon: Users },
          { id: 'absence', label: 'Rekod Ketidakhadiran', icon: AlertTriangle },
          { id: 'warnings', label: 'Amaran', icon: AlertTriangle },
          { id: 'reports', label: 'Laporan', icon: FileText },
          { id: 'mail', label: 'Mail Inbox', icon: Mail },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'users', label: 'Pengguna', icon: Users },
          { id: 'classes', label: 'Kelas', icon: BookOpen },
          { id: 'students', label: 'Pelajar', icon: GraduationCap },
          { id: 'absences', label: 'Ketidakhadiran', icon: AlertTriangle },
          { id: 'calendar', label: 'Kalendar', icon: Calendar },
          { id: 'reports', label: 'Laporan', icon: FileText },
          { id: 'activities', label: 'Aktiviti Rasmi', icon: BarChart3 },
          { id: 'settings', label: 'Tetapan', icon: Settings },
        ];
    }
  };

  const getRoleLabel = () => {
    if (!currentUser) return '';
    switch (currentUser.role) {
      case 'parent': return 'Ibu Bapa/Penjaga';
      case 'teacher': return 'Guru Kelas';
      case 'admin': return 'PK HEM (Super Admin)';
    }
  };

  const getRoleColor = () => {
    if (!currentUser) return 'bg-blue-600';
    switch (currentUser.role) {
      case 'parent': return 'bg-blue-600';
      case 'teacher': return 'bg-green-600';
      case 'admin': return 'bg-purple-600';
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className={`${getRoleColor()} p-4`}>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-white font-bold text-lg">e-HADIR</h1>
              <p className="text-white/80 text-xs">{getRoleLabel()}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {currentUser?.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            Log Keluar
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h2 className="font-medium text-gray-800">e-HADIR</h2>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
