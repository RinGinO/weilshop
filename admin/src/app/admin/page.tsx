'use client';

import Link from 'next/link';

const STATS = [
  { label: 'Товаров', value: '156', change: '+12%', icon: '🧴', color: 'bg-blue-500' },
  { label: 'Заказов', value: '48', change: '+8%', icon: '📦', color: 'bg-green-500' },
  { label: 'Заявок', value: '23', change: '+15%', icon: '📋', color: 'bg-yellow-500' },
  { label: 'Консультаций', value: '12', change: '+5%', icon: '💬', color: 'bg-purple-500' },
];

const RECENT_ORDERS = [
  { id: 'ORD-048', customer: 'Иван Петров', total: 4580, status: 'processing', date: '2025-01-15' },
  { id: 'ORD-047', customer: 'Анна Смирнова', total: 8900, status: 'new', date: '2025-01-15' },
  { id: 'ORD-046', customer: 'Дмитрий Козлов', total: 2190, status: 'completed', date: '2025-01-14' },
  { id: 'ORD-045', customer: 'Елена Морозова', total: 6750, status: 'processing', date: '2025-01-14' },
  { id: 'ORD-044', customer: 'Алексей Волков', total: 3200, status: 'completed', date: '2025-01-13' },
];

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  new: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Выполнен',
  processing: 'В обработке',
  new: 'Новый',
  cancelled: 'Отменён',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Дашборд</h1>
        <p className="text-[#5B6470]">Обзор статистики и последних заказов</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <span className="text-sm text-green-600 font-semibold">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold text-[#000000] mb-1">{stat.value}</div>
            <div className="text-sm text-[#5B6470]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD]">
        <div className="p-6 border-b border-[#D9DCDD] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#000000]">Последние заказы</h2>
          <Link
            href="/admin/requests"
            className="text-sm text-[#000000] font-semibold hover:underline"
          >
            Все заказы →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Заказ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Дата
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DCDD]">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-[#F5F4EF]">
                  <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5B6470]">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                    {order.total} ₽
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[order.status]
                      }`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5B6470]">
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD] hover:border-[#000000] transition-colors"
        >
          <div className="text-3xl mb-3">➕</div>
          <h3 className="font-semibold text-[#000000] mb-1">Добавить товар</h3>
          <p className="text-sm text-[#5B6470]">Создать новую карточку товара</p>
        </Link>
        <Link
          href="/admin/requests"
          className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD] hover:border-[#000000] transition-colors"
        >
          <div className="text-3xl mb-3">📦</div>
          <h3 className="font-semibold text-[#000000] mb-1">Обработать заявки</h3>
          <p className="text-sm text-[#5B6470]">Новые заказы требуют внимания</p>
        </Link>
        <Link
          href="/admin/consultations"
          className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD] hover:border-[#000000] transition-colors"
        >
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-[#000000] mb-1">Консультации</h3>
          <p className="text-sm text-[#5B6470]">Ответить на запросы клиентов</p>
        </Link>
      </div>
    </div>
  );
}
