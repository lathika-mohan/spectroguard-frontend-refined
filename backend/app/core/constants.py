from enum import Enum

class CameraStatus(str, Enum):
    LIVE = "live"
    WARN = "warn"
    ALARM = "alarm"
    OFFLINE = "offline"

class AlertSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class PathType(str, Enum):
    FAST = "fast"
    DEEP = "deep"

class JobStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class WorkerStatus(str, Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    RESTARTING = "restarting"
    OFFLINE = "offline"
