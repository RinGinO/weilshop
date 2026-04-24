# Catalog Module

Модуль каталога товаров WeilShop.

## 📋 Эндпоинты

### Категории

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/catalog/categories` | Создание категории | ✅ |
| GET | `/api/catalog/categories` | Список категорий с фильтрами | 🌐 |
| GET | `/api/catalog/categories/:id` | Категория по ID | 🌐 |
| GET | `/api/catalog/categories/slug/:slug` | Категория по slug | 🌐 |
| PUT | `/api/catalog/categories/:id` | Обновление категории | ✅ |
| DELETE | `/api/catalog/categories/:id` | Удаление категории | ✅ |

### Бренды

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/catalog/brands` | Создание бренда | ✅ |
| GET | `/api/catalog/brands` | Список брендов с фильтрами | 🌐 |
| GET | `/api/catalog/brands/:id` | Бренд по ID | 🌐 |
| GET | `/api/catalog/brands/slug/:slug` | Бренд по slug | 🌐 |
| PUT | `/api/catalog/brands/:id` | Обновление бренда | ✅ |
| DELETE | `/api/catalog/brands/:id` | Удаление бренда | ✅ |

### Товары

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/catalog/products` | Создание товара | ✅ |
| GET | `/api/catalog/products` | Список товаров с фильтрами | 🌐 |
| GET | `/api/catalog/products/:id` | Товар по ID | 🌐 |
| GET | `/api/catalog/products/slug/:slug` | Товар по slug | 🌐 |
| GET | `/api/catalog/products/:id/related` | Связанные товары | 🌐 |
| PUT | `/api/catalog/products/:id` | Обновление товара | ✅ |
| DELETE | `/api/catalog/products/:id` | Удаление товара (мягкое) | ✅ |

---

## 🔧 DTO

### Category

**CreateCategoryDto:**
- `name` (string, 2-100) — название
- `slug` (string, 2-200) — URL-идентификатор
- `description` (string?, max 500) — описание
- `parentId` (UUID?, optional) — родительская категория
- `isActive` (boolean?, default: true) — активна ли

**UpdateCategoryDto:** все поля опциональны

**CategoryQueryDto:**
- `parentId` (UUID?, optional) — фильтр по родителю
- `isActive` (boolean?, default: true) — фильтр по статусу
- `search` (string?, optional) — поиск по названию/описанию
- `sortBy` (string, default: 'name') — сортировка
- `sortOrder` ('asc' | 'desc', default: 'asc')
- `page` (string, default: '1')
- `limit` (string, default: '20')

### Brand

**CreateBrandDto:**
- `name` (string, 2-100)
- `slug` (string, 2-200)
- `description` (string?, max 1000)
- `logoMediaId` (UUID?, optional)
- `isActive` (boolean?, default: true)

**BrandQueryDto:** аналогично CategoryQueryDto

### Product

**CreateProductDto:**
- `name` (string, 2-200)
- `slug` (string, 2-200)
- `sku` (string?, max 50) — артикул
- `brandId` (UUID?, optional)
- `categoryId` (UUID?, optional)
- `shortDescription` (string?, max 500)
- `fullDescription` (string?, optional)
- `usageMethod` (string?, optional)
- `benefits` (string?, optional)
- `precautions` (string?, optional)
- `volume` (string?, max 100)
- `isActive` (boolean?, default: true)
- `sortOrder` (int, 0-10000, default: 0)

**ProductQueryDto:**
- `categoryId` (UUID?, optional)
- `brandId` (UUID?, optional)
- `isActive` (boolean?, default: true)
- `search` (string?, optional)
- `sortBy` (string, default: 'name')
- `sortOrder` ('asc' | 'desc', default: 'asc')
- `page` (int, default: 1, min: 1)
- `limit` (int, default: 20, min: 1, max: 100)

---

## 📝 Бизнес-логика

### Категории

- Древовидная структура (родитель-потомки)
- Уникальность slug
- Нельзя удалить категорию с дочерними элементами или товарами
- При обновлении parentId нельзя сделать категорию родителем самой себя

### Бренды

- Уникальность slug
- Нельзя удалить бренд с товарами
- Логотип опционально (MediaFile)

### Товары

- Уникальность slug и SKU
- Мягкое удаление (isActive = false)
- Связи с задачами ухода (CareTask)
- Связанные товары: из той же категории или бренда
- Проверка существования категории и бренда при создании/обновлении

---

## 🎯 Примеры запросов

### Создание категории

```bash
curl -X POST http://localhost:3001/api/catalog/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Автошампуни",
    "slug": "avtoshampuni",
    "description": "Шампуни для мойки кузова"
  }'
```

### Получение списка товаров

```bash
curl "http://localhost:3001/api/catalog/products?categoryId=uuid&brandId=uuid&page=1&limit=20"
```

### Обновление товара

```bash
curl -X PUT http://localhost:3001/api/catalog/products/uuid \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новое название",
    "isActive": false
  }'
```

---

*Реализовано: 2025-01-15*
