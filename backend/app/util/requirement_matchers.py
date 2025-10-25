from __future__ import annotations
from typing import List, Optional, Set, Dict, Any, Tuple
from pydantic import BaseModel
import json, re
from pathlib import Path

from app.model.course import Course, Section, Meeting

COURSE_CODE_RE = re.compile(r'^(?P<prefix>[A-Z]{3})\s*(?P<number>\d{4}[A-Z]?)$')

def parse_course_code(code: Optional[str]):
    if not code:
        return None, None, None
    m = COURSE_CODE_RE.match(code.replace('\xa0',' ').strip())
    if not m:
        return None, None, None
    prefix = m.group('prefix')
    fullnum = m.group('number')
    num_int = int(re.match(r'(\d{4})', fullnum).group(1))
    return prefix, num_int, fullnum

def _is_exact_any(code: str, codes: List[str], exclude: Optional[List[str]] = None) -> bool:
    c = code.strip().upper().replace('\xa0',' ')
    if exclude and c in set(exclude):
        return False
    return c in set(codes)

def _prefix_level_at_least(code: str, prefixes: List[str], min_level: int, exclude: Optional[List[str]] = None) -> bool:
    pfx, num, _ = parse_course_code(code)
    if not pfx or num is None:
        return False
    if exclude and code.strip().upper() in set(exclude):
        return False
    return pfx in set(prefixes) and num >= min_level

def _prefix_level_between(code: str, prefix: str, min_level: int, max_level: int, exclude: Optional[List[str]] = None) -> bool:
    pfx, num, _ = parse_course_code(code)
    if not pfx or num is None:
        return False
    if exclude and code.strip().upper() in set(exclude):
        return False
    return pfx == prefix and (min_level <= num <= max_level)

def _any_course(_: str) -> bool:
    return True

RULES: Dict[str, Dict[str, Any]] = json.loads(Path("app/data/requirements_rules.json").read_text())["rules"]

def requirement_names() -> List[str]:
    return [r["name"] for r in RULES]

def get_rule(name: str) -> Dict[str, Any]:
    for r in RULES:
        if r["name"] == name:
            return r
    raise KeyError(name)

def course_fulfills(course: Course, requirement_name: str) -> bool:
    code = (course.code or "").upper()
    r = get_rule(requirement_name)
    if r["type"] == "exact_any":
        return _is_exact_any(code, r["codes"], r.get("exclude"))
    elif r["type"] == "patterns":
        pats = r.get("patterns", [])
        for p in pats:
            kind = p["kind"]
            if kind == "exact_any":
                if _is_exact_any(code, p["codes"], p.get("exclude")):
                    return True
            elif kind == "prefix_level_at_least":
                if _prefix_level_at_least(code, p["prefixes"], p["min_level"], p.get("exclude")):
                    return True
            elif kind == "prefix_level_between":
                if _prefix_level_between(code, p["prefix"], p["min_level"], p["max_level"], p.get("exclude")):
                    return True
        return False
    elif r["type"] == "any_course":
        return True
    else:
        # Unknown rule type – be conservative
        return False

def all_requirements_course_fulfills(course: Course) -> List[str]:
    return [r["name"] for r in RULES if course_fulfills(course, r["name"])]
