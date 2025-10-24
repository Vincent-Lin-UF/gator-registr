from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, course_proxy, course_search
from app.config.settings import settings

def create_app() -> FastAPI:
    api = FastAPI(title="New One.UF")
    
    api.add_middleware(
        CORSMiddleware,
        allow_origins=settings.FRONTEND_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    api.include_router(health.router, prefix="/v1")
    api.include_router(course_proxy.router, prefix="/v1")
    api.include_router(course_search.router, prefix="/v1")
    return api

app = create_app()