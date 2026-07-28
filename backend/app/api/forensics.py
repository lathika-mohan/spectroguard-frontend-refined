from fastapi import APIRouter
from app.schemas.common import SuccessResponse
from app.services import forensic_service

router = APIRouter(prefix="/forensics", tags=["Forensics"])

@router.get("/{id}", response_model=SuccessResponse)
def get_forensic_package(id: str):
    data = forensic_service.get_forensic_package(id)
    return SuccessResponse(success=True, meta=None, data=data)
