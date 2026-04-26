'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminTasksApi } from '@/entities/task/api';
import type { CreateCareTaskDto, CreateCareTaskStepDto, CreateCareTaskFaqDto } from '@/entities/task/types';

export default function AdminTaskEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateCareTaskDto>({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    icon: '🎯',
    steps: [],
    tips: [],
    faq: [],
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    setIsLoading(true);
    try {
      const task = await adminTasksApi.getById(id);
      setFormData({
        name: task.name,
        slug: task.slug,
        shortDescription: task.shortDescription,
        description: task.description,
        icon: task.icon || '🎯',
        steps: task.steps.map((s) => ({
          order: s.order,
          title: s.title,
          description: s.description,
          imageUrl: s.imageUrl || undefined,
        })),
        tips: task.tips,
        faq: task.faq.map((f) => ({
          question: f.question,
          answer: f.answer,
          order: f.order,
        })),
        order: task.order,
        isActive: task.isActive,
      });
    } catch (error) {
      console.error('Failed to load task:', error);
      alert('Ошибка загрузки задачи');
      router.push('/admin/tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await adminTasksApi.update(id, formData);
      router.push('/admin/tasks');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при сохранении задачи');
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

  const addStep = () => {
    const newStep: CreateCareTaskStepDto = {
      order: (formData.steps?.length || 0) + 1,
      title: '',
      description: '',
    };
    setFormData({ ...formData, steps: [...(formData.steps || []), newStep] });
  };

  const updateStep = (index: number, field: keyof CreateCareTaskStepDto, value: string) => {
    const newSteps = [...(formData.steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, steps: newSteps });
  };

  const addTip = () => {
    setFormData({ ...formData, tips: [...(formData.tips || []), ''] });
  };

  const updateTip = (index: number, value: string) => {
    const newTips = [...(formData.tips || [])];
    newTips[index] = value;
    setFormData({ ...formData, tips: newTips });
  };

  const removeTip = (index: number) => {
    const newTips = formData.tips?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, tips: newTips });
  };

  const icons = ['🎯', '🧼', '🚿', '✨', '🧽', '🪣', '🧴', '💧', '🌟', '🛡️'];

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
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Редактирование задачи</h1>
        <p className="text-[#5B6470]">{formData.name}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Основная информация</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Иконка
              </label>
              <div className="flex gap-2 flex-wrap">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-colors ${
                      formData.icon === icon
                        ? 'border-[#000000] bg-[#F5F4EF]'
                        : 'border-[#D9DCDD] hover:border-[#000000]'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

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
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                required
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Полное описание *
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

        {/* Steps */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#000000]">Шаги выполнения</h2>
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
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#000000]">Советы</h2>
            <button
              type="button"
              onClick={addTip}
              className="text-sm text-[#000000] font-semibold hover:underline"
            >
              + Добавить совет
            </button>
          </div>

          <div className="space-y-3">
            {formData.tips?.map((tip, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => updateTip(index, e.target.value)}
                  placeholder="Текст совета"
                  className="flex-1 px-3 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
                <button
                  type="button"
                  onClick={() => removeTip(index)}
                  className="text-red-600 hover:underline px-3"
                >
                  ✕
                </button>
              </div>
            ))}
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
