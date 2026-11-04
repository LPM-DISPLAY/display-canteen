import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "DISPLAY Canteen"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"
    
    # Supabase Cloud Storage
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    STORAGE_BUCKET: str = "payment-proofs"
    
    # Cloudflare Tunnel
    TUNNEL_TOKEN: str = ""
    
    # Security
    ADMIN_SECRET_KEY: str = "displaycanteen2026"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env")),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
