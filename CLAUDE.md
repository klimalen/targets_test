# Habits — трекер привычек

## Что это

Веб-приложение для отслеживания привычек. Бесплатное, PWA (можно установить на телефон/десктоп). Русскоязычный интерфейс. Деплой: `https://your-habits-calendar.vercel.app/`

## Стек

- **Frontend**: чистый Vanilla JS + HTML + CSS (без фреймворков)
- **Backend/DB**: Supabase (PostgreSQL as a service) — аутентификация, хранилище, real-time синхронизация
- **Библиотеки**: Supabase JS SDK v2 (через CDN)
- **Аналитика**: Яндекс.Метрика
- **Хостинг**: Vercel (static)

## Структура файлов

```
targets/
├── index.html          # Всё приложение — HTML + встроенный CSS + JS (2893 строк)
├── sw.js               # Service Worker (минифицированный, PWA кэширование)
├── privacy.html        # Политика конфиденциальности (генерируется из переменной PRIVACY_HTML)
├── terms.html          # Пользовательское соглашение (генерируется из TERMS_HTML)
├── og-image.png        # Open Graph превью (1.6 MB)
├── robots.txt          # SEO
├── sitemap.xml         # Sitemap
├── google80cdc3169e5fd6a2.html  # Верификация Google
└── yandex_9403e045025f4c4b.html # Верификация Яндекс
```

**Важно:** всё приложение живёт в одном файле `index.html` — разметка, стили (минифицированы), логика.

## Архитектура

### Глобальный стейт (строки 1223–1231)
```javascript
let state = {
  habits: [],        // массив привычек
  completions: {},   // выполнения: { dateKey: { habitId: true } }
  celebrations: {},  // достижения/вехи
  plans: {}          // планы на будущее: { dateKey: { habitId: true } }
};
```

### Хранение данных
- **localStorage** (`habitcal_v4`): офлайн-режим, гостевой режим
- **Supabase**: синхронизация для залогиненных пользователей
- При регистрации/входе локальные данные мигрируют в бэкенд

### Supabase (строки 1151–1165)
```javascript
const SUPABASE_URL = 'https://zwucnogryxntjypbfpwe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_z3z4QbvoZVAoLQJFZZCFAQ_o1guHFAd';
```

### Схема БД
| Таблица | Ключевые поля |
|---------|--------------|
| `profiles` | `id`, `email`, `celebrations`, `has_migrated_local_data` |
| `habits` | `id`, `user_id`, `local_id`, `name`, `emoji`, `color`, `goal_type`, `goal_value`, `sort_order`, `is_archived`, `created_at` |
| `completions` | `habit_id`, `date` (YYYY-MM-DD) |
| `plans` | `habit_id`, `date` |

RPC функция: `delete_user_data()` — удаляет все данные пользователя.

## Функциональность

- Создание/редактирование/удаление привычек (emoji, цвет, цель)
- Три вида календаря: месяц / неделя / год
- Отметка выполнения, планирование будущих дней
- Статистика: стрики, процент выполнения, хитмап, ранги
- Геймификация: достижения, ранги пользователя
- Онбординг для новых пользователей
- Email/password аутентификация через Supabase
- Офлайн-работа через Service Worker

## UI / Адаптивность

- **Десктоп (>1100px)**: три колонки — сайдбар, календарь, панель статистики
- **Планшет (769–1100px)**: две колонки
- **Мобайл (<768px)**: полная ширина, боттомшит модалки, коллапсируемый сайдбар

Тема: тёмная. Акцентный цвет: `#7c6af7` (фиолетовый). Фон: `#0f0f13`.

## Точка входа / запуск

Статические файлы, бэкенда нет — открывается прямо через браузер или деплоится на любой static hosting.

Инициализация приложения (конец `index.html`):
```javascript
renderHeaderAuth();
render();
initAuth().catch(...);
```

## Правовые документы

- Политика конфиденциальности и пользовательское соглашение хранятся как HTML-строки прямо в `index.html` (переменные `PRIVACY_HTML` и `TERMS_HTML`). Дата последнего обновления: 1 апреля 2026.
