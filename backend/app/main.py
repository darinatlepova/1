"""FastAPI application entry point."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import CORS_ORIGINS
from backend.app.database import init_db
from backend.app.api import auth, tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Task / Progress Tracker API",
    description="MVP API for tasks and progress tracking with auth",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "API is running"}


