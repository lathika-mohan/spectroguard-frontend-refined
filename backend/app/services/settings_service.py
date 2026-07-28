from typing import List
from app.schemas.settings import Setting

def get_settings() -> List[Setting]:
    return [
        Setting(
            name="Spatial Variance Threshold",
            value="0.72",
            zone="Exterior"
        )
    ]
