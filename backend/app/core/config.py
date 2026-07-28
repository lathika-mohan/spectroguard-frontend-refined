import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SpectraGuard Core"
    API_VERSION: str = "v1"
    DEBUG: bool = True
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
