from typing import Optional
from pydantic import BaseModel
from app.core.constants import JobStatus

class UploadJob(BaseModel):
    jobId: str
    status: JobStatus
    progress: float
    etaSeconds: Optional[int] = None
