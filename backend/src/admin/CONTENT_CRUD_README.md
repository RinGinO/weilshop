# Admin Content CRUD Module

Модуль административной панели для управления контентом: статьи, инструкции, FAQ.

## 📋 Эндпоинты

### Статьи (Articles)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| POST | `/api/admin/articles` | Создать статью | Content Manager |
| GET | `/api/admin/articles` | Список статей | Content Manager |
| GET | `/api/admin/articles/:id` | Статья по ID | Content Manager |
| PUT | `/api/admin/articles/:id` | Обновить статью | Content Manager |
| DELETE | `/api/admin/articles/:id` | Удалить статью | Content Manager |

### Инструкции (Instructions)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| POST | `/api/admin/instructions` | Создать инструкцию | Content Manager |
| GET | `/api/admin/instructions` | Список инструкций | Content Manager |
| GET | `/api/admin/instructions/:id` | Инструкция по ID | Content Manager |
| PUT | `/api/admin/instructions/:id` | Обновить инструкцию | Content Manager |
| DELETE | `/api/admin/instructions/:id` | Удалить инструкцию | Content Manager |

### FAQ (FaqItems)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| POST | `/api/admin/faqs` | Создать FAQ | Content Manager |
| GET | `/api/admin/faqs` | Список FAQ | Content Manager |
| GET | `/api/admin/faqs/:id` | FAQ по ID | Content Manager |
| PUT | `/api/admin/faqs/:id` | Обновить FAQ | Content Manager |
| DELETE | `/api/admin/faqs/:id` | Удалить FAQ | Content Manager |

---

## 🔧 DTO

### CreateArticleDto

**Поля:**
- `title` (string) — заголовок статьи
- `slug` (string) — ЧПУ (уникальный)
- `previewText` (string?, optional) — текст превью
- `content` (string) — содержимое статьи
- `coverMediaId` (UUID?, optional) — ID обложки
- `authorId` (UUID?, optional) — ID автора (администратора)
- `isPublished` (boolean?, default: false) — опубликована ли
- `relatedProductIds` (UUID[]?, optional) — ID связанных товаров
- `relatedTaskIds` (UUID[]?, optional) — ID связанных задач ухода

### UpdateArticleDto

**Поля:**
- Все поля как в CreateArticleDto, но optional (кроме content)

### CreateInstructionDto

**Поля:**
- `title` (string) — заголовок инструкции
- `slug` (string) — ЧПУ (уникальный)
- `content` (string) — содержимое
- `relatedProductId` (UUID?, optional) — ID связанного товара
- `relatedTaskId` (UUID?, optional) — ID связанной задачи ухода
- `isPublished` (boolean?, default: false) — опубликована ли

### CreateFaqDto

**Поля:**
- `question` (string) — вопрос
- `answer` (string) — ответ
- `sortOrder` (int?, 0-10000, default: 0) — порядок сортировки
- `relatedProductId` (UUID?, optional) — ID связанного товара
- `relatedTaskId` (UUID?, optional) — ID связанной задачи ухода
- `isPublished` (boolean?, default: true) — опубликован ли

---

## 🎯 Примеры запросов

### Создание статьи

```bash
curl -X POST "http://localhost:3001/api/admin/articles" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Как правильно мыть автомобиль",
    "slug": "kak-pravilno-myt-avtomobil",
    "previewText": "Подробное руководство по мойке авто",
    "content": "# Введение\n\nМойка автомобиля...",
    "coverMediaId": "uuid-медиа",
    "authorId": "uuid-автора",
    "isPublished": false
  }'
```

### Получение списка статей с фильтрами

```bash
curl "http://localhost:3001/api/admin/articles?isPublished=true&authorId=uuid&search=мойка&page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

### Создание инструкции

```bash
curl -X POST "http://localhost:3001/api/admin/instructions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Инструкция по нанесению воска",
    "slug": "instrukciya-po-naneseniyu-voska",
    "content": "Шаг 1: Подготовьте поверхность...",
    "relatedProductId": "uuid-товара",
    "isPublished": true
  }'
```

### Создание FAQ

```bash
curl -X POST "http://localhost:3001/api/admin/faqs" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Как часто нужно мыть автомобиль?",
    "answer": "Рекомендуется мыть автомобиль не реже 1-2 раз в месяц...",
    "sortOrder": 1,
    "relatedTaskId": "uuid-задачи",
    "isPublished": true
  }'
```

---

## 💡 Бизнес-логика

### Статьи

- **Уникальность slug** — проверка при создании и обновлении
- **Авторство** — связь с Admin (автор статьи)
- **Обложка** — связь с MediaFile
- **Публикация** — флаг isPublished
- **Поиск** — по заголовку и превью

### Инструкции

- **Уникальность slug** — проверка при создании и обновлении
- **Связи** — с товаром и/или задачей ухода
- **Публикация** — флаг isPublished
- **Поиск** — по заголовку и содержимому

### FAQ

- **Сортировка** — поле sortOrder для ручного порядка
- **Связи** — с товаром и/или задачей ухода
- **Публикация** — флаг isPublished (default: true)
- **Поиск** — по вопросу и ответу

---

## 📊 Response форматы

### Статья

```json
{
  "id": "uuid",
  "title": "Как правильно мыть автомобиль",
  "slug": "kak-pravilno-myt-avtomobil",
  "previewText": "Подробное руководство...",
  "content": "# Введение...",
  "coverMediaId": "uuid",
  "authorId": "uuid",
  "isPublished": true,
  "coverMedia": {...},
  "author": {
    "id": "uuid",
    "name": "Иван Петров",
    "email": "ivan@weilshop.ru"
  },
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### Инструкция

```json
{
  "id": "uuid",
  "title": "Инструкция по нанесению воска",
  "slug": "instrukciya-po-naneseniyu-voska",
  "content": "Шаг 1: ...",
  "relatedProductId": "uuid",
  "relatedTaskId": null,
  "isPublished": true,
  "relatedProduct": {...},
  "relatedTask": null
}
```

### FAQ

```json
{
  "id": "uuid",
  "question": "Как часто нужно мыть автомобиль?",
  "answer": "Рекомендуется мыть...",
  "sortOrder": 1,
  "relatedProductId": null,
  "relatedTaskId": "uuid",
  "isPublished": true,
  "relatedProduct": null,
  "relatedTask": {...}
}
```

---

## 🔗 Связи с другими модулями

| Сущность | Связь | Описание |
|----------|-------|----------|
| **Admin** | Article.authorId | Автор статьи |
| **MediaFile** | Article.coverMediaId | Обложка статьи |
| **Product** | Instruction.relatedProductId | Связанный товар |
| **Product** | FaqItem.relatedProductId | Связанный товар |
| **CareTask** | Instruction.relatedTaskId | Связанная задача |
| **CareTask** | FaqItem.relatedTaskId | Связанная задача |

---

*Реализовано: 2025-01-15*
