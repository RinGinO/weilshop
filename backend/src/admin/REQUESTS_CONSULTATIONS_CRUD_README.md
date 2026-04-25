# Admin Requests & Consultations CRUD Module

Модуль административной панели для управления заявками и консультациями.

## 📋 Эндпоинты

### Заявки (Requests)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| GET | `/api/admin/requests` | Список заявок | Request Manager |
| GET | `/api/admin/requests/statistics` | Статистика по заявкам | Request Manager |
| GET | `/api/admin/requests/:id` | Заявка по ID | Request Manager |
| PUT | `/api/admin/requests/:id/status` | Обновить статус | Request Manager |
| PUT | `/api/admin/requests/:id` | Обновить заявку | Request Manager |
| DELETE | `/api/admin/requests/:id` | Удалить заявку | Request Manager |

### Консультации (Consultations)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| GET | `/api/admin/consultations` | Список консультаций | Consultation Manager |
| GET | `/api/admin/consultations/statistics` | Статистика по консультациям | Consultation Manager |
| GET | `/api/admin/consultations/:id` | Консультация по ID | Consultation Manager |
| POST | `/api/admin/consultations/:id/assign` | Назначить исполнителя | Consultation Manager |
| PUT | `/api/admin/consultations/:id` | Обновить консультацию | Consultation Manager |
| POST | `/api/admin/consultations/:id/resolve` | Завершить с ответом | Consultation Manager |
| POST | `/api/admin/consultations/:id/close` | Закрыть консультацию | Consultation Manager |
| DELETE | `/api/admin/consultations/:id` | Удалить консультацию | Consultation Manager |

---

## 🔧 DTO

### UpdateRequestStatusDto

**Поля:**
- `newStatus` (RequestStatus enum) — новый статус
- `comment` (string?, optional) — комментарий к изменению

### UpdateRequestDto

**Поля:**
- `status` (RequestStatus?, enum) — статус
- `adminComment` (string?, optional) — комментарий администратора

### RequestQueryDto

**Параметры:**
- `status` (RequestStatus?, enum) — фильтр по статусу
- `userId` (UUID?, optional) — фильтр по пользователю
- `search` (string?, optional) — поиск по имени/email/телефону
- `sortBy` (string?, default: 'createdAt') — поле сортировки
- `sortOrder` ('asc' | 'desc', default: 'desc') — порядок
- `page` (int, default: 1)
- `limit` (int, default: 20)

### UpdateConsultationDto

**Поля:**
- `status` (ConsultationStatus?, enum) — статус
- `response` (string?, optional) — текст ответа
- `assignedAdminId` (UUID?, optional) — ID назначенного админа

### AssignConsultationDto

**Поля:**
- `assignedAdminId` (UUID) — ID администратора для назначения

### ConsultationQueryDto

**Параметры:**
- `status` (ConsultationStatus?, enum) — фильтр по статусу
- `assignedAdminId` (UUID?, optional) — фильтр по исполнителю
- `careTaskId` (UUID?, optional) — фильтр по задаче ухода
- `search` (string?, optional) — поиск по имени/email/сообщению
- `sortBy` (string?, default: 'createdAt') — поле сортировки
- `sortOrder` ('asc' | 'desc', default: 'desc') — порядок
- `page` (int, default: 1)
- `limit` (int, default: 20)

---

## 📝 Статусы заявок

### RequestStatus

```typescript
enum RequestStatus {
  NEW,         // Новая заявка
  IN_REVIEW,   // На рассмотрении
  CONFIRMED,   // Подтверждена
  PROCESSING,  // В обработке
  COMPLETED,   // Завершена
  CANCELLED    // Отменена
}
```

**Workflow:** `NEW` → `IN_REVIEW` → `CONFIRMED` → `PROCESSING` → `COMPLETED` / `CANCELLED`

---

## 📝 Статусы консультаций

### ConsultationStatus

```typescript
enum ConsultationStatus {
  NEW,         // Новая консультация
  IN_PROGRESS, // В работе
  RESOLVED,    // Решена (с ответом)
  CLOSED       // Закрыта
}
```

**Workflow:** `NEW` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`

---

## 🎯 Примеры запросов

### Получение списка заявок

```bash
curl "http://localhost:3001/api/admin/requests?status=NEW&page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

### Обновление статуса заявки

```bash
curl -X PUT "http://localhost:3001/api/admin/requests/:id/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newStatus": "IN_REVIEW",
    "comment": "Заявка принята в работу"
  }'
```

### Статистика по заявкам

```bash
curl "http://localhost:3001/api/admin/requests/statistics" \
  -H "Authorization: Bearer <token>"
```

**Ответ:**
```json
{
  "totalCount": 150,
  "byStatus": {
    "NEW": 5,
    "IN_REVIEW": 10,
    "CONFIRMED": 20,
    "PROCESSING": 15,
    "COMPLETED": 90,
    "CANCELLED": 10
  }
}
```

### Назначение консультации

```bash
curl -X POST "http://localhost:3001/api/admin/consultations/:id/assign" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "assignedAdminId": "uuid-админа"
  }'
```

### Завершение консультации с ответом

```bash
curl -X POST "http://localhost:3001/api/admin/consultations/:id/resolve" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "response": "Рекомендуем использовать автошампунь Premium для мойки кузова..."
  }'
```

---

## 💡 Бизнес-логика

### Заявки

- **История статусов** — каждое изменение статуса логируется в RequestStatusHistory
- **Ответственный админ** — фиксируется в истории изменений
- **Комментарии** — администратор может добавить комментарий к заявке
- **Статистика** — подсчёт по всем статусам
- **Поиск** — по имени, email, телефону клиента

### Консультации

- **Назначение исполнителя** — автоматически меняет статус на IN_PROGRESS
- **Ответ клиенту** — поле response заполняется при завершении
- **Закрытие** — финальный статус CLOSED
- **Статистика** — подсчёт по всем статусам
- **Привязка к задаче** — консультация по конкретной задаче ухода

---

## 📊 Response форматы

### Заявка

```json
{
  "id": "uuid",
  "userId": "uuid",
  "status": "IN_REVIEW",
  "customerName": "Иван Петров",
  "customerEmail": "ivan@example.com",
  "customerPhone": "+79991234567",
  "comment": "Доставка в выходные",
  "adminComment": "Клиент VIP",
  "user": {...},
  "items": [
    {
      "productId": "uuid",
      "productNameSnapshot": "Автошампунь Premium",
      "quantity": 2,
      "product": {...}
    }
  ],
  "statusHistory": [
    {
      "oldStatus": "NEW",
      "newStatus": "IN_REVIEW",
      "changedByAdmin": {"id": "uuid", "name": "Админ"},
      "comment": "Принято в работу",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### Консультация

```json
{
  "id": "uuid",
  "userId": "uuid",
  "careTaskId": "uuid",
  "assignedAdminId": "uuid",
  "customerName": "Иван Петров",
  "customerEmail": "ivan@example.com",
  "message": "Какое средство выбрать для мойки?",
  "status": "IN_PROGRESS",
  "response": null,
  "user": {...},
  "careTask": {...},
  "assignedAdmin": {...},
  "products": [...],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

---

## 🔗 Связи с другими модулями

| Сущность | Связь | Описание |
|----------|-------|----------|
| **User** | RequestOrder.userId | Пользователь создавший заявку |
| **User** | ConsultationRequest.userId | Пользователь создавший консультацию |
| **Admin** | RequestStatusHistory.changedByAdminId | Админ изменивший статус |
| **Admin** | ConsultationRequest.assignedAdminId | Ответственный админ |
| **CareTask** | ConsultationRequest.careTaskId | Задача ухода |

---

*Реализовано: 2025-01-15*
