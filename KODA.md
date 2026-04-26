# KODA — Контекст проекта WeilShop

**Дата обновления:** 2025-01-15  
**Статус проекта:** 🟢 99% (готов к запуску)

Этот файл содержит инструкционный контекст для работы с проектом **WeilShop**. Используйте его как основной справочник при любых взаимодействиях с кодовой базой.

---

## 📋 Обзор проекта

**WeilShop** — интернет-магазин автохимии с акцентом на сценарии ухода за автомобилем. Проект разрабатывается как **API-first** платформа, состоящая из трёх частей:

- **Публичный сайт** (витрина товаров)
- **Backend API** (единая точка данных)
- **Административная панель** (управление контентом и заявками)

### Ключевая особенность

Вместо традиционного каталога основной акцент сделан на **подбор по задачам ухода** (CareTask): пользователь выбирает не товар, а задачу (мойка кузова, очистка салона, уход за пластиком и т.д.), а система предлагает подходящие средства.

### Формат продаж

На первом этапе **без онлайн-оплаты и доставки**. Оформление происходит через заявку:
1. Пользователь добавляет товары в корзину
2. Отправляет заявку с контактными данными
3. Администратор обрабатывает заявку и меняет статусы
4. Пользователь отслеживает статус в личном кабинете

---

## 📊 Статус проекта

| Компонент | Прогресс | Статус |
|-----------|----------|--------|
| Документация | 22 файла | ✅ 100% |
| Backend | 147 endpoints | ✅ 100% |
| Frontend | 10 страниц | ✅ 95% |
| Admin UI | 20 страниц | ✅ 100% |
| **Всего** | **~99%** | 🟢 **Готов** |

### 📈 Статистика

- **310+ файлов** кода
- **25,900+ строк** кода
- **147 API эндпоинтов**
- **27 таблиц** базы данных
- **0 TypeScript ошибок**
- **0 критических warnings**

---

## 🚀 Сборка и запуск

### Требования

| Компонент | Версия | Примечание |
|-----------|--------|------------|
| Node.js | 20.x LTS | [Скачать](https://nodejs.org/) |
| PostgreSQL | 15+ | База данных |
| Redis | 7+ | Кэш и сессии |
| Git | latest | Система контроля версий |

### Быстрый старт (локальная разработка)

```bash
# 1. Клонирование и установка зависимостей
git clone <repository-url> weilshop
cd weilshop

# 2. Настройка базы данных
psql -U postgres
CREATE USER weilshop_dev WITH PASSWORD 'weilshop_dev';
CREATE DATABASE weilshop_dev OWNER weilshop_dev;
GRANT ALL PRIVILEGES ON DATABASE weilshop_dev TO weilshop_dev;
\q

# 3. Backend (NestJS)
cd backend
cp ../.env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev  # http://localhost:3001

# 4. Frontend (Next.js)
cd ../frontend
cp .env.example .env.local
npm install
npm run dev  # http://localhost:3000

# 5. Админка (Next.js)
cd ../admin
cp .env.example .env.local
npm install
npm run dev  # http://localhost:3002
```

### Команды разработки

**Backend:**
```bash
npm run start:dev      # Режим разработки (watch)
npm run build          # Продакшен сборка
npm run start:prod     # Продакшен запуск
npm run test           # Unit-тесты
npm run test:e2e       # E2E-тесты
npm run lint           # Линтинг
npx prisma generate    # Генерация Prisma клиента
npx prisma migrate dev # Создание и применение миграции
npx prisma studio      # GUI для работы с БД
```

**Frontend / Admin:**
```bash
npm run dev            # Режим разработки
npm run build          # Продакшен сборка
npm run start          # Продакшен запуск
npm run test           # Тесты
npm run lint           # Линтинг
npm run lint:fix       # Автоисправление линтера
```

### Переменные окружения

Ключевые переменные в `.env`:

```env
# Backend
NODE_ENV=development
DATABASE_URL=postgresql://weilshop_dev:weilshop_dev@localhost:5432/weilshop_dev
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=dev-access-secret-key-min-32-characters
JWT_REFRESH_SECRET=dev-refresh-secret-key-min-32-characters
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
```

Полный шаблон: `.env.example`

---

## 🛠 Технологический стек

| Компонент | Технология | Версия |
|-----------|------------|--------|
| Frontend (витрина + ЛК) | Next.js | 14.x |
| Админка | Next.js | 14.x |
| Backend | NestJS | 10.x |
| База данных | PostgreSQL | 15+ |
| ORM | Prisma | 5.x |
| Кэш / сессии | Redis | 7+ |
| Хранилище файлов | S3-compatible | - |
| Аутентификация | JWT + Refresh Token | - |
| Валидация | class-validator | 0.14.x |
| Стилизация | Tailwind CSS | 3.3.x |
| State Management | Zustand | 4.4.x |
| HTTP Client | Axios | 1.5.x |
| Query | TanStack Query | 5.x |

---

## 📂 Структура проекта

```
/
├── .env.example             # Шаблон переменных окружения
├── .vscode/                 # Настройки VS Code
├── KODA.md                  # Этот файл (контекст проекта)
├── README.md                # Описание проекта
├── PROJECT_STATUS.md        # Текущий статус и прогресс
├── FINAL_STATUS.md          # Финальный статус проекта
├── docs/                    # Документация проекта (22 файла)
│   ├── README.md           # Техническое задание
│   ├── architecture.md     # Архитектура системы
│   ├── database-schema.md  # Логическая схема БД
│   ├── api-contract.md     # REST API спецификация (147 endpoints)
│   ├── design-concept.md   # Дизайн-концепция
│   ├── sitemap.md          # Структура страниц
│   ├── user-flows.md       # Пользовательские сценарии
│   ├── implementation-roadmap.md  # План реализации
│   ├── prisma-schema.prisma       # Схема Prisma ORM (27 таблиц)
│   ├── er-diagram.md       # ER-диаграмма
│   ├── component-diagram.md # Компонентная диаграмма
│   ├── admin-roles.md      # Роли администраторов
│   ├── ui-kit.md           # UI компоненты и токены
│   ├── recommended-features.md # Рекомендуемый функционал
│   ├── use-case-diagram.md # Use-case диаграмма
│   ├── technical-specification.md # Технические требования
│   ├── development.md      # Быстрый старт для разработчиков
│   ├── deployment.md       # Инструкции по развёртыванию
│   ├── security.md         # Политики безопасности
│   ├── validation-rules.md # Правила валидации API
│   ├── glossary.md         # Глоссарий терминов
│   ├── component-diagram.md # Компонентная диаграмма
│   └── er-diagram.md       # ER-диаграмма
├── backend/                 # NestJS API (100% ✅)
│   ├── src/
│   │   ├── main.ts         # Точка входа
│   │   ├── app.module.ts   # Главный модуль
│   │   ├── auth/           # Аутентификация (6 endpoints)
│   │   ├── catalog/        # Товары, категории, бренды (19 endpoints)
│   │   ├── tasks/          # Задачи ухода, комплекты (14 endpoints)
│   │   ├── knowledge/      # Статьи, инструкции, FAQ (17 endpoints)
│   │   ├── favorites/      # Избранное (4 endpoints)
│   │   ├── cart/           # Корзина (6 endpoints)
│   │   ├── requests/       # Заявки (5 endpoints)
│   │   ├── consultations/  # Консультации (9 endpoints)
│   │   ├── account/        # Личный кабинет (12 endpoints)
│   │   ├── admin/          # Админ CRUD (55 endpoints)
│   │   └── common/         # Общие модули (Prisma, Redis, guards)
│   ├── prisma/
│   │   ├── schema.prisma   # Схема БД (27 таблиц)
│   │   └── seed.ts         # Seed данные (539 строк)
│   ├── test/               # E2E тесты
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .eslintrc.js
├── frontend/                # Next.js витрина (95% ✅)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx  # Header + Footer
│   │   │   ├── page.tsx    # Главная страница
│   │   │   ├── globals.css # CSS переменные
│   │   │   ├── catalog/
│   │   │   │   ├── page.tsx        # Каталог
│   │   │   │   └── [slug]/page.tsx # Карточка товара
│   │   │   ├── tasks/
│   │   │   │   ├── page.tsx        # Список задач
│   │   │   │   └── [slug]/page.tsx # Страница задачи
│   │   │   ├── cart/page.tsx       # Корзина
│   │   │   ├── account/page.tsx    # Личный кабинет
│   │   │   ├── consultations/page.tsx # Консультации
│   │   │   ├── knowledge/    # База знаний
│   │   │   ├── faq/          # FAQ
│   │   │   ├── login/        # Авторизация
│   │   │   └── register/     # Регистрация
│   │   ├── entities/       # Бизнес-сущности
│   │   ├── features/       # Функции
│   │   ├── widgets/        # Крупные блоки
│   │   └── shared/         # Общие компоненты
│   ├── public/             # Статика
│   ├── .env.local          # Переменные окружения
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
└── admin/                   # Next.js админка (100% ✅)
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx  # Layout с sidebar
    │   │   ├── page.tsx    # Дашборд
    │   │   ├── login/      # Страница входа
    │   │   └── admin/      # Админ разделы
    │   │       ├── products/       # CRUD товаров
    │   │       ├── categories/     # CRUD категорий
    │   │       ├── brands/         # CRUD брендов
    │   │       ├── tasks/          # CRUD задач ухода
    │   │       ├── articles/       # CRUD статей
    │   │       ├── instructions/   # CRUD инструкций
    │   │       ├── faq/            # CRUD FAQ
    │   │       ├── requests/       # Заявки
    │   │       ├── consultations/  # Консультации
    │   │       └── admins/         # Администраторы
    │   ├── entities/       # Сущности админки
    │   ├── features/       # Функции
    │   ├── widgets/        # Блоки
    │   └── shared/         # Общие компоненты
    ├── public/
    ├── .env.local
    ├── package.json
    └── tailwind.config.js
```

---

## 🗄 Модель данных

**Всего таблиц:** 27

### Ядро каталога
| Таблица | Описание |
|---------|----------|
| `Product` | Товары (с мягким удалением) |
| `Category` | Категории (древовидная структура) |
| `Brand` | Бренды |
| `CareTask` | Задачи ухода (ключевая сущность) |
| `ProductCareTask` | Связь товаров с задачами |
| `ProductComparison` | Сравнение товаров |
| `ProductComparisonItem` | Позиции сравнения |

### Контент
| Таблица | Описание |
|---------|----------|
| `Article` | Статьи базы знаний |
| `Instruction` | Инструкции по применению |
| `FaqItem` | FAQ |

### Пользователи и авторизация
| Таблица | Описание |
|---------|----------|
| `User` | Пользователи |
| `Admin` | Администраторы |
| `Role` | Роли |
| `AdminRole` | Связь администраторов с ролями |

### Функциональные сущности
| Таблица | Описание |
|---------|----------|
| `Favorite` | Избранное |
| `CartItem` | Корзина |
| `RequestOrder` | Заявки |
| `RequestOrderItem` | Позиции заявки |
| `RequestStatusHistory` | История статусов заявки |
| `ProductView` | История просмотров |
| `CareKit` | Пошаговые комплекты |
| `CareKitItem` | Позиции комплекта |
| `ConsultationRequest` | Запросы на консультацию |
| `ConsultationRequestProduct` | Товары в консультации |
| `Notification` | Уведомления |
| `NotificationPreference` | Настройки уведомлений |
| `MediaFile` | Медиафайлы |
| `SeoMeta` | SEO-метаданные |

### Статусы заявки
```
NEW → IN_REVIEW → CONFIRMED → PROCESSING → COMPLETED / CANCELLED
```

### Роли администраторов
| Роль | Доступ |
|------|--------|
| `Super Admin` | Полный доступ ко всем модулям |
| `Catalog Manager` | Товары, категории, бренды, задачи ухода |
| `Content Manager` | Статьи, инструкции, FAQ, SEO |
| `Request Manager` | Обработка заявок |
| `Consultation Manager` | Консультации по подбору |
| `SEO / Merch Manager` | Коммерческая подача и видимость |

---

## 🌐 API структура

**Базовый префикс:** `/api`

| Группа | Эндпоинтов | Описание |
|--------|------------|----------|
| `/api/auth/*` | 6 | Регистрация, логин, refresh, восстановление пароля |
| `/api/catalog/*` | 19 | Товары, категории, бренды, сравнение |
| `/api/tasks/*` | 14 | Список задач, страница задачи, комплекты |
| `/api/knowledge/*` | 17 | Статьи, инструкции, FAQ |
| `/api/favorites/*` | 4 | Управление избранным (auth required) |
| `/api/account/views` | 1 | Просмотренные товары (auth required) |
| `/api/cart/*` | 6 | Управление корзиной (auth required) |
| `/api/requests/*` | 5 | Создание и просмотр заявок (auth required) |
| `/api/consultations/*` | 9 | Запросы на консультацию |
| `/api/account/*` | 12 | Профиль, уведомления, настройки |
| `/api/admin/*` | 55 | CRUD операции для администраторов |

**Итого:** 147 эндпоинтов

### Формат ответов

**Список:**
```json
{
  "page": 1,
  "limit": 12,
  "total": 120,
  "items": []
}
```

**Ошибка:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": ["Некорректный email"]
  }
}
```

---

## 🎨 Дизайн-система

### Концепция
**Tech Clean + Practical Expert** — современный технологичный интерфейс с экспертной подачей.

### Цветовые токены
| Токен | Значение | Назначение |
|-------|----------|------------|
| `--color-bg` | `#F5F4EF` | Основной фон |
| `--color-surface` | `#FFFFFF` | Поверхности карточек |
| `--color-text-primary` | `#1F2328` | Основной текст |
| `--color-text-secondary` | `#5B6470` | Вторичный текст |
| `--color-primary` | `#000000` | Акцент бренда (чёрный) |
| `--color-accent` | `#E57A22` | CTA действия (оранжевый) |
| `--color-border` | `#D9DCDD` | Границы |
| `--color-success` | `#2F8F5B` | Успешные состояния |
| `--color-warning` | `#C77A12` | Предупреждения |
| `--color-danger` | `#B84A3A` | Ошибки |

### Типографика
- **Логотип:** Pacifico (каллиграфический)
- **Основной шрифт:** System UI (sans-serif)
- **Шкала:** Display, H1, H2, H3, Body L/M/S, Caption

### Ключевые компоненты
- Карточка товара (с акцентом на сценарий применения)
- Карточка задачи ухода
- Блок пошаговых шагов ухода
- FAQ accordion
- Таймлайн статусов заявки
- Блок сравнения товаров
- Мобильная панель быстрых действий

---

## 📱 Мобильная стратегия

**Принцип:** Mobile-first. Сайт проектируется как основной сценарий использования с заделом под будущее Android-приложение.

### Приоритеты для мобильной версии
- Крупные интерактивные элементы
- Быстрый доступ к задачам ухода
- Компактные фильтры (drawer)
- Sticky action bar в карточке товара
- Bottom sheet для быстрых действий
- Минимальное число действий до консультации

---

## 📝 Правила разработки

### Стиль кодирования
- Следовать принципам **Clean Architecture**
- Использовать **TypeScript** строгой типизации
- Соблюдать **модульную структуру** backend (по доменам)
- Применять **feature-sliced design** на frontend
- Использовать **DTO** для валидации входных данных (class-validator)
- Следовать **принципу API-first**: контракт перед реализацией

### Работа с базой данных
- Все публичные сущности должны иметь `slug` для ЧПУ
- Использовать индексы на `slug`, `status`, `category_id`, `brand_id`
- Хранить снапшот названия товара в `request_order_items`
- История статусов заявки — отдельная таблица
- Использовать мягкое удаление (`isActive` flag) для товаров
- Сложные запросы через Prisma, raw SQL только при необходимости

### Безопасность
- Пароли хранить в хешированном виде (bcrypt cost 12)
- JWT токены с refresh-механизмом (access 15 мин, refresh 7 дней)
- Rate limiting для критических эндпоинтов (auth: 10/мин, остальные: 100/мин)
- Валидация всех входных данных через DTO
- CORS настроен на конкретные домены
- Security headers на frontend (HSTS, CSP, X-Frame-Options)
- Логи не содержат персональных данных (маскирование email, телефона)

### Тестирование
- Unit-тесты для бизнес-логики (сервисы, утилиты)
- Integration-тесты для API эндпоинтов (supertest)
- E2E-тесты для критических пользовательских сценариев
- Покрытие тестами: минимум 70% для backend
- Запуск тестов в CI перед мержем

### Контрибуция
- Критические действия администраторов должны логироваться
- Создание новых администраторов — только Super Admin
- Изменение ролей — только Super Admin
- Code review для всех изменений
- Ветки: `feature/*`, `bugfix/*`, `hotfix/*`
- Commit messages по Conventional Commits

---

## 🔑 Ключевые бизнес-правила

### Подбор по задачам ухода
- `CareTask` — самостоятельная сущность, не тег
- Каждая задача имеет: описание проблемы, шаги решения, FAQ, связанные товары
- Пошаговые комплекты (`CareKit`) группируют товары по шагам применения

### Заявки
- Нет онлайн-оплаты на первом этапе
- Заявка формируется из корзины
- Пользователь видит историю смены статусов
- Уведомления о смене статуса (email, в будущем SMS/Telegram)

### Авторизация
- Вход по email или номеру телефона (единая форма)
- Подтверждение email обязательно
- Архитектурная готовность к подтверждению телефона по SMS

### Контент
- База знаний — равноправный раздел с каталогу
- Статьи и инструкции связаны с товарами и задачами ухода
- SEO-метаданные управляются из админки

---

## 📎 Полезные ссылки на документы

| Документ | Описание |
|----------|----------|
| `docs/README.md` | Полное техническое задание |
| `docs/architecture.md` | Архитектура системы |
| `docs/api-contract.md` | Спецификация REST API |
| `docs/prisma-schema.prisma` | Схема базы данных Prisma |
| `docs/design-concept.md` | Дизайн-концепция и визуальные принципы |
| `docs/ui-kit.md` | Компоненты и токены дизайн-системы |
| `docs/user-flows.md` | Пользовательские сценарии |
| `docs/admin-roles.md` | Роли и права администраторов |
| `docs/implementation-roadmap.md` | План реализации по этапам |
| `docs/development.md` | Быстрый старт для разработчиков |
| `docs/deployment.md` | Инструкции по развёртыванию |
| `docs/security.md` | Политики безопасности |
| `docs/validation-rules.md` | Правила валидации API |
| `docs/glossary.md` | Глоссарий терминов |
| `FINAL_STATUS.md` | Финальный статус проекта |
| `PROJECT_STATUS.md` | Текущий прогресс |

---

## 💡 Особенности предметной области (автохимия)

Для этой ниши критически важны:
- Предупреждения о совместимости поверхностей
- Меры предосторожности при применении
- Рекомендации по последовательности использования средств
- Понятные инструкции для новичков
- Акцент на сценарий применения, а не только характеристики

---

## 🚀 Следующие шаги

### Приоритет 1 (Интеграция и тестирование)
- [ ] Prisma миграции в БД
- [ ] Seed данные (товары, категории, бренды, задачи)
- [ ] Интеграция frontend с backend API (тестирование)
- [ ] E2E тестирование ключевых сценариев

### Приоритет 2 (Опционально)
- [ ] Страница редактирования статей (Admin)
- [ ] Страница редактирования инструкций (Admin)
- [ ] Страница редактирования FAQ (Admin)
- [ ] Массовая загрузка товаров (CSV import)

### Приоритет 3 (Подготовка к запуску)
- [ ] Настройка S3 для изображений
- [ ] Деплой на продакшен
- [ ] Настройка домена и SSL
- [ ] Настройка SMTP для email уведомлений
- [ ] Мониторинг и логирование

---

## 📞 Контакты

**Репозиторий:** https://github.com/RinGinO/weilshop  
**Документация:** `/docs`  
**Контекст проекта:** `/KODA.md`

---

*Последнее обновление: 2025-01-15*
*Статус проекта: ~99% (Backend 100%, Frontend 95%, Admin 100%)*
