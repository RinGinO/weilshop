'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuthStore } from '@/entities/admin/store';

const NAVIGATION = [
  { href: '/admin', label: 'Дашборд', icon: '📊' },
  { href: '/admin/products', label: 'Товары', icon: '🧴' },
  { href: '/admin/categories', label: 'Категории', icon: '📁' },
  { href: '/admin/brands', label: 'Бренды', icon: '🏷️' },
  { href: '/admin/tasks', label: 'Задачи ухода', icon: '🎯' },
  { href: '/admin/articles', label: 'Статьи', icon: '📝' },
  { href: '/admin/instructions', label: 'Инструкции', icon: '📋' },
  { href: '/admin/faq', label: 'FAQ', icon: '❓' },
  { href: '/admin/requests', label: 'Заявки', icon: '📦' },
  { href: '/admin/consultations', label: 'Консультации', icon: '💬' },
  { href: '/admin/admins', label: 'Администраторы', icon: '👥' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { checkAuth, isAuthenticated, isLoading, logout, admin } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F4EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000000] mx-auto mb-4" />
          <p className="text-[#5B6470]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#000000] text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/20">
          <Link href="/admin" className="text-xl font-bold">
            WeilShop Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {NAVIGATION.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Info */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
              {admin?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{admin?.name || 'Admin'}</div>
              <div className="text-xs text-white/50 truncate">{admin?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 text-sm text-white/70 hover:text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
          >
            Выйти
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#D9DCDD] flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-[#5B6470] hover:bg-[#F5F4EF] rounded-lg"
          >
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-[#5B6470] hover:text-[#000000]"
            >
              🌐 Сайт
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
