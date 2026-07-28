from fastapi import APIRouter
from app.schemas.common import SuccessResponse
from app.services import settings_service

router = APIRouter(prefix="/settings", tags=["Configuration"])

@router.get("", response_model=SuccessResponse)
def get_settings():
    data = settings_service.get_settings()
    return SuccessResponse(success=True, meta=None, data=data)
