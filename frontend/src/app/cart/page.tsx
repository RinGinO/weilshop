'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/entities/cart/store';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCartStore();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    comment: '',
  });

  const subtotal = totalPrice();
  const delivery = 0;
  const total = subtotal + delivery;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Заказ оформлен!\n\nСумма: ${total} ₽\nМенеджер свяжется с вами в ближайшее время.`);
    clearCart();
    setShowCheckoutForm(false);
  };

  if (items.length === 0 && !showCheckoutForm) {
    return (
      <main className="min-h-screen bg-[#F5F4EF]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-[#000000] mb-4">Корзина пуста</h1>
            <p className="text-[#5B6470] mb-8">
              Добавьте товары из каталога или подберите средства по задачам ухода
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/catalog"
                className="bg-[#000000] hover:bg-[#333333] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Перейти в каталог
              </Link>
              <Link
                href="/tasks"
                className="bg-white hover:bg-[#F5F4EF] text-[#000000] border border-[#000000] px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Подбор по задачам
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
        <h1 className="text-4xl font-bold text-[#000000] mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD]">
                <div className="flex items-center gap-6">
                  {/* Image */}
                  <Link href={`/catalog/${item.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-[#F5F4EF] rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🧴</span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1">
                    <Link
                      href={`/catalog/${item.slug}`}
                      className="text-lg font-semibold text-[#000000] hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="text-sm text-[#5B6470] mb-2">{item.brand}</div>
                    {item.volume && (
                      <div className="text-sm text-[#5B6470] mb-2">Объём: {item.volume}</div>
                    )}
                    <div className="text-xl font-bold text-[#000000]">{item.price} ₽</div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-[#D9DCDD] rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-4 py-2 text-[#000000] hover:bg-[#F5F4EF] rounded-l-lg"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 text-[#000000] font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-4 py-2 text-[#000000] hover:bg-[#F5F4EF] rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Total & Remove */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#000000] mb-2">
                      {item.price * item.quantity} ₽
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-[#000000] hover:underline font-semibold"
            >
              ← Продолжить покупки
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D9DCDD] sticky top-24">
              <h2 className="text-2xl font-bold text-[#000000] mb-6">Ваш заказ</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#5B6470]">
                  <span>Товары ({totalItems()} шт.)</span>
                  <span>{subtotal} ₽</span>
                </div>
                <div className="flex justify-between text-[#5B6470]">
                  <span>Доставка</span>
                  <span className="text-green-600">Бесплатно</span>
                </div>
                <div className="border-t border-[#D9DCDD] pt-4">
                  <div className="flex justify-between text-xl font-bold text-[#000000]">
                    <span>Итого</span>
                    <span>{total} ₽</span>
                  </div>
                </div>
              </div>

              {!showCheckoutForm ? (
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full bg-[#000000] hover:bg-[#333333] text-white px-8 py-4 rounded-lg font-semibold transition-colors mb-4"
                >
                  Оформить заказ
                </button>
              ) : (
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="w-full bg-[#F5F4EF] hover:bg-[#E5E5E5] text-[#000000] px-8 py-4 rounded-lg font-semibold transition-colors mb-4 border border-[#D9DCDD]"
                >
                  Назад к корзине
                </button>
              )}

              <Link
                href="/tasks"
                className="block text-center text-[#5B6470] hover:text-[#000000] text-sm"
              >
                Продолжить покупки →
              </Link>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        {showCheckoutForm && (
          <div className="mt-8 bg-white rounded-xl p-8 shadow-sm border border-[#D9DCDD]">
            <h2 className="text-2xl font-bold text-[#000000] mb-6">Оформление заказа</h2>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
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
                    placeholder="Иванов Иван Иванович"
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

                <div>
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

                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Адрес доставки *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                    placeholder="г. Москва, ул. Примерная, д. 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-2">
                  Комментарий к заказу
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000]"
                  placeholder="Дополнительная информация для менеджера"
                />
              </div>

              <div className="bg-[#F5F4EF] rounded-lg p-6">
                <h3 className="font-semibold text-[#000000] mb-4">Детали заказа</h3>
                <div className="space-y-2 text-[#5B6470]">
                  <div className="flex justify-between">
                    <span>Товары ({totalItems()} шт.)</span>
                    <span className="text-[#000000] font-semibold">{subtotal} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span className="text-green-600">Бесплатно</span>
                  </div>
                  <div className="border-t border-[#D9DCDD] pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-[#000000]">
                      <span>Итого к оплате</span>
                      <span>{total} ₽</span>
                    </div>
                  </div>
                </div>
              </div>

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

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#E57A22] hover:bg-[#d46a1a] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  Подтвердить заказ ({total} ₽)
                </button>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="px-8 py-4 rounded-lg font-semibold transition-colors border border-[#D9DCDD] text-[#5B6470] hover:bg-[#F5F4EF]"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
