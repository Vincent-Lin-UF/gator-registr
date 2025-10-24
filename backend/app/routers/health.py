from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["health"])

class Health(BaseModel):
    status: str
    
@router.get("/health", response_model=Health)
def healthcheck() -> Health:
    return Health(status="ok")