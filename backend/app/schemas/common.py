from typing import TypeVar, Generic, Optional, List, Any
from pydantic import BaseModel

T = TypeVar("T")

class ResponseMeta(BaseModel):
    correlationId: str
    traceId: str
    timestamp: str

class Pagination(BaseModel):
    totalRecords: int
    limit: int
    offset: int
    hasNext: bool
    hasPrev: bool

class ErrorDetail(BaseModel):
    field: Optional[str] = None
    location: Optional[str] = None
    issue: str
    message: str

class ErrorPayload(BaseModel):
    code: str
    message: str
    details: List[ErrorDetail]

class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    meta: Optional[ResponseMeta] = None
    pagination: Optional[Pagination] = None
    data: T

class ErrorResponse(BaseModel):
    success: bool = False
    meta: ResponseMeta
    error: ErrorPayload
