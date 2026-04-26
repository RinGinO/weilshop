'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminTasksApi } from '@/entities/task/api';
import type { CareTask } from '@/entities/task/types';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const list = await adminTasksApi.getList();
      setTasks(list);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить задачу ухода "${name}"?`)) return;

    try {
      await adminTasksApi.delete(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      alert('Ошибка при удалении задачи');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await adminTasksApi.toggleActive(id);
      setTasks(tasks.map((t) => (t.id === id ? { ...t, isActive: !currentActive } : t)));
    } catch (error) {
      alert('Ошибка при изменении статуса');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2">Задачи ухода</h1>
          <p className="text-[#5B6470]">Управление задачами ухода за автомобилем</p>
        </div>
        <Link
          href="/admin/tasks/new"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Добавить задачу
        </Link>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Задача
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Шагов
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Товаров
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
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Задачи не найдены</div>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{task.icon || '🎯'}</div>
                        <div>
                          <div className="font-semibold text-[#000000]">{task.name}</div>
                          <div className="text-xs text-[#5B6470] line-clamp-1">
                            {task.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                      {task.steps.length}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                      {task.productsCount}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(task.id, task.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.isActive ? 'Активна' : 'Неактивна'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/tasks/${task.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(task.id, task.name)}
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
    </div>
  );
}
