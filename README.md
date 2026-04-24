# WeilShop

Интернет-магазин автохимии с акцентом на подбор по задачам ухода.

## 📋 О проекте

**WeilShop** — API-first платформа, состоящая из трёх частей:

- **Публичный сайт** (витрина товаров)
- **Backend API** (единая точка данных)
- **Административная панель** (управление контентом и заявками)

### Ключевая особенность

Вместо традиционного каталога основной акцент сделан на **подбор по задачам ухода** (CareTask): пользователь выбирает не товар, а задачу (мойка кузова, очистка салона, уход за пластиком и т.д.), а система предлагает подходящие средства.

## 🛠 Технологический стек

| Компонент | Технология |
|-----------|------------|
| Frontend | Next.js 14 |
| Backend | NestJS |
| База данных | PostgreSQL 15+ |
| ORM | Prisma |
| Кэш | Redis 7+ |
| Хранилище | S3-compatible |

## 🚀 Быстрый старт

См. подробную инструкцию в [`docs/development.md`](./docs/development.md)

```bash
# Backend
cd backend && npm install && npm run start:dev

# Frontend
cd frontend && npm install && npm run dev

# Admin
cd admin && npm install && npm run dev
```

## 📚 Документация

Полная документация проекта находится в папке [`docs/`](./docs/):

| Документ | Описание |
|----------|----------|
| [README.md](./docs/README.md) | Техническое задание |
| [Architecture](./docs/architecture.md) | Архитектура системы |
| [API Contract](./docs/api-contract.md) | REST API спецификация |
| [Prisma Schema](./docs/prisma-schema.prisma) | Схема базы данных |
| [Design Concept](./docs/design-concept.md) | Дизайн-концепция |
| [UI Kit](./docs/ui-kit.md) | Компоненты и токены |
| [User Flows](./docs/user-flows.md) | Пользовательские сценарии |
| [Admin Roles](./docs/admin-roles.md) | Роли администраторов |
| [Development](./docs/development.md) | Быстрый старт |
| [Deployment](./docs/deployment.md) | Развёртывание |
| [Security](./docs/security.md) | Политики безопасности |
| [Validation Rules](./docs/validation-rules.md) | Правила валидации API |
| [Glossary](./docs/glossary.md) | Глоссарий терминов |

## 📊 Статус проекта

✅ Документация завершена  
⏳ Код не реализован

## 📝 Лицензия

Все права защищены.
