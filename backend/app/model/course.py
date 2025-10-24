from __future__ import annotations
from typing import Optional, List
from pydantic import BaseModel, Field

class Course(BaseModel):
    id: str = Field(..., description="Unique Identifer")
    course_code: str = Field(..., description="Course Code (e.g. COP3503)")
    title: str = Field(..., description="Course Title")
    credits: float = Field(..., ge=0.0, description="# of Credits")



class Meeting(BaseModel):
    meetNo: Optional[int] = None
    meetDays: List[str] = None
    meetTimeBegin: Optional[str] = None
    meetTimeEnd: Optional[str] = None
    meetPeriodBegin: Optional[int] = None
    meetPeriodEnd: Optional[int] = None
    meetBuilding: Optional[str] = None
    meetBldgCode: Optional[str] = None
    meetRoom: Optional[str] = None

@dataclass
class Section:
    number: Optional[str] = None
    classNumber: Optional[int] = None
    display: Optional[str] = None
    credits: Optional[float] = None
    credits_min: Optional[float] = None
    credits_max: Optional[float] = None
    deptCode: Optional[str] = None
    deptName: Optional[str] = None
    acadCareer: Optional[str] = None
    gradBasis: Optional[str] = None
    sectWeb: Optional[str] = None
    finalExam: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    dropaddDeadline: Optional[str] = None
    openSeats: Optional[int] = None
    courseFee: Optional[str] = None
    grWriting: Optional[bool] = None
    EEP: Optional[bool] = None
    lateFlag: Optional[bool] = None
    isAICourse: Optional[bool] = None
    isAffordable: Optional[bool] = None
    note: Optional[str] = None
    dNote: Optional[str] = None
    rotateTitle: Optional[str] = None
    instructors: List[str] = None
    meetings: List[Meeting] = None

@dataclass
class Course:
    code: Optional[str] = None
    courseId: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    prerequisites: Optional[str] = None
    openSeats: Optional[int] = None
    termInd: Optional[str] = None
    sections: List[Section] = None
