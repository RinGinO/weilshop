import Link from 'next/link';

const TASK = {
  slug: 'moyka-kuzova',
  name: 'Мойка кузова',
  icon: '🚿',
  shortDescription: 'Правильная мойка автомобиля без царапин',
  fullDescription: 'Регулярная мойка кузова — основа долговечности лакокрасочного покрытия вашего автомобиля. Неправильная мойка может привести к появлению микроцарапин, которые со временем сделают ЛКП матовым.',
  problemDescription: 'Грязь, пыль, дорожные реагенты, птичий помёт и насекомые разрушают лакокрасочное покрытие, вызывая коррозию и потускнение.',
  steps: [
    {
      number: 1,
      title: 'Предварительная мойка',
      description: 'Смойте основную грязь водой без контакта с кузовом. Используйте мойку высокого давления с расстояния 30-40 см.',
      duration: '5-10 минут',
    },
    {
      number: 2,
      title: 'Нанесение активной пены',
      description: 'Нанесите активную пену на весь кузов. Дайте поработать 3-5 минут для размягчения загрязнений.',
      duration: '5 минут',
    },
    {
      number: 3,
      title: 'Основная мойка',
      description: 'Вымойте автомобиль шампунем с помощью губки или варежки из микрофибры. Двигайтесь сверху вниз.',
      duration: '10-15 минут',
    },
    {
      number: 4,
      title: 'Сушка',
      description: 'Высушите кузов полотенцем из микрофибры. Не трите, а промакивающими движениями удаляйте воду.',
      duration: '5-10 минут',
    },
    {
      number: 5,
      title: 'Защита воском (опционально)',
      description: 'Нанесите защитный воск для создания гидрофобного слоя и дополнительного блеска.',
      duration: '10-15 минут',
    },
  ],
  tips: [
    'Мойте автомобиль в тени, чтобы избежать высыхания шампуня на солнце',
    'Используйте отдельную губку для нижней части кузова и колёс',
    'Меняйте воду в ведре после каждого круга мойки',
    'Не используйте бытовые моющие средства — они смывают защитный воск',
  ],
  productsCount: 8,
  avgTime: '30-45 минут',
  frequency: '1-2 раза в месяц',
};

const RECOMMENDED_PRODUCTS = [
  { slug: 'avtoshampun-premium', name: 'Автошампунь Premium', brand: 'Leraton', price: 890, volume: '500 мл' },
  { slug: 'mr-pink', name: 'Chemical Guys Mr. Pink', brand: 'Chemical Guys', price: 1590, volume: '473 мл' },
  { slug: 'gubka-dlya-moyki', name: 'Губка для мойки', brand: 'Detail', price: 350, volume: null },
  { slug: 'varezhka-mikrofibr', name: 'Варежка микрофибра', brand: 'Detail', price: 590, volume: null },
  { slug: 'polotence-60x90', name: 'Полотенце 60x90', brand: 'Detail', price: 890, volume: null },
  { slug: 'vosk-karnaubskiy', name: 'Воск карнаубский', brand: 'Leraton', price: 1290, volume: '200 г' },
];

const FAQ = [
  {
    question: 'Как часто нужно мыть автомобиль?',
    answer: 'Рекомендуется мыть автомобиль 1-2 раза в месяц, в зависимости от условий эксплуатации. Зимой чаще из-за реагентов.',
  },
  {
    question: 'Можно ли мыть машину под прямыми солнечными лучами?',
    answer: 'Нет, мойка на солнце приводит к быстрому высыханию шампуня и образованию пятен. Мойте в тени или в помещении.',
  },
  {
    question: 'Какой шампунь лучше выбрать?',
    answer: 'Выбирайте шампунь с нейтральным pH (7.0). Для регулярной мойки подойдут бюджетные варианты, для защиты — с добавлением воска.',
  },
  {
    question: 'Нужно ли использовать отдельную губку для колёс?',
    answer: 'Да, обязательно! Колёса сильно загрязнены тормозной пылью, которую не следует переносить на кузов.',
  },
];

export default function TaskPage() {
  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-[#5B6470]">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#000000]">Главная</Link></li>
            <li>/</li>
            <li><Link href="/tasks" className="hover:text-[#000000]">Задачи ухода</Link></li>
            <li>/</li>
            <li className="text-[#000000]">{TASK.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-12">
          <div className="text-6xl mb-6">{TASK.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#000000] mb-4">{TASK.name}</h1>
          <p className="text-xl text-[#5B6470] mb-6">{TASK.shortDescription}</p>
          <div className="flex flex-wrap gap-6 text-[#5B6470]">
            <div>⏱️ {TASK.avgTime}</div>
            <div>📅 {TASK.frequency}</div>
            <div>🧴 {TASK.productsCount} товаров</div>
          </div>
        </div>

        {/* Problem Description */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-[#000000] mb-4">⚠️ Проблема</h2>
          <p className="text-lg text-[#5B6470] leading-relaxed">{TASK.problemDescription}</p>
        </div>

        {/* Full Description */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-[#000000] mb-4">📖 Описание</h2>
          <p className="text-lg text-[#5B6470] leading-relaxed">{TASK.fullDescription}</p>
        </div>

        {/* Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#000000] mb-8">📋 Пошаговая инструкция</h2>
          <div className="space-y-6">
            {TASK.steps.map((step) => (
              <div key={step.number} className="bg-white rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#000000] text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#000000] mb-2">{step.title}</h3>
                    <p className="text-[#5B6470] mb-3">{step.description}</p>
                    <div className="text-sm text-[#5B6470]">⏱️ {step.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-[#000000] mb-6">💡 Советы экспертов</h2>
          <ul className="space-y-4">
            {TASK.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[#000000] font-bold">✓</span>
                <span className="text-[#5B6470]">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Products */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#000000] mb-8">🛒 Рекомендуемые товары</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RECOMMENDED_PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/catalog/${product.slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-[#D9DCDD] hover:border-[#000000]"
              >
                <div className="aspect-square bg-[#F5F4EF] rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">🧴</span>
                </div>
                <div className="text-sm text-[#5B6470] mb-1">{product.brand}</div>
                <h3 className="text-lg font-semibold text-[#000000] mb-2 group-hover:text-[#333333] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                {product.volume && (
                  <div className="text-sm text-[#5B6470] mb-3">{product.volume}</div>
                )}
                <div className="text-xl font-bold text-[#000000]">{product.price} ₽</div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#000000] mb-8">❓ Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            {FAQ.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-[#000000] mb-3">{faq.question}</h3>
                <p className="text-[#5B6470]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#000000] text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Нужна помощь с подбором?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Оставьте заявку на консультацию — эксперт поможет подобрать оптимальный набор 
            средств для вашего автомобиля
          </p>
          <Link
            href="/consultations"
            className="bg-[#E57A22] hover:bg-[#d46a1a] text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-block"
          >
            Заказать консультацию
          </Link>
        </div>
      </div>
    </main>
  );
}
