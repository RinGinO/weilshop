'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/auth/store';
import { useCartStore } from '@/entities/cart/store';

const ORDERS = [
  {
    id: 'ORD-001',
    date: '2025-01-10',
    status: 'completed',
    statusLabel: 'Выполнен',
    total: 4580,
    items: 5,
  },
  {
    id: 'ORD-002',
    date: '2025-01-08',
    status: 'processing',
    statusLabel: 'В обработке',
    total: 8900,
    items: 8,
  },
  {
    id: 'ORD-003',
    date: '2025-01-05',
    status: 'new',
    statusLabel: 'Новый',
    total: 2190,
    items: 3,
  },
];

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  new: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const totalItems = useCartStore((state) => state.totalItems);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F4EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000000] mx-auto mb-4" />
          <p className="text-[#5B6470]">Загрузка...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-[#000000] mb-8">Личный кабинет</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD] mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#000000] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-[#000000]">{user.name || 'Пользователь'}</h2>
                <p className="text-sm text-[#5B6470]">{user.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-[#000000] text-white'
                      : 'text-[#1F2328] hover:bg-[#F5F4EF]'
                  }`}
                >
                  👤 Профиль
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-[#000000] text-white'
                      : 'text-[#1F2328] hover:bg-[#F5F4EF]'
                  }`}
                >
                  📦 Заказы
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-[#000000] text-white'
                      : 'text-[#1F2328] hover:bg-[#F5F4EF]'
                  }`}
                >
                  ⚙️ Настройки
                </button>
              </div>

              <button
                onClick={async () => {
                  await logout();
                  router.push('/');
                }}
                className="w-full text-center mt-6 px-4 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Выйти
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
              <h3 className="font-semibold text-[#000000] mb-4">Статистика</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#5B6470]">Заказов</span>
                  <span className="font-semibold text-[#000000]">{ORDERS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6470]">В корзине</span>
                  <span className="font-semibold text-[#000000]">{totalItems()} шт.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6470]">Email</span>
                  <span className={`font-semibold ${user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.isEmailVerified ? '✓ Подтверждён' : '⚠ Не подтверждён'}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-[#D9DCDD]">
                <h2 className="text-2xl font-bold text-[#000000] mb-6">Профиль</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#000000] mb-2">
                        ФИО
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name || ''}
                        className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-[#F5F4EF] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#000000] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-[#E5E5E5] text-[#5B6470] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#000000] mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        defaultValue={user.phone || ''}
                        className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-[#F5F4EF] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#D9DCDD]">
                    <h3 className="font-semibold text-[#000000] mb-4">История заказов</h3>
                    <div className="space-y-3">
                      {ORDERS.map((order) => (
                        <Link
                          key={order.id}
                          href={`/account/orders/${order.id}`}
                          className="block p-4 rounded-lg border border-[#D9DCDD] hover:border-[#000000] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-[#000000]">{order.id}</div>
                              <div className="text-sm text-[#5B6470]">
                                {order.items} товаров • {order.date}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                                {order.statusLabel}
                              </span>
                              <span className="font-bold text-[#000000]">{order.total} ₽</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                      Сохранить изменения
                    </button>
                    <button className="text-[#5B6470] hover:text-[#000000] px-6 py-3">
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-[#D9DCDD]">
                <h2 className="text-2xl font-bold text-[#000000] mb-6">Мои заказы</h2>

                <div className="space-y-4">
                  {ORDERS.map((order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className="block p-6 rounded-xl border border-[#D9DCDD] hover:border-[#000000] hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-lg font-bold text-[#000000]">{order.id}</div>
                          <div className="text-sm text-[#5B6470]">от {order.date}</div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                          {order.statusLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#D9DCDD]">
                        <div className="text-[#5B6470]">
                          {order.items} товаров
                        </div>
                        <div className="text-2xl font-bold text-[#000000]">
                          {order.total} ₽
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-[#D9DCDD]">
                <h2 className="text-2xl font-bold text-[#000000] mb-6">Настройки</h2>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div>
                    <h3 className="font-semibold text-[#000000] mb-4">Смена пароля</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#000000] mb-2">
                          Текущий пароль
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#000000] mb-2">
                          Новый пароль
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#000000] mb-2">
                          Подтверждение пароля
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="pt-6 border-t border-[#D9DCDD]">
                    <h3 className="font-semibold text-[#000000] mb-4">Уведомления</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-[#5B6470]">Email о статусе заказа</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-[#5B6470]">SMS о статусе заказа</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-[#5B6470]">Рассылка новостей и акций</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                      Сохранить настройки
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
