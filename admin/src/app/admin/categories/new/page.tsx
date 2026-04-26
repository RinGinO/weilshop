'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminCategoriesApi } from '@/entities/category/api';
import type { Category, CreateCategoryDto } from '@/entities/category/types';

export default function AdminCategoryCreatePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    slug: '',
    description: '',
    parentId: undefined,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const tree = await adminCategoriesApi.getTree();
      setCategories(tree);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminCategoriesApi.create(formData);
      router.push('/admin/categories');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании категории');
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

  const renderCategoryOptions = (cats: Category[], level: number = 0): JSX.Element[] => {
    return cats.flatMap((cat) => [
      <option key={cat.id} value={cat.id}>
        {'  '.repeat(level)}{cat.name}
      </option>,
      ...renderCategoryOptions(cat.children, level + 1),
    ]);
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Новая категория</h1>
        <p className="text-[#5B6470]">Создание категории товаров</p>
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
                placeholder="Например: Автошампуни"
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
                  placeholder="avtoshampuni"
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
                placeholder="Краткое описание категории..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Родительская категория
              </label>
              <select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              >
                <option value="">Без родительской категории</option>
                {renderCategoryOptions(categories)}
              </select>
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
                <span className="text-[#5B6470]">Активна</span>
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
            {isLoading ? 'Создание...' : 'Создать категорию'}
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
