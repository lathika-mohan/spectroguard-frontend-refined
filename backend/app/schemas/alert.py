from pydantic import BaseModel
from app.core.constants import AlertSeverity, PathType

class Alert(BaseModel):
    id: str
    cameraId: str
    cameraName: str
    label: str
    severity: AlertSeverity
    confidence: float
    timestamp: str
    acknowledged: bool
    pathType: PathType
