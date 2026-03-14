from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Annotated, List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

# Pastikan file models.py kamu ada di folder yang sama
from models import (
    ActionItemSummary,
    Base,
    Category,
    CategoryCreate,
    CategoryRead,
    CategoryUpdate,
    Note,
    NoteCreate,
    NoteRead,
    NoteUpdate,
    extract_action_items_from_text,
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./dev_control_center.db",
)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db() -> None:
    Base.metadata.create_all(bind=engine)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DBSessionDep = Annotated[Session, Depends(get_db)]

class HealthResponse(BaseModel):
    status: str

@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="Developer Control Center API",
    version="1.0.0",
    lifespan=lifespan,
)

# --- PERBAIKAN CORS DI SINI ---
# Kita izinkan semua origin lokal agar tidak bentrok antara localhost vs 127.0.0.1
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:5174", # Kadang Vite pindah port kalau 5173 dipakai
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ganti ke ["*"] sementara untuk memastikan koneksi jalan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------------

@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok")

# --- Category endpoints ---

@app.get("/categories", response_model=List[CategoryRead])
def list_categories(db: DBSessionDep) -> List[CategoryRead]:
    categories = db.scalars(
        select(Category).order_by(Category.name.asc())
    ).all()
    return categories

@app.post("/categories", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryCreate, db: DBSessionDep) -> CategoryRead:
    category = Category(
        name=payload.name.strip(),
        color=payload.color.strip() or "#6366f1",
    )
    db.add(category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists.",
        )
    db.refresh(category)
    return category

@app.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: str, db: DBSessionDep) -> None:
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")
    
    # Set category_id jadi null di semua note yang pakai kategori ini
    notes = db.scalars(select(Note).where(Note.category_id == category_id)).all()
    for note in notes:
        note.category_id = None
        
    db.delete(category)
    db.commit()

# --- Note endpoints ---

def _note_to_read_model(note: Note) -> NoteRead:
    action_items = extract_action_items_from_text(note.content or "")
    category = note.category
    category_read = CategoryRead.model_validate(category) if category else None
    return NoteRead(
        id=note.id,
        title=note.title,
        content=note.content,
        category_id=note.category_id,
        created_at=note.created_at,
        updated_at=note.updated_at,
        category=category_read,
        action_items=action_items,
    )

@app.get("/notes", response_model=List[NoteRead])
def list_notes(db: DBSessionDep) -> List[NoteRead]:
    notes = db.scalars(
        select(Note).order_by(Note.updated_at.desc())
    ).all()
    return [_note_to_read_model(n) for n in notes]

@app.post("/notes", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def create_note(payload: NoteCreate, db: DBSessionDep) -> NoteRead:
    note = Note(
        title=payload.title.strip(),
        content=payload.content.strip(),
        category_id=payload.category_id,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return _note_to_read_model(note)

@app.put("/notes/{note_id}", response_model=NoteRead)
def update_note(note_id: str, payload: NoteUpdate, db: DBSessionDep) -> NoteRead:
    note = db.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found.")

    if payload.title is not None:
        note.title = payload.title.strip()
    if payload.content is not None:
        note.content = payload.content.strip()
    if payload.category_id is not None:
        note.category_id = payload.category_id if payload.category_id != "" else None

    db.commit()
    db.refresh(note)
    return _note_to_read_model(note)

@app.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: str, db: DBSessionDep) -> None:
    note = db.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found.")
    db.delete(note)
    db.commit()

@app.get("/action-items", response_model=List[ActionItemSummary])
def list_action_items(db: DBSessionDep) -> List[ActionItemSummary]:
    notes = db.scalars(select(Note)).all()
    summaries: List[ActionItemSummary] = []
    for note in notes:
        items = extract_action_items_from_text(note.content or "")
        for item in items:
            summaries.append(
                ActionItemSummary(
                    note_id=note.id,
                    note_title=note.title,
                    content=item,
                )
            )
    return summaries

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)