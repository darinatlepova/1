# Task / Progress Tracker (MVP)

Веб-приложение для отслеживания задач и прогресса с регистрацией, авторизацией (JWT), CRUD задач и историей изменений.

## Стек

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** FastAPI, SQLAlchemy, JWT (python-jose), passlib (bcrypt)
- **БД:** SQLite (по умолчанию), возможна замена на PostgreSQL

## Структура проекта

```
├── backend/          # FastAPI API
├── frontend/         # React SPA
├── ARCHITECTURE.md   # Описание архитектуры и моделей
└── README.md
```

## Запуск локально

### Требования

- Python 3.11+
- Node.js 18+
- npm или yarn

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
# Опционально: скопировать .env.example в .env и задать SECRET_KEY, DATABASE_URL

python run.py
```

API будет доступен по адресу: **http://localhost:8000**

- Документация: http://localhost:8000/docs  
- Health: http://localhost:8000/health  

### 2. Frontend

В отдельном терминале:

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется по адресу: **http://localhost:5173**

Запросы к API проксируются с `/api` на `http://localhost:8000` (настроено в `vite.config.js`).

### Переменные окружения (backend)

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `SECRET_KEY` | Секрет для JWT | (задать в production) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Время жизни токена (мин) | 1440 (24 ч) |
| `DATABASE_URL` | URL БД | `sqlite:///./app.db` |
| `CORS_ORIGINS` | Разрешённые origins через запятую | `http://localhost:5173` |

Пример `.env`:

```env
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Деплой (bult.ai и др.)

### Backend

- Соберите образ из `backend/` (см. `backend/Dockerfile`).
- Задайте переменные: `SECRET_KEY`, при необходимости `DATABASE_URL` (PostgreSQL) и `CORS_ORIGINS` (URL фронтенда).
- На bult.ai: создайте проект, выберите источник (GitHub или Docker image), укажите порт **8000**, задайте переменные окружения.

### Frontend

- Соберите статику: `cd frontend && npm run build`.
- Разместите содержимое `frontend/dist` на любом статическом хостинге или отдавайте через backend (FastAPI `StaticFiles` на путь `/` и `FileResponse` для SPA).
- В production задайте в приложении базовый URL API (если не через тот же домен) или настройте прокси/nginx.

### Одним сервисом (опционально)

Можно раздавать собранный frontend из FastAPI: положить `frontend/dist` в `backend/static`, подключить `StaticFiles` и отдавать `index.html` для всех неизвестных путей. Тогда один контейнер обслуживает и API, и SPA.

## Функциональность

- Регистрация и вход по email/паролю, JWT
- Создание, редактирование и удаление задач (название, описание, статус, прогресс 0–100%)
- Статусы: «Не начато», «В процессе», «Готово»
- История изменений статуса и прогресса по каждой задаче
- Защищённые маршруты: доступ к задачам только для авторизованного пользователя

## Лицензия

MVP, учебный проект.
