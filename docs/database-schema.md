# Логическая схема базы данных WeilShop

## 1. Основные таблицы

- `users`
- `products`
- `categories`
- `brands`
- `care_tasks`
- `product_care_tasks`
- `articles`
- `instructions`
- `faq_items`
- `favorites`
- `cart_items`
- `request_orders`
- `request_order_items`
- `request_status_history`
- `admins`
- `roles`
- `admin_roles`
- `media_files`
- `seo_meta`
- `care_kits`
- `care_kit_items`
- `product_views`
- `consultation_requests`
- `consultation_request_products`
- `notification_preferences`
- `notifications`
- `product_comparisons`
- `product_comparison_items`

## 2. Таблицы и поля

### `users`
- `id`
- `first_name`
- `last_name`
- `email`
- `phone`
- `password_hash`
- `is_email_verified`
- `is_phone_verified`
- `status`
- `created_at`
- `updated_at`

### `products`
- `id`
- `name`
- `slug`
- `sku`
- `brand_id`
- `category_id`
- `short_description`
- `full_description`
- `usage_method`
- `benefits`
- `precautions`
- `volume`
- `is_active`
- `sort_order`
- `created_at`
- `updated_at`

### `categories`
- `id`
- `name`
- `slug`
- `description`
- `parent_id`
- `is_active`

### `brands`
- `id`
- `name`
- `slug`
- `description`
- `logo_media_id`
- `is_active`

### `care_tasks`
- `id`
- `name`
- `slug`
- `short_description`
- `full_description`
- `problem_description`
- `step_by_step`
- `faq_block`
- `is_active`

### `product_care_tasks`
- `product_id`
- `care_task_id`

### `articles`
- `id`
- `title`
- `slug`
- `preview_text`
- `content`
- `cover_media_id`
- `author_id`
- `is_published`
- `published_at`

### `instructions`
- `id`
- `title`
- `slug`
- `content`
- `related_product_id`
- `related_task_id`
- `is_published`

### `faq_items`
- `id`
- `question`
- `answer`
- `sort_order`
- `is_published`
- `related_product_id`
- `related_task_id`

### `favorites`
- `id`
- `user_id`
- `product_id`

### `cart_items`
- `id`
- `user_id`
- `product_id`
- `quantity`

### `request_orders`
- `id`
- `user_id`
- `status`
- `customer_name`
- `customer_email`
- `customer_phone`
- `comment`
- `admin_comment`
- `created_at`
- `updated_at`

### `request_order_items`
- `id`
- `request_order_id`
- `product_id`
- `product_name_snapshot`
- `quantity`

### `request_status_history`
- `id`
- `request_order_id`
- `old_status`
- `new_status`
- `changed_by_admin_id`
- `comment`
- `created_at`

### `admins`
- `id`
- `name`
- `email`
- `password_hash`
- `status`
- `created_at`

### `roles`
- `id`
- `name`
- `code`

### `admin_roles`
- `admin_id`
- `role_id`

### `media_files`
- `id`
- `path`
- `type`
- `alt`
- `size`

### `seo_meta`
- `id`
- `entity_type`
- `entity_id`
- `meta_title`
- `meta_description`
- `meta_keywords`
- `og_title`
- `og_description`

### `care_kits`
- `id`
- `name`
- `slug`
- `description`
- `care_task_id`
- `is_active`
- `sort_order`
- `created_at`
- `updated_at`

### `care_kit_items`
- `id`
- `care_kit_id`
- `product_id`
- `step_number`
- `title`
- `description`

### `product_views`
- `id`
- `user_id`
- `product_id`
- `viewed_at`

### `consultation_requests`
- `id`
- `user_id`
- `care_task_id`
- `assigned_admin_id`
- `customer_name`
- `customer_email`
- `customer_phone`
- `message`
- `status`
- `response`
- `created_at`
- `updated_at`

### `consultation_request_products`
- `consultation_request_id`
- `product_id`

### `notification_preferences`
- `id`
- `user_id`
- `type`
- `channel`
- `is_enabled`
- `created_at`
- `updated_at`

### `notifications`
- `id`
- `user_id`
- `request_order_id`
- `consultation_request_id`
- `type`
- `channel`
- `status`
- `title`
- `message`
- `sent_at`
- `read_at`
- `created_at`
- `updated_at`

### `product_comparisons`
- `id`
- `user_id`
- `title`
- `created_at`
- `updated_at`

### `product_comparison_items`
- `comparison_id`
- `product_id`
- `added_at`

## 3. Связи между сущностями

- `Category 1 -> N Product`
- `Brand 1 -> N Product`
- `Product N <-> N CareTask`
- `User 1 -> N Favorite`
- `User 1 -> N CartItem`
- `User 1 -> N RequestOrder`
- `User 1 -> N ProductView`
- `User 1 -> N NotificationPreference`
- `User 1 -> N Notification`
- `User 1 -> N ConsultationRequest`
- `User 1 -> N ProductComparison`
- `RequestOrder 1 -> N RequestOrderItem`
- `RequestOrder 1 -> N RequestStatusHistory`
- `RequestOrder 1 -> N Notification`
- `CareTask 1 -> N CareKit`
- `CareKit 1 -> N CareKitItem`
- `Product 1 -> N CareKitItem`
- `ConsultationRequest N <-> N Product`
- `Admin 1 -> N ConsultationRequest`
- `ConsultationRequest 1 -> N Notification`
- `ProductComparison 1 -> N ProductComparisonItem`
- `ProductComparisonItem N -> 1 Product`
- `Article` может быть связан с `Product` и `CareTask`
- `Instruction` может быть связан с `Product` и `CareTask`

## 4. Рекомендации по проектированию

- использовать `slug` для всех публичных сущностей
- хранить снапшот названия товара в `request_order_items`, чтобы история заявок не ломалась при переименовании товара
- предусмотреть индексы на `slug`, `status`, `category_id`, `brand_id`
- предусмотреть уникальность по `email` и по `phone`, если поле заполнено
- хранить историю смены статусов отдельно, а не только текущее состояние заявки
- хранить историю просмотров отдельной таблицей, чтобы использовать ее для рекомендаций и возврата к товарам
- для сравнений использовать отдельную сущность списка сравнения, а не временное состояние в сессии
- уведомления проектировать с учетом нескольких каналов: `email`, `sms`, `push`, `telegram`, `in_app`
