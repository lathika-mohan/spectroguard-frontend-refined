from fastapi import APIRouter
from pydantic import BaseModel
from app.schemas.common import SuccessResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    operatorId: str
    pinCode: str

@router.post("/login")
def login(payload: LoginRequest):
    return {"accessToken": "mock-jwt-token-xyz", "expiresIn": 900}

@router.post("/refresh")
def refresh():
    return {"accessToken": "mock-jwt-token-new-xyz", "expiresIn": 900}

@router.post("/logout")
def logout():
    return {"message": "Session terminated"}

@router.get("/profile")
def profile():
    return {"operatorId": "op-4471", "clearance": "lead", "assignedZones": ["Exterior"]}
