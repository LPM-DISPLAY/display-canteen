from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.models.menu import Menu
from backend.app.schemas.menu import MenuCreate, MenuUpdate, MenuItemResponse

router = APIRouter()

def verify_admin(x_admin_secret: Optional[str] = Header(None)):
    if not x_admin_secret or x_admin_secret != settings.ADMIN_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid Admin Secret Key")
    return True

@router.get("", response_model=List[MenuItemResponse])
def get_menus(
    all: bool = Query(False, description="Include unavailable items"),
    db: Session = Depends(get_db)
):
    query = db.query(Menu)
    if not all:
        query = query.filter(Menu.is_available == True)
    
    menus = query.order_by(Menu.created_at.asc()).all()

    # Auto-seed initial Roti Bakar base if completely empty
    if not menus and not all:
        default_roti = Menu(
            name="Roti Bakar DISPLAY",
            description="Roti bakar tebal krispi di luar, empuk di dalam dengan lelehan mentega gurih.",
            price=6000,
            category="Roti Bakar",
            prep_time_minutes=5,
            is_available=True
        )
        db.add(default_roti)
        db.commit()
        db.refresh(default_roti)
        return [default_roti]

    return menus

@router.post("", response_model=MenuItemResponse, status_code=201)
def create_menu(
    payload: MenuCreate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    menu = Menu(**payload.model_dump())
    db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu

@router.put("/{menu_id}", response_model=MenuItemResponse)
def update_menu(
    menu_id: UUID,
    payload: MenuUpdate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan")
    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(menu, key, value)
    
    db.commit()
    db.refresh(menu)
    return menu

@router.delete("/{menu_id}")
def delete_menu(
    menu_id: UUID,
    db: Session = Depends(get_db),
    authorized: bool = Depends(verify_admin)
):
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan")
    
    # Toggle availability or delete
    menu.is_available = not menu.is_available
    db.commit()
    return {"success": True, "is_available": menu.is_available}
