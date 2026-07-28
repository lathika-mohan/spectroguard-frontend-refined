from typing import Optional
from pydantic import BaseModel
from app.core.constants import CameraStatus

class Camera(BaseModel):
    id: str
    name: str
    zone: str
    status: CameraStatus
    lastEvent: Optional[str] = None
    streamSpecs: Optional[str] = None
