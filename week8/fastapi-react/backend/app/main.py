from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import engine
from .models import Base
from .routers import categories as categories_router
from .routers import notes as notes_router

app = FastAPI(title="Developer Control Center", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path("data").mkdir(parents=True, exist_ok=True)


@app.on_event("startup")
def startup_event() -> None:
    Base.metadata.create_all(bind=engine)


app.include_router(notes_router.router)
app.include_router(categories_router.router)
