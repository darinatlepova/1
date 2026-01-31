"""Application configuration."""
import os

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "change-me-in-production-use-long-random-string"
)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:////app/db.sqlite3"
)

# SQLite needs check_same_thread=False
CONNECT_ARGS = (
    {"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173"
).split(",")
