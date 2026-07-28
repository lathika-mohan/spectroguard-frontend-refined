from typing import Optional
from fastapi import APIRouter
from app.schemas.common import SuccessResponse, ResponseMeta
from app.services import alert_service

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=SuccessResponse)
def get_alerts(acknowledged: Optional[bool] = None):
    data = alert_service.get_alerts(acknowledged)
    return SuccessResponse(success=True, meta=None, data=data)

@router.post("/{id}/acknowledge", response_model=SuccessResponse)
def acknowledge_alert(id: str):
    alert_service.acknowledge_alert(id)
    meta_ack = ResponseMeta(
        correlationId="str-corr-018f3c7a-1b9e",
        traceId="str-trc-9e2d4f5c-8f3c",
        timestamp="2026-07-28T13:42:20.000Z"
    )
    return SuccessResponse(success=True, meta=meta_ack, data={"ok": True})
