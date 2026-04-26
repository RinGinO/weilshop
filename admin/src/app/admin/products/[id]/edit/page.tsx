'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminProductsApi } from '@/entities/product/api';
import type { CreateProductDto } from '@/entities/product/types';

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    volume: '',
    sku: '',
    categoryId: '',
    brandId: '',
    isHit: false,
    isNew: false,
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const product = await adminProductsApi.getById(id);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        volume: product.volume || '',
        sku: product.sku,
        categoryId: product.category.id,
        brandId: product.brand.id,
        isHit: product.isHit,
        isNew: product.isNew,
      });
    } catch (error) {
      console.error('Failed to load product:', error);
      alert('Ошибка загрузки товара');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await adminProductsApi.update(id, formData);
      router.push('/admin/products');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при сохранении товара');
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s-]/gi, '')
      .replace(/\s+/g, '-');
    setFormData({ ...formData, slug });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000000] mx-auto mb-4" />
          <p className="text-[#5B6470]">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Редактирование товара</h1>
        <p className="text-[#5B6470]">{formData.name}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Основная информация</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Название *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Slug (URL) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-3 bg-[#F5F4EF] hover:bg-[#E5E5E5] rounded-lg font-semibold transition-colors"
                >
                  Авто
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Описание *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>
          </div>
        </div>

        {/* Price & SKU */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Цена и артикул</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Цена (₽) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min={0}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Объём
              </label>
              <input
                type="text"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Артикул (SKU) *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>
          </div>
        </div>

        {/* Category & Brand */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Категория и бренд</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Категория *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              >
                <option value="">Выберите категорию</option>
                <option value="shampoo">Автошампуни</option>
                <option value="polish">Полироли</option>
                <option value="interior">Для салона</option>
                <option value="engine">Для двигателя</option>
                <option value="wheels">Для дисков</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Бренд *
              </label>
              <select
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              >
                <option value="">Выберите бренд</option>
                <option value="weil">Weil</option>
                <option value="sonax">Sonax</option>
                <option value="grass">Grass</option>
                <option value="shine">Shine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Особые отметки</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isHit}
                onChange={(e) => setFormData({ ...formData, isHit: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-[#5B6470]">Хит продаж</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-[#5B6470]">Новинка</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
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
