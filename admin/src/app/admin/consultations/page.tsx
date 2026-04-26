'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminConsultationsApi } from '@/entities/consultation/api';
import type { ConsultationRequest, ConsultationStatus } from '@/entities/consultation/types';

const STATUS_COLORS: Record<ConsultationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<ConsultationStatus, string> = {
  PENDING: 'Ожидает',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершена',
  CANCELLED: 'Отменена',
};

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadConsultations = async () => {
    setIsLoading(true);
    try {
      const response = await adminConsultationsApi.getList({
        page,
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setConsultations(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load consultations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Консультации</h1>
        <p className="text-[#5B6470]">Запросы клиентов на подбор товаров</p>
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
            <option value="PENDING">Ожидающие</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="COMPLETED">Завершённые</option>
            <option value="CANCELLED">Отменённые</option>
          </select>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Товары
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Авто
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
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Загрузка...</div>
                  </td>
                </tr>
              ) : consultations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Консультации не найдены</div>
                  </td>
                </tr>
              ) : (
                consultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#000000]">
                        {consultation.customer.name}
                      </div>
                      <div className="text-xs text-[#5B6470]">
                        {consultation.customer.email}
                      </div>
                      {consultation.customer.phone && (
                        <div className="text-xs text-[#5B6470]">
                          {consultation.customer.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#5B6470]">
                        {consultation.requestedProducts.length} товаров
                      </div>
                      {consultation.requestedProducts.slice(0, 2).map((p) => (
                        <div key={p.id} className="text-xs text-[#5B6470] truncate max-w-[200px]">
                          {p.productName}
                        </div>
                      ))}
                      {consultation.requestedProducts.length > 2 && (
                        <div className="text-xs text-[#5B6470]">
                          +{consultation.requestedProducts.length - 2} ещё
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {consultation.vehicleInfo ? (
                        <div className="text-sm text-[#5B6470]">
                          {consultation.vehicleInfo.brand} {consultation.vehicleInfo.model}
                          {consultation.vehicleInfo.year &&
                            `, ${consultation.vehicleInfo.year}`}
                        </div>
                      ) : (
                        <span className="text-sm text-[#5B6470]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_COLORS[consultation.status]
                        }`}
                      >
                        {STATUS_LABELS[consultation.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6470]">
                      {new Date(consultation.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/consultations/${consultation.id}`}
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
        {consultations.length > 0 && (
          <div className="px-6 py-4 border-t border-[#D9DCDD] flex items-center justify-between">
            <div className="text-sm text-[#5B6470]">
              Показано {consultations.length} из {total} консультаций
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
                disabled={consultations.length < limit}
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
