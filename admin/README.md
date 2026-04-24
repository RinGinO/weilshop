# WeilShop Admin

Административная панель на Next.js.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Копирование .env
cp .env.example .env.local

# Запуск в режиме разработки
npm run dev
```

## 📁 Структура проекта

```
src/
├── app/               # Next.js App Router страницы
├── entities/          # Бизнес-сущности (Admin, RequestOrder, Product)
├── features/          # Функции (UpdateRequestStatus, CreateProduct)
├── widgets/           # Крупные блоки (Sidebar, RequestTable, ProductForm)
└── shared/            # Общие компоненты и утилиты
```

## 🔐 Роли администраторов

- **Super Admin** — полный доступ
- **Catalog Manager** — товары, категории, бренды, задачи ухода
- **Content Manager** — статьи, инструкции, FAQ, SEO
- **Request Manager** — обработка заявок
- **Consultation Manager** — консультации
- **SEO / Merch Manager** — коммерческая подача

См. `../docs/admin-roles.md`

## 🧪 Тестирование

```bash
# Линтинг
npm run lint
npm run lint:fix
```

## 📦 Сборка

```bash
# Продакшен сборка
npm run build

# Запуск продакшен версии
npm run start
```
