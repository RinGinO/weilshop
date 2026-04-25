import Link from 'next/link';

const CARE_TASKS = [
  {
    slug: 'moyka-kuzova',
    name: 'Мойка кузова',
    shortDescription: 'Правильная мойка автомобиля без царапин',
    fullDescription: 'Пошаговая инструкция по безопасной мойке кузова без разводов и царапин.',
    icon: '🚿',
    productsCount: 8,
  },
  {
    slug: 'ochistka-salona',
    name: 'Очистка салона',
    shortDescription: 'Комплексная чистка интерьера',
    fullDescription: 'Глубокая очистка всех поверхностей салона от загрязнений.',
    icon: '🧹',
    productsCount: 5,
  },
  {
    slug: 'polirovka-kuzova',
    name: 'Полировка кузова',
    shortDescription: 'Восстановление блеска ЛКП',
    fullDescription: 'Удаление царапин и восстановление глубины цвета.',
    icon: '✨',
    productsCount: 4,
  },
  {
    slug: 'uhod-za-kolyosami',
    name: 'Уход за колёсами',
    shortDescription: 'Чистка и защита дисков и шин',
    fullDescription: 'Удаление тормозной пыли и защита резины.',
    icon: '🛞',
    productsCount: 6,
  },
  {
    slug: 'zashchita-kuzova-voskom',
    name: 'Защита кузова воском',
    shortDescription: 'Нанесение защитного воска',
    fullDescription: 'Создание гидрофобного слоя для защиты ЛКП.',
    icon: '🛡️',
    productsCount: 5,
  },
  {
    slug: 'ochistka-styokol',
    name: 'Очистка стёкол',
    shortDescription: 'Безразводная мойка стёкол',
    fullDescription: 'Кристально чистые стёкла без разводов.',
    icon: '🪟',
    productsCount: 3,
  },
  {
    slug: 'uhod-za-plastikom',
    name: 'Уход за пластиком',
    shortDescription: 'Очистка и защита пластика салона',
    fullDescription: 'Восстановление внешнего вида пластиковых панелей.',
    icon: '🎛️',
    productsCount: 4,
  },
  {
    slug: 'himchistka-salona',
    name: 'Химчистка салона',
    shortDescription: 'Глубокая очистка тканей',
    fullDescription: 'Удаление сложных пятен с обивки сидений и пола.',
    icon: '🧼',
    productsCount: 5,
  },
  {
    slug: 'dezinfekciya-salona',
    name: 'Дезинфекция салона',
    shortDescription: 'Устранение бактерий и запахов',
    fullDescription: 'Антибактериальная обработка всех поверхностей.',
    icon: '🦠',
    productsCount: 3,
  },
  {
    slug: 'podgotovka-k-zime',
    name: 'Подготовка к зиме',
    shortDescription: 'Защита авто перед зимой',
    fullDescription: 'Комплексная защита кузова и салона от зимних реагентов.',
    icon: '❄️',
    productsCount: 7,
  },
  {
    slug: 'udalenie-bituma',
    name: 'Удаление битума',
    shortDescription: 'Очистка кузова от смолы и битума',
    fullDescription: 'Безопасное удаление дорожных загрязнений.',
    icon: '⚫',
    productsCount: 2,
  },
  {
    slug: 'uhod-za-kozhey',
    name: 'Уход за кожей',
    shortDescription: 'Очистка и кондиционирование кожи',
    fullDescription: 'Сохранение мягкости и внешнего вида кожаного салона.',
    icon: '🛋️',
    productsCount: 4,
  },
];

export default function TasksPage() {
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

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARE_TASKS.map((task) => (
            <Link
              key={task.slug}
              href={`/tasks/${task.slug}`}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-[#D9DCDD] hover:border-[#000000]"
            >
              <div className="text-5xl mb-4">{task.icon}</div>
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
