from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .db import init_db, list_notes
from .routers import action_items, notes
from .services.extract import extract_action_items_llm

init_db()

app = FastAPI(title="Action Item Extractor")


class ExtractLLMRequest(BaseModel):
    """Request body for LLM-based extraction that keeps the payload minimal and explicit."""

    text: str


class ExtractLLMResponse(BaseModel):
    """Response shape for LLM extraction, matching the JSON contract used by the frontend."""

    items: List[str]


class Note(BaseModel):
    """API-facing representation of a note row, decoupled from the raw sqlite Row object."""

    id: int
    content: str
    created_at: str


@app.get("/", response_class=HTMLResponse)
def index() -> str:
    html_path = Path(__file__).resolve().parents[1] / "frontend" / "index.html"
    return html_path.read_text(encoding="utf-8")


app.include_router(notes.router)
app.include_router(action_items.router)


@app.post("/extract-llm", response_model=ExtractLLMResponse)
def extract_llm(payload: ExtractLLMRequest) -> ExtractLLMResponse:
    """Expose LLM-based extraction over HTTP while keeping the implementation detail in services."""

    items = extract_action_items_llm(payload.text)
    return ExtractLLMResponse(items=items)


@app.get("/notes", response_model=List[Note])
def list_all_notes() -> List[Note]:
    """Provide a simple way for clients to fetch all notes without going through the action-items API."""

    try:
        rows = list_notes()
    except Exception as exc:  # rely on db-layer to wrap sqlite-specific errors
        raise HTTPException(status_code=500, detail="Failed to list notes") from exc

    return [Note(id=r["id"], content=r["content"], created_at=r["created_at"]) for r in rows]


static_dir = Path(__file__).resolve().parents[1] / "frontend"
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
