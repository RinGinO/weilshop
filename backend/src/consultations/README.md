# Consultations Module

Модуль запросов на консультацию по подбору товаров.

## 📋 Эндпоинты

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/consultations` | Создать запрос | 🌐 |
| GET | `/api/consultations` | Список всех (админ) | ✅ |
| GET | `/api/consultations/my` | Мои запросы | ✅ |
| GET | `/api/consultations/assigned` | Назначенные мне | ✅ |
| GET | `/api/consultations/:id` | Запрос по ID | ✅ |
| POST | `/api/consultations/:id/assign` | Назначить админа | ✅ |
| PATCH | `/api/consultations/:id/respond` | Ответить | ✅ |
| POST | `/api/consultations/:id/close` | Закрыть запрос | ✅ |
| POST | `/api/consultations/:id/cancel` | Отменить запрос | ✅ |

---

## 🔧 DTO

### CreateConsultationDto

**Поля:**
- `message` (string, 5-500) — текст запроса
- `customerName` (string, max 100) — имя клиента
- `customerEmail` (string?, max 100) — email
- `customerPhone` (string?, max 50) — телефон
- `careTaskId` (UUID?, optional) — связанная задача ухода
- `productIds` (UUID[]?, optional) — список товаров для консультации

### AssignConsultationDto

**Поля:**
- `adminId` (UUID) — ID администратора

### RespondConsultationDto

**Поля:**
- `response` (string, max 2000) — текст ответа
- `status` (ConsultationStatus?, optional) — статус после ответа

### ConsultationQueryDto

**Параметры запроса:**
- `status` (ConsultationStatus?, optional) — фильтр по статусу
- `assignedAdminId` (UUID?, optional) — фильтр по администратору
- `userId` (UUID?, optional) — фильтр по пользователю
- `search` (string?, optional) — поиск по имени/email/сообщению
- `sortBy` (string, default: 'createdAt')
- `sortOrder` ('asc' | 'desc', default: 'desc')
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)

---

## 📝 Статусы консультаций

```typescript
enum ConsultationStatus {
  NEW,         // Новый запрос
  IN_PROGRESS, // В работе (назначен админ)
  RESOLVED,    // Решён (дан ответ)
  CLOSED       // Закрыт
}
```

### Переходы статусов

```
NEW → IN_PROGRESS (назначен админ)
IN_PROGRESS → RESOLVED (админ ответил)
RESOLVED → CLOSED (закрыт админом)
NEW → CLOSED (отменён пользователем)
```

---

## 🎯 Примеры запросов

### Создание запроса на консультацию

```bash
curl -X POST http://localhost:3001/api/consultations \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Помогите подобрать средства для мойки салона",
    "customerName": "Иван Петров",
    "customerEmail": "ivan@example.com",
    "customerPhone": "+79991234567",
    "careTaskId": "uuid-задачи",
    "productIds": ["uuid-товара-1", "uuid-товара-2"]
  }'
```

### Назначение администратора

```bash
curl -X POST http://localhost:3001/api/consultations/:id/assign \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "uuid-админа"
  }'
```

### Ответ на консультацию

```bash
curl -X PATCH http://localhost:3001/api/consultations/:id/respond \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "response": "Рекомендую использовать автошампунь X и полироль Y...",
    "status": "RESOLVED"
  }'
```

### Получение моих консультаций

```bash
curl "http://localhost:3001/api/consultations/my?page=1&limit=10" \
  -H "Authorization: Bearer <user-token>"
```

---

## 💡 Бизнес-логика

### Создание запроса

- **Анонимно** или **авторизованным** пользователем
- Если указан `careTaskId` — проверка существования
- Если указаны `productIds` — проверка всех товаров
- Статус по умолчанию: `NEW`

### Назначение администратора

- Только для статусов `NEW` или `IN_PROGRESS`
- Автоматически меняет статус на `IN_PROGRESS`
- Требует прав администратора

### Ответ на консультацию

- Только **назначенный администратор** может ответить
- Автоматически меняет статус на `RESOLVED` (если не указан другой)
- Требует прав администратора

### Отмена пользователем

- Только для статуса `NEW`
- Меняет статус на `CLOSED`
- Только владелец запроса может отменить

---

## 🔗 Связи с другими модулями

| Модуль | Сущность | Связь |
|--------|----------|-------|
| **Users** | User | ConsultationRequest.userId |
| **Admin** | Admin | ConsultationRequest.assignedAdminId |
| **Tasks** | CareTask | ConsultationRequest.careTaskId |
| **Catalog** | Product | ConsultationRequestProduct.productId |

---

## 📊 Статистика

Для получения статистики по консультациям используйте общий эндпоинт с фильтрами:

```bash
# Все консультации в работе
GET /api/consultations?status=IN_PROGRESS

# Назначенные конкретному админу
GET /api/consultations?assignedAdminId=uuid
```

---

*Реализовано: 2025-01-15*
