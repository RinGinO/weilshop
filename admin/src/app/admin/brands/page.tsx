'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminBrandsApi } from '@/entities/brand/api';
import type { Brand } from '@/entities/brand/types';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const list = await adminBrandsApi.getList();
      setBrands(list);
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить бренд "${name}"?`)) return;

    try {
      await adminBrandsApi.delete(id);
      setBrands(brands.filter((b) => b.id !== id));
    } catch (error) {
      alert('Ошибка при удалении бренда');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await adminBrandsApi.toggleActive(id);
      setBrands(brands.map((b) => (b.id === id ? { ...b, isActive: !currentActive } : b)));
    } catch (error) {
      alert('Ошибка при изменении статуса');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2">Бренды</h1>
          <p className="text-[#5B6470]">Управление брендами</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Добавить бренд
        </Link>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Бренд
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Сайт
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
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Бренды не найдены</div>
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#F5F4EF] rounded-lg flex items-center justify-center text-lg font-bold">
                            {brand.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-[#000000]">{brand.name}</div>
                          <div className="text-xs text-[#5B6470]">
                            {brand.description || '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6470]">{brand.slug}</td>
                    <td className="px-6 py-4">
                      {brand.websiteUrl ? (
                        <a
                          href={brand.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          🌐 Сайт
                        </a>
                      ) : (
                        <span className="text-sm text-[#5B6470]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                      {brand.productCount}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(brand.id, brand.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          brand.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {brand.isActive ? 'Активен' : 'Неактивен'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/brands/${brand.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(brand.id, brand.name)}
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
      </div>
    </div>
  );
}
