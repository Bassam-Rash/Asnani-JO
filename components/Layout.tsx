
import React, { useState } from 'react';
import { User, UserRole } from '../types';

const SparkleToothIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 85C55 85 62 78 68 70C75 60 78 45 78 35C78 22 70 15 50 15C30 15 22 22 22 35C22 45 25 60 32 70C38 78 45 85 50 85Z" fill="#e0f2fe" opacity="0.3" />
    <path d="M50 82C54 82 58 78 63 70C68 62 72 50 72 38C72 25 65 18 50 18C35 18 28 25 28 38C28 50 32 62 37 70C42 78 46 82 50 82Z" fill="white" stroke="#0ea5e9" strokeWidth="2.5" />
    <path d="M38 28C42 25 46 25 50 28C54 25 58 25 62 28" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 35L18 38L21 35L18 32L15 35Z" fill="white" stroke="#0ea5e9" strokeWidth="1" />
    <path d="M85 25L88 28L91 25L88 22L85 25Z" fill="white" stroke="#0ea5e9" strokeWidth="1" />
    <path d="M80 60L83 65L88 68L83 71L80 76L77 71L72 68L77 65L80 60Z" fill="white" stroke="#0ea5e9" strokeWidth="1" />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = {
    [UserRole.STUDENT]: [
      { id: 'dashboard', label: 'لوحة التحكم', icon: '📊' },
      { id: 'cases', label: 'الحالات المتاحة', icon: '🦷' },
      { id: 'pending-cases', label: 'حالات قيد التنفيذ', icon: '⏳' },
      { id: 'profile', label: 'ملفي الشخصي', icon: '👤' },
    ],
    [UserRole.PATIENT]: [
      { id: 'patient-dashboard', label: 'لوحة التحكم', icon: '📊' },
      { id: 'submit-case', label: 'تقديم حالة جديدة', icon: '📝' },
      { id: 'profile', label: 'ملفي الشخصي', icon: '👤' },
    ],
    [UserRole.ADMIN]: [
      { id: 'admin-dashboard', label: 'نظرة عامة', icon: '🏢' },
      { id: 'profile', label: 'ملفي الشخصي', icon: '👤' },
    ]
  };

  const currentMenu = menuItems[user.role] || [];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-right font-['Cairo']" dir="rtl">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-sky-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-sky-50 flex items-center gap-3">
            <SparkleToothIcon className="w-12 h-12" />
            <h2 className="text-xl font-black text-sky-500 tracking-tight">أسناني JO</h2>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {currentMenu.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                      : 'text-slate-400 hover:bg-sky-50 hover:text-sky-500'}
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-6 bg-slate-50 border-t border-sky-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-black text-sm truncate text-slate-700">{user.name}</p>
                <p className="text-[10px] text-sky-500 font-bold uppercase">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-2 rounded-lg border border-sky-200 text-xs font-bold text-sky-500 hover:bg-sky-500 hover:text-white transition-all"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-sky-50 flex items-center justify-between px-10 sticky top-0 z-30">
          <h1 className="text-xl font-black text-slate-800">
            {currentMenu.find(i => i.id === activeTab)?.label || 'الرئيسية'}
          </h1>
          <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
