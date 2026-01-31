"""Task schemas."""
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Literal

TaskStatus = Literal["not_started", "in_progress", "done"]


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None
    progress: int | None = Field(None, ge=0, le=100)


class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    status: str
    progress: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
