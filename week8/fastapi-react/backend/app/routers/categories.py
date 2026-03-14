from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Category
from ..schemas import CategoryCreate, CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)) -> list[CategoryRead]:
    rows = db.execute(select(Category).order_by(Category.name)).scalars().all()
    return [CategoryRead.model_validate(row) for row in rows]


@router.post("/", response_model=CategoryRead, status_code=201)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)) -> CategoryRead:
    existing = db.execute(
        select(Category).where(Category.name == payload.name)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Category already exists")

    category = Category(name=payload.name)
    db.add(category)
    db.flush()
    db.refresh(category)
    return CategoryRead.model_validate(category)


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)) -> CategoryRead:
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return CategoryRead.model_validate(category)


@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int, payload: CategoryCreate, db: Session = Depends(get_db)
) -> CategoryRead:
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category.name = payload.name
    db.add(category)
    db.flush()
    db.refresh(category)
    return CategoryRead.model_validate(category)


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)) -> None:
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.flush()
