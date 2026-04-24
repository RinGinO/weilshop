# WeilShop Frontend

Публичная витрина магазина на Next.js.

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
├── entities/          # Бизнес-сущности (Product, CareTask, User)
├── features/          # Функции (AddToCart, AddToFavorites)
├── widgets/           # Крупные блоки (Header, Footer, ProductCard)
└── shared/            # Общие компоненты и утилиты
```

## 🎨 Дизайн-система

См. `../docs/design-concept.md` и `../docs/ui-kit.md`

## 🧪 Тестирование

```bash
# Запуск тестов
npm run test

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
