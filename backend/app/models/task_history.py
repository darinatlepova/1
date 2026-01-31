"""Task history model for change tracking."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class TaskHistoryChangeType(str, enum.Enum):
    STATUS = "status"
    PROGRESS = "progress"


class TaskHistory(Base):
    __tablename__ = "task_history"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    change_type = Column(SQLEnum(TaskHistoryChangeType), nullable=False)
    old_value = Column(String(255), nullable=True)
    new_value = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="history")
