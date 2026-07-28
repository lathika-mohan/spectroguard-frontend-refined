from datetime import datetime
import uuid
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api import cameras, alerts, forensics, upload, auth, health
from app.api import settings as settings_api

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all Contract API Routers under /api/v1
app.include_router(cameras.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(forensics.router, prefix="/api/v1")
app.include_router(upload.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")
app.include_router(settings_api.router, prefix="/api/v1")

def create_meta():
    return {
        "correlationId": f"str-corr-{uuid.uuid4().hex[:8]}",
        "traceId": f"str-trc-{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# Centralized Error Handlers mapping to BACKEND_API_SPEC Section 11
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    details = []
    for err in exc.errors():
        details.append({
            "field": str(err.get("loc", [""])[-1]),
            "location": str(err.get("loc", [""])[0]),
            "issue": err.get("type", "VALIDATION_ERROR"),
            "message": err.get("msg", "")
        })
    
    content = {
        "success": False,
        "meta": create_meta(),
        "error": {
            "code": "VALIDATION_FAILED",
            "message": "Input validation checks failed.",
            "details": details
        }
    }
    return JSONResponse(status_code=400, content=content)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    code_map = {
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        503: "MODEL_BUSY",
        504: "INFERENCE_TIMEOUT"
    }
    machine_code = code_map.get(exc.status_code, "HTTP_EXCEPTION")
    
    content = {
        "success": False,
        "meta": create_meta(),
        "error": {
            "code": machine_code,
            "message": str(exc.detail),
            "details": []
        }
    }
    return JSONResponse(status_code=exc.status_code, content=content)

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    content = {
        "success": False,
        "meta": create_meta(),
        "error": {
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred.",
            "details": []
        }
    }
    return JSONResponse(status_code=500, content=content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
