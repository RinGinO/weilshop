'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminInstructionsApi } from '@/entities/instruction/api';
import type { Instruction } from '@/entities/instruction/types';

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-red-100 text-red-800',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'Лёгкая',
  MEDIUM: 'Средняя',
  HARD: 'Сложная',
};

export default function AdminInstructionsPage() {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadInstructions = async () => {
    setIsLoading(true);
    try {
      const response = await adminInstructionsApi.getList({
        page,
        limit,
        search,
        difficulty: difficultyFilter === 'all' ? undefined : difficultyFilter,
      });
      setInstructions(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load instructions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInstructions();
  }, [page, search, difficultyFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить инструкцию "${title}"?`)) return;

    try {
      await adminInstructionsApi.delete(id);
      setInstructions(instructions.filter((i) => i.id !== id));
      setTotal(total - 1);
    } catch (error) {
      alert('Ошибка при удалении инструкции');
    }
  };

  const handleTogglePublished = async (id: string, currentPublished: boolean) => {
    try {
      await adminInstructionsApi.togglePublished(id);
      setInstructions(
        instructions.map((i) =>
          i.id === id ? { ...i, isPublished: !currentPublished } : i
        )
      );
    } catch (error) {
      alert('Ошибка при изменении статуса публикации');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2">Инструкции</h1>
          <p className="text-[#5B6470]">Пошаговые инструкции по уходу</p>
        </div>
        <Link
          href="/admin/instructions/new"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Добавить инструкцию
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#D9DCDD]">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
          />
          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-[#D9DCDD] focus:outline-none focus:ring-2 focus:ring-[#000000]"
          >
            <option value="all">Все сложности</option>
            <option value="EASY">Лёгкая</option>
            <option value="MEDIUM">Средняя</option>
            <option value="HARD">Сложная</option>
          </select>
        </div>
      </div>

      {/* Instructions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D9DCDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4EF]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Заголовок
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Сложность
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Время
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5B6470] uppercase">
                  Шагов
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
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Загрузка...</div>
                  </td>
                </tr>
              ) : instructions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-[#5B6470]">Инструкции не найдены</div>
                  </td>
                </tr>
              ) : (
                instructions.map((instruction) => (
                  <tr key={instruction.id} className="hover:bg-[#F5F4EF]">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-[#000000]">
                          {instruction.title}
                        </div>
                        <div className="text-xs text-[#5B6470] line-clamp-1">
                          {instruction.shortDescription}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          DIFFICULTY_COLORS[instruction.difficulty]
                        }`}
                      >
                        {DIFFICULTY_LABELS[instruction.difficulty]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6470]">
                      {instruction.estimatedTime} мин.
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#000000]">
                      {instruction.steps.length}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleTogglePublished(instruction.id, instruction.isPublished)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          instruction.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {instruction.isPublished ? 'Опубликована' : 'Черновик'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/instructions/${instruction.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(instruction.id, instruction.title)
                          }
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

        {/* Pagination */}
        {instructions.length > 0 && (
          <div className="px-6 py-4 border-t border-[#D9DCDD] flex items-center justify-between">
            <div className="text-sm text-[#5B6470]">
              Показано {instructions.length} из {total} инструкций
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-[#D9DCDD] disabled:opacity-50 hover:bg-[#F5F4EF]"
              >
                Назад
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={instructions.length < limit}
                className="px-4 py-2 rounded-lg border border-[#D9DCDD] disabled:opacity-50 hover:bg-[#F5F4EF]"
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
