from app.schemas.upload import UploadJob
from app.core.constants import JobStatus

def create_upload_job() -> UploadJob:
    return UploadJob(
        jobId="job-bc394a71-f9e2",
        status=JobStatus.QUEUED,
        progress=0.0,
        etaSeconds=45
    )

def get_upload_job(job_id: str) -> UploadJob:
    return UploadJob(
        jobId="job-bc394a71-f9e2",
        status=JobStatus.PROCESSING,
        progress=68.4,
        etaSeconds=12
    )
