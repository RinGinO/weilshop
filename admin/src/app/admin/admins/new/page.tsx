'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminUsersApi } from '@/entities/admin-user/api';
import type { AdminRole, CreateAdminDto } from '@/entities/admin-user/types';

const AVAILABLE_ROLES: AdminRole[] = [
  {
    id: 'super-admin',
    slug: 'super_admin',
    name: 'Super Admin',
    description: 'Полный доступ ко всем модулям',
    permissions: ['*'],
  },
  {
    id: 'catalog-manager',
    slug: 'catalog_manager',
    name: 'Менеджер каталога',
    description: 'Товары, категории, бренды, задачи ухода',
    permissions: ['products.*', 'categories.*', 'brands.*', 'tasks.*'],
  },
  {
    id: 'content-manager',
    slug: 'content_manager',
    name: 'Менеджер контента',
    description: 'Статьи, инструкции, FAQ, SEO',
    permissions: ['articles.*', 'instructions.*', 'faq.*'],
  },
  {
    id: 'request-manager',
    slug: 'request_manager',
    name: 'Менеджер заявок',
    description: 'Обработка заказов',
    permissions: ['requests.*'],
  },
  {
    id: 'consultation-manager',
    slug: 'consultation_manager',
    name: 'Менеджер консультаций',
    description: 'Консультации по подбору',
    permissions: ['consultations.*'],
  },
];

export default function AdminAdminCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAdminDto>({
    email: '',
    password: '',
    name: '',
    roleIds: [],
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminUsersApi.create(formData);
      router.push('/admin/admins');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании администратора');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRole = (roleId: string) => {
    setFormData({
      ...formData,
      roleIds: formData.roleIds.includes(roleId)
        ? formData.roleIds.filter((id) => id !== roleId)
        : [...formData.roleIds, roleId],
    });
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Новый администратор</h1>
        <p className="text-[#5B6470]">Создание учётной записи администратора</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Данные учётной записи</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                ФИО *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Иванов Иван"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="admin@weilshop.ru"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Пароль *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Минимум 8 символов"
              />
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <h2 className="text-xl font-bold text-[#000000] mb-6">Роли и доступ</h2>

          <div className="space-y-3">
            {AVAILABLE_ROLES.map((role) => (
              <label
                key={role.id}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.roleIds.includes(role.id)
                    ? 'border-[#000000] bg-[#F5F4EF]'
                    : 'border-[#D9DCDD] hover:border-[#000000]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.roleIds.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                  className="w-5 h-5 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-semibold text-[#000000] mb-1">{role.name}</div>
                  <div className="text-sm text-[#5B6470]">{role.description}</div>
                  {role.permissions[0] !== '*' && (
                    <div className="text-xs text-[#5B6470] mt-2">
                      Разрешения: {role.permissions.join(', ')}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="text-[#5B6470]">Активен сразу после создания</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading || formData.roleIds.length === 0}
            className="bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? 'Создание...' : 'Создать администратора'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[#5B6470] hover:text-[#000000] px-8 py-3"
          >
            Отмена
          </button>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Важно</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Пароль должен быть не менее 8 символов</li>
            <li>• Минимум одна роль обязательна</li>
            <li>• Super Admin имеет полный доступ ко всем функциям</li>
            <li>• После создания пароль нельзя восстановить (только сброс)</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
