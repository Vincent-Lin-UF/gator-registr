from __future__ import annotations
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
import httpx

from app.config.settings import UF_SOC_BASE_URL, UF_TERM

router = APIRouter(prefix="/uf", tags=["uf"])

_ALLOWED_KEYS = {
    "ai","auf","category","class-num","course-code","course-title","cred-srch","credits",
    "day-f","day-m","day-r","day-s","day-t","day-w","dept","eep","fitsSchedule","ge",
    "ge-b","ge-c","ge-d","ge-h","ge-m","ge-n","ge-p","ge-s","instructor","last-control-number",
    "level-max","level-min","no-open-seats","online-a","online-c","online-h","online-p",
    "period-b","period-e","prog-level","qst-1","qst-2","qst-3","quest","term","wr-2000",
    "wr-4000","wr-6000","writing","var-cred","hons",
}

@router.get("/schedule", response_class=JSONResponse)
def course_schedule(
    course_title: str | None = Query(default=None, alias="course-title"),
    term: str | None = Query(default=None, description="UF term code (e.g., 2258)"),
    **extra: str,
) -> JSONResponse:
    params: Dict[str, str] = {}
    
    params["term"] = (term or UF_TERM)
    
    if course_title is not None:
        params["course-title"] = course_title
        
    for k, v in extra.items():
        if k in _ALLOWED_KEYS and isinstance(v, str):
            params[k] = v
            
    params.setdefault("ai", "false")
    params.setdefault("auf", "false")
    params.setdefault("quest", "false")
    params.setdefault("fitsSchedule", "false")
    params.setdefault("no-open-seats", "false")
    params.setdefault("last-control-number", "0")

    try:
        with httpx.Client(timeout=15.0) as client:
            upstream = client.get(UF_SOC_BASE_URL, params=params)
            upstream.raise_for_status()
            data: Any = upstream.json()

            return JSONResponse(content=data, status_code=upstream.status_code)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"UF upstream error: {exc!s}")