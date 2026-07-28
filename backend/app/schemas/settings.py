from typing import Optional
from pydantic import BaseModel

class Setting(BaseModel):
    name: str
    value: str
    zone: Optional[str] = None
