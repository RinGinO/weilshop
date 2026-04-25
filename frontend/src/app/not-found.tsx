import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#F5F4EF] flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="text-9xl mb-8">🔍</div>
          
          {/* Heading */}
          <h1 className="text-6xl font-bold text-[#000000] mb-4">404</h1>
          <h2 className="text-3xl font-bold text-[#000000] mb-6">
            Страница не найдена
          </h2>
          
          {/* Description */}
          <p className="text-xl text-[#5B6470] mb-12">
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-[#000000] hover:bg-[#333333] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              ← На главную
            </Link>
            <Link
              href="/catalog"
              className="bg-white hover:bg-[#F5F4EF] text-[#000000] border border-[#000000] px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Перейти в каталог
            </Link>
            <Link
              href="/tasks"
              className="bg-white hover:bg-[#F5F4EF] text-[#000000] border border-[#000000] px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Подбор по задачам
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="mt-16 pt-16 border-t border-[#D9DCDD]">
            <h3 className="text-lg font-semibold text-[#000000] mb-6">
              Популярные разделы
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/catalog"
                className="p-4 bg-white rounded-lg border border-[#D9DCDD] hover:border-[#000000] transition-colors"
              >
                <div className="text-2xl mb-2">🛒</div>
                <div className="font-semibold text-[#000000]">Каталог</div>
              </Link>
              <Link
                href="/tasks"
                className="p-4 bg-white rounded-lg border border-[#D9DCDD] hover:border-[#000000] transition-colors"
              >
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-[#000000]">Задачи ухода</div>
              </Link>
              <Link
                href="/knowledge"
                className="p-4 bg-white rounded-lg border border-[#D9DCDD] hover:border-[#000000] transition-colors"
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold text-[#000000]">База знаний</div>
              </Link>
              <Link
                href="/consultations"
                className="p-4 bg-white rounded-lg border border-[#D9DCDD] hover:border-[#000000] transition-colors"
              >
                <div className="text-2xl mb-2">💬</div>
                <div className="font-semibold text-[#000000]">Консультации</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
