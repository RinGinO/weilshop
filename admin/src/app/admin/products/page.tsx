'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminProductsApi } from '@/entities/product/api';
import type { Product } from '@/entities/product/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminProductsApi.getList({ page, limit, search });
      setProducts(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить товар "${name}"?`)) return;

    try {
      await adminProductsApi.delete(id);
      setProducts(products.filter((p) => p.id !== id));
      setTotal(total - 1);
    } catch (error) {
      alert('Ошибка при удалении товара');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await adminProductsApi.toggleActive(id);
      setProducts(
        products.map((p) => (p.id === id ? { ...p, isActive: !currentActive } : p))
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
          <h1 className="text-3xl font-bold text-[#000000] mb-2">Товары</h1>
          <p className="text-[#5B6470]">Управление каталогом товаров</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Добавить товар
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

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Товар
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Артикул
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Бренд
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Цена
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
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Загрузка...</div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Товары не найдены</div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#F5F4EF] rounded-lg flex items-center justify-center text-2xl">
                          {product.images[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            '🧴'
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#000000]">{product.name}</div>
                          <div className="text-xs text-[#5B6470]">
                            {product.volume || '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6470]">{product.sku}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#000000]">{product.category.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#000000]">{product.brand.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                      {product.price} ₽
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(product.id, product.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.isActive ? 'Активен' : 'Неактивен'}
                        </button>
                        {product.isHit && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                            Хит
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            Новый
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/catalog/${product.slug}`}
                          target="_blank"
                          className="text-sm text-[#000000] hover:underline"
                        >
                          👁
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
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
        {products.length > 0 && (
          <div className="px-6 py-4 border-t border-[#D9DCDD] flex items-center justify-between">
            <div className="text-sm text-[#5B6470]">
              Показано {products.length} из {total} товаров
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
                disabled={products.length < limit}
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
