import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.core.storage import LOCAL_UPLOAD_DIR
import backend.app.models.menu
import backend.app.models.order

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables automatically on startup if using direct database connection
    try:
        Base.metadata.create_all(bind=engine)
        print("[Database] Schema synchronized successfully.")
    except Exception as e:
        print(f"[Database] Warning: Could not auto-create tables: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="DISPLAY Canteen REST API - Roti Bakar Customizer, QRIS Verification, and Admin Dashboard",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve local uploads fallback
if os.path.exists(LOCAL_UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=LOCAL_UPLOAD_DIR), name="uploads")

@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}

# Include routers
from backend.app.api.menus import router as menus_router
from backend.app.api.orders import router as orders_router
from backend.app.api.reports import router as reports_router

app.include_router(menus_router, prefix="/api/menus", tags=["Menus"])
app.include_router(orders_router, prefix="/api/orders", tags=["Orders"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])
