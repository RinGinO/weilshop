# WeilShop Backend

Backend API на NestJS для проекта WeilShop.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Копирование .env
cp .env.example .env

# Генерация Prisma клиента
npx prisma generate

# Применение миграций
npx prisma migrate dev

# Запуск в режиме разработки
npm run start:dev
```

## 📁 Структура модулей

```
src/
├── auth/              # Аутентификация и авторизация
├── catalog/           # Товары, категории, бренды
├── tasks/             # Задачи ухода, комплекты
├── knowledge/         # Статьи, инструкции, FAQ
├── favorites/         # Избранное
├── cart/              # Корзина
├── requests/          # Заявки
├── consultations/     # Консультации
├── account/           # Личный кабинет
├── admin/             # Административная панель
└── common/            # Общие модули (Prisma, Redis, guards, decorators)
```

## 📝 API Документация

После запуска Swagger доступен по адресу: `http://localhost:3001/api/docs`

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие
npm run test:cov
```

## 🔧 Команды Prisma

```bash
# Генерация клиента
npx prisma generate

# Создание миграции
npx prisma migrate dev --name <migration_name>

# Применение миграций
npx prisma migrate deploy

# Сброс БД
npx prisma migrate reset

# GUI для БД
npx prisma studio
```
