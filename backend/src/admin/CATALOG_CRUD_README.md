# Admin Catalog CRUD Module

Модуль административной панели для управления каталогом: товары, категории, бренды.

## 📋 Эндпоинты

### Товары (Products)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| POST | `/api/admin/products` | Создать товар | Catalog Manager |
| GET | `/api/admin/products` | Список товаров | Catalog Manager |
| GET | `/api/admin/products/:id` | Товар по ID | Catalog Manager |
| PUT | `/api/admin/products/:id` | Обновить товар | Catalog Manager |
| DELETE | `/api/admin/products/:id` | Удалить товар (мягкое) | Catalog Manager |

### Категории (Categories)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| POST | `/api/admin/categories` | Создать категорию | Catalog Manager |
| GET | `/api/admin/categories` | Список категорий | Catalog Manager |
| GET | `/api/admin/categories/:id` | Категория по ID | Catalog Manager |
| PUT | `/api/admin/categories/:id` | Обновить категорию | Catalog Manager |
| DELETE | `/api/admin/categories/:id` | Удалить категорию (мягкое) | Catalog Manager |

### Бренды (Brands)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| POST | `/api/admin/brands` | Создать бренд | Catalog Manager |
| GET | `/api/admin/brands` | Список брендов | Catalog Manager |
| GET | `/api/admin/brands/:id` | Бренд по ID | Catalog Manager |
| PUT | `/api/admin/brands/:id` | Обновить бренд | Catalog Manager |
| DELETE | `/api/admin/brands/:id` | Удалить бренд (мягкое) | Catalog Manager |

---

## 🔧 DTO

### CreateProductDto

**Поля:**
- `name` (string, 2-200) — название товара
- `slug` (string, 2-200) — ЧПУ (уникальный)
- `sku` (string?, max 50) — артикул
- `brandId` (UUID?, optional) — ID бренда
- `categoryId` (UUID?, optional) — ID категории
- `shortDescription` (string?, max 500) — краткое описание
- `fullDescription` (string?, optional) — полное описание
- `usageMethod` (string?, optional) — способ применения
- `benefits` (string?, optional) — преимущества
- `precautions` (string?, optional) — меры предосторожности
- `volume` (string?, max 50) — объём/вес
- `sortOrder` (int?, 0-10000, default: 0) — порядок сортировки
- `isActive` (boolean?, default: true) — активность
- `taskIds` (UUID[]?, optional) — ID задач ухода для связи

### UpdateProductDto

**Поля:**
- Все поля как в CreateProductDto, но optional

### CategoryDto

**Поля:**
- `name` (string, 2-200) — название категории
- `slug` (string, 2-200) — ЧПУ (уникальный)
- `description` (string?, max 500) — описание
- `parentId` (UUID?, optional) — ID родительской категории

### BrandDto

**Поля:**
- `name` (string, 2-200) — название бренда
- `slug` (string, 2-200) — ЧПУ (уникальный)
- `description` (string?, max 500) — описание
- `logoMediaId` (UUID?, optional) — ID логотипа

### ProductQueryDto

**Параметры:**
- `brandId` (UUID?, optional) — фильтр по бренду
- `categoryId` (UUID?, optional) — фильтр по категории
- `isActive` (boolean?, optional) — фильтр по активности
- `search` (string?, optional) — поиск по названию/SKU
- `sortBy` (string?, default: 'createdAt') — поле сортировки
- `sortOrder` ('asc' | 'desc', default: 'desc') — порядок
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)

---

## 🎯 Примеры запросов

### Создание товара

```bash
curl -X POST "http://localhost:3001/api/admin/products" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Автошампунь Premium",
    "slug": "avtoshampun-premium",
    "sku": "SH-001",
    "brandId": "uuid-бренда",
    "categoryId": "uuid-категории",
    "shortDescription": "Профессиональный шампунь",
    "fullDescription": "Подробное описание...",
    "usageMethod": "Нанести на влажную поверхность...",
    "benefits": "Глубокая очистка, защита воском",
    "precautions": "Избегать попадания в глаза",
    "volume": "500 мл",
    "sortOrder": 1,
    "isActive": true,
    "taskIds": ["uuid-задачи-1", "uuid-задачи-2"]
  }'
```

### Получение списка товаров с фильтрами

```bash
curl "http://localhost:3001/api/admin/products?brandId=uuid&categoryId=uuid&isActive=true&search=шампун&page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

### Обновление товара

```bash
curl -X PUT "http://localhost:3001/api/admin/products/:id" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Автошампунь Premium Plus",
    "price": 1500,
    "sortOrder": 10
  }'
```

### Мягкое удаление товара

```bash
curl -X DELETE "http://localhost:3001/api/admin/products/:id" \
  -H "Authorization: Bearer <token>"
```

---

## 💡 Бизнес-логика

### Товары

- **Уникальность slug** — проверка при создании и обновлении
- **Уникальность sku** — проверка при создании и обновлении
- **Связь с задачами ухода** — через ProductCareTask (многие-ко-многим)
- **Мягкое удаление** — isActive = false вместо DELETE
- **Валидация связей** — проверка существования brandId, categoryId

### Категории

- **Древовидная структура** — поддержка родительских категорий
- **Уникальность slug** — проверка при создании и обновлении
- **Мягкое удаление** — isActive = false
- **Проверка родительской категории** — существование parentId

### Бренды

- **Уникальность slug** — проверка при создании и обновлении
- **Логотип** — связь с MediaFile (опционально)
- **Мягкое удаление** — isActive = false

---

## 📊 Response форматы

### Товар

```json
{
  "id": "uuid",
  "name": "Автошампунь Premium",
  "slug": "avtoshampun-premium",
  "sku": "SH-001",
  "brandId": "uuid",
  "categoryId": "uuid",
  "shortDescription": "Профессиональный шампунь",
  "fullDescription": "...",
  "usageMethod": "...",
  "benefits": "...",
  "precautions": "...",
  "volume": "500 мл",
  "isActive": true,
  "sortOrder": 1,
  "brand": {...},
  "category": {...},
  "taskLinks": [
    {
      "careTask": {...}
    }
  ],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### Список товаров

```json
{
  "page": 1,
  "limit": 20,
  "total": 150,
  "items": [...]
}
```

### Категория с деревом

```json
{
  "id": "uuid",
  "name": "Автохимия",
  "slug": "avtohimiya",
  "parentId": null,
  "parent": null,
  "children": [...],
  "products": [...]
}
```

---

## 🔗 Связи с другими модулями

| Сущность | Связь | Описание |
|----------|-------|----------|
| **ProductCareTask** | Product ↔ CareTask | Связь товаров с задачами ухода |
| **Favorite** | User ↔ Product | Избранное пользователей |
| **CartItem** | User ↔ Product | Корзина пользователей |
| **RequestOrderItem** | RequestOrder ↔ Product | Позиции заявок |
| **Instruction** | Product ↔ Instruction | Инструкции к товарам |
| **FaqItem** | Product ↔ FaqItem | FAQ по товарам |
| **CareKitItem** | CareKit ↔ Product | Комплекты товаров |
| **ProductView** | User ↔ Product | История просмотров |
| **ProductComparisonItem** | Comparison ↔ Product | Сравнение товаров |

---

*Реализовано: 2025-01-15*
