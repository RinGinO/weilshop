'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminConsultationsApi } from '@/entities/consultation/api';
import type {
  ConsultationRequest,
  ConsultationStatus,
  UpdateConsultationDto,
} from '@/entities/consultation/types';

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

export default function AdminConsultationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [consultation, setConsultation] = useState<ConsultationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<ConsultationStatus>('PENDING');
  const [responseComment, setResponseComment] = useState('');

  useEffect(() => {
    loadConsultation();
  }, [id]);

  const loadConsultation = async () => {
    setIsLoading(true);
    try {
      const data = await adminConsultationsApi.getById(id);
      setConsultation(data);
      setNewStatus(data.status);
      setResponseComment(data.responseComment || '');
    } catch (error) {
      console.error('Failed to load consultation:', error);
      alert('Ошибка загрузки консультации');
      router.push('/admin/consultations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const data: UpdateConsultationDto = {
        status: newStatus,
        responseComment: responseComment || undefined,
      };
      const updated = await adminConsultationsApi.update(id, data);
      setConsultation(updated);
      alert('Консультация обновлена');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при обновлении');
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

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <p className="text-[#5B6470]">Консультация не найдена</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/consultations"
              className="text-sm text-[#5B6470] hover:text-[#000000]"
            >
              ← Назад к консультациям
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-[#000000]">
            Консультация от {consultation.customer.name}
          </h1>
          <p className="text-[#5B6470]">
            от {new Date(consultation.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            STATUS_COLORS[consultation.status]
          }`}
        >
          {STATUS_LABELS[consultation.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requested Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
            <h2 className="text-xl font-bold text-[#000000] mb-6">
              Запрошенные товары
            </h2>
            <div className="space-y-4">
              {consultation.requestedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-3 border-b border-[#D9DCDD] last:border-0"
                >
                  <Link
                    href={`/catalog/${product.productSlug}`}
                    target="_blank"
                    className="font-semibold text-[#000000] hover:underline"
                  >
                    {product.productName}
                  </Link>
                  <span className="text-sm text-[#5B6470]">→</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Info */}
          {consultation.vehicleInfo && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
              <h2 className="text-xl font-bold text-[#000000] mb-6">
                Информация об автомобиле
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-[#5B6470] mb-1">Марка</div>
                  <div className="font-semibold text-[#000000]">
                    {consultation.vehicleInfo.brand || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#5B6470] mb-1">Модель</div>
                  <div className="font-semibold text-[#000000]">
                    {consultation.vehicleInfo.model || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#5B6470] mb-1">Год выпуска</div>
                  <div className="font-semibold text-[#000000]">
                    {consultation.vehicleInfo.year || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#5B6470] mb-1">Цвет</div>
                  <div className="font-semibold text-[#000000]">
                    {consultation.vehicleInfo.color || '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Comment */}
          {consultation.comment && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
              <h2 className="text-xl font-bold text-[#000000] mb-4">
                Комментарий клиента
              </h2>
              <p className="text-[#5B6470]">{consultation.comment}</p>
            </div>
          )}

          {/* Response */}
          {consultation.responseComment && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
              <h2 className="text-xl font-bold text-[#000000] mb-4">
                Ответ эксперта
              </h2>
              <p className="text-[#5B6470] whitespace-pre-wrap">
                {consultation.responseComment}
              </p>
              {consultation.respondedAt && (
                <p className="text-xs text-[#5B6470] mt-4">
                  Ответ от{' '}
                  {new Date(consultation.respondedAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          )}
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
                  {consultation.customer.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-[#5B6470] mb-1">Email</div>
                <a
                  href={`mailto:${consultation.customer.email}`}
                  className="font-semibold text-[#000000] hover:underline"
                >
                  {consultation.customer.email}
                </a>
              </div>
              {consultation.customer.phone && (
                <div>
                  <div className="text-sm text-[#5B6470] mb-1">Телефон</div>
                  <a
                    href={`tel:${consultation.customer.phone}`}
                    className="font-semibold text-[#000000] hover:underline"
                  >
                    {consultation.customer.phone}
                  </a>
                </div>
              )}
              <div>
                <div className="text-sm text-[#5B6470] mb-1">
                  Предпочтительный способ связи
                </div>
                <div className="font-semibold text-[#000000]">
                  {consultation.preferredContactMethod === 'email'
                    ? '📧 Email'
                    : '📱 Телефон'}
                </div>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
            <h2 className="text-xl font-bold text-[#000000] mb-6">
              Обработать консультацию
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Статус
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ConsultationStatus)}
                  className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                >
                  <option value="PENDING">Ожидает</option>
                  <option value="IN_PROGRESS">В работе</option>
                  <option value="COMPLETED">Завершена</option>
                  <option value="CANCELLED">Отменена</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Ответ клиенту
                </label>
                <textarea
                  value={responseComment}
                  onChange={(e) => setResponseComment(e.target.value)}
                  rows={6}
                  placeholder="Рекомендации по подбору товаров..."
                  className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
              </div>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {isUpdating ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Подсказка</h3>
            <p className="text-sm text-blue-700">
              После заполнения ответа и смены статуса на «Завершена», клиент получит
              уведомление на {consultation.preferredContactMethod === 'email' ? 'email' : 'телефон'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
