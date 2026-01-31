"""Application configuration."""
import os

# === Security ===
SECRET_KEY: str = os.getenv(
    "SECRET_KEY",
    "change-me-in-production-use-long-random-string"
)
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")  # 24h
)

# === Database ===
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "sqlite:////app/db.sqlite3"
)

# SQLite needs check_same_thread=False
CONNECT_ARGS = (
    {"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

# === CORS ===
CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,"
    "http://localhost:8000,"
    "https://front-task--progress-tracker-mvp-arrive.fin1.bult.app"
).split(",")
