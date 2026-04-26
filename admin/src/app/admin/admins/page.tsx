'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminUsersApi } from '@/entities/admin-user/api';
import type { Admin } from '@/entities/admin-user/types';

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const list = await adminUsersApi.getList();
      setAdmins(list);
    } catch (error) {
      console.error('Failed to load admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить администратора "${name}"? Это действие нельзя отменить.`)) return;

    try {
      await adminUsersApi.delete(id);
      setAdmins(admins.filter((a) => a.id !== id));
    } catch (error) {
      alert('Ошибка при удалении администратора');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await adminUsersApi.toggleActive(id);
      setAdmins(admins.map((a) => (a.id === id ? { ...a, isActive: !currentActive } : a)));
    } catch (error) {
      alert('Ошибка при изменении статуса');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2">Администраторы</h1>
          <p className="text-[#5B6470]">Управление доступом администраторов</p>
        </div>
        <Link
          href="/admin/admins/new"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Добавить администратора
        </Link>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Администратор
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Роли
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Последний вход
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[#5B6470] uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DCDD]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Загрузка...</div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Администраторы не найдены</div>
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-[#000000]">{admin.name}</div>
                        <div className="text-sm text-[#5B6470]">{admin.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {admin.roles.map((role) => (
                          <span
                            key={role.id}
                            className="px-2 py-1 bg-[#F5F4EF] rounded text-xs font-semibold text-[#000000]"
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6470]">
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(admin.id, admin.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          admin.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {admin.isActive ? 'Активен' : 'Неактивен'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/admins/${admin.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(admin.id, admin.name)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Block */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Информация</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Только Super Admin может создавать и редактировать администраторов</li>
          <li>• Удаление администратора нельзя отменить</li>
          <li>• Деактивация временно блокирует доступ без удаления данных</li>
          <li>• Администратор может иметь несколько ролей</li>
        </ul>
      </div>
    </div>
  );
}
