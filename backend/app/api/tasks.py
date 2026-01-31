"""Task CRUD and history endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.task import Task, TaskStatus as TaskStatusEnum
from app.models.task_history import TaskHistory, TaskHistoryChangeType
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.schemas.task_history import TaskHistoryResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


def _record_history(db: Session, task_id: int, change_type: TaskHistoryChangeType, old_value: str | None, new_value: str):
    entry = TaskHistory(
        task_id=task_id,
        change_type=change_type,
        old_value=old_value,
        new_value=new_value,
    )
    db.add(entry)


def _task_to_response(task: Task) -> TaskResponse:
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        status=task.status.value,
        progress=task.progress,
        created_at=task.created_at,
        updated_at=task.updated_at,
    )


@router.get("", response_model=list[TaskResponse])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks = db.query(Task).filter(Task.user_id == current_user.id).order_by(Task.updated_at.desc()).all()
    return [_task_to_response(t) for t in tasks]


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = Task(
        user_id=current_user.id,
        title=data.title,
        description=data.description or None,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return _task_to_response(task)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return _task_to_response(task)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description

    if data.status is not None:
        new_status = TaskStatusEnum(data.status)
        if task.status != new_status:
            _record_history(db, task.id, TaskHistoryChangeType.STATUS, task.status.value, new_status.value)
            task.status = new_status

    if data.progress is not None:
        if task.progress != data.progress:
            _record_history(db, task.id, TaskHistoryChangeType.PROGRESS, str(task.progress), str(data.progress))
            task.progress = data.progress

    db.commit()
    db.refresh(task)
    return _task_to_response(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    db.delete(task)
    db.commit()
    return None


@router.get("/{task_id}/history", response_model=list[TaskHistoryResponse])
def get_task_history(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return [
        TaskHistoryResponse(
            id=h.id,
            task_id=h.task_id,
            change_type=h.change_type.value,
            old_value=h.old_value,
            new_value=h.new_value,
            changed_at=h.changed_at,
        )
        for h in task.history
    ]
