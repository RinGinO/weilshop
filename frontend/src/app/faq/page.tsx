'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ_CATEGORIES = [
  { slug: 'all', label: 'Все вопросы' },
  { slug: 'washing', label: 'Мойка кузова' },
  { slug: 'protection', label: 'Защита' },
  { slug: 'interior', label: 'Салон' },
  { slug: 'wheels', label: 'Колёса' },
  { slug: 'products', label: 'Товары' },
];

const FAQ_ITEMS = [
  {
    id: 1,
    category: 'washing',
    question: 'Как часто нужно мыть автомобиль?',
    answer: 'Рекомендуется мыть автомобиль 1-2 раза в месяц, в зависимости от условий эксплуатации. Зимой чаще из-за реагентов, летом можно реже. Если автомобиль стоит в гараже и мало используется, достаточно мойки раз в 2-3 недели.',
  },
  {
    id: 2,
    category: 'washing',
    question: 'Можно ли мыть машину под прямыми солнечными лучами?',
    answer: 'Нет, мойка на солнце приводит к быстрому высыханию шампуня и образованию пятен на кузове. Вода и моющие средства высыхают неравномерно, оставляя разводы. Мойте автомобиль в тени или в помещении.',
  },
  {
    id: 3,
    category: 'washing',
    question: 'Какой шампунь лучше выбрать для регулярной мойки?',
    answer: 'Для регулярной мойки выбирайте шампунь с нейтральным pH (около 7.0). Такие средства бережно очищают, не смывая защитный воск. Для сильных загрязнений можно использовать щелочные шампуни, но не чаще 1-2 раз в год.',
  },
  {
    id: 4,
    category: 'washing',
    question: 'Нужно ли использовать отдельную губку для колёс?',
    answer: 'Да, обязательно! Колёса сильно загрязнены тормозной пылью, металлической стружкой и дорожной грязью. Эти загрязнения могут поцарапать ЛКП кузова. Используйте отдельную губку или варежку только для колёс.',
  },
  {
    id: 5,
    category: 'protection',
    question: 'Как часто нужно наносить защитный воск?',
    answer: 'Зависит от типа воска. Карнаубские воски держатся 4-8 недель, синтетические полимерные — до 3-6 месяцев. Керамические покрытия могут служить от 1 до 5 лет. Для максимальной защиты рекомендуется обновлять воск каждые 2-3 месяца.',
  },
  {
    id: 6,
    category: 'protection',
    question: 'Что лучше: воск или керамическое покрытие?',
    answer: 'Воск даёт глубокий блеск и хорошую гидрофобность, но требует частого обновления. Керамика более долговечна, лучше защищает от царапин и химии, но дороже в нанесении. Оптимально: керамика как база + воск сверху для блеска.',
  },
  {
    id: 7,
    category: 'protection',
    question: 'Нужно ли полировать автомобиль перед нанесением воска?',
    answer: 'Полировка рекомендуется, но не обязательна. Если на кузове есть царапины и потёртости, полировка восстановит блеск. Если ЛКП в хорошем состоянии, достаточно тщательной мойки и обезжиривания перед воском.',
  },
  {
    id: 8,
    category: 'interior',
    question: 'Как часто нужно делать химчистку салона?',
    answer: 'Профессиональную химчистку рекомендуется делать 1-2 раза в год. Между глубокими чистками можно использовать экспресс-средства для локальной очистки пятен. При наличии детей или животных — чаще.',
  },
  {
    id: 9,
    category: 'interior',
    question: 'Как ухаживать за кожаным салоном?',
    answer: 'Кожаный салон нужно очищать специальным средством для кожи 1-2 раза в месяц, затем наносить кондиционер. Избегайте спиртовых средств — они сушат кожу. Защищайте от прямых солнечных лучей для предотвращения выцветания.',
  },
  {
    id: 10,
    category: 'interior',
    question: 'Чем очистить пластик в салоне?',
    answer: 'Используйте специальные очистители для автомобильного пластика. Они не содержат спирта и агрессивных растворителей. Для матового пластика выбирайте средства без силикона, для глянцевого — с антистатиком.',
  },
  {
    id: 11,
    category: 'wheels',
    question: 'Как очистить диски от тормозной пыли?',
    answer: 'Используйте специальный очиститель тормозной пыли (iron remover). Он растворяет металлические частицы, окрашиваясь в фиолетовый цвет. Нанесите на сухие диски, подождите 3-5 минут, смойте водой. Не допускайте высыхания!',
  },
  {
    id: 12,
    category: 'wheels',
    question: 'Как защитить шины от выгорания?',
    answer: 'Используйте чернитель шин на водной или силиконовой основе. Наносите на чистые сухие шины. Чернители на водной основе дают матовый эффект и держатся 1-2 недели, силиконовые — глянцевый блеск до 4-6 недель.',
  },
  {
    id: 13,
    category: 'products',
    question: 'Можно ли использовать бытовую химию для автомобиля?',
    answer: 'Не рекомендуется. Бытовые средства имеют неподходящий pH, могут содержать абразивы и агрессивные компоненты. Они смывают защитные покрытия, повреждают пластик и резину. Используйте специализированную автохимию.',
  },
  {
    id: 14,
    category: 'products',
    question: 'В чём разница между профессиональной и любительской автохимией?',
    answer: 'Профессиональная химия более концентрированная, требует разведения, даёт лучший результат. Любительская готова к использованию, проще в применении, но менее эффективна. Для дома подойдёт любительская серия.',
  },
  {
    id: 15,
    category: 'products',
    question: 'Сколько хранится автохимия?',
    answer: 'Срок хранения большинства средств 2-3 года в закрытой упаковке при температуре от +5 до +25°C. После вскрытия рекомендуется использовать в течение 12 месяцев. Не храните на морозе и под прямыми солнечными лучами.',
  },
];

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#000000] mb-4">
            Часто задаваемые вопросы
          </h1>
          <p className="text-xl text-[#5B6470] max-w-3xl">
            Ответы на популярные вопросы по уходу за автомобилем 
            и использованию автохимии
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Поиск по вопросам..."
            className="w-full max-w-2xl px-6 py-4 rounded-lg border border-[#D9DCDD] bg-white focus:outline-none focus:ring-2 focus:ring-[#000000] text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#000000] text-white'
                  : 'bg-white text-[#1F2328] hover:bg-[#F5F4EF] border border-[#D9DCDD]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-[#D9DCDD] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-semibold text-[#000000] text-lg pr-8">
                  {faq.question}
                </span>
                <span className={`text-2xl transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-[#D9DCDD]">
                    <p className="text-[#5B6470] leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#5B6470] text-lg">Вопросы не найдены</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-[#000000] text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Не нашли ответ на свой вопрос?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Задайте вопрос нашему эксперту — получим персональную консультацию 
            по уходу за вашим автомобилем
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultations"
              className="bg-[#E57A22] hover:bg-[#d46a1a] text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-block"
            >
              Заказать консультацию
            </Link>
            <Link
              href="/knowledge"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors border border-white/30 inline-block"
            >
              Перейти в базу знаний
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
