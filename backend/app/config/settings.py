from __future__ import annotations

import os
from typing import List, Final

class Settings:
    
    def __init__(self) -> None:
        raw: str = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000")
        self.FRONTEND_ORIGINS: List[str] = [o.strip() for o in raw.split(",") if o.strip()]
        
settings = Settings()

UF_SOC_BASE_URL: Final[str] = "https://one.uf.edu/apix/soc/schedule"
UF_TERM: Final[str] = "2258"