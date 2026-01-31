"""Database connection and session."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from backend.app.config import DATABASE_URL, CONNECT_ARGS

engine = create_engine(DATABASE_URL, connect_args=CONNECT_ARGS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency: yield DB session and close after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables (for MVP; use Alembic in production)."""
    from backend.app.models import user, task, task_history  # noqa: F401
    Base.metadata.create_all(bind=engine)
