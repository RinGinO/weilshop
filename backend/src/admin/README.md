# Admin Module

Модуль административной панели для управления системой.

## 📋 Эндпоинты

### Администраторы (Admins)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| POST | `/api/admin/admins` | Создать админа | Super Admin |
| GET | `/api/admin/admins` | Список админов | Super Admin |
| GET | `/api/admin/admins/:id` | Админ по ID | Super Admin |
| PUT | `/api/admin/admins/:id` | Обновить админа | Super Admin |
| POST | `/api/admin/admins/:id/change-password` | Сменить пароль | Super Admin |
| DELETE | `/api/admin/admins/:id` | Удалить админа | Super Admin |

### Роли (Roles)

| Метод | Эндпоинт | Описание | Роль |
|-------|----------|----------|------|
| POST | `/api/admin/roles` | Создать роль | Super Admin |
| GET | `/api/admin/roles` | Список ролей | Все админы |
| GET | `/api/admin/roles/:id` | Роль по ID | Super Admin |
| PUT | `/api/admin/roles/:id` | Обновить роль | Super Admin |
| DELETE | `/api/admin/roles/:id` | Удалить роль | Super Admin |

---

## 🔧 DTO

### CreateAdminDto

**Поля:**
- `name` (string, 2-100) — имя администратора
- `email` (string, email) — email (уникальный)
- `password` (string, min 8) — пароль
- `roleIds` (UUID[]?, optional) — ID ролей

### UpdateAdminDto

**Поля:**
- `name` (string?, 2-100) — имя
- `email` (string?, email) — email
- `status` (AdminStatus?, enum) — статус
- `roleIds` (UUID[]?, optional) — ID ролей

### AdminStatus

```typescript
enum AdminStatus {
  ACTIVE,    // Активен
  INACTIVE,  // Неактивен
  BLOCKED    // Заблокирован
}
```

### CreateRoleDto

**Поля:**
- `name` (string, 2-50) — название роли
- `code` (string, 2-50) — код роли (уникальный)
- `description` (string?, max 500) — описание

---

## 📝 Роли администраторов

### Стандартные роли

| Роль | Code | Описание |
|------|------|----------|
| Super Admin | `SUPER_ADMIN` | Полный доступ ко всем функциям |
| Catalog Manager | `CATALOG_MANAGER` | Товары, категории, бренды, задачи ухода |
| Content Manager | `CONTENT_MANAGER` | Статьи, инструкции, FAQ, SEO |
| Request Manager | `REQUEST_MANAGER` | Обработка заявок |
| Consultation Manager | `CONSULTATION_MANAGER` | Консультации по подбору |
| SEO / Merch Manager | `SEO_MERCH_MANAGER` | Коммерческая подача и видимость |

---

## 🎯 Примеры запросов

### Создание администратора

```bash
curl -X POST "http://localhost:3001/api/admin/admins" \
  -H "Authorization: Bearer <super-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "email": "ivan@weilshop.ru",
    "password": "SecurePassword123",
    "roleIds": ["uuid-роли-1", "uuid-роли-2"]
  }'
```

### Назначение ролей администратору

```bash
curl -X PUT "http://localhost:3001/api/admin/admins/:id" \
  -H "Authorization: Bearer <super-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roleIds": ["uuid-роли-1", "uuid-роли-3"]
  }'
```

### Создание роли

```bash
curl -X POST "http://localhost:3001/api/admin/roles" \
  -H "Authorization: Bearer <super-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Менеджер по продажам",
    "code": "SALES_MANAGER",
    "description": "Управление заявками и консультациями"
  }'
```

---

## 💡 Бизнес-логика

### Создание администратора

- **Уникальность email** — проверка перед созданием
- **Хеширование пароля** — bcrypt с cost 12
- **Назначение ролей** — опционально при создании
- **Статус по умолчанию** — ACTIVE

### Управление ролями

- **Уникальность code** — проверка перед созданием
- **Удаление роли** — удаляет все связи с админами
- **Просмотр ролей** — доступен всем админам

### Безопасность

- **Только Super Admin** — создание/удаление админов и ролей
- **Смена пароля** — только Super Admin может сменить пароль другому
- **Статусы** — BLOCKED админ не может войти в систему

---

## 🔗 Связи с другими модулями

| Модуль | Сущность | Связь |
|--------|----------|-------|
| **Knowledge** | Article | Article.authorId → Admin.id |
| **Requests** | RequestStatusHistory | changedByAdminId → Admin.id |
| **Consultations** | ConsultationRequest | assignedAdminId → Admin.id |

---

*Реализовано: 2025-01-15*
