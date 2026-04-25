'use client';

import { useState } from 'react';
import Link from 'next/link';

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

const PRODUCTS = [
  { slug: 'avtoshampun-premium', name: 'Автошампунь Premium', brand: 'Leraton', category: 'avtoshampuni', price: 890, volume: '500 мл', description: 'Концентрированный шампунь с воском' },
  { slug: 'avtoshampun-grass', name: 'Автошампунь Grass', brand: 'Grass', category: 'avtoshampuni', price: 650, volume: '1 л', description: 'Бюджетный шампунь для ежедневной мойки' },
  { slug: 'mr-pink', name: 'Chemical Guys Mr. Pink', brand: 'Chemical Guys', category: 'avtoshampuni', price: 1590, volume: '473 мл', description: 'Легендарный шампунь с ароматом вишни' },
  { slug: 'nano-magic', name: 'Koch Chemie Nano Magic', brand: 'Koch Chemie', category: 'avtoshampuni', price: 2100, volume: '1 л', description: 'Нано-шампунь премиум класса' },
  { slug: 'vosk-karnaubskiy', name: 'Воск карнаубский', brand: 'Leraton', category: 'voski-i-poliroli', price: 1290, volume: '200 г', description: 'Твёрдый воск для глубокого блеска' },
  { slug: 'meguiars-wax', name: 'Meguiars Ultimate Wax', brand: 'Meguiars', category: 'voski-i-poliroli', price: 1890, volume: '450 мл', description: 'Синтетический воск с длительной защитой' },
  { slug: 'sonax-wax', name: 'Sonax Polymer Wax', brand: 'Sonax', category: 'voski-i-poliroli', price: 1450, volume: '500 мл', description: 'Полимерный воск для быстрого нанесения' },
  { slug: 'ochistitel-bituma', name: 'Очиститель битума', brand: 'Leraton', category: 'ochistiteli', price: 690, volume: '500 мл', description: 'Быстрое удаление смолы и битума' },
  { slug: 'ochistitel-pyli', name: 'Очиститель тормозной пыли', brand: 'Shafite', category: 'ochistiteli', price: 750, volume: '500 мл', description: 'Для дисков и колёсных арок' },
  { slug: 'ochistitel-styokol', name: 'Очиститель стёкол', brand: 'Grass', category: 'ochistiteli', price: 450, volume: '1 л', description: 'Без разводов и аммиака' },
  { slug: 'ochistitel-plastika', name: 'Очиститель пластика', brand: 'Detail', category: 'uhod-za-salonom', price: 590, volume: '500 мл', description: 'Матовый финиш для салона' },
  { slug: 'kondicioner-kozhi', name: 'Кондиционер кожи', brand: 'Leraton', category: 'uhod-za-salonom', price: 890, volume: '250 мл', description: 'Питание и защита кожаного салона' },
  { slug: 'chernitel-shin', name: 'Чернитель шин', brand: 'Leraton', category: 'dlya-kolyos', price: 690, volume: '500 мл', description: 'Глубокий чёрный цвет резины' },
  { slug: 'gubka-dlya-moyki', name: 'Губка для мойки', brand: 'Detail', category: 'aksessuary', price: 350, volume: null, description: 'Двухсторонняя губка' },
  { slug: 'varezhka-mikrofibr', name: 'Варежка микрофибра', brand: 'Detail', category: 'aksessuary', price: 590, volume: null, description: 'Для бесконтактной мойки' },
  { slug: 'polotence-60x90', name: 'Полотенце 60x90', brand: 'Detail', category: 'aksessuary', price: 890, volume: null, description: 'Впитывающее полотенце для сушки' },
];

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand.toLowerCase().replace(' ', '-') === selectedBrand;
    const matchesSearch = searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
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
              Найдено товаров: <span className="font-semibold text-[#000000]">{filteredProducts.length}</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5B6470] text-lg">Товары не найдены</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/catalog/${product.slug}`}
                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-[#D9DCDD] hover:border-[#000000]"
                  >
                    <div className="aspect-square bg-[#F5F4EF] rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-6xl">🧴</span>
                    </div>
                    <div className="text-sm text-[#5B6470] mb-1">{product.brand}</div>
                    <h3 className="text-lg font-semibold text-[#000000] mb-2 group-hover:text-[#333333] transition-colors">
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
          </div>
        </div>
      </div>
    </main>
  );
}
