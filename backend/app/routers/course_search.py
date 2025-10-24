from __future__ import annotations
from typing import Dict, Any

from app.util.parse_courses_json import parse_courses_json

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/uf", tags=["uf"])
courses = parse_courses_json("../data/courses.json")
print(courses)

class FilterParams(BaseModel):
    requirement_satisfied: str | None
    course_code: str | None
    instructor: str | None


@router.get("/search", response_class=JSONResponse)
def course_search(req: FilterParams) -> JSONResponse:
    if req.course_code:
        pass


@router.get("/all_requirements", response_class=JSONResponse)
def all_requirements() -> JSONResponse:
    pass


class UserRequirementsParams(BaseModel):
    username: str


@router.get("/user_requirements", response_class=JSONResponse)
def user_requirements(req: UserRequirementsParams) -> JSONResponse:
    pass
