# Tasks Module

Модуль задач ухода и пошаговых комплектов WeilShop.

## 📋 Эндпоинты

### Задачи ухода (CareTask)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/tasks` | Создание задачи ухода | ✅ |
| GET | `/api/tasks` | Список задач с фильтрами | 🌐 |
| GET | `/api/tasks/:id` | Задача по ID | 🌐 |
| GET | `/api/tasks/slug/:slug` | Задача по slug | 🌐 |
| PUT | `/api/tasks/:id` | Обновление задачи | ✅ |
| DELETE | `/api/tasks/:id` | Удаление задачи | ✅ |
| POST | `/api/tasks/products/add` | Добавить товар к задаче | ✅ |
| DELETE | `/api/tasks/products/remove` | Удалить товар из задачи | ✅ |

### Комплекты ухода (CareKit)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/tasks/care-kits` | Создание комплекта | ✅ |
| GET | `/api/tasks/care-kits` | Список комплектов | 🌐 |
| GET | `/api/tasks/care-kits/:id` | Комплект по ID | 🌐 |
| GET | `/api/tasks/care-kits/slug/:slug` | Комплект по slug | 🌐 |
| PUT | `/api/tasks/care-kits/:id` | Обновление комплекта | ✅ |
| DELETE | `/api/tasks/care-kits/:id` | Удаление комплекта | ✅ |

---

## 🔧 DTO

### CareTask

**CreateCareTaskDto:**
- `name` (string, 2-100) — название задачи
- `slug` (string, 2-200) — URL-идентификатор
- `shortDescription` (string?, max 500) — краткое описание
- `fullDescription` (string?, optional) — полное описание
- `problemDescription` (string?, optional) — описание проблемы
- `stepByStep` (string?, optional) — пошаговая инструкция
- `faqBlock` (string?, optional) — блок FAQ
- `isActive` (boolean?, default: true) — активна ли

**UpdateCareTaskDto:** все поля опциональны

**CareTaskQueryDto:**
- `isActive` (boolean?, default: true)
- `search` (string?, optional)
- `sortBy` (string, default: 'name')
- `sortOrder` ('asc' | 'desc', default: 'asc')
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)

**AddProductToTaskDto:**
- `productId` (UUID)
- `careTaskId` (UUID)

**RemoveProductFromTaskDto:**
- `productId` (UUID)
- `careTaskId` (UUID)

### CareKit

**CreateCareKitDto:**
- `name` (string, 2-200)
- `slug` (string, 2-200)
- `description` (string?, max 500)
- `careTaskId` (UUID?, optional) — связанная задача
- `isActive` (boolean?, default: true)
- `sortOrder` (int, 0-10000, default: 0)
- `items` (array?, optional) — шаги комплекта

**CareKitItem:**
- `productId` (UUID)
- `stepNumber` (int, 1-100) — номер шага
- `title` (string?, max 200) — название шага
- `description` (string?, max 500) — описание шага

**UpdateCareKitDto:** все поля опциональны

**CareKitQueryDto:**
- `careTaskId` (UUID?, optional)
- `isActive` (boolean?, default: true)
- `search` (string?, optional)
- `sortBy`, `sortOrder`, `page`, `limit` — как у CareTask

---

## 📝 Бизнес-логика

### Задачи ухода (CareTask)

**Ключевая особенность проекта** — подбор товаров по задачам ухода.

- Уникальность slug
- Связи с товарами (ProductCareTask) — многие-ко-многим
- Связи с комплектами (CareKit) — один-ко-многим
- Связи с инструкциями и FAQ
- Нельзя удалить задачу с связанными товарами или комплектами

**Примеры задач:**
- Мойка кузова
- Очистка салона
- Уход за пластиком
- Полировка кузова
- Защита лакокрасочного покрытия
- Очистка двигателя

### Комплекты ухода (CareKit)

Пошаговые наборы товаров для решения задачи:

- Уникальность slug
- Связь с CareTask (опционально)
- Элементы комплекта (CareKitItem) с порядковыми номерами
- Каждый элемент — товар + шаг применения + описание
- Автоматическая сортировка по stepNumber
- При обновлении items — пересоздание всех элементов

**Пример комплекта "Мойка кузова":**
1. Шаг 1: Бесконтактная пена — нанести на кузов
2. Шаг 2: Автошампунь — помыть губкой
3. Шаг 3: Воск — нанести для защиты
4. Шаг 4: Полироль — отполировать поверхность

---

## 🎯 Примеры запросов

### Создание задачи ухода

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Мойка кузова",
    "slug": "mojka-kuzova",
    "shortDescription": "Комплексная мойка кузова автомобиля",
    "problemDescription": "Загрязнения, пыль, следы насекомых",
    "stepByStep": "1. Нанести пену\n2. Смыть водой\n3. Вытереть насухо",
    "isActive": true
  }'
```

### Добавить товар к задаче

```bash
curl -X POST http://localhost:3001/api/tasks/products/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "uuid-товара",
    "careTaskId": "uuid-задачи"
  }'
```

### Создание комплекта

```bash
curl -X POST http://localhost:3001/api/tasks/care-kits \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Комплект для мойки кузова",
    "slug": "komplekt-dlya-mojki-kuzova",
    "description": "Всё необходимое для мойки кузова",
    "careTaskId": "uuid-задачи",
    "items": [
      {
        "productId": "uuid-пены",
        "stepNumber": 1,
        "title": "Бесконтактная пена",
        "description": "Нанести на 2-3 минуты"
      },
      {
        "productId": "uuid-шампуня",
        "stepNumber": 2,
        "title": "Автошампунь",
        "description": "Помыть губкой"
      }
    ]
  }'
```

### Получение списка комплектов

```bash
curl "http://localhost:3001/api/tasks/care-kits?careTaskId=uuid&page=1&limit=10"
```

---

## 🔗 Связи с другими модулями

| Модуль | Связь | Описание |
|--------|-------|----------|
| **Catalog** | Product | Товары связаны с задачами через ProductCareTask |
| **Knowledge** | Instruction, FaqItem | Инструкции и FAQ привязаны к задачам |
| **Consultations** | ConsultationRequest | Запросы на консультацию по задаче |

---

## 💡 Особенности

### ProductCareTask (связь многие-ко-многим)

```prisma
model ProductCareTask {
  productId  String
  careTaskId String
  product    Product  @relation(fields: [productId], references: [id])
  careTask   CareTask @relation(fields: [careTaskId], references: [id])

  @@id([productId, careTaskId])
}
```

- Составной первичный ключ (productId, careTaskId)
- Каскадное удаление при удалении товара или задачи
- Один товар может быть в нескольких задачах
- Одна задача может содержать много товаров

### CareKitItem (пошаговые элементы)

```prisma
model CareKitItem {
  id          String   @id @default(uuid())
  careKitId   String
  productId   String
  stepNumber  Int
  title       String?
  description String?
  careKit     CareKit  @relation(fields: [careKitId], references: [id])
  product     Product  @relation(fields: [productId], references: [id])

  @@unique([careKitId, stepNumber])
  @@index([productId])
}
```

- Уникальность stepNumber в рамках комплекта
- Сортировка по stepNumber при получении
- Каскадное удаление при удалении комплекта

---

*Реализовано: 2025-01-15*
