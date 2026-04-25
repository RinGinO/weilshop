# Account Module

Модуль личного кабинета пользователя: профиль, история просмотров, уведомления.

## 📋 Эндпоинты

### Профиль (Profile)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/account/profile` | Получить профиль | ✅ |
| PATCH | `/api/account/profile` | Обновить профиль | ✅ |
| PATCH | `/api/account/profile/password` | Сменить пароль | ✅ |
| DELETE | `/api/account/profile` | Удалить аккаунт | ✅ |

### История просмотров (Views)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/account/views` | История просмотров | ✅ |
| POST | `/api/account/views` | Добавить просмотр | ✅ |
| DELETE | `/api/account/views/clear` | Очистить историю | ✅ |

### Уведомления (Notifications)

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/account/notifications` | Список уведомлений | ✅ |
| PATCH | `/api/account/notifications/:id/read` | Прочитать уведомление | ✅ |
| POST | `/api/account/notifications/mark-all-read` | Прочитать все | ✅ |
| GET | `/api/account/notifications/preferences` | Настройки уведомлений | ✅ |
| PATCH | `/api/account/notifications/preferences` | Обновить настройки | ✅ |

---

## 🔧 DTO

### UpdateProfileDto

**Поля:**
- `firstName` (string?, max 50) — имя
- `lastName` (string?, max 50) — фамилия
- `email` (string?, email) — email (проверка на уникальность)
- `phone` (string?, max 20) — телефон (проверка на уникальность)

**Особенности:**
- При смене email сбрасывается `isEmailVerified`

### ChangePasswordDto

**Поля:**
- `currentPassword` (string, min 8) — текущий пароль
- `newPassword` (string, min 8) — новый пароль

### AddViewDto

**Поля:**
- `productId` (UUID) — ID просмотренного товара

**Особенности:**
- Если просмотр за сегодня уже есть — обновляется `viewedAt`
- Иначе создаётся новая запись

### NotificationQueryDto

**Параметры:**
- `filter` ('all' | 'unread' | 'read', default: 'all')
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)

### UpdateNotificationPreferencesDto

**Поля:**
- `type` (NotificationType) — тип уведомления
- `channel` (NotificationChannel) — канал доставки
- `isEnabled` (boolean) — включить/выключить

---

## 📝 Типы уведомлений

### NotificationType

```typescript
enum NotificationType {
  REQUEST_STATUS_CHANGED,  // Смена статуса заявки
  CONSULTATION_RESPONSE,   // Ответ на консультацию
  SYSTEM                   // Системные уведомления
}
```

### NotificationChannel

```typescript
enum NotificationChannel {
  EMAIL,   // Email
  SMS,     // SMS
  PUSH,    // Push-уведомления
  TELEGRAM, // Telegram
  IN_APP   // В приложении
}
```

---

## 🎯 Примеры запросов

### Получение профиля

```bash
curl "http://localhost:3001/api/account/profile" \
  -H "Authorization: Bearer <token>"
```

### Обновление профиля

```bash
curl -X PATCH "http://localhost:3001/api/account/profile" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Иван",
    "lastName": "Петров"
  }'
```

### Смена пароля

```bash
curl -X PATCH "http://localhost:3001/api/account/profile/password" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
  }'
```

### Добавление просмотра товара

```bash
curl -X POST "http://localhost:3001/api/account/views" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "uuid-товара"
  }'
```

### Получение уведомлений

```bash
curl "http://localhost:3001/api/account/notifications?filter=unread&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Обновление настроек уведомлений

```bash
curl -X PATCH "http://localhost:3001/api/account/notifications/preferences" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "REQUEST_STATUS_CHANGED",
    "channel": "EMAIL",
    "isEnabled": true
  }'
```

---

## 💡 Бизнес-логика

### Профиль

- **Уникальность email и телефона** — проверка при обновлении
- **Сброс верификации email** — при смене email
- **Хеширование пароля** — bcrypt с cost 12
- **Удаление аккаунта** — полное удаление пользователя

### История просмотров

- **Автоматическое дедуплицирование** — не более одной записи на товар в день
- **Обновление времени** — при повторном просмотре за день
- **Сортировка** — по убыванию `viewedAt`

### Уведомления

- **Фильтрация** — все/непрочитанные/прочитанные
- **Счётчик непрочитанных** — возвращается в списке
- **Массовая отметка** — прочитать все сразу
- **Настройки по типам и каналам** — гибкое управление

---

## 🔗 Связи с другими модулями

| Модуль | Сущность | Связь |
|--------|----------|-------|
| **Requests** | RequestOrder | Notification.requestOrderId |
| **Consultations** | ConsultationRequest | Notification.consultationRequestId |
| **Catalog** | Product | ProductView.productId |

---

## 📊 Response форматы

### Профиль

```json
{
  "id": "uuid",
  "firstName": "Иван",
  "lastName": "Петров",
  "email": "ivan@example.com",
  "phone": "+79991234567",
  "isEmailVerified": true,
  "isPhoneVerified": false,
  "status": "ACTIVE",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Уведомления

```json
{
  "page": 1,
  "limit": 20,
  "total": 45,
  "unreadCount": 5,
  "items": [
    {
      "id": "uuid",
      "type": "REQUEST_STATUS_CHANGED",
      "channel": "EMAIL",
      "status": "PENDING",
      "title": "Статус заявки изменён",
      "message": "Ваша заявка #123 в работе",
      "readAt": null,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### История просмотров

```json
{
  "page": 1,
  "limit": 20,
  "total": 15,
  "items": [
    {
      "id": "uuid",
      "name": "Автошампунь",
      "slug": "avtoshampun",
      "brand": {...},
      "category": {...}
    }
  ]
}
```

---

*Реализовано: 2025-01-15*
