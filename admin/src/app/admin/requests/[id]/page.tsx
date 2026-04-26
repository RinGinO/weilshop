'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminRequestsApi } from '@/entities/request/api';
import type { RequestOrder, RequestStatus, UpdateRequestStatusDto } from '@/entities/request/types';

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

const STATUS_FLOW: RequestStatus[] = [
  'NEW',
  'IN_REVIEW',
  'CONFIRMED',
  'PROCESSING',
  'COMPLETED',
];

export default function AdminRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<RequestOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus>('NEW');
  const [statusComment, setStatusComment] = useState('');

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    setIsLoading(true);
    try {
      const data = await adminRequestsApi.getById(id);
      setRequest(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error('Failed to load request:', error);
      alert('Ошибка загрузки заявки');
      router.push('/admin/requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!request || newStatus === request.status) return;

    setIsUpdating(true);
    try {
      const data: UpdateRequestStatusDto = {
        status: newStatus,
        comment: statusComment || undefined,
      };
      const updated = await adminRequestsApi.updateStatus(id, data);
      setRequest(updated);
      setStatusComment('');
      alert('Статус успешно обновлён');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при обновлении статуса');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000000] mx-auto mb-4" />
          <p className="text-[#5B6470]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-[#5B6470]">Заявка не найдена</p>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(request.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/requests"
              className="text-sm text-[#5B6470] hover:text-[#000000]"
            >
              ← Назад к заявкам
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-[#000000]">{request.orderNumber}</h1>
          <p className="text-[#5B6470]">
            от {new Date(request.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            STATUS_COLORS[request.status]
          }`}
        >
          {STATUS_LABELS[request.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
            <h2 className="text-xl font-bold text-[#000000] mb-6">Товары в заказе</h2>
            <div className="space-y-4">
              {request.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-[#D9DCDD] last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#F5F4EF] rounded-lg flex items-center justify-center text-2xl">
                      🧴
                    </div>
                    <div>
                      <Link
                        href={`/catalog/${item.productSlug}`}
                        target="_blank"
                        className="font-semibold text-[#000000] hover:underline"
                      >
                        {item.productName}
                      </Link>
                      {item.volume && (
                        <div className="text-sm text-[#5B6470]">{item.volume}</div>
                      )}
                      <div className="text-sm text-[#5B6470]">
                        {item.quantity} шт. × {item.price} ₽
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#000000]">
                    {item.subtotal} ₽
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#D9DCDD] flex items-center justify-between">
              <span className="text-lg font-semibold text-[#000000]">Итого:</span>
              <span className="text-2xl font-bold text-[#000000]">
                {request.totalAmount} ₽
              </span>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
            <h2 className="text-xl font-bold text-[#000000] mb-6">История статусов</h2>
            <div className="space-y-4">
              {request.statusHistory.map((history, index) => (
                <div key={history.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        STATUS_COLORS[history.status].split(' ')[0]
                      }`}
                    />
                    {index < request.statusHistory.length - 1 && (
                      <div className="w-0.5 h-8 bg-[#D9DCDD] mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          STATUS_COLORS[history.status]
                        }`}
                      >
                        {STATUS_LABELS[history.status]}
                      </span>
                      <span className="text-sm text-[#5B6470]">
                        {new Date(history.changedAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {history.comment && (
                      <p className="text-sm text-[#5B6470] mt-1">{history.comment}</p>
                    )}
                    {history.changedBy && (
                      <p className="text-xs text-[#5B6470] mt-1">
                        Изменил: {history.changedBy}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
            <h2 className="text-xl font-bold text-[#000000] mb-6">Клиент</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-[#5B6470] mb-1">ФИО</div>
                <div className="font-semibold text-[#000000]">
                  {request.customer.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-[#5B6470] mb-1">Email</div>
                <a
                  href={`mailto:${request.contactEmail}`}
                  className="font-semibold text-[#000000] hover:underline"
                >
                  {request.contactEmail}
                </a>
              </div>
              {request.contactPhone && (
                <div>
                  <div className="text-sm text-[#5B6470] mb-1">Телефон</div>
                  <a
                    href={`tel:${request.contactPhone}`}
                    className="font-semibold text-[#000000] hover:underline"
                  >
                    {request.contactPhone}
                  </a>
                </div>
              )}
              <div>
                <div className="text-sm text-[#5B6470] mb-1">Способ доставки</div>
                <div className="font-semibold text-[#000000]">
                  {request.deliveryMethod}
                </div>
              </div>
              {request.deliveryAddress && (
                <div>
                  <div className="text-sm text-[#5B6470] mb-1">Адрес доставки</div>
                  <div className="font-semibold text-[#000000]">
                    {request.deliveryAddress}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
            <h2 className="text-xl font-bold text-[#000000] mb-6">Изменить статус</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Новый статус
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as RequestStatus)}
                  className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                >
                  {STATUS_FLOW.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                  {request.status === 'CANCELLED' && (
                    <option value="CANCELLED">Отменён</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Комментарий
                </label>
                <textarea
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  rows={3}
                  placeholder="Комментарий к изменению статуса..."
                  className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={
                  isUpdating ||
                  (newStatus === request.status && !statusComment) ||
                  request.status === 'COMPLETED' ||
                  request.status === 'CANCELLED'
                }
                className="w-full bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {isUpdating ? 'Обновление...' : 'Обновить статус'}
              </button>
            </div>
          </div>

          {/* Comment */}
          {request.comment && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
              <h2 className="text-xl font-bold text-[#000000] mb-4">
                Комментарий клиента
              </h2>
              <p className="text-[#5B6470]">{request.comment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
