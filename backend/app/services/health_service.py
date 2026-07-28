from typing import List
from app.schemas.health import WorkerNode
from app.core.constants import WorkerStatus

def get_system_health() -> List[WorkerNode]:
    return [
        WorkerNode(
            id="node-01",
            name="Edge Node Alpha",
            role="Ingest & FFT",
            status=WorkerStatus.HEALTHY,
            uptime="14d 6h",
            restarts24h=0,
            queueDepth=2
        )
    ]
