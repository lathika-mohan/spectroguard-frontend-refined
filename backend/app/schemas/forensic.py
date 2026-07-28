from typing import List, Optional
from pydantic import BaseModel
from app.core.constants import PathType

class ShapFactor(BaseModel):
    factor: str
    weight: float

class HeatmapCell(BaseModel):
    x: int
    y: int
    weight: float

class ForensicPackage(BaseModel):
    id: str
    alertId: str
    cameraName: str
    pathType: PathType
    decisionPath: List[str]
    shapFactors: List[ShapFactor]
    heatmapCells: Optional[List[HeatmapCell]] = None
    signedHash: str
    signedAt: str
    operator: str
    ntpOffsetMs: int
