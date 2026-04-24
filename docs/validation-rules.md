# Правила валидации API WeilShop

Этот документ описывает правила валидации для всех эндпоинтов API WeilShop.

---

## 1. Общие правила валидации

### 1.1. Стандартные форматы

| Поле | Формат | Пример |
|------|--------|--------|
| Email | RFC 5322 | `user@example.com` |
| Телефон | E.164 | `+79991234567` |
| UUID | UUID v4 | `550e8400-e29b-41d4-a716-446655440000` |
| Slug | lowercase, дефисы | `mojka-kuzova` |
| Дата | ISO 8601 | `2025-01-15T14:30:00Z` |
| URL | HTTPS | `https://example.com` |

### 1.2. Глобальные ограничения

| Тип | Максимальная длина |
|-----|-------------------|
| Строка (короткая) | 100 символов |
| Строка (средняя) | 500 символов |
| Строка (длинная) | 5000 символов |
| Текст (описание) | 10000 символов |
| Массив ID | 50 элементов |

### 1.3. Ответы при ошибках валидации

**Статус:** `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": ["Некорректный email"],
    "password": ["Минимум 8 символов", "Должна содержать цифру"]
  }
}
```

---

## 2. Auth Module

### 2.1. `POST /api/auth/register`

```typescript
{
  firstName: string;      // 1-50 символов, только буквы, пробелы, дефисы
  lastName: string;       // 1-50 символов, только буквы, пробелы, дефисы
  email: string;          // valid email, уникален
  phone: string;          // E.164 формат, уникален (если указан)
  password: string;       // 8-128 символов, минимум 1 заглавная, 1 строчная, 1 цифра
}
```

**Правила:**
- Требуется минимум одно из полей: `email` или `phone`
- Пароль не должен совпадать с email или phone
- Проверка на распространённые пароли (`12345678`, `password`)

### 2.2. `POST /api/auth/login`

```typescript
{
  login: string;    // email или телефон
  password: string; // 1-128 символов
}
```

**Правила:**
- Rate limit: 10 попыток в минуту
- Блокировка после 5 неудачных попыток (15 минут)

### 2.3. `POST /api/auth/forgot-password`

```typescript
{
  email: string;    // valid email
}
```

**Правила:**
- Rate limit: 3 запроса в час на email
- Всегда возвращать успех (защита от enumeration)

### 2.4. `POST /api/auth/reset-password`

```typescript
{
  token: string;    // JWT, срок действия 1 час
  password: string; // 8-128 символов, правила как при регистрации
}
```

**Правила:**
- Токен одноразовый
- После сброса — инвалидация всех refresh токенов

---

## 3. Catalog Module

### 3.1. `GET /api/catalog/products`

```typescript
{
  category?: string;    // UUID или slug
  brand?: string;       // UUID или slug
  task?: string;        // UUID или slug
  search?: string;      // 1-100 символов
  minPrice?: number;    // >= 0
  maxPrice?: number;    // >= minPrice
  page?: number;        // >= 1, default: 1
  limit?: number;       // 1-100, default: 12
  sortBy?: string;      // 'name', 'price', 'createdAt', 'popularity'
  sortOrder?: string;   // 'asc', 'desc'
}
```

### 3.2. `POST /api/admin/products`

```typescript
{
  name: string;             // 3-200 символов
  slug: string;             // unique, lowercase, дефисы
  sku: string;              // unique, 1-50 символов, алфавитно-цифровой
  brandId: string;          // UUID, существует
  categoryId: string;       // UUID, существует
  shortDescription: string; // 0-500 символов
  fullDescription: string;  // 0-5000 символов
  usageMethod: string;      // 0-2000 символов
  benefits: string;         // 0-1000 символов
  precautions: string;      // 0-1000 символов
  volume: string;           // 0-50 символов
  isActive: boolean;        // default: true
  sortOrder: number;        // >= 0, default: 0
}
```

**Правила:**
- `slug` генерируется автоматически из `name`, если не указан
- `sku` уникален в пределах всех товаров

### 3.3. `PATCH /api/admin/products/:id`

```typescript
// Все поля опциональны, те же правила что и при создании
```

### 3.4. `DELETE /api/admin/products/:id`

**Правила:**
- Мягкое удаление (установка `isActive: false`)
- Проверка на наличие в активных заявках

---

## 4. Tasks Module

### 4.1. `POST /api/admin/care-tasks`

```typescript
{
  name: string;             // 3-100 символов
  slug: string;             // unique, lowercase, дефисы
  shortDescription: string; // 0-300 символов
  fullDescription: string;  // 0-3000 символов
  problemDescription: string; // 0-2000 символов
  stepByStep: string;       // 0-5000 символов, JSON или markdown
  faqBlock: string;         // 0-3000 символов, JSON или markdown
  isActive: boolean;        // default: true
}
```

### 4.2. `POST /api/admin/care-kits`

```typescript
{
  name: string;         // 3-100 символов
  slug: string;         // unique, lowercase, дефисы
  description: string;  // 0-1000 символов
  careTaskId: string;   // UUID, существует
  isActive: boolean;    // default: true
  sortOrder: number;    // >= 0, default: 0
  items: [{
    productId: string;  // UUID, существует
    stepNumber: number; // >= 1
    title: string;      // 0-100 символов
    description: string; // 0-500 символов
  }]
}
```

**Правила:**
- `stepNumber` уникален в пределах одного комплекта
- Минимум 1 item в комплекте

---

## 5. Cart & Requests Module

### 5.1. `POST /api/cart/items`

```typescript
{
  productId: string;  // UUID, существует, isActive: true
  quantity: number;   // 1-999, default: 1
}
```

**Правила:**
- Проверка наличия товара (isActive)
- Максимум 100 уникальных товаров в корзине

### 5.2. `PATCH /api/cart/items/:itemId`

```typescript
{
  quantity: number;   // 1-999
}
```

### 5.3. `POST /api/requests`

```typescript
{
  customerName: string;   // 2-100 символов, буквы и пробелы
  customerEmail: string;  // valid email
  customerPhone: string;  // E.164 формат
  comment: string;        // 0-1000 символов
}
```

**Правила:**
- Корзина не должна быть пустой
- Максимум 1 активная заявка в обработке на пользователя

---

## 6. Knowledge Base Module

### 6.1. `POST /api/admin/articles`

```typescript
{
  title: string;        // 3-200 символов
  slug: string;         // unique, lowercase, дефисы
  previewText: string;  // 0-500 символов
  content: string;      // 100-50000 символов
  coverMediaId: string; // UUID, существует, тип: image
  authorId: string;     // UUID, существует (Admin)
  isPublished: boolean; // default: false
  publishedAt: string;  // ISO 8601, future date allowed
}
```

### 6.2. `POST /api/admin/instructions`

```typescript
{
  title: string;        // 3-200 символов
  slug: string;         // unique, lowercase, дефисы
  content: string;      // 100-20000 символов
  relatedProductId: string; // UUID, существует (опционально)
  relatedTaskId: string;    // UUID, существует (опционально)
  isPublished: boolean;     // default: false
}
```

**Правила:**
- Минимум одна связь: `relatedProductId` или `relatedTaskId`

### 6.3. `POST /api/admin/faq-items`

```typescript
{
  question: string;   // 5-500 символов
  answer: string;     // 10-2000 символов
  sortOrder: number;  // >= 0, default: 0
  isPublished: boolean; // default: true
  relatedProductId: string; // UUID (опционально)
  relatedTaskId: string;    // UUID (опционально)
}
```

---

## 7. Favorites & Comparisons

### 7.1. `POST /api/favorites`

```typescript
{
  productId: string;  // UUID, существует
}
```

**Правила:**
- Уникальность пары `userId + productId`
- Максимум 500 товаров в избранном

### 7.2. `POST /api/catalog/compare`

```typescript
{
  productIds: string[]; // 2-5 UUID, уникальные
  title: string;        // 0-100 символов (опционально)
}
```

**Правила:**
- Минимум 2 товара для сравнения
- Максимум 5 товаров в одном сравнении

---

## 8. Consultations Module

### 8.1. `POST /api/consultations`

```typescript
{
  customerName: string;   // 2-100 символов
  customerEmail: string;  // valid email
  customerPhone: string;  // E.164 формат
  careTaskId: string;     // UUID, существует (опционально)
  productIds: string[];   // 0-10 UUID (опционально)
  message: string;        // 10-2000 символов
}
```

**Правила:**
- Требуется авторизация или все контактные данные
- Rate limit: 5 запросов в сутки на пользователя

---

## 9. Admin Module

### 9.1. `POST /api/admin/admins`

```typescript
{
  name: string;       // 2-100 символов
  email: string;      // valid email, уникален
  password: string;   // 8-128 символов, правила как при регистрации
  roleIds: string[];  // 1-5 UUID, существуют
}
```

**Правила:**
- Доступно только Super Admin
- Пароль отправляется на email администратора или устанавливается при первом входе

### 9.2. `PATCH /api/admin/admins/:id/roles`

```typescript
{
  roleIds: string[];  // 1-5 UUID, существуют
}
```

**Правила:**
- Только Super Admin
- Нельзя удалить все роли

### 9.3. `PATCH /api/admin/requests/:id/status`

```typescript
{
  status: string;   // NEW, IN_REVIEW, CONFIRMED, PROCESSING, COMPLETED, CANCELLED
  comment: string;  // 0-500 символов (опционально)
}
```

**Правила:**
- Разрешённые переходы статусов:
  - `NEW` → `IN_REVIEW`, `CANCELLED`
  - `IN_REVIEW` → `CONFIRMED`, `CANCELLED`
  - `CONFIRMED` → `PROCESSING`
  - `PROCESSING` → `COMPLETED`, `CANCELLED`
- Запись в `RequestStatusHistory` обязательна

---

## 10. SEO Module

### 10.1. `POST /api/admin/seo`

```typescript
{
  entityType: string;   // 'PRODUCT', 'CATEGORY', 'BRAND', 'TASK', 'ARTICLE'
  entityId: string;     // UUID
  metaTitle: string;    // 10-70 символов
  metaDescription: string; // 50-300 символов
  metaKeywords: string; // 0-500 символов, comma-separated
  ogTitle: string;      // 0-70 символов
  ogDescription: string; // 0-300 символов
}
```

**Правила:**
- Уникальность пары `entityType + entityId`

---

## 11. Media Module

### 11.1. Загрузка файлов

| Параметр | Значение |
|----------|----------|
| Максимальный размер | 5 MB |
| Разрешённые типы (изображения) | `image/jpeg`, `image/png`, `image/webp` |
| Разрешённые типы (видео) | `video/mp4` |
| Максимальное разрешение | 4000x4000 px |

**Правила:**
- Проверка MIME типа по содержимому (не по расширению)
- Генерация уникального имени файла
- Создание thumbnail для изображений

---

## 12. Реализация валидации (NestJS)

### 12.1. Пример DTO

```typescript
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
```

### 12.2. Global Validation Pipe

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}));
```

---

*Последнее обновление: {{date}}*
