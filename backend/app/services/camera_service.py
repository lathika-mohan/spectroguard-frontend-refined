from typing import List, Optional
from app.schemas.camera import Camera
from app.core.constants import CameraStatus

def get_cameras(limit: int = 50, offset: int = 0, status: Optional[str] = None) -> List[Camera]:
    return [
        Camera(
            id="cam-05",
            name="Perimeter West",
            zone="Exterior",
            status=CameraStatus.WARN,
            lastEvent="Motion detected (cleared)"
        )
    ]

def get_camera(camera_id: str) -> Camera:
    return Camera(
        id="cam-05",
        name="Perimeter West",
        zone="Exterior",
        status=CameraStatus.WARN,
        lastEvent="Motion detected (cleared)",
        streamSpecs="3840x2160 . 24fps"
    )
