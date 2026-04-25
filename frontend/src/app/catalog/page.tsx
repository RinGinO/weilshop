'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/entities/product/api';
import type { ProductsFilter } from '@/entities/product/types';

const CATEGORIES = [
  { slug: 'all', name: 'Все товары' },
  { slug: 'avtoshampuni', name: 'Автошампуни' },
  { slug: 'voski-i-poliroli', name: 'Воски и полироли' },
  { slug: 'ochistiteli', name: 'Очистители' },
  { slug: 'uhod-za-salonom', name: 'Уход за салоном' },
  { slug: 'dlya-kolyos', name: 'Для колёс' },
  { slug: 'aksessuary', name: 'Аксессуары' },
];

const BRANDS = [
  { slug: 'all', name: 'Все бренды' },
  { slug: 'leraton', name: 'Leraton' },
  { slug: 'grass', name: 'Grass' },
  { slug: 'chemical-guys', name: 'Chemical Guys' },
  { slug: 'koch-chemie', name: 'Koch Chemie' },
  { slug: 'shafite', name: 'Shafite' },
  { slug: 'detail', name: 'Detail' },
];

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const filters: ProductsFilter = {
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    brand: selectedBrand !== 'all' ? selectedBrand : undefined,
    search: searchQuery || undefined,
    sortBy: sortBy as any,
    page,
    limit,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getList(filters),
  });

  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#000000] mb-2">Каталог товаров</h1>
          <p className="text-[#5B6470]">Профессиональная автохимия от лучших производителей</p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск товаров..."
              className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">По названию</option>
            <option value="price-asc">По цене (возрастание)</option>
            <option value="price-desc">По цене (убывание)</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-[#000000] mb-3">Категории</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-[#000000] text-white'
                        : 'text-[#1F2328] hover:bg-[#D9DCDD]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-semibold text-[#000000] mb-3">Бренды</h3>
              <div className="space-y-2">
                {BRANDS.map((brand) => (
                  <button
                    key={brand.slug}
                    onClick={() => setSelectedBrand(brand.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedBrand === brand.slug
                        ? 'bg-[#000000] text-white'
                        : 'text-[#1F2328] hover:bg-[#D9DCDD]'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                }}
                className="w-full px-4 py-2 text-[#000000] border border-[#000000] rounded-lg hover:bg-[#000000] hover:text-white transition-colors"
              >
                Сбросить фильтры
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-[#5B6470]">
              {isLoading ? (
                <span>Загрузка...</span>
              ) : error ? (
                <span className="text-red-600">Ошибка загрузки</span>
              ) : (
                <>
                  Найдено товаров:{' '}
                  <span className="font-semibold text-[#000000]">{data?.total || 0}</span>
                </>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="aspect-square bg-[#F5F4EF] rounded-lg mb-4" />
                    <div className="h-4 bg-[#F5F4EF] rounded mb-2" />
                    <div className="h-6 bg-[#F5F4EF] rounded mb-3" />
                    <div className="h-4 bg-[#F5F4EF] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-[#5B6470] text-lg">Ошибка загрузки товаров</p>
              </div>
            ) : !data || data.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5B6470] text-lg">Товары не найдены</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/catalog/${product.slug}`}
                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-[#D9DCDD] hover:border-[#000000]"
                  >
                    <div className="aspect-square bg-[#F5F4EF] rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-6xl">🧴</span>
                    </div>
                    <div className="text-sm text-[#5B6470] mb-1">{product.brand.name}</div>
                    <h3 className="text-lg font-semibold text-[#000000] mb-2 group-hover:text-[#333333] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#5B6470] mb-3 line-clamp-2">{product.description}</p>
                    {product.volume && (
                      <div className="text-sm text-[#5B6470] mb-3">{product.volume}</div>
                    )}
                    <div className="text-xl font-bold text-[#000000]">{product.price} ₽</div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.total > limit && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-[#D9DCDD] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F4EF]"
                >
                  ← Назад
                </button>
                <span className="px-4 py-2">
                  Страница {page} из {Math.ceil(data.total / limit)}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(Math.ceil(data.total / limit), p + 1))}
                  disabled={page >= Math.ceil(data.total / limit)}
                  className="px-4 py-2 rounded-lg border border-[#D9DCDD] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F4EF]"
                >
                  Вперёд →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
