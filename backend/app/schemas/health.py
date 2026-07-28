from pydantic import BaseModel
from app.core.constants import WorkerStatus

class WorkerNode(BaseModel):
    id: str
    name: str
    role: str
    status: WorkerStatus
    uptime: str
    restarts24h: int
    queueDepth: int
