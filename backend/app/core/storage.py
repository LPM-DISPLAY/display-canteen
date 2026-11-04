import os
import uuid
from typing import Optional
from backend.app.core.config import settings

# Create local uploads dir if not exists
LOCAL_UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../uploads"))
os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)

class StorageClient:
    def __init__(self):
        self.supabase = None
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                from supabase import create_client
                self.supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception as e:
                print(f"[Storage] Warning: Failed to initialize Supabase client: {e}. Fallback to local uploads.")

    def upload_file(self, file_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        """
        Uploads file to Supabase Storage if configured; otherwise saves to local directory.
        Returns the accessible URL for the image.
        """
        file_ext = os.path.splitext(filename)[1]
        unique_name = f"{uuid.uuid4()}{file_ext}"

        if self.supabase:
            try:
                bucket = settings.STORAGE_BUCKET
                res = self.supabase.storage.from_(bucket).upload(
                    path=unique_name,
                    file=file_bytes,
                    file_options={"content-type": content_type}
                )
                # Obtain public URL
                public_url = self.supabase.storage.from_(bucket).get_public_url(unique_name)
                return public_url
            except Exception as e:
                print(f"[Storage] Supabase upload failed ({e}), using local filesystem fallback.")

        # Local fallback
        local_path = os.path.join(LOCAL_UPLOAD_DIR, unique_name)
        with open(local_path, "wb") as f:
            f.write(file_bytes)
        
        # Return local static file route
        return f"/uploads/{unique_name}"

storage_client = StorageClient()
