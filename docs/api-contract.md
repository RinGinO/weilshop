# API Contract WeilShop

Этот документ описывает рекомендуемую структуру `REST API` для первой версии проекта.

## Общие правила

- базовый префикс: `/api`
- формат данных: `JSON`
- авторизация: `Bearer JWT`
- время в ответах: `ISO 8601`
- пагинация списков: `page`, `limit`, `total`, `items`

## 1. Auth

### `POST /api/auth/register`
Регистрация пользователя по `email` или телефону.

Тело запроса:
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "email": "ivan@example.com",
  "phone": "+79990000000",
  "password": "secret123"
}
```

### `POST /api/auth/login`
Вход по `email` или номеру телефона.

```json
{
  "login": "ivan@example.com",
  "password": "secret123"
}
```

### `POST /api/auth/refresh`
Обновление пары токенов.

### `POST /api/auth/forgot-password`
Запрос восстановления доступа.

### `POST /api/auth/reset-password`
Смена пароля по токену восстановления.

## 2. Каталог

### `GET /api/catalog/products`
Список товаров с фильтрами:
- `category`
- `brand`
- `task`
- `search`
- `page`
- `limit`

### `GET /api/catalog/products/:slug`
Карточка товара.

### `POST /api/catalog/compare`
Добавление товаров в список сравнения.

```json
{
  "productIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

### `GET /api/catalog/compare/:comparisonId`
Получение списка сравнения товаров.

### `GET /api/catalog/categories`
Список категорий.

### `GET /api/catalog/brands`
Список брендов.

### `GET /api/catalog/brands/:slug`
Страница бренда.

## 3. Задачи ухода

### `GET /api/tasks`
Список задач ухода.

### `GET /api/tasks/:slug`
Страница задачи ухода с:
- описанием
- шагами
- FAQ
- связанными товарами
- связанными статьями
- пошаговыми комплектами товаров

### `GET /api/tasks/:slug/care-kits`
Список комплектов товаров для задачи ухода.

## 4. База знаний

### `GET /api/knowledge/articles`
Список статей.

### `GET /api/knowledge/articles/:slug`
Страница статьи.

### `GET /api/knowledge/instructions`
Список инструкций.

### `GET /api/knowledge/instructions/:slug`
Страница инструкции.

### `GET /api/knowledge/faq`
Список FAQ.

## 5. Избранное

Требует авторизации.

### `GET /api/favorites`
Список избранных товаров пользователя.

### `POST /api/favorites`
Добавление товара в избранное.

```json
{
  "productId": "uuid"
}
```

### `DELETE /api/favorites/:productId`
Удаление товара из избранного.

## 6. История просмотров

Требует авторизации.

### `GET /api/account/views`
Список просмотренных товаров.

### `POST /api/account/views`
Фиксация просмотра товара.

```json
{
  "productId": "uuid"
}
```

## 7. Корзина

Требует авторизации.

### `GET /api/cart`
Содержимое корзины.

### `POST /api/cart/items`
Добавление товара в корзину.

```json
{
  "productId": "uuid",
  "quantity": 1
}
```

### `PATCH /api/cart/items/:itemId`
Изменение количества.

### `DELETE /api/cart/items/:itemId`
Удаление позиции.

## 8. Заявки

Требует авторизации.

### `POST /api/requests`
Создание заявки на основе корзины.

```json
{
  "customerName": "Иван Иванов",
  "customerEmail": "ivan@example.com",
  "customerPhone": "+79990000000",
  "comment": "Нужна консультация по применению"
}
```

### `GET /api/requests`
Список заявок текущего пользователя.

### `GET /api/requests/:id`
Детали заявки и история статусов.

## 9. Консультации

### `POST /api/consultations`
Создание запроса на консультацию.

```json
{
  "customerName": "Иван Иванов",
  "customerEmail": "ivan@example.com",
  "customerPhone": "+79990000000",
  "careTaskId": "uuid",
  "productIds": ["uuid-1", "uuid-2"],
  "message": "Нужна помощь с подбором средств для салона"
}
```

### `GET /api/account/consultations`
Список консультаций пользователя.

### `GET /api/account/consultations/:id`
Карточка консультации.

## 10. Личный кабинет

Требует авторизации.

### `GET /api/account/profile`
Профиль пользователя.

### `PATCH /api/account/profile`
Обновление данных профиля.

### `PATCH /api/account/password`
Смена пароля.

### `GET /api/account/history`
История просмотров.

### `GET /api/account/comparisons`
Списки сравнения пользователя.

### `GET /api/account/notifications`
Список уведомлений пользователя.

### `PATCH /api/account/notifications/:id/read`
Отметить уведомление как прочитанное.

### `GET /api/account/notification-preferences`
Настройки уведомлений.

### `PATCH /api/account/notification-preferences`
Изменение настроек уведомлений.

```json
{
  "type": "REQUEST_STATUS_CHANGED",
  "channel": "EMAIL",
  "isEnabled": true
}
```

## 11. Admin API

Требует авторизации администратора.

### `GET /api/admin/requests`
Список заявок с фильтрацией по статусам.

### `PATCH /api/admin/requests/:id/status`
Изменение статуса заявки.

```json
{
  "status": "processing",
  "comment": "Связались с клиентом, комплектуем заявку"
}
```

### `GET /api/admin/consultations`
Список запросов на консультацию.

### `PATCH /api/admin/consultations/:id`
Обработка консультации.

```json
{
  "status": "resolved",
  "response": "Рекомендуем комплект для очистки салона и защиту пластика",
  "assignedAdminId": "uuid"
}
```

### `GET /api/admin/care-kits`
Список пошаговых комплектов.

### `POST /api/admin/care-kits`
Создание комплекта по задаче ухода.

### `GET /api/admin/products`
Список товаров в админке.

### `POST /api/admin/products`
Создание товара.

### `PATCH /api/admin/products/:id`
Редактирование товара.

### `DELETE /api/admin/products/:id`
Архивация или деактивация товара.

### `GET /api/admin/articles`
Список статей.

### `POST /api/admin/articles`
Создание статьи.

### `GET /api/admin/admins`
Список администраторов.

### `POST /api/admin/admins`
Создание администратора.

### `PATCH /api/admin/admins/:id/roles`
Назначение ролей администратору.

## 12. Рекомендации по ответам API

Пример ответа списка:

```json
{
  "page": 1,
  "limit": 12,
  "total": 120,
  "items": []
}
```

Пример ответа ошибки:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": ["Некорректный email"]
  }
}
```
