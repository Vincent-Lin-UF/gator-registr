from __future__ import annotations
from dataclasses import dataclass, asdict
from typing import List, Optional, Any, Dict
from pathlib import Path
import json
import pickle




def parse_courses_json(path: str | Path) -> List[Course]:
    p = Path(path)
    raw = json.loads(p.read_text(encoding="utf-8"))
    courses_list = raw[0].get("COURSES", []) if isinstance(raw, list) else raw.get("COURSES", [])

    out: List[Course] = []
    for c in courses_list:
        sections: List[Section] = []
        for s in (c.get("sections") or []):
            meetings = [
                Meeting(
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
                for mt in (s.get("meetTimes") or [])
            ]

            instructors = [ins.get("name") for ins in (s.get("instructors") or [])]

            sections.append(Section(
                number=s.get("number"),
                classNumber=s.get("classNumber"),
                display=s.get("display"),
                credits=s.get("credits"),
                credits_min=s.get("credits_min"),
                credits_max=s.get("credits_max"),
                deptCode=s.get("deptCode"),
                deptName=s.get("deptName"),
                acadCareer=s.get("acadCareer"),
                gradBasis=s.get("gradBasis"),
                sectWeb=s.get("sectWeb"),
                finalExam=s.get("finalExam"),
                startDate=s.get("startDate"),
                endDate=s.get("endDate"),
                dropaddDeadline=s.get("dropaddDeadline"),
                openSeats=s.get("openSeats"),
                courseFee=s.get("courseFee"),
                grWriting=s.get("grWriting"),
                EEP=s.get("EEP"),
                lateFlag=s.get("lateFlag"),
                isAICourse=s.get("isAICourse"),
                isAffordable=s.get("isAffordable"),
                note=s.get("note"),
                dNote=s.get("dNote"),
                rotateTitle=s.get("rotateTitle"),
                instructors=instructors,
                meetings=meetings
            ))

        out.append(Course(
            code=c.get("code"),
            courseId=c.get("courseId"),
            name=c.get("name"),
            description=c.get("description"),
            prerequisites=c.get("prerequisites"),
            openSeats=c.get("openSeats"),
            termInd=c.get("termInd"),
            sections=sections
        ))
    return out


