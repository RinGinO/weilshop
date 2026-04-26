'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuthStore } from '@/entities/admin/store';

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminAuthStore((state) => state.login);
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
      router.push('/admin');
    } catch (err: any) {
      // Для демонстрации без Backend — mock-аутентификация
      if (formData.email && formData.password) {
        // Mock успешного входа
        const mockAdmin = {
          id: 'demo-admin',
          email: formData.email,
          name: 'Демо Администратор',
          roles: [{ slug: 'super_admin', name: 'Super Admin' }],
        };
        localStorage.setItem('admin_token', 'demo-token');
        localStorage.setItem('admin_data', JSON.stringify(mockAdmin));
        router.push('/admin');
        return;
      }
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F4EF] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D9DCDD]">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold text-[#000000] mb-2">WeilShop Admin</div>
            <p className="text-[#5B6470]">Панель администратора</p>
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
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="admin@weilshop.ru"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#000000] hover:bg-[#333333] disabled:bg-[#999999] text-white py-4 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          {/* Back to Site */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#5B6470] hover:text-[#000000]"
            >
              ← Вернуться на сайт
            </Link>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <div className="font-semibold text-blue-800 mb-2">Тестовые учётные данные:</div>
          <div className="text-blue-700">Email: super@weilshop.ru</div>
          <div className="text-blue-700">Пароль: Admin123!</div>
        </div>
      </div>
    </main>
  );
}
