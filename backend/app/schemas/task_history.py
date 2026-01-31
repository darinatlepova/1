"""Task history schemas."""
from datetime import datetime
from pydantic import BaseModel
from typing import Literal

TaskHistoryChangeType = Literal["status", "progress"]


class TaskHistoryResponse(BaseModel):
    id: int
    task_id: int
    change_type: str
    old_value: str | None
    new_value: str
    changed_at: datetime

    class Config:
        from_attributes = True
