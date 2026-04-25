import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ==================== CONSTANTS ====================

const ROLES = [
  { name: 'Super Admin', code: 'SUPER_ADMIN', description: 'Полный доступ ко всем функциям' },
  { name: 'Catalog Manager', code: 'CATALOG_MANAGER', description: 'Товары, категории, бренды, задачи ухода' },
  { name: 'Content Manager', code: 'CONTENT_MANAGER', description: 'Статьи, инструкции, FAQ, SEO' },
  { name: 'Request Manager', code: 'REQUEST_MANAGER', description: 'Обработка заявок' },
  { name: 'Consultation Manager', code: 'CONSULTATION_MANAGER', description: 'Консультации по подбору' },
  { name: 'SEO / Merch Manager', code: 'SEO_MERCH_MANAGER', description: 'Коммерческая подача и видимость' },
];

const ADMINS = [
  { name: 'Super Admin', email: 'super@weilshop.ru', password: 'Admin123!', roleCodes: ['SUPER_ADMIN'] },
  { name: 'Catalog Manager', email: 'catalog@weilshop.ru', password: 'Admin123!', roleCodes: ['CATALOG_MANAGER', 'CONTENT_MANAGER'] },
  { name: 'Request Manager', email: 'request@weilshop.ru', password: 'Admin123!', roleCodes: ['REQUEST_MANAGER', 'CONSULTATION_MANAGER'] },
];

const CATEGORIES = [
  { name: 'Автохимия', slug: 'avtohimiya', description: 'Все виды автохимии' },
  { name: 'Автошампуни', slug: 'avtoshampuni', description: 'Шампуни для мойки кузова', parentSlug: 'avtohimiya' },
  { name: 'Воски и полироли', slug: 'voski-i-poliroli', description: 'Защита и блеск кузова', parentSlug: 'avtohimiya' },
  { name: 'Очистители', slug: 'ochistiteli', description: 'Очистители различных поверхностей', parentSlug: 'avtohimiya' },
  { name: 'Уход за салоном', slug: 'uhod-za-salonom', description: 'Средства для интерьера', parentSlug: 'avtohimiya' },
  { name: 'Для колёс', slug: 'dlya-kolyos', description: 'Шампуни и чернители для шин', parentSlug: 'avtohimiya' },
  { name: 'Аксессуары', slug: 'aksessuary', description: 'Инструменты и принадлежности' },
  { name: 'Мойка', slug: 'moyka', description: 'Губки, варежки, щётки', parentSlug: 'aksessuary' },
  { name: 'Сушка', slug: 'sushka', description: 'Полотенца из микрофибры', parentSlug: 'aksessuary' },
  { name: 'Кисти и щётки', slug: 'kisti-i-shchyotki', description: 'Детейлинг кисти', parentSlug: 'aksessuary' },
];

const BRANDS = [
  { name: 'Leraton', slug: 'leraton', description: 'Профессиональная автохимия' },
  { name: 'Grass', slug: 'grass', description: 'Бытовая и автохимия' },
  { name: 'Chemical Guys', slug: 'chemical-guys', description: 'Премиум автохимия США' },
  { name: 'Koch Chemie', slug: 'koch-chemie', description: 'Немецкое качество' },
  { name: 'Shafite', slug: 'shafite', description: 'Корейская автохимия' },
  { name: 'Detail', slug: 'detail', description: 'Российский бренд' },
  { name: 'Meguiars', slug: 'meguiars', description: 'Легенда детейлинга' },
  { name: 'Sonax', slug: 'sonax', description: 'Немецкая классика' },
];

const CARE_TASKS = [
  {
    name: 'Мойка кузова',
    slug: 'moyka-kuzova',
    shortDescription: 'Правильная мойка автомобиля',
    fullDescription: 'Пошаговая инструкция по безопасной мойке кузова без разводов и царапин.',
    problemDescription: 'Грязь, пыль, дорожные реагенты разрушают лакокрасочное покрытие.',
    stepByStep: '1. Предварительная мойка\n2. Основная мойка с шампунем\n3. Сушка микрофиброй\n4. Нанесение воска',
    faqBlock: 'Как часто мыть? - 1-2 раза в месяц. Какой шампунь выбрать? - С нейтральным pH.',
  },
  {
    name: 'Очистка салона',
    slug: 'ochistka-salona',
    shortDescription: 'Комплексная чистка интерьера',
    fullDescription: 'Глубокая очистка всех поверхностей салона от загрязнений.',
    problemDescription: 'Пыль, пятна, запахи в салоне снижают комфорт.',
    stepByStep: '1. Удаление пыли\n2. Очистка пластика\n3. Чистка ткани\n4. Кондиционирование',
    faqBlock: 'Как часто чистить? - Раз в 3-6 месяцев.',
  },
  {
    name: 'Полировка кузова',
    slug: 'polirovka-kuzova',
    shortDescription: 'Восстановление блеска ЛКП',
    fullDescription: 'Удаление царапин и восстановление глубины цвета.',
    problemDescription: 'Мелкие царапины, потускнение лака, оксидация.',
    stepByStep: '1. Мойка\n2. Очистка глиной\n3. Полировка\n4. Защита воском',
    faqBlock: 'Сколько держится полировка? - От 6 до 12 месяцев.',
  },
  {
    name: 'Уход за колёсами',
    slug: 'uhod-za-kolyosami',
    shortDescription: 'Чистка и защита дисков и шин',
    fullDescription: 'Удаление тормозной пыли и защита резины.',
    problemDescription: 'Тормозная пыль, грязь, старение резины.',
    stepByStep: '1. Мойка дисков\n2. Очиститель тормозной пыли\n3. Чернитель шин',
    faqBlock: 'Как часто чистить диски? - При каждой мойке авто.',
  },
  {
    name: 'Защита кузова воском',
    slug: 'zashchita-kuzova-voskom',
    shortDescription: 'Нанесение защитного воска',
    fullDescription: 'Создание гидрофобного слоя для защиты ЛКП.',
    problemDescription: 'Отсутствие защиты от воды, грязи, УФ-лучей.',
    stepByStep: '1. Мойка\n2. Сушка\n3. Нанесение воска\n4. Полировка',
    faqBlock: 'Как часто наносить воск? - Каждые 2-3 месяца.',
  },
  {
    name: 'Очистка стёкол',
    slug: 'ochistka-styokol',
    shortDescription: 'Безразводная мойка стёкол',
    fullDescription: 'Кристально чистые стёкла без разводов.',
    problemDescription: 'Разводы, плёнка, насекомые на стекле.',
    stepByStep: '1. Предварительная мойка\n2. Очиститель стёкол\n3. Сушка микрофиброй',
    faqBlock: 'Чем мыть стёкла? - Специальным очистителем без аммиака.',
  },
  {
    name: 'Уход за пластиком',
    slug: 'uhod-za-plastikom',
    shortDescription: 'Очистка и защита пластика салона',
    fullDescription: 'Восстановление внешнего вида пластиковых панелей.',
    problemDescription: 'Выцветание, царапины, пыль на пластике.',
    stepByStep: '1. Очистка\n2. Нанесение кондиционера\n3. Полировка',
    faqBlock: 'Какой блеск выбрать? - Матовый выглядит естественнее.',
  },
  {
    name: 'Химчистка салона',
    slug: 'himchistka-salona',
    shortDescription: 'Глубокая очистка тканей',
    fullDescription: 'Удаление сложных пятен с обивки сидений и пола.',
    problemDescription: 'Пятна, запахи, загрязнения ткани.',
    stepByStep: '1. Пылесос\n2. Нанесение очистителя\n3. Чистка щёткой\n4. Удаление пены',
    faqBlock: 'Можно ли чистить самостоятельно? - Да, с правильными средствами.',
  },
  {
    name: 'Дезинфекция салона',
    slug: 'dezinfekciya-salona',
    shortDescription: 'Устранение бактерий и запахов',
    fullDescription: 'Антибактериальная обработка всех поверхностей.',
    problemDescription: 'Бактерии, вирусы, неприятные запахи.',
    stepByStep: '1. Очистка поверхностей\n2. Нанесение дезинфектора\n3. Обработка кондиционера',
    faqBlock: 'Как часто делать? - Раз в сезон или при продаже авто.',
  },
  {
    name: 'Подготовка к зиме',
    slug: 'podgotovka-k-zime',
    shortDescription: 'Защита авто перед зимой',
    fullDescription: 'Комплексная защита кузова и салона от зимних реагентов.',
    problemDescription: 'Соль, реагенты, перепады температур.',
    stepByStep: '1. Глубокая мойка\n2. Полировка\n3. Восковая защита\n4. Обработка уплотнителей',
    faqBlock: 'Когда готовить? - В октябре-ноябре, до первого снега.',
  },
  {
    name: 'Удаление битума',
    slug: 'udalenie-bituma',
    shortDescription: 'Очистка кузова от смолы и битума',
    fullDescription: 'Безопасное удаление дорожных загрязнений.',
    problemDescription: 'Битумные пятна на кузове после поездок.',
    stepByStep: '1. Мойка\n2. Нанесение очистителя битума\n3. Смывание\n4. Мойка с шампунем',
    faqBlock: 'Можно ли оттирать тряпкой? - Нет, только химией.',
  },
  {
    name: 'Уход за кожей',
    slug: 'uhod-za-kozhey',
    shortDescription: 'Очистка и кондиционирование кожи',
    fullDescription: 'Сохранение мягкости и внешнего вида кожаного салона.',
    problemDescription: 'Сухость, трещины, загрязнения кожи.',
    stepByStep: '1. Очистка кожи\n2. Кондиционирование\n3. Защита от УФ',
    faqBlock: 'Как часто ухаживать? - Раз в 1-2 месяца.',
  },
];

const PRODUCTS = [
  // Автошампуни
  { name: 'Автошампунь Premium', slug: 'avtoshampun-premium', sku: 'SH-001', brandSlug: 'leraton', categorySlug: 'avtoshampuni', shortDescription: 'Концентрированный шампунь с воском', fullDescription: 'Профессиональный шампунь с нейтральным pH и добавлением карнаубского воска.', volume: '500 мл', sortOrder: 1 },
  { name: 'Автошампунь Grass', slug: 'avtoshampun-grass', sku: 'SH-002', brandSlug: 'grass', categorySlug: 'avtoshampuni', shortDescription: 'Бюджетный шампунь', fullDescription: 'Эффективный шампунь для ежедневной мойки.', volume: '1 л', sortOrder: 2 },
  { name: 'Chemical Guys Mr. Pink', slug: 'mr-pink', sku: 'CG-001', brandSlug: 'chemical-guys', categorySlug: 'avtoshampuni', shortDescription: 'Легендарный шампунь', fullDescription: 'Культовый шампунь с ароматом вишни.', volume: '473 мл', sortOrder: 3 },
  { name: 'Koch Chemie Nano Magic', slug: 'nano-magic', sku: 'KC-001', brandSlug: 'koch-chemie', categorySlug: 'avtoshampuni', shortDescription: 'Нано-шампунь', fullDescription: 'Инновационный шампунь с нано-частицами.', volume: '1 л', sortOrder: 4 },
  
  // Воски
  { name: 'Воск карнаубский', slug: 'vosk-karnaubskiy', sku: 'WX-001', brandSlug: 'leraton', categorySlug: 'voski-i-poliroli', shortDescription: 'Твёрдый воск', fullDescription: '100% карнаубский воск для глубокого блеска.', volume: '200 г', sortOrder: 1 },
  { name: 'Meguiars Ultimate Wax', slug: 'meguiars-wax', sku: 'MW-001', brandSlug: 'meguiars', categorySlug: 'voski-i-poliroli', shortDescription: 'Синтетический воск', fullDescription: 'Долговременная защита до 12 месяцев.', volume: '450 мл', sortOrder: 2 },
  { name: 'Sonax Polymer Wax', slug: 'sonax-wax', sku: 'SW-001', brandSlug: 'sonax', categorySlug: 'voski-i-poliroli', shortDescription: 'Полимерный воск', fullDescription: 'Быстрое нанесение и отличный блеск.', volume: '500 мл', sortOrder: 3 },
  
  // Очистители
  { name: 'Очиститель битума', slug: 'ochistitel-bituma', sku: 'CL-001', brandSlug: 'leraton', categorySlug: 'ochistiteli', shortDescription: 'Быстрое удаление смолы', fullDescription: 'Эффективно удаляет битум и смолу без повреждения ЛКП.', volume: '500 мл', sortOrder: 1 },
  { name: 'Очиститель тормозной пыли', slug: 'ochistitel-pyli', sku: 'CL-002', brandSlug: 'shafite', categorySlug: 'ochistiteli', shortDescription: 'Для дисков', fullDescription: 'Удаляет тормозную пыль и нагар с колёсных дисков.', volume: '500 мл', sortOrder: 2 },
  { name: 'Очиститель стёкол', slug: 'ochistitel-styokol', sku: 'CL-003', brandSlug: 'grass', categorySlug: 'ochistiteli', shortDescription: 'Без разводов', fullDescription: 'Антистатический очиститель без аммиака.', volume: '1 л', sortOrder: 3 },
  
  // Уход за салоном
  { name: 'Очиститель пластика', slug: 'ochistitel-plastika', sku: 'IN-001', brandSlug: 'detail', categorySlug: 'uhod-za-salonom', shortDescription: 'Матовый финиш', fullDescription: 'Очищает и защищает пластик салона.', volume: '500 мл', sortOrder: 1 },
  { name: 'Кондиционер кожи', slug: 'kondicioner-kozhi', sku: 'IN-002', brandSlug: 'leraton', categorySlug: 'uhod-za-salonom', shortDescription: 'Питание и защита', fullDescription: 'Восстанавливает мягкость кожаного салона.', volume: '250 мл', sortOrder: 2 },
  { name: 'Очиститель ткани', slug: 'ochistitel-tkani', sku: 'IN-003', brandSlug: 'shafite', categorySlug: 'uhod-za-salonom', shortDescription: 'Для обивки', fullDescription: 'Удаляет пятна с тканевой обивки.', volume: '500 мл', sortOrder: 3 },
  
  // Для колёс
  { name: 'Чернитель шин', slug: 'chernitel-shin', sku: 'TR-001', brandSlug: 'leraton', categorySlug: 'dlya-kolyos', shortDescription: 'Глубокий чёрный цвет', fullDescription: 'Восстанавливает глубину цвета резины.', volume: '500 мл', sortOrder: 1 },
  { name: 'Шампунь для дисков', slug: 'shampun-dlya-diskov', sku: 'TR-002', brandSlug: 'grass', categorySlug: 'dlya-kolyos', shortDescription: 'Кислотный очиститель', fullDescription: 'Удаляет сложные загрязнения с дисков.', volume: '1 л', sortOrder: 2 },
  
  // Аксессуары - мойка
  { name: 'Губка для мойки', slug: 'gubka-dlya-moyki', sku: 'AC-001', brandSlug: 'detail', categorySlug: 'moyka', shortDescription: 'Двухсторонняя', fullDescription: 'Мягкая губка для безопасной мойки.', volume: null, sortOrder: 1 },
  { name: 'Варежка микрофибра', slug: 'varezhka-mikrofibr', sku: 'AC-002', brandSlug: 'detail', categorySlug: 'moyka', shortDescription: 'Для бесконтактной мойки', fullDescription: 'Варежка из микрофибры для деликатной мойки.', volume: null, sortOrder: 2 },
  
  // Аксессуары - сушка
  { name: 'Полотенце 60x90', slug: 'polotence-60x90', sku: 'AC-003', brandSlug: 'detail', categorySlug: 'sushka', shortDescription: 'Впитывающее', fullDescription: 'Полотенце из микрофибры для сушки кузова.', volume: null, sortOrder: 1 },
  { name: 'Полотенце 40x40', slug: 'polotence-40x40', sku: 'AC-004', brandSlug: 'detail', categorySlug: 'sushka', shortDescription: 'Универсальное', fullDescription: 'Компактное полотенце для деталей.', volume: null, sortOrder: 2 },
  
  // Аксессуары - кисти
  { name: 'Кисть мягкая', slug: 'kist-myagkaya', sku: 'AC-005', brandSlug: 'detail', categorySlug: 'kisti-i-shchyotki', shortDescription: 'Для деталей', fullDescription: 'Мягкая кисть для труднодоступных мест.', volume: null, sortOrder: 1 },
  { name: 'Щётка для колёс', slug: 'shchyotka-dlya-kolyos', sku: 'AC-006', brandSlug: 'detail', categorySlug: 'kisti-i-shchyotki', shortDescription: 'Жёсткая щетина', fullDescription: 'Для очистки дисков и арок.', volume: null, sortOrder: 2 },
];

const PRODUCT_TASK_LINKS = [
  // Мойка кузова
  { productSlug: 'avtoshampun-premium', taskSlug: 'moyka-kuzova' },
  { productSlug: 'avtoshampun-grass', taskSlug: 'moyka-kuzova' },
  { productSlug: 'mr-pink', taskSlug: 'moyka-kuzova' },
  { productSlug: 'nano-magic', taskSlug: 'moyka-kuzova' },
  { productSlug: 'gubka-dlya-moyki', taskSlug: 'moyka-kuzova' },
  { productSlug: 'varezhka-mikrofibr', taskSlug: 'moyka-kuzova' },
  { productSlug: 'polotence-60x90', taskSlug: 'moyka-kuzova' },
  { productSlug: 'vosk-karnaubskiy', taskSlug: 'zashchita-kuzova-voskom' },
  { productSlug: 'meguiars-wax', taskSlug: 'zashchita-kuzova-voskom' },
  { productSlug: 'sonax-wax', taskSlug: 'zashchita-kuzova-voskom' },
  
  // Очистка
  { productSlug: 'ochistitel-bituma', taskSlug: 'udalenie-bituma' },
  { productSlug: 'ochistitel-pyli', taskSlug: 'uhod-za-kolyosami' },
  { productSlug: 'ochistitel-styokol', taskSlug: 'ochistka-styokol' },
  
  // Салон
  { productSlug: 'ochistitel-plastika', taskSlug: 'uhod-za-plastikom' },
  { productSlug: 'kondicioner-kozhi', taskSlug: 'uhod-za-kozhey' },
  { productSlug: 'ochistitel-tkani', taskSlug: 'himchistka-salona' },
  
  // Колёса
  { productSlug: 'chernitel-shin', taskSlug: 'uhod-za-kolyosami' },
  { productSlug: 'shampun-dlya-diskov', taskSlug: 'uhod-za-kolyosami' },
  { productSlug: 'shchyotka-dlya-kolyos', taskSlug: 'uhod-za-kolyosami' },
  
  // Дезинфекция
  { productSlug: 'ochistitel-tkani', taskSlug: 'dezinfekciya-salona' },
];

const USERS = [
  { firstName: 'Иван', lastName: 'Петров', email: 'ivan@example.com', phone: '+79991112233', passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G.2QYwKjZ5qK9C' },
  { firstName: 'Анна', lastName: 'Смирнова', email: 'anna@example.com', phone: '+79994445566', passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G.2QYwKjZ5qK9C' },
  { firstName: 'Сергей', lastName: 'Козлов', email: 'sergey@example.com', phone: '+79997778899', passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G.2QYwKjZ5qK9C' },
  { firstName: 'Елена', lastName: 'Морозова', email: 'elena@example.com', phone: '+79990001122', passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G.2QYwKjZ5qK9C' },
  { firstName: 'Дмитрий', lastName: 'Волков', email: 'dmitry@example.com', phone: '+79993334455', passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G.2QYwKjZ5qK9C' },
];

const ARTICLES = [
  {
    title: 'Как правильно мыть автомобиль',
    slug: 'kak-pravilno-myt-avtomobil',
    previewText: 'Подробное руководство по безопасной мойке кузова',
    content: '# Введение\n\nПравильная мойка автомобиля — залог долговечности лакокрасочного покрытия...\n\n## Шаг 1: Предварительная мойка\n\nСначала смойте основную грязь водой без контакта...\n\n## Шаг 2: Основная мойка\n\nИспользуйте качественный автошампунь и мягкую губку...',
    isPublished: true,
  },
  {
    title: 'Выбор воска для кузова',
    slug: 'vybor-voska-dlya-kuzova',
    previewText: 'Сравнение типов воска и рекомендации по выбору',
    content: '# Типы воска\n\n## Карнаубский воск\n\nНатуральный воск из листьев пальмы...\n\n## Синтетический воск\n\nПолимерные составы с длительной защитой...',
    isPublished: true,
  },
  {
    title: 'Уход за салоном зимой',
    slug: 'uhod-za-salonom-zimoy',
    previewText: 'Особенности ухода за интерьером в холодное время года',
    content: '# Зимний уход\n\nЗимой салон автомобиля подвергается особым нагрузкам...',
    isPublished: true,
  },
];

const INSTRUCTIONS = [
  {
    title: 'Нанесение воска на кузов',
    slug: 'nanесenie-voska-na-kuzov',
    content: '1. Вымойте и высушите автомобиль\n2. Нанесите воск аппликатором\n3. Дайте высохнуть 5-10 минут\n4. Отполируйте микрофиброй',
    isPublished: true,
  },
  {
    title: 'Очистка колёсных дисков',
    slug: 'ochistka-kolyosnyh-diskov',
    content: '1. Остудите диски\n2. Нанесите очиститель\n3. Подождите 2-3 минуты\n4. Смойте водой\n5. При необходимости повторите',
    isPublished: true,
  },
];

const FAQ_ITEMS = [
  { question: 'Как часто нужно мыть автомобиль?', answer: 'Рекомендуется мыть автомобиль 1-2 раза в месяц, в зависимости от условий эксплуатации.', sortOrder: 1 },
  { question: 'Какой шампунь лучше выбрать?', answer: 'Выбирайте шампунь с нейтральным pH. Для регулярной мойки подойдут бюджетные варианты, для защиты — с добавлением воска.', sortOrder: 2 },
  { question: 'Можно ли мыть машину обычным моющим средством?', answer: 'Нет, обычные средства могут повредить ЛКП. Используйте только специализированные автошампуни.', sortOrder: 3 },
  { question: 'Как долго держится воск?', answer: 'Карнаубский воск держится 2-3 месяца, синтетический — до 6-12 месяцев.', sortOrder: 4 },
  { question: 'Нужно ли полировать автомобиль?', answer: 'Полировка рекомендуется 1-2 раза в год для удаления царапин и восстановления блеска.', sortOrder: 5 },
  { question: 'Как очистить салон от пятен?', answer: 'Используйте специализированный очиститель для ткани. Нанесите, потрите щёткой, удалите пену.', sortOrder: 6 },
];

// ==================== HELPERS ====================

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ==================== MAIN ====================

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Roles
  console.log('📋 Creating roles...');
  const createdRoles = await Promise.all(
    ROLES.map((role) =>
      prisma.role.upsert({
        where: { code: role.code },
        update: {},
        create: role,
      })
    )
  );
  console.log(`   ✅ Created ${createdRoles.length} roles`);

  // 2. Admins
  console.log('👨‍💼 Creating admins...');
  for (const adminData of ADMINS) {
    const { roleCodes, ...adminInfo } = adminData;
    const passwordHash = await hashPassword(adminInfo.password);
    
    const admin = await prisma.admin.upsert({
      where: { email: adminInfo.email },
      update: { name: adminInfo.name },
      create: {
        ...adminInfo,
        passwordHash,
      },
    });

    // Assign roles
    const roles = createdRoles.filter((r) => roleCodes.includes(r.code));
    await Promise.all(
      roles.map((role) =>
        prisma.adminRole.upsert({
          where: {
            adminId_roleId: {
              adminId: admin.id,
              roleId: role.id,
            },
          },
          update: {},
          create: {
            adminId: admin.id,
            roleId: role.id,
          },
        })
      )
    );
  }
  console.log(`   ✅ Created ${ADMINS.length} admins`);

  // 3. Categories
  console.log('📁 Creating categories...');
  const categoryMap = new Map<string, string>();
  
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categoryMap.set(cat.slug, created.id);
  }

  // Set parent relationships
  for (const cat of CATEGORIES) {
    if (cat.parentSlug) {
      await prisma.category.update({
        where: { slug: cat.slug },
        data: {
          parentId: categoryMap.get(cat.parentSlug),
        },
      });
    }
  }
  console.log(`   ✅ Created ${CATEGORIES.length} categories`);

  // 4. Brands
  console.log('🏷️ Creating brands...');
  const brandMap = new Map<string, string>();
  
  for (const brand of BRANDS) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
    brandMap.set(brand.slug, created.id);
  }
  console.log(`   ✅ Created ${BRANDS.length} brands`);

  // 5. Care Tasks
  console.log('🎯 Creating care tasks...');
  const taskMap = new Map<string, string>();
  
  for (const task of CARE_TASKS) {
    const created = await prisma.careTask.upsert({
      where: { slug: task.slug },
      update: {},
      create: task,
    });
    taskMap.set(task.slug, created.id);
  }
  console.log(`   ✅ Created ${CARE_TASKS.length} care tasks`);

  // 6. Products
  console.log('📦 Creating products...');
  const productMap = new Map<string, string>();
  
  for (const product of PRODUCTS) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        brandId: brandMap.get(product.brandSlug!),
        categoryId: categoryMap.get(product.categorySlug!),
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        volume: product.volume,
        sortOrder: product.sortOrder,
        isActive: true,
      },
    });
    productMap.set(product.slug, created.id);
  }
  console.log(`   ✅ Created ${PRODUCTS.length} products`);

  // 7. Product-Task Links
  console.log('🔗 Creating product-task links...');
  for (const link of PRODUCT_TASK_LINKS) {
    await prisma.productCareTask.upsert({
      where: {
        productId_careTaskId: {
          productId: productMap.get(link.productSlug)!,
          careTaskId: taskMap.get(link.taskSlug)!,
        },
      },
      update: {},
      create: {
        productId: productMap.get(link.productSlug)!,
        careTaskId: taskMap.get(link.taskSlug)!,
      },
    });
  }
  console.log(`   ✅ Created ${PRODUCT_TASK_LINKS.length} links`);

  // 8. Users
  console.log('👥 Creating users...');
  for (const user of USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log(`   ✅ Created ${USERS.length} users`);

  // 9. Articles
  console.log('📰 Creating articles...');
  const superAdmin = await prisma.admin.findFirst({ where: { email: 'super@weilshop.ru' } });
  
  for (const article of ARTICLES) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        authorId: superAdmin?.id,
        publishedAt: article.isPublished ? new Date() : null,
      },
    });
  }
  console.log(`   ✅ Created ${ARTICLES.length} articles`);

  // 10. Instructions
  console.log('📖 Creating instructions...');
  for (const instruction of INSTRUCTIONS) {
    await prisma.instruction.upsert({
      where: { slug: instruction.slug },
      update: {},
      create: instruction,
    });
  }
  console.log(`   ✅ Created ${INSTRUCTIONS.length} instructions`);

  // 11. FAQ
  console.log('❓ Creating FAQ...');
  for (const faq of FAQ_ITEMS) {
    await prisma.faqItem.create({
      data: faq,
    });
  }
  console.log(`   ✅ Created ${FAQ_ITEMS.length} FAQ items`);

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Roles: ${createdRoles.length}`);
  console.log(`   Admins: ${ADMINS.length}`);
  console.log(`   Categories: ${CATEGORIES.length}`);
  console.log(`   Brands: ${BRANDS.length}`);
  console.log(`   Care Tasks: ${CARE_TASKS.length}`);
  console.log(`   Products: ${PRODUCTS.length}`);
  console.log(`   Product-Task Links: ${PRODUCT_TASK_LINKS.length}`);
  console.log(`   Users: ${USERS.length}`);
  console.log(`   Articles: ${ARTICLES.length}`);
  console.log(`   Instructions: ${INSTRUCTIONS.length}`);
  console.log(`   FAQ Items: ${FAQ_ITEMS.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
