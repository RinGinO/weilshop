'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/entities/task/api';

export default function TasksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.getList(),
  });

  const tasks = data?.items || [];
  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#000000] mb-4">Задачи ухода</h1>
          <p className="text-xl text-[#5B6470] max-w-3xl">
            Выберите задачу — мы подберём подходящие средства и пошаговую инструкцию
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-16 bg-[#F5F4EF] rounded mb-4" />
                <div className="h-6 bg-[#F5F4EF] rounded w-3/4 mb-3" />
                <div className="h-4 bg-[#F5F4EF] rounded w-full mb-4" />
                <div className="h-4 bg-[#F5F4EF] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-[#5B6470] text-lg">Ошибка загрузки задач</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#5B6470] text-lg">Задачи не найдены</p>
          </div>
        ) : (
          /* Tasks Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Link
                key={task.slug}
                href={`/tasks/${task.slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-[#D9DCDD] hover:border-[#000000]"
              >
                <div className="text-5xl mb-4">{task.icon || '🎯'}</div>
                <h3 className="text-2xl font-bold text-[#000000] mb-3 group-hover:text-[#333333] transition-colors">
                  {task.name}
                </h3>
                <p className="text-[#5B6470] mb-4 line-clamp-2">{task.shortDescription}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5B6470]">
                    {task.productsCount} товаров
                  </span>
                  <span className="text-[#000000] font-semibold group-hover:translate-x-2 transition-transform inline-block">
                    Подробнее →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-[#000000] text-white rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Не знаете с чего начать?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Оставьте заявку на консультацию — эксперт поможет подобрать 
              оптимальный набор средств для вашего автомобиля
            </p>
            <Link
              href="/consultations"
              className="bg-[#E57A22] hover:bg-[#d46a1a] text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-block"
            >
              Заказать консультацию
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
