"""Database connection and session."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from backend.app.config import DATABASE_URL, CONNECT_ARGS

engine = create_engine(
    DATABASE_URL,
    connect_args=CONNECT_ARGS,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Create all tables.
    IMPORTANT: imports models so SQLAlchemy knows them
    """
    from backend.app.models.user import User
    from backend.app.models.task import Task
    from backend.app.models.task_history import TaskHistory

    Base.metadata.create_all(bind=engine)
