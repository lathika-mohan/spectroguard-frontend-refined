from typing import List, Optional
from app.schemas.alert import Alert
from app.core.constants import AlertSeverity, PathType

def get_alerts(acknowledged: Optional[bool] = None) -> List[Alert]:
    return [
        Alert(
            id="evt-88213",
            cameraId="cam-02",
            cameraName="Server Room A",
            label="Frame Dropout Anomaly",
            severity=AlertSeverity.CRITICAL,
            confidence=0.9412,
            timestamp="12:04:11",
            acknowledged=False,
            pathType=PathType.FAST
        )
    ]

def acknowledge_alert(alert_id: str) -> bool:
    return True
