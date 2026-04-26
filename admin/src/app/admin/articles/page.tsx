'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminArticlesApi } from '@/entities/article/api';
import type { Article } from '@/entities/article/types';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const response = await adminArticlesApi.getList({ page, limit, search });
      setArticles(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [page, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить статью "${title}"?`)) return;

    try {
      await adminArticlesApi.delete(id);
      setArticles(articles.filter((a) => a.id !== id));
      setTotal(total - 1);
    } catch (error) {
      alert('Ошибка при удалении статьи');
    }
  };

  const handleTogglePublished = async (id: string, currentPublished: boolean) => {
    try {
      await adminArticlesApi.togglePublished(id);
      setArticles(
        articles.map((a) =>
          a.id === id ? { ...a, isPublished: !currentPublished } : a
        )
      );
    } catch (error) {
      alert('Ошибка при изменении статуса публикации');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2">Статьи</h1>
          <p className="text-[#5B6470]">Управление статьями базы знаний</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Добавить статью
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#D9DCDD]">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Заголовок
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Просмотры
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
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Статьи не найдены</div>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-[#000000]">
                          {article.title}
                        </div>
                        <div className="text-xs text-[#5B6470] line-clamp-1">
                          {article.shortDescription}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#000000]">
                      {article.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                      {article.viewCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleTogglePublished(article.id, article.isPublished)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            article.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {article.isPublished ? 'Опубликована' : 'Черновик'}
                        </button>
                        {article.isActive && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            Активна
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6470]">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                        'ru-RU'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/knowledge/${article.slug}`}
                          target="_blank"
                          className="text-sm text-[#000000] hover:underline"
                        >
                          👁
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
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
        {articles.length > 0 && (
          <div className="px-6 py-4 border-t border-[#D9DCDD] flex items-center justify-between">
            <div className="text-sm text-[#5B6470]">
              Показано {articles.length} из {total} статей
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
                disabled={articles.length < limit}
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
