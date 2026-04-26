'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminRequestsApi } from '@/entities/request/api';
import type { RequestOrder, RequestStatus } from '@/entities/request/types';

const STATUS_COLORS: Record<RequestStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-purple-100 text-purple-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: 'Новый',
  IN_REVIEW: 'На рассмотрении',
  CONFIRMED: 'Подтверждён',
  PROCESSING: 'В обработке',
  COMPLETED: 'Выполнен',
  CANCELLED: 'Отменён',
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RequestOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await adminRequestsApi.getList({
        page,
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setRequests(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Заявки</h1>
        <p className="text-[#5B6470]">Управление заказами клиентов</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#D9DCDD]">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
          >
            <option value="all">Все статусы</option>
            <option value="NEW">Новые</option>
            <option value="IN_REVIEW">На рассмотрении</option>
            <option value="CONFIRMED">Подтверждённые</option>
            <option value="PROCESSING">В обработке</option>
            <option value="COMPLETED">Выполненные</option>
            <option value="CANCELLED">Отменённые</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
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
                  Товаров
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
                <th className="px-6 py-3 text-right text-xs font-semibold text-[#5B6470] uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DCDD]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Загрузка...</div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Заявки не найдены</div>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#000000]">
                        {request.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#000000]">
                        {request.customer.name}
                      </div>
                      <div className="text-xs text-[#5B6470]">{request.contactEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6470]">
                      {request.items.length} шт.
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                      {request.totalAmount} ₽
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_COLORS[request.status]
                        }`}
                      >
                        {STATUS_LABELS[request.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6470]">
                      {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="text-sm text-[#000000] font-semibold hover:underline"
                      >
                        Просмотр →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {requests.length > 0 && (
          <div className="px-6 py-4 border-t border-[#D9DCDD] flex items-center justify-between">
            <div className="text-sm text-[#5B6470]">
              Показано {requests.length} из {total} заявок
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-[#D9DCDD] disabled:opacity-50 hover:bg-[#F5F4EF]"
              >
                Назад
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={requests.length < limit}
                className="px-4 py-2 rounded-lg border border-[#D9DCDD] disabled:opacity-50 hover:bg-[#F5F4EF]"
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
