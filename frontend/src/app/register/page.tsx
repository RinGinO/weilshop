'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/auth/store';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreement: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!formData.agreement) {
      setError('Необходимо согласие с условиями обработки данных');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
      });
      router.push('/account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации. Попробуйте другой email.');
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
            <h1 className="text-3xl font-bold text-[#000000] mb-2">Регистрация</h1>
            <p className="text-[#5B6470]">
              Создайте аккаунт для доступа ко всем возможностям
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                ФИО
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
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
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="example@mail.ru"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Телефон
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="+7 (999) 000-00-00"
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
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#000000] mb-2">
                Подтверждение пароля *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="flex items-start gap-2 text-sm text-[#5B6470]">
                <input
                  type="checkbox"
                  checked={formData.agreement}
                  onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                  className="w-4 h-4 mt-0.5"
                />
                <span>
                  Я согласен на обработку{' '}
                  <Link href="/privacy" className="text-[#000000] underline">
                    персональных данных
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white py-4 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-[#5B6470]">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-[#000000] font-semibold hover:underline">
              Войти
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
