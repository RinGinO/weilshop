'use client';

import { useState } from 'react';
import Link from 'next/link';

const CAR_TYPES = [
  { value: 'sedan', label: 'Седан' },
  { value: 'suv', label: 'Внедорожник / Кроссовер' },
  { value: 'hatchback', label: 'Хетчбэк' },
  { value: 'wagon', label: 'Универсал' },
  { value: 'coupe', label: 'Купе' },
  { value: 'convertible', label: 'Кабриолет' },
  { value: 'minivan', label: 'Минивэн' },
  { value: 'other', label: 'Другое' },
];

const TASKS = [
  { value: 'moyka-kuzova', label: 'Мойка кузова' },
  { value: 'ochistka-salona', label: 'Очистка салона' },
  { value: 'polirovka-kuzova', label: 'Полировка кузова' },
  { value: 'zashchita-voskom', label: 'Защита воском' },
  { value: 'uhod-za-kolyosami', label: 'Уход за колёсами' },
  { value: 'himchistka', label: 'Химчистка салона' },
  { value: 'uhod-za-kozhey', label: 'Уход за кожей' },
  { value: 'podgotovka-k-zime', label: 'Подготовка к зиме' },
  { value: 'other', label: 'Другое' },
];

const BUDGET_RANGES = [
  { value: 'up-to-5000', label: 'до 5 000 ₽' },
  { value: '5000-10000', label: '5 000 - 10 000 ₽' },
  { value: '10000-20000', label: '10 000 - 20 000 ₽' },
  { value: '20000-50000', label: '20 000 - 50 000 ₽' },
  { value: 'over-50000', label: 'более 50 000 ₽' },
];

export default function ConsultationsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carType: '',
    carYear: '',
    tasks: [] as string[],
    budget: '',
    comment: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskToggle = (taskValue: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.includes(taskValue)
        ? prev.tasks.filter(t => t !== taskValue)
        : [...prev.tasks, taskValue],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F5F4EF]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-[#000000] mb-4">
              Заявка на консультацию отправлена!
            </h1>
            <p className="text-xl text-[#5B6470] mb-8">
              Наш эксперт свяжется с вами в течение 1-2 часов для уточнения деталей подбора.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/catalog"
                className="bg-[#000000] hover:bg-[#333333] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Перейти в каталог
              </Link>
              <Link
                href="/account"
                className="bg-white hover:bg-[#F5F4EF] text-[#000000] border border-[#000000] px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Личный кабинет
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-[#000000] mb-4">
            Консультация по подбору средств
          </h1>
          <p className="text-xl text-[#5B6470]">
            Оставьте заявку — наш эксперт поможет подобрать оптимальный набор 
            средств для вашего автомобиля
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#D9DCDD]">
          <div className="space-y-8">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#000000] mb-6">Контактные данные</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    ФИО *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                    placeholder="example@mail.ru"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                    placeholder="+7 (999) 000-00-00"
                  />
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className="pt-8 border-t border-[#D9DCDD]">
              <h2 className="text-2xl font-bold text-[#000000] mb-6">Информация об автомобиле</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Тип кузова
                  </label>
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                  >
                    <option value="">Выберите тип кузова</option>
                    {CAR_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Год выпуска
                  </label>
                  <input
                    type="text"
                    name="carYear"
                    value={formData.carYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="pt-8 border-t border-[#D9DCDD]">
              <h2 className="text-2xl font-bold text-[#000000] mb-6">Какие задачи нужно решить?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TASKS.map((task) => (
                  <label
                    key={task.value}
                    className="flex items-center gap-3 p-4 rounded-lg border border-[#D9DCDD] cursor-pointer hover:border-[#000000] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tasks.includes(task.value)}
                      onChange={() => handleTaskToggle(task.value)}
                      className="w-5 h-5"
                    />
                    <span className="text-[#1F2328]">{task.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="pt-8 border-t border-[#D9DCDD]">
              <h2 className="text-2xl font-bold text-[#000000] mb-6">Планируемый бюджет</h2>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
              >
                <option value="">Выберите бюджет</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Comment */}
            <div className="pt-8 border-t border-[#D9DCDD]">
              <h2 className="text-2xl font-bold text-[#000000] mb-6">Дополнительные пожелания</h2>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                placeholder="Опишите подробнее, какие задачи нужно решить, есть ли предпочтения по брендам..."
              />
            </div>

            {/* Agreement */}
            <div className="pt-8 border-t border-[#D9DCDD]">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreement"
                  required
                  className="mt-1 w-4 h-4"
                />
                <label htmlFor="agreement" className="text-sm text-[#5B6470]">
                  Я согласен на обработку персональных данных и подтверждаю, что ознакомлен с{' '}
                  <Link href="/privacy" className="text-[#000000] underline">
                    политикой конфиденциальности
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full bg-[#E57A22] hover:bg-[#d46a1a] text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
              >
                Отправить заявку на консультацию
              </button>
              <p className="text-center text-sm text-[#5B6470] mt-4">
                Эксперт свяжется с вами в течение 1-2 часов
              </p>
            </div>
          </div>
        </form>

        {/* Benefits */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-4">👨‍🔧</div>
            <h3 className="font-semibold text-[#000000] mb-2">Экспертная помощь</h3>
            <p className="text-sm text-[#5B6470]">
              Подбор от специалиста с опытом работы в детейлинге
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="font-semibold text-[#000000] mb-2">Оптимальный бюджет</h3>
            <p className="text-sm text-[#5B6470]">
              Подберём средства под ваш бюджет без лишних покупок
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-semibold text-[#000000] mb-2">Пошаговая инструкция</h3>
            <p className="text-sm text-[#5B6470]">
              Предоставим подробную инструкцию по применению средств
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
