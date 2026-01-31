# Архитектура Task / Progress Tracker MVP

## Обзор

Веб-приложение для отслеживания задач и прогресса с регистрацией, авторизацией (JWT), CRUD задач и историей изменений.

---

## Структура проекта

```
task-tracker/
├── backend/                    # FastAPI REST API
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # Точка входа, CORS, роутеры
│   │   ├── config.py           # Настройки (SECRET_KEY, DB_URL)
│   │   ├── database.py         # Подключение БД, сессии
│   │   ├── models/             # SQLAlchemy модели
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   └── task_history.py
│   │   ├── schemas/            # Pydantic схемы (request/response)
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   └── task_history.py
│   │   ├── api/                # Эндпоинты
│   │   │   ├── __init__.py
│   │   │   ├── auth.py         # register, login
│   │   │   └── tasks.py        # CRUD задач + история
│   │   └── core/               # Безопасность и зависимости
│   │       ├── __init__.py
│   │       ├── security.py     # хеш паролей, JWT
│   │       └── dependencies.py # get_current_user
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py                  # Запуск uvicorn
│
├── frontend/                   # React (Vite) SPA
│   ├── src/
│   │   ├── components/         # Переиспользуемые компоненты
│   │   ├── pages/              # Страницы (Login, Register, Tasks, TaskDetail)
│   │   ├── services/           # API-клиент (axios)
│   │   ├── context/            # AuthContext
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── ARCHITECTURE.md             # Этот файл
└── README.md                   # Инструкция по запуску и деплою
```

---

## Модели данных

### User (пользователь)

| Поле             | Тип        | Описание                    |
|------------------|------------|-----------------------------|
| id               | Integer PK | Идентификатор               |
| email            | String     | Уникальный email            |
| hashed_password  | String     | Хеш пароля (bcrypt)         |
| created_at       | DateTime   | Дата регистрации            |

### Task (задача)

| Поле       | Тип        | Описание                                      |
|------------|------------|-----------------------------------------------|
| id         | Integer PK | Идентификатор                                 |
| user_id    | Integer FK | Владелец задачи → User.id                     |
| title      | String     | Название                                      |
| description| Text       | Описание (nullable)                           |
| status     | Enum       | "not_started" \| "in_progress" \| "done"      |
| progress   | Integer    | 0–100                                         |
| created_at | DateTime   | Дата создания                                 |
| updated_at | DateTime   | Дата последнего обновления                    |

### TaskHistory (история изменений задачи)

| Поле       | Тип        | Описание                                      |
|------------|------------|-----------------------------------------------|
| id         | Integer PK | Идентификатор                                 |
| task_id    | Integer FK | Задача → Task.id                              |
| change_type| Enum       | "status" \| "progress"                        |
| old_value  | String     | Старое значение (для отображения)             |
| new_value  | String     | Новое значение                                |
| changed_at | DateTime   | Время изменения                               |

---

## API (REST)

### Аутентификация

| Метод | Путь                    | Описание           | Доступ   |
|-------|-------------------------|--------------------|----------|
| POST  | /api/auth/register      | Регистрация        | Публичный|
| POST  | /api/auth/login         | Вход (возврат JWT) | Публичный|

### Задачи

| Метод | Путь                    | Описание              | Доступ   |
|-------|-------------------------|-----------------------|----------|
| GET   | /api/tasks              | Список задач юзера    | JWT      |
| POST  | /api/tasks              | Создать задачу        | JWT      |
| GET   | /api/tasks/{id}         | Одна задача           | JWT      |
| PUT   | /api/tasks/{id}         | Обновить задачу       | JWT      |
| DELETE| /api/tasks/{id}         | Удалить задачу        | JWT      |
| GET   | /api/tasks/{id}/history | История изменений     | JWT      |

Авторизация: заголовок `Authorization: Bearer <token>`.

---

## Безопасность

- Пароли: хеширование через **passlib** (bcrypt).
- Сессии: **JWT** (access token), срок жизни настраивается (например 24 ч).
- Защищённые маршруты: зависимость `get_current_user` проверяет JWT и возвращает пользователя или 401.

---

## Frontend

- **React** + **Vite**, маршрутизация **React Router**.
- **AuthContext**: хранение токена и пользователя, проверка авторизации.
- Защищённые маршруты: редирект на логин, если нет токена.
- Запросы к API через **axios** с подстановкой `Authorization: Bearer <token>`.

---

## База данных

- **SQLite** для MVP (файл `backend/app.db`).
- Для продакшена можно переключиться на PostgreSQL через переменную окружения `DATABASE_URL`.
- **SQLAlchemy** ORM, миграции через `create_all` в старте приложения (для MVP).

---

## Деплой (bult.ai)

- Backend и frontend разделены: backend как FastAPI-сервис, frontend как статика или отдельный сервис.
- Переменные окружения: `SECRET_KEY`, `DATABASE_URL` (при необходимости), `CORS_ORIGINS`.
- README и конфиги подготовлены для запуска локально и на bult.ai.
