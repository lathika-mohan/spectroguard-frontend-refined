from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.common import SuccessResponse, ResponseMeta
from app.services import camera_service

router = APIRouter(prefix="/cameras", tags=["Cameras"])

meta_stub = ResponseMeta(
    correlationId="str-corr-018f3c7a-1b9e",
    traceId="str-trc-9e2d4f5c-8f3c",
    timestamp="2026-07-28T13:42:00.000Z"
)

@router.get("", response_model=SuccessResponse)
def get_cameras(
    limit: int = Query(50, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    status: Optional[str] = None
):
    data = camera_service.get_cameras(limit, offset, status)
    return SuccessResponse(success=True, meta=meta_stub, data=data)

@router.get("/{id}", response_model=SuccessResponse)
def get_camera(id: str):
    data = camera_service.get_camera(id)
    meta_specific = ResponseMeta(
        correlationId="str-corr-018f3c7a-1b9e",
        traceId="str-trc-9e2d4f5c-8f3c",
        timestamp="2026-07-28T13:42:05.000Z"
    )
    return SuccessResponse(success=True, meta=meta_specific, data=data)
