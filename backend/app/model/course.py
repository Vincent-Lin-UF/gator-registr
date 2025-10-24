from __future__ import annotations
from pydantic import BaseModel, Field

class Course(BaseModel):
    id: str = Field(..., description="Unique Identifer")
    course_code: str = Field(..., description="Course Code (e.g. COP3503)")
    title: str = Field(..., description="Course Title")
    credits: float = Field(..., ge=0.0, description="# of Credits")