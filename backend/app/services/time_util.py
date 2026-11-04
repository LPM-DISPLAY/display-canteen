from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from typing import Optional

WIB_TZ = ZoneInfo("Asia/Jakarta")

def now_wib() -> datetime:
    """Return current datetime localized to Asia/Jakarta (WIB)."""
    return datetime.now(WIB_TZ)

def format_datetime_wib(dt: Optional[datetime], include_seconds: bool = False) -> str:
    """Format a datetime object into WIB time string.
    
    Example: '14:30 WIB' or '2026-11-05 14:30:00 WIB'
    """
    if not dt:
        return "-"
    
    # If naive datetime, assume UTC
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    
    # Convert to Asia/Jakarta
    local_dt = dt.astimezone(WIB_TZ)
    
    if include_seconds:
        return local_dt.strftime("%Y-%m-%d %H:%M:%S WIB")
    return local_dt.strftime("%H:%M WIB")
