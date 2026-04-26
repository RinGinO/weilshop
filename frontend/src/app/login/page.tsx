'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/auth/store';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      router.push('/account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F4EF] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D9DCDD]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#000000] mb-2">Вход</h1>
            <p className="text-[#5B6470]">
              Войдите для доступа к личному кабинету
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Email или телефон
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="example@mail.ru"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#5B6470]">
                <input type="checkbox" className="w-4 h-4" />
                Запомнить меня
              </label>
              <Link href="/forgot-password" className="text-sm text-[#000000] hover:underline">
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white py-4 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-[#5B6470]">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-[#000000] font-semibold hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-2">📦</div>
            <div className="text-xs text-[#5B6470]">История заказов</div>
          </div>
          <div>
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-xs text-[#5B6470]">Избранное</div>
          </div>
          <div>
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-xs text-[#5B6470]">Настройки</div>
          </div>
        </div>
      </div>
    </main>
  );
}
