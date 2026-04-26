'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminArticlesApi } from '@/entities/article/api';
import type { CreateArticleDto } from '@/entities/article/types';

const CATEGORIES = [
  { id: 'care', name: 'Уход за автомобилем' },
  { id: 'products', name: 'Обзоры товаров' },
  { id: 'tips', name: 'Советы экспертов' },
  { id: 'news', name: 'Новости' },
];

export default function AdminArticleCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateArticleDto>({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    coverImageUrl: '',
    categoryId: '',
    tags: [],
    isPublished: false,
    seoTitle: '',
    seoDescription: '',
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminArticlesApi.create(formData);
      router.push('/admin/articles');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании статьи');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s-]/gi, '')
      .replace(/\s+/g, '-');
    setFormData({ ...formData, slug });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Новая статья</h1>
        <p className="text-[#5B6470]">Создание статьи базы знаний</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Основная информация</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Заголовок *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Например: Как правильно мыть автомобиль бесконтактным способом"
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
                  placeholder="kak-pravilno-myt-avtomobil-beskontaktnym-sposobom"
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
                Краткое описание *
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Краткое описание для превью..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Категория *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              >
                <option value="">Выберите категорию</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                URL обложки
              </label>
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, coverImageUrl: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Содержимое</h2>

          <div>
            <label className="block text-sm font-semibold text-[#000000] mb-2">
              Текст статьи *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={15}
              className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000] font-mono text-sm"
              placeholder="Текст статьи (поддерживается Markdown)..."
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Теги</h2>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Введите тег и нажмите Enter"
                className="flex-1 px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-[#000000] text-white rounded-lg font-semibold hover:bg-[#333333] transition-colors"
              >
                Добавить
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#F5F4EF] rounded-full text-sm text-[#000000] flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">SEO параметры</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                SEO заголовок
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder={formData.title || 'SEO заголовок'}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                SEO описание
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData({ ...formData, seoDescription: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder={formData.shortDescription || 'SEO описание'}
              />
            </div>
          </div>
        </div>

        {/* Publish */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="w-5 h-5"
            />
            <span className="text-[#5B6470]">
              Опубликовать сразу после создания
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? 'Создание...' : 'Создать статью'}
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
