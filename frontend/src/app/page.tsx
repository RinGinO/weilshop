import Link from 'next/link';

const CARE_TASKS = [
  {
    slug: 'moyka-kuzova',
    name: 'Мойка кузова',
    description: 'Правильная мойка автомобиля без царапин',
    icon: '🚿',
  },
  {
    slug: 'ochistka-salona',
    name: 'Очистка салона',
    description: 'Комплексная чистка интерьера',
    icon: '🧹',
  },
  {
    slug: 'polirovka-kuzova',
    name: 'Полировка кузова',
    description: 'Восстановление блеска ЛКП',
    icon: '✨',
  },
  {
    slug: 'uhod-za-kolyosami',
    name: 'Уход за колёсами',
    description: 'Чистка и защита дисков и шин',
    icon: '🛞',
  },
  {
    slug: 'zashchita-kuzova-voskom',
    name: 'Защита воском',
    description: 'Нанесение защитного воска',
    icon: '🛡️',
  },
  {
    slug: 'uhod-za-plastikom',
    name: 'Уход за пластиком',
    description: 'Очистка и защита пластика салона',
    icon: '🎛️',
  },
];

const FEATURED_PRODUCTS = [
  {
    slug: 'avtoshampun-premium',
    name: 'Автошампунь Premium',
    brand: 'Leraton',
    price: 890,
    volume: '500 мл',
  },
  {
    slug: 'vosk-karnaubskiy',
    name: 'Воск карнаубский',
    brand: 'Leraton',
    price: 1290,
    volume: '200 г',
  },
  {
    slug: 'mr-pink',
    name: 'Chemical Guys Mr. Pink',
    brand: 'Chemical Guys',
    price: 1590,
    volume: '473 мл',
  },
  {
    slug: 'ochistitel-bituma',
    name: 'Очиститель битума',
    brand: 'Leraton',
    price: 690,
    volume: '500 мл',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      {/* Hero Section */}
      <section className="bg-[#000000] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Профессиональная автохимия для ухода за вашим автомобилем
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Подбор средств по задачам ухода. Только проверенные бренды. 
              Экспертные консультации.
            </p>
            <div className="flex gap-4">
              <Link
                href="/catalog"
                className="bg-[#E57A22] hover:bg-[#d46a1a] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Перейти в каталог
              </Link>
              <Link
                href="/tasks"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors border border-white/30"
              >
                Подбор по задачам
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Care Tasks */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-4">
            Подбор по задачам ухода
          </h2>
          <p className="text-[#5B6470] mb-12 text-lg">
            Выберите задачу — мы подберём подходящие средства
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARE_TASKS.map((task) => (
              <Link
                key={task.slug}
                href={`/tasks/${task.slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-[#D9DCDD] hover:border-[#000000]"
              >
                <div className="text-4xl mb-4">{task.icon}</div>
                <h3 className="text-xl font-semibold text-[#1F2328] mb-2 group-hover:text-[#000000] transition-colors">
                  {task.name}
                </h3>
                <p className="text-[#5B6470]">{task.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/tasks"
              className="text-[#000000] hover:text-[#333333] font-semibold inline-flex items-center gap-2"
            >
              Показать все задачи
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-4">
            Популярные товары
          </h2>
          <p className="text-[#5B6470] mb-12 text-lg">
            Выбор наших покупателей
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/catalog/${product.slug}`}
                className="group bg-[#F5F4EF] rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">🧴</span>
                </div>
                <div className="text-sm text-[#5B6470] mb-1">{product.brand}</div>
                <h3 className="text-lg font-semibold text-[#1F2328] mb-2 group-hover:text-[#000000] transition-colors">
                  {product.name}
                </h3>
                <div className="text-sm text-[#5B6470] mb-3">{product.volume}</div>
                <div className="text-xl font-bold text-[#000000]">
                  {product.price} ₽
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="text-[#000000] hover:text-[#333333] font-semibold inline-flex items-center gap-2"
            >
              Смотреть весь каталог
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1F2328] mb-12 text-center">
            Почему выбирают нас
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-[#1F2328] mb-2">
                Подбор по задачам
              </h3>
              <p className="text-[#5B6470]">
                Не знаете что выбрать? Подберём средства под конкретную задачу
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-[#1F2328] mb-2">
                Только проверенные бренды
              </h3>
              <p className="text-[#5B6470]">
                Работаем с лучшими производителями автохимии
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-[#1F2328] mb-2">
                Экспертные консультации
              </h3>
              <p className="text-[#5B6470]">
                Поможем с выбором и ответим на все вопросы
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1F2328] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Нужна помощь с подбором?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
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
      </section>
    </main>
  );
}
