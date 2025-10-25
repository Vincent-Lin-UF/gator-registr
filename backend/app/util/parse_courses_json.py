from __future__ import annotations
from typing import List, Optional
from pathlib import Path
import json

from pydantic import ValidationError
from app.model.course import Course, Meeting, Section


def parse_courses_json(path: str | Path) -> List[Course]:
    def _safe_build(model, **kwargs):
        try:
            return model(**kwargs)
        except ValidationError:
            print('invalid', kwargs)
            return None

    p = Path(path)
    raw = json.loads(p.read_text(encoding="utf-8"))
    courses_list = raw[0].get("COURSES", []) if isinstance(raw, list) else raw.get("COURSES", [])

    out: List[Course] = []
    for c in courses_list:
        # Build sections, skipping any invalid meetings/sections
        built_sections: List[Section] = []
        for s in (c.get("sections") or []):
            # Meetings
            built_meetings: List[Meeting] = []
            for mt in (s.get("meetTimes") or []):
                m = _safe_build(
                    Meeting,
                    meetNo=mt.get("meetNo"),
                    meetDays=list(mt.get("meetDays") or []),
                    meetTimeBegin=mt.get("meetTimeBegin"),
                    meetTimeEnd=mt.get("meetTimeEnd"),
                    meetPeriodBegin=mt.get("meetPeriodBegin"),
                    meetPeriodEnd=mt.get("meetPeriodEnd"),
                    meetBuilding=mt.get("meetBuilding"),
                    meetBldgCode=mt.get("meetBldgCode"),
                    meetRoom=mt.get("meetRoom"),
                )
                if m is not None:
                    built_meetings.append(m)

            instructors = [ins.get("name") for ins in (s.get("instructors") or [])]

            sec = _safe_build(
                Section,
                number=s.get("number"),
                classNumber=s.get("classNumber"),
                display=s.get("display"),
                credits=s.get("credits"),
                credits_min=s.get("credits_min"),
                credits_max=s.get("credits_max"),
                deptCode=None if s.get("deptCode") is None else str(s.get("deptCode")),
                deptName=s.get("deptName"),
                acadCareer=s.get("acadCareer"),
                gradBasis=s.get("gradBasis"),
                sectWeb=s.get("sectWeb"),
                finalExam=s.get("finalExam"),
                startDate=s.get("startDate"),
                endDate=s.get("endDate"),
                dropaddDeadline=s.get("dropaddDeadline"),
                openSeats=s.get("openSeats"),
                courseFee=None if s.get("courseFee") is None else str(s.get("courseFee")),
                EEP=s.get("EEP"),
                lateFlag=s.get("lateFlag"),
                isAICourse=s.get("isAICourse"),
                isAffordable=s.get("isAffordable"),
                note=s.get("note"),
                dNote=s.get("dNote"),
                rotateTitle=s.get("rotateTitle"),
                instructors=instructors,
                meetings=built_meetings,
            )
            if sec is not None:
                built_sections.append(sec)

        course = _safe_build(
            Course,
            code=c.get("code"),
            courseId=c.get("courseId"),
            name=c.get("name"),
            description=c.get("description"),
            prerequisites=c.get("prerequisites"),
            openSeats=c.get("openSeats"),
            termInd=c.get("termInd"),
            sections=built_sections,
        )
        if course is not None:
            out.append(course)

    return out
