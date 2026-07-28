from fastapi import APIRouter, UploadFile, File
from app.schemas.common import SuccessResponse
from app.services import upload_service

router = APIRouter(prefix="/upload", tags=["Ingestion"])

@router.post("", response_model=SuccessResponse, status_code=202)
async def upload_video(file: UploadFile = File(...)):
    data = upload_service.create_upload_job()
    return SuccessResponse(success=True, meta=None, data=data)

@router.get("/{jobId}", response_model=SuccessResponse)
def get_upload_status(jobId: str):
    data = upload_service.get_upload_job(jobId)
    return SuccessResponse(success=True, meta=None, data=data)
