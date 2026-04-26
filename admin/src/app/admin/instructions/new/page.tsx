'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminInstructionsApi } from '@/entities/instruction/api';
import type {
  CreateInstructionDto,
  CreateInstructionMaterialDto,
  CreateInstructionStepDto,
} from '@/entities/instruction/types';

export default function AdminInstructionCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateInstructionDto>({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    difficulty: 'MEDIUM',
    estimatedTime: 30,
    materials: [],
    steps: [],
    isPublished: false,
  });
  const [materialName, setMaterialName] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminInstructionsApi.create(formData);
      router.push('/admin/instructions');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании инструкции');
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

  const addMaterial = () => {
    if (materialName.trim()) {
      const newMaterial: CreateInstructionMaterialDto = {
        name: materialName.trim(),
        quantity: materialQuantity.trim() || undefined,
      };
      setFormData({
        ...formData,
        materials: [...(formData.materials || []), newMaterial],
      });
      setMaterialName('');
      setMaterialQuantity('');
    }
  };

  const removeMaterial = (index: number) => {
    const newMaterials = formData.materials?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, materials: newMaterials });
  };

  const addStep = () => {
    const newStep: CreateInstructionStepDto = {
      order: (formData.steps?.length || 0) + 1,
      title: '',
      description: '',
    };
    setFormData({
      ...formData,
      steps: [...(formData.steps || []), newStep],
    });
  };

  const updateStep = (index: number, field: keyof CreateInstructionStepDto, value: string) => {
    const newSteps = [...(formData.steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Новая инструкция</h1>
        <p className="text-[#5B6470]">Создание пошаговой инструкции</p>
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
                placeholder="Например: Как нанести защитный воск на кузов"
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
                  placeholder="kak-nanesti-zashchitnyj-vosk-na-kuzov"
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
                placeholder="Краткое описание инструкции..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Сложность *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD',
                    })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                >
                  <option value="EASY">Лёгкая</option>
                  <option value="MEDIUM">Средняя</option>
                  <option value="HARD">Сложная</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Время (мин) *
                </label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedTime: Number(e.target.value) })
                  }
                  required
                  min={1}
                  className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#000000]">Материалы и инструменты</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder="Название материала"
                className="flex-1 px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
              <input
                type="text"
                value={materialQuantity}
                onChange={(e) => setMaterialQuantity(e.target.value)}
                placeholder="Количество"
                className="w-32 px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
              <button
                type="button"
                onClick={addMaterial}
                className="px-4 py-2 bg-[#000000] text-white rounded-lg font-semibold hover:bg-[#333333] transition-colors"
              >
                +
              </button>
            </div>

            <div className="space-y-2">
              {formData.materials?.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#F5F4EF] rounded-lg"
                >
                  <div className="text-sm text-[#000000]">
                    {material.name}
                    {material.quantity && (
                      <span className="text-[#5B6470] ml-2">— {material.quantity}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#000000]">Шаги инструкции</h2>
            <button
              type="button"
              onClick={addStep}
              className="text-sm text-[#000000] font-semibold hover:underline"
            >
              + Добавить шаг
            </button>
          </div>

          <div className="space-y-4">
            {formData.steps?.map((step, index) => (
              <div key={index} className="p-4 bg-[#F5F4EF] rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[#000000]">Шаг {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Удалить
                  </button>
                </div>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  placeholder="Название шага"
                  className="w-full px-3 py-2 rounded-lg border border-[#D9DCDD] mb-2 focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  placeholder="Описание шага"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Дополнительное содержание</h2>

          <div>
            <label className="block text-sm font-semibold text-[#000000] mb-2">
              Полный текст (Markdown)
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000] font-mono text-sm"
              placeholder="Дополнительная информация, советы, предупреждения..."
            />
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
            {isLoading ? 'Создание...' : 'Создать инструкцию'}
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
