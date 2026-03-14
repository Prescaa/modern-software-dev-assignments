from __future__ import annotations

import re
import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Category(Base, TimestampMixin):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    color: Mapped[str] = mapped_column(String(32), nullable=False, default="#6366f1")

    notes: Mapped[List["Note"]] = relationship(
        back_populates="category",
        cascade="all,delete-orphan",
        passive_deletes=True,
    )


class Note(Base, TimestampMixin):
    __tablename__ = "notes"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    category_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
    )

    category: Mapped[Optional[Category]] = relationship(back_populates="notes")


# Pydantic schemas --------------------------------------------------------------------


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=255)
    color: str = Field("#6366f1", max_length=32)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    color: Optional[str] = Field(None, max_length=32)


class CategoryRead(CategoryBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NoteBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    category_id: Optional[str] = None


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    category_id: Optional[str] = None


class NoteRead(NoteBase):
    id: str
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryRead] = None
    action_items: List[str] = []

    class Config:
        from_attributes = True


class ActionItemSummary(BaseModel):
    note_id: str
    note_title: str
    content: str


# Action items engine -----------------------------------------------------------------

ACTION_ITEM_PATTERN = re.compile(
    r"^(?:\s*)(TODO:.*|.*!\s*)$",
    flags=re.MULTILINE,
)


def extract_action_items_from_text(text: str) -> List[str]:
    """
    Extract action items from note content.

    Rules:
    - Any line starting with 'TODO:' (case-sensitive)
    - Any line ending with '!' (after optional whitespace)
    """
    if not text:
        return []

    items: List[str] = []
    for match in ACTION_ITEM_PATTERN.finditer(text):
        line = match.group(0).strip()
        if line:
            items.append(line)
    return items

