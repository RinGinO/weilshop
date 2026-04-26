'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminBrandsApi } from '@/entities/brand/api';
import type { CreateBrandDto } from '@/entities/brand/types';

export default function AdminBrandCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBrandDto>({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    order: 0,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminBrandsApi.create(formData);
      router.push('/admin/brands');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании бренда');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s-]/gi, '')
      .replace(/\s+/g, '-');
    setFormData({ ...formData, slug });
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Новый бренд</h1>
        <p className="text-[#5B6470]">Создание бренда</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Основная информация</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Название *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Например: Weil"
              />
            </div>

            <div>
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
                  placeholder="weil"
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

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Краткое описание бренда..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                URL логотипа
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Сайт бренда
              </label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="https://weil.ru"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Порядок отображения
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                min={0}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-[#5B6470]">Активен</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? 'Создание...' : 'Создать бренд'}
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
