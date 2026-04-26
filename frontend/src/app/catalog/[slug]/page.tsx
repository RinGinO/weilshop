'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { productsApi } from '@/entities/product/api';
import { useCartStore } from '@/entities/cart/store';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['product-related', slug],
    queryFn: () => productsApi.getRelated(slug, 4),
    enabled: !!slug,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand.name,
        price: product.price,
        volume: product.volume || null,
        quantity,
      });
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F4EF]">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-[#D9DCDD] rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl p-8 aspect-square" />
              <div className="space-y-4">
                <div className="h-6 bg-[#D9DCDD] rounded w-24" />
                <div className="h-12 bg-[#D9DCDD] rounded w-3/4" />
                <div className="h-8 bg-[#D9DCDD] rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#F5F4EF]">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-[#5B6470] text-lg">Ошибка загрузки товара</p>
          <Link href="/catalog" className="text-[#000000] underline mt-4 inline-block">
            ← Вернуться в каталог
          </Link>
        </div>
      </main>
    );
  }

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
            <li className="text-[#000000]">{product.name}</li>
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
            <div className="mb-2 text-[#5B6470]">{product.brand.name}</div>
            <h1 className="text-4xl font-bold text-[#000000] mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-[#E57A22]">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-[#5B6470]">{product.rating} ({product.reviewsCount} отзывов)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-[#000000] mb-1">{product.price} ₽</div>
              {product.volume && (
                <div className="text-[#5B6470]">Объём: {product.volume}</div>
              )}
            </div>

            {/* Stock Status */}
            {product.inStock ? (
              <div className="mb-6 text-green-600 font-semibold">
                ✓ В наличии ({product.stockQuantity} шт.)
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
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-4 py-3 text-[#000000] hover:bg-[#F5F4EF] rounded-r-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#000000] hover:bg-[#333333] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Добавить в корзину
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#000000] mb-2">Описание</h3>
              <p className="text-[#5B6470]">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[#000000] mb-2">Особенности</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-[#5B6470] flex items-center gap-2">
                      <span className="text-[#000000]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Usage & Precautions */}
        {(product.usage || product.precautions) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {product.usage && (
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#000000] mb-4">📋 Способ применения</h3>
                <p className="text-[#5B6470]">{product.usage}</p>
              </div>
            )}
            {product.precautions && (
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#000000] mb-4">⚠️ Меры предосторожности</h3>
                <p className="text-[#5B6470]">{product.precautions}</p>
              </div>
            )}
          </div>
        )}

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#000000] mb-8">С этим товаром покупают</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
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
                  {product.volume && (
                    <div className="text-sm text-[#5B6470] mb-3">{product.volume}</div>
                  )}
                  <div className="text-xl font-bold text-[#000000]">{product.price} ₽</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
