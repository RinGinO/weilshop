# Knowledge Module

Модуль базы знаний WeilShop: статьи, инструкции, FAQ.

## 📋 Эндпоинты

### Статьи (Articles)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/knowledge/articles` | Создание статьи | ✅ |
| GET | `/api/knowledge/articles` | Список статей | 🌐 |
| GET | `/api/knowledge/articles/:id` | Статья по ID | 🌐 |
| GET | `/api/knowledge/articles/slug/:slug` | Статья по slug | 🌐 |
| PUT | `/api/knowledge/articles/:id` | Обновление статьи | ✅ |
| DELETE | `/api/knowledge/articles/:id` | Удаление статьи | ✅ |

### Инструкции (Instructions)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/knowledge/instructions` | Создание инструкции | ✅ |
| GET | `/api/knowledge/instructions` | Список инструкций | 🌐 |
| GET | `/api/knowledge/instructions/:id` | Инструкция по ID | 🌐 |
| GET | `/api/knowledge/instructions/slug/:slug` | Инструкция по slug | 🌐 |
| PUT | `/api/knowledge/instructions/:id` | Обновление инструкции | ✅ |
| DELETE | `/api/knowledge/instructions/:id` | Удаление инструкции | ✅ |

### FAQ

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/knowledge/faq` | Создание FAQ элемента | ✅ |
| GET | `/api/knowledge/faq` | Список FAQ | 🌐 |
| GET | `/api/knowledge/faq/:id` | FAQ по ID | 🌐 |
| PUT | `/api/knowledge/faq/:id` | Обновление FAQ | ✅ |
| DELETE | `/api/knowledge/faq/:id` | Удаление FAQ | ✅ |

---

## 🔧 DTO

### Article

**CreateArticleDto:**
- `title` (string, 2-200) — заголовок
- `slug` (string, 2-200) — URL-идентификатор
- `previewText` (string?, max 500) — краткое описание
- `content` (string) — полный текст
- `coverMediaId` (UUID?, optional) — обложка
- `authorId` (UUID?, optional) — автор (Admin)
- `isPublished` (boolean?, default: false) — опубликовано

**UpdateArticleDto:** все поля опциональны

**ArticleQueryDto:**
- `isPublished` (boolean?, optional) — фильтр по статусу
- `authorId` (UUID?, optional) — фильтр по автору
- `search` (string?, optional) — поиск
- `sortBy` (string, default: 'createdAt')
- `sortOrder` ('asc' | 'desc', default: 'desc')
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)

### Instruction

**CreateInstructionDto:**
- `title` (string, 2-200)
- `slug` (string, 2-200)
- `content` (string) — текст инструкции
- `relatedProductId` (UUID?, optional) — связанный товар
- `relatedTaskId` (UUID?, optional) — связанная задача ухода
- `isPublished` (boolean?, default: false)

**InstructionQueryDto:**
- `relatedProductId` (UUID?, optional)
- `relatedTaskId` (UUID?, optional)
- `isPublished` (boolean?, default: true)
- `search`, `sortBy`, `sortOrder`, `page`, `limit`

### FaqItem

**CreateFaqItemDto:**
- `question` (string, 5-500) — вопрос
- `answer` (string, 5-2000) — ответ
- `sortOrder` (int, 0-10000, default: 0)
- `relatedProductId` (UUID?, optional)
- `relatedTaskId` (UUID?, optional)
- `isPublished` (boolean?, default: true)

**UpdateFaqItemDto:** все поля опциональны

**FaqQueryDto:**
- `relatedProductId` (UUID?, optional)
- `relatedTaskId` (UUID?, optional)
- `isPublished` (boolean?, default: true)
- `sortBy` (string, default: 'sortOrder')
- `sortOrder` ('asc' | 'desc', default: 'asc')
- `search`, `page`, `limit`

---

## 📝 Бизнес-логика

### Статьи (Article)

- Уникальность slug
- Автор — Admin (связь с таблицей Admin)
- Обложка — MediaFile (опционально)
- Авто-установка `publishedAt` при публикации
- Снятие с публикации очищает `publishedAt`

### Инструкции (Instruction)

- Уникальность slug
- Связь с Product (опционально)
- Связь с CareTask (опционально)
- Может быть связана и с товаром, и с задачей одновременно

### FAQ (FaqItem)

- Нет slug (идентификация по ID)
- Связь с Product (опционально)
- Связь с CareTask (опционально)
- Сортировка по sortOrder
- По умолчанию опубликованы

---

## 🎯 Примеры запросов

### Создание статьи

```bash
curl -X POST http://localhost:3001/api/knowledge/articles \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Как правильно мыть автомобиль",
    "slug": "kak-pravilno-myt-avtomobil",
    "previewText": "Пошаговая инструкция по мойке кузова",
    "content": "Полный текст статьи...",
    "isPublished": true
  }'
```

### Создание инструкции для товара

```bash
curl -X POST http://localhost:3001/api/knowledge/instructions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Инструкция по применению автошампуня",
    "slug": "instrukciya-avtoshampun",
    "content": "1. Развести с водой...\n2. Нанести...",
    "relatedProductId": "uuid-товара",
    "isPublished": true
  }'
```

### Добавление FAQ к задаче ухода

```bash
curl -X POST http://localhost:3001/api/knowledge/faq \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Как часто нужно мыть автомобиль?",
    "answer": "Рекомендуется мыть автомобиль раз в 1-2 недели...",
    "relatedTaskId": "uuid-задачи",
    "sortOrder": 1
  }'
```

### Получение всех FAQ для товара

```bash
curl "http://localhost:3001/api/knowledge/faq?relatedProductId=uuid&page=1&limit=10"
```

---

## 🔗 Связи с другими модулями

| Модуль | Сущность | Связь |
|--------|----------|-------|
| **Admin** | Admin | Article.author |
| **Catalog** | Product | Instruction.relatedProduct, FaqItem.relatedProduct |
| **Tasks** | CareTask | Instruction.relatedTask, FaqItem.relatedTask |
| **Common** | MediaFile | Article.coverMedia |

---

## 💡 Особенности

### Публикация статей

```typescript
// При создании с isPublished: true
publishedAt: new Date()

// При обновлении на isPublished: false
publishedAt: null

// При повторной публикации
publishedAt: new Date() // текущая дата
```

### Связи с товарами и задачами

Одна инструкция или FAQ могут быть связаны:
- Только с товаром
- Только с задачей
- С обоими одновременно
- Ни с чем (общая инструкция/FAQ)

### Сортировка FAQ

FAQ элементы сортируются по `sortOrder` (возрастание). Элементы с меньшим номером отображаются первыми.

---

*Реализовано: 2025-01-15*
