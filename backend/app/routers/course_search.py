from __future__ import annotations
from typing import Dict, Any, List

from app.util.parse_courses_json import parse_courses_json
from app.model.course import FilterParams, Course, CourseSearchResponse
from app.util.requirement_matchers import RULES

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/uf", tags=["uf"])
courses = parse_courses_json("../data/courses.json")
requirements = [rule["name"] for rule in RULES]


@router.get("/search", response_model=CourseSearchResponse)
def course_search(req: FilterParams) -> CourseSearchResponse:
    return_courses: list[Course] = courses
    if req.course_code:
        return_courses = [course for course in return_courses if course.code == req.course_code]

    if req.instructor:
        return_courses = [
            course for course in return_courses if req.instructor in set().union(
                *[{instructor for instructor in section.instructors} for section in course.sections]
            )
        ]

    if req.requirement_satisfied:
        pass


    return CourseSearchResponse(courses=return_courses)


@router.get("/all_requirements", response_model=list[str])
def all_requirements() -> list[str]:
    return requirements


class UserRequirementsParams(BaseModel):
    username: str


@router.get("/user_requirements", response_class=JSONResponse)
def user_requirements(req: UserRequirementsParams) -> JSONResponse:
    pass
