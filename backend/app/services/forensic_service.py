from app.schemas.forensic import ForensicPackage, ShapFactor, HeatmapCell
from app.core.constants import PathType

def get_forensic_package(alert_id: str) -> ForensicPackage:
    return ForensicPackage(
        id="pkg-88213",
        alertId="evt-88213",
        cameraName="Server Room A",
        pathType=PathType.FAST,
        decisionPath=[
            "Frame Grabber Ingest",
            "Spatial Variance Scan",
            "Log Spectral Energy Drop"
        ],
        shapFactors=[
            ShapFactor(factor="laplacian_variance", weight=0.42)
        ],
        heatmapCells=[
            HeatmapCell(x=4, y=7, weight=0.89)
        ],
        signedHash="0x8f3c7a1b9e2d4f5c",
        signedAt="2026-07-28T12:04:15Z",
        operator="op-4471",
        ntpOffsetMs=12
    )
