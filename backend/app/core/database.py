import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.app.core.config import settings

def create_db_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    connect_args = {}
    if "sqlite" in db_url:
        connect_args = {"check_same_thread": False}

    try:
        eng = create_engine(
            db_url,
            pool_pre_ping=True,
            connect_args=connect_args
        )
        # Test connection eagerly
        with eng.connect() as conn:
            pass
        return eng
    except Exception as e:
        print(f"[Database] Could not connect to {db_url}: {e}")
        print("[Database] Using SQLite fallback (canteen_dev.db) for local offline execution.")
        sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../canteen_dev.db"))
        return create_engine(f"sqlite:///{sqlite_path}", connect_args={"check_same_thread": False})

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
