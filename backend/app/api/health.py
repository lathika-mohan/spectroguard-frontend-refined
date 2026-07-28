from fastapi import APIRouter
from app.schemas.common import SuccessResponse
from app.services import health_service

router = APIRouter(prefix="/system", tags=["Infrastructure"])

@router.get("/health", response_model=SuccessResponse)
def get_health():
    data = health_service.get_system_health()
    return SuccessResponse(success=True, meta=None, data=data)
