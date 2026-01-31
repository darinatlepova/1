"""Application configuration."""
import os

SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production-use-long-random-string")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24h

DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "sqlite:///./app.db",
)
# SQLite needs check_same_thread=False
CONNECT_ARGS = {} if "sqlite" not in DATABASE_URL else {"check_same_thread": False}

CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
