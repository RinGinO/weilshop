'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRODUCT = {
  slug: 'avtoshampun-premium',
  name: 'Автошампунь Premium',
  brand: 'Leraton',
  category: 'avtoshampuni',
  price: 890,
  volume: '500 мл',
  sku: 'SH-001',
  description: 'Профессиональный концентрированный автошампунь с нейтральным pH и добавлением карнаубского воска. Обеспечивает бережную мойку без повреждения защитных покрытий.',
  features: [
    'Нейтральный pH (7.0)',
    'Высокая концентрация',
    'Содержит карнаубский воск',
    'Биоразлагаемая формула',
    'Подходит для всех типов ЛКП',
    'Экономичный расход 50-100 мл на 10 л воды',
  ],
  usage: 'Развести 50-100 мл шампуня в 10 литрах воды. Нанести на влажный автомобиль губкой или варежкой. Смыть чистой водой.',
  precautions: 'Избегать попадания в глаза. При попадании промыть водой. Хранить в недоступном для детей месте.',
  inStock: true,
  stockQuantity: 156,
  rating: 4.8,
  reviewsCount: 42,
};

const RELATED_PRODUCTS = [
  { slug: 'vosk-karnaubskiy', name: 'Воск карнаубский', brand: 'Leraton', price: 1290, volume: '200 г' },
  { slug: 'gubka-dlya-moyki', name: 'Губка для мойки', brand: 'Detail', price: 350, volume: null },
  { slug: 'varezhka-mikrofibr', name: 'Варежка микрофибра', brand: 'Detail', price: 590, volume: null },
  { slug: 'polotence-60x90', name: 'Полотенце 60x90', brand: 'Detail', price: 890, volume: null },
];

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-[#5B6470]">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#000000]">Главная</Link></li>
            <li>/</li>
            <li><Link href="/catalog" className="hover:text-[#000000]">Каталог</Link></li>
            <li>/</li>
            <li className="text-[#000000]">{PRODUCT.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
            <div className="aspect-square w-full max-w-md bg-[#F5F4EF] rounded-xl flex items-center justify-center">
              <span className="text-9xl">🧴</span>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 text-[#5B6470]">{PRODUCT.brand}</div>
            <h1 className="text-4xl font-bold text-[#000000] mb-4">{PRODUCT.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-[#E57A22]">
                {'★'.repeat(Math.floor(PRODUCT.rating))}
                {'☆'.repeat(5 - Math.floor(PRODUCT.rating))}
              </div>
              <span className="text-[#5B6470]">{PRODUCT.rating} ({PRODUCT.reviewsCount} отзывов)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-[#000000] mb-1">{PRODUCT.price} ₽</div>
              {PRODUCT.volume && (
                <div className="text-[#5B6470]">Объём: {PRODUCT.volume}</div>
              )}
            </div>

            {/* Stock Status */}
            {PRODUCT.inStock ? (
              <div className="mb-6 text-green-600 font-semibold">
                ✓ В наличии ({PRODUCT.stockQuantity} шт.)
              </div>
            ) : (
              <div className="mb-6 text-red-600 font-semibold">
                ✗ Нет в наличии
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-[#D9DCDD] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-[#000000] hover:bg-[#F5F4EF] rounded-l-lg"
                >
                  −
                </button>
                <span className="px-6 py-3 text-[#000000] font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(PRODUCT.stockQuantity, quantity + 1))}
                  className="px-4 py-3 text-[#000000] hover:bg-[#F5F4EF] rounded-r-lg"
                >
                  +
                </button>
              </div>
              <button className="flex-1 bg-[#000000] hover:bg-[#333333] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Добавить в корзину
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#000000] mb-2">Описание</h3>
              <p className="text-[#5B6470]">{PRODUCT.description}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#000000] mb-2">Особенности</h3>
              <ul className="space-y-1">
                {PRODUCT.features.map((feature, index) => (
                  <li key={index} className="text-[#5B6470] flex items-center gap-2">
                    <span className="text-[#000000]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Usage & Precautions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-xl font-bold text-[#000000] mb-4">📋 Способ применения</h3>
            <p className="text-[#5B6470]">{PRODUCT.usage}</p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-xl font-bold text-[#000000] mb-4">⚠️ Меры предосторожности</h3>
            <p className="text-[#5B6470]">{PRODUCT.precautions}</p>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#000000] mb-8">С этим товаром покупают</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/catalog/${product.slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-[#D9DCDD] hover:border-[#000000]"
              >
                <div className="aspect-square bg-[#F5F4EF] rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">🧴</span>
                </div>
                <div className="text-sm text-[#5B6470] mb-1">{product.brand}</div>
                <h3 className="text-lg font-semibold text-[#000000] mb-2 group-hover:text-[#333333] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                {product.volume && (
                  <div className="text-sm text-[#5B6470] mb-3">{product.volume}</div>
                )}
                <div className="text-xl font-bold text-[#000000]">{product.price} ₽</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
