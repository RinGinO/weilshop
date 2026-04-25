import Link from 'next/link';

const ARTICLES = [
  {
    slug: 'kak-vybrat-avtoshampun',
    title: 'Как выбрать автошампунь: полное руководство',
    category: 'articles',
    categoryLabel: 'Статья',
    excerpt: 'Разбираемся в типах автошампуней, pH-балансе и особенностях выбора для разных задач.',
    readTime: '8 мин',
    publishedAt: '2025-01-10',
    cover: '📝',
  },
  {
    slug: 'oshibki-pri-moyke-kuzova',
    title: '10 ошибок при мойке кузова',
    category: 'articles',
    categoryLabel: 'Статья',
    excerpt: 'Типичные ошибки, которые приводят к царапинам и потускнению ЛКП.',
    readTime: '6 мин',
    publishedAt: '2025-01-08',
    cover: '⚠️',
  },
  {
    slug: 'chto-takoe-karnaubskiy-vosk',
    title: 'Что такое карнаубский воск и зачем он нужен',
    category: 'articles',
    categoryLabel: 'Статья',
    excerpt: 'Всё о защитных свойствах карнаубского воска и способах нанесения.',
    readTime: '5 мин',
    publishedAt: '2025-01-05',
    cover: '🛡️',
  },
  {
    slug: 'podgotovka-k-zime',
    title: 'Подготовка автомобиля к зиме: чек-лист',
    category: 'articles',
    categoryLabel: 'Статья',
    excerpt: 'Полный чек-лист по подготовке кузова и салона к зимнему сезону.',
    readTime: '10 мин',
    publishedAt: '2025-01-03',
    cover: '❄️',
  },
  {
    slug: 'instrukciya-po-naneseniyu-voska',
    title: 'Инструкция по нанесению воска',
    category: 'instructions',
    categoryLabel: 'Инструкция',
    excerpt: 'Пошаговая инструкция нанесения защитного воска на кузов автомобиля.',
    readTime: '7 мин',
    publishedAt: '2025-01-12',
    cover: '📋',
  },
  {
    slug: 'kak-ispolzovat-ochistitel-bituma',
    title: 'Как использовать очиститель битума',
    category: 'instructions',
    categoryLabel: 'Инструкция',
    excerpt: 'Правильное применение очистителя битума без повреждения ЛКП.',
    readTime: '4 мин',
    publishedAt: '2025-01-09',
    cover: '🧴',
  },
  {
    slug: 'uhod-za-kozhanym-salonom',
    title: 'Уход за кожаным салоном',
    category: 'instructions',
    categoryLabel: 'Инструкция',
    excerpt: 'Рекомендации по очистке и кондиционированию кожаных сидений.',
    readTime: '6 мин',
    publishedAt: '2025-01-06',
    cover: '🛋️',
  },
];

const CATEGORIES = [
  { slug: 'all', label: 'Все материалы' },
  { slug: 'articles', label: 'Статьи' },
  { slug: 'instructions', label: 'Инструкции' },
  { slug: 'faq', label: 'FAQ' },
];

export default function KnowledgePage() {
  const selectedCategory = 'all';

  const filteredArticles = selectedCategory === 'all'
    ? ARTICLES
    : ARTICLES.filter(article => article.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#000000] mb-4">База знаний</h1>
          <p className="text-xl text-[#5B6470] max-w-3xl">
            Статьи, инструкции и ответы на часто задаваемые вопросы 
            по уходу за автомобилем
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/knowledge${cat.slug !== 'all' ? `?category=${cat.slug}` : ''}`}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#000000] text-white'
                  : 'bg-white text-[#1F2328] hover:bg-[#F5F4EF] border border-[#D9DCDD]'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Поиск по базе знаний..."
            className="w-full max-w-2xl px-6 py-4 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000] text-lg"
          />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/knowledge/${article.category}/${article.slug}`}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-[#D9DCDD] hover:border-[#000000]"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{article.cover}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  article.category === 'articles'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {article.categoryLabel}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-3 group-hover:text-[#333333] transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-[#5B6470] mb-4 line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-[#5B6470]">
                <span>⏱️ {article.readTime}</span>
                <span>📅 {new Date(article.publishedAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* FAQ Preview */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#000000]">❓ Часто задаваемые вопросы</h2>
            <Link
              href="/faq"
              className="text-[#000000] font-semibold hover:underline"
            >
              Смотреть все →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'Как часто нужно мыть автомобиль?', a: 'Рекомендуется 1-2 раза в месяц...' },
              { q: 'Можно ли мыть машину на солнце?', a: 'Нет, мойка на солнце приводит...' },
              { q: 'Какой шампунь лучше выбрать?', a: 'Выбирайте шампунь с нейтральным pH...' },
              { q: 'Нужна ли отдельная губка для колёс?', a: 'Да, обязательно! Колёса сильно...' },
            ].map((faq, index) => (
              <Link
                key={index}
                href={`/faq#${index}`}
                className="p-6 rounded-xl bg-[#F5F4EF] hover:bg-[#E5E5E5] transition-colors"
              >
                <h3 className="font-semibold text-[#000000] mb-2">{faq.q}</h3>
                <p className="text-sm text-[#5B6470] line-clamp-2">{faq.a}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#000000] text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Не нашли ответ?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Задайте вопрос нашему эксперту — получим персональную консультацию 
            по уходу за вашим автомобилем
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
