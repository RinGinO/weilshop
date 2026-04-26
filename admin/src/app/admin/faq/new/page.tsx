'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFaqApi } from '@/entities/faq/api';
import type { CreateFaqItemDto } from '@/entities/faq/types';

const CATEGORIES = [
  { id: 'general', name: 'Общие вопросы' },
  { id: 'orders', name: 'Заказы и доставка' },
  { id: 'products', name: 'Товары' },
  { id: 'payment', name: 'Оплата' },
  { id: 'care', name: 'Уход за автомобилем' },
];

export default function AdminFaqCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateFaqItemDto>({
    question: '',
    answer: '',
    categoryId: '',
    order: 0,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminFaqApi.create(formData);
      router.push('/admin/faq');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании вопроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Новый вопрос FAQ</h1>
        <p className="text-[#5B6470]">Добавление часто задаваемого вопроса</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Основная информация</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Вопрос *
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Например: Как оформить заказ?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Ответ *
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Развёрнутый ответ на вопрос..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Категория *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              >
                <option value="">Выберите категорию</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Порядок отображения
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                min={0}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-[#5B6470]">Активен</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? 'Создание...' : 'Создать вопрос'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[#5B6470] hover:text-[#000000] px-8 py-3"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
