'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminCategoriesApi } from '@/entities/category/api';
import type { Category } from '@/entities/category/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const tree = await adminCategoriesApi.getTree();
      setCategories(tree);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить категорию "${name}"?`)) return;

    try {
      await adminCategoriesApi.delete(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      alert('Ошибка при удалении категории');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await adminCategoriesApi.toggleActive(id);
      setCategories(
        categories.map((c) => (c.id === id ? { ...c, isActive: !currentActive } : c))
      );
    } catch (error) {
      alert('Ошибка при изменении статуса');
    }
  };

  const renderCategoryRow = (category: Category, level: number = 0): JSX.Element => {
    const paddingLeft = level * 24;

    return (
      <>
        <tr key={category.id} className="hover:bg-[#F5F4EF]">
          <td className="px-6 py-4">
            <div className="flex items-center" style={{ paddingLeft }}>
              {level > 0 && <span className="text-[#D9DCDD] mr-2">└─</span>}
              <div className="font-semibold text-[#000000]">{category.name}</div>
            </div>
          </td>
          <td className="px-6 py-4 text-sm text-[#5B6470]">{category.slug}</td>
          <td className="px-6 py-4 text-sm text-[#5B6470]">
            {category.description || '—'}
          </td>
          <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
            {category.productCount}
          </td>
          <td className="px-6 py-4">
            <button
              onClick={() => handleToggleActive(category.id, category.isActive)}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                category.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {category.isActive ? 'Активна' : 'Неактивна'}
            </button>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="text-sm text-blue-600 hover:underline"
              >
                ✏️
              </Link>
              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="text-sm text-red-600 hover:underline"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
        {category.children?.map((child) => renderCategoryRow(child, level + 1))}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2">Категории</h1>
          <p className="text-[#5B6470]">Управление категориями товаров</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Добавить категорию
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Описание
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Товаров
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
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Загрузка...</div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Категории не найдены</div>
                  </td>
                </tr>
              ) : (
                categories.map((category) => renderCategoryRow(category))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
