'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminFaqApi } from '@/entities/faq/api';
import type { FaqItem } from '@/entities/faq/types';

const CATEGORIES = [
  { id: 'general', name: 'Общие вопросы' },
  { id: 'orders', name: 'Заказы и доставка' },
  { id: 'products', name: 'Товары' },
  { id: 'payment', name: 'Оплата' },
  { id: 'care', name: 'Уход за автомобилем' },
];

export default function AdminFaqPage() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  const loadFaq = async () => {
    setIsLoading(true);
    try {
      const response = await adminFaqApi.getList({
        page,
        limit,
        search,
        categoryId: categoryFilter === 'all' ? undefined : categoryFilter,
      });
      setFaqItems(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load FAQ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaq();
  }, [page, search, categoryFilter]);

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Удалить вопрос "${question}"?`)) return;

    try {
      await adminFaqApi.delete(id);
      setFaqItems(faqItems.filter((item) => item.id !== id));
      setTotal(total - 1);
    } catch (error) {
      alert('Ошибка при удалении вопроса');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await adminFaqApi.toggleActive(id);
      setFaqItems(
        faqItems.map((item) =>
          item.id === id ? { ...item, isActive: !currentActive } : item
        )
      );
    } catch (error) {
      alert('Ошибка при изменении статуса');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2">FAQ</h1>
          <p className="text-[#5B6470]">Часто задаваемые вопросы</p>
        </div>
        <Link
          href="/admin/faq/new"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Добавить вопрос
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#D9DCDD]">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Поиск по вопросу..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
          />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
          >
            <option value="all">Все категории</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Вопрос
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Порядок
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[#5B6470] uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DCDD]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Загрузка...</div>
                  </td>
                </tr>
              ) : faqItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Вопросы не найдены</div>
                  </td>
                </tr>
              ) : (
                faqItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#000000] mb-1">
                        {item.question}
                      </div>
                      <div className="text-xs text-[#5B6470] line-clamp-1">
                        {item.answer}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#000000]">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                      {item.order}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(item.id, item.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.isActive ? 'Активен' : 'Неактивен'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/faq/${item.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.question)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {faqItems.length > 0 && (
          <div className="px-6 py-4 border-t border-[#D9DCDD] flex items-center justify-between">
            <div className="text-sm text-[#5B6470]">
              Показано {faqItems.length} из {total} вопросов
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
                disabled={faqItems.length < limit}
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
