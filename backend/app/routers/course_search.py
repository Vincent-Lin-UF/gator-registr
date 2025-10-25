from __future__ import annotations
import json
from typing import Dict, Any, List

from app.util.parse_courses_json import parse_courses_json
from app.model.course import FilterParams, Course, CourseSearchResponse
from app.util.requirement_matchers import RULES, course_fulfills

from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/uf", tags=["uf"])
courses = parse_courses_json("app/data/courses_spring_2026.json")
requirements = [rule["name"] for rule in RULES]


@router.get("/search", response_model=CourseSearchResponse)
def course_search(req: FilterParams = Depends()) -> CourseSearchResponse:
    return_courses: list[Course] = courses
    if req.course_code and req.course_code != "null":
        print("cc")
        return_courses = [course for course in return_courses if course.code == req.course_code.upper()]

    if req.instructor and req.instructor != "null":
        print('i')
        return_courses = [
            course for course in return_courses if req.instructor.lower() in set().union(
                *[{instructor for instructor in section.instructors} for section in course.sections]
            )
        ]

    if req.requirement_satisfied and req.requirement_satisfied != "null":
        print('req')
        return_courses = [
            course for course in return_courses if course_fulfills(course, req.requirement_satisfied)
        ]

    return CourseSearchResponse(courses=return_courses[:20])


@router.get("/all_requirements", response_model=list[str])
def all_requirements() -> list[str]:
    return requirements


class UserRequirementsParams(BaseModel):
    username: str


@router.get("/user_requirements", response_model=list[str])
def user_requirements() -> list[str]:
    with open('app/data/requirements_rules_with_status.json', 'r') as f:
        data = json.load(f)
        return [rule["name"] for rule in data['rules'] if not rule["completed"]]

