import json
import httpx
import time
from typing import Any, List, Set

UF_API_URL = "https://one.uf.edu/apix/soc/schedule"
TERM = "2258"  # Fall 2025
OUTPUT_FILE = "courses.json"

def fetch_all_courses() -> List[Any]:
    all_data = []
    seen_courses: Set[str] = set()
    control_number = 0
    increment = 500
    max_control = 35000
    empty_streak = 0
    max_empty_streak = 10

    print("Starting comprehensive fetch of all UF courses...")
    print(f"Term: {TERM}")
    print(f"Strategy: Increment by {increment}, max control: {max_control}\n")

    with httpx.Client(timeout=60.0) as client:
        while control_number <= max_control and empty_streak < max_empty_streak:
            params = {
                "term": TERM,
                "last-control-number": str(control_number),
            }

            try:
                response = client.get(UF_API_URL, params=params)
                response.raise_for_status()
                data = response.json()

                if not data or len(data) == 0:
                    empty_streak += 1
                    print(f"[{control_number:6d}] Empty response (streak: {empty_streak})")
                else:
                    empty_streak = 0

                    new_courses = 0
                    for dept in data:
                        for course in dept.get("COURSES", []):
                            course_id = course.get("courseId", "")
                            if course_id and course_id not in seen_courses:
                                seen_courses.add(course_id)
                                new_courses += 1

                    all_data.extend(data)

                    dept_codes = set()
                    for dept in data:
                        for course in dept.get("COURSES", []):
                            code = course.get("code", "")[:3]
                            if code:
                                dept_codes.add(code)

                    print(f"[{control_number:6d}] Found {len(data)} dept(s), {new_courses} new courses. Depts: {', '.join(sorted(dept_codes))}")

                control_number += increment

                time.sleep(0.5)

            except httpx.HTTPError as e:
                print(f"[{control_number:6d}] HTTP error: {e}")
                break
            except Exception as e:
                print(f"[{control_number:6d}] Error: {e}")
                import traceback
                traceback.print_exc()
                break

    print(f"\nScan complete! Reached control number: {control_number}")
    print(f"Total unique courses found: {len(seen_courses)}")
    return all_data

def save_to_json(data: List[Any], filename: str) -> None:
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"\nData saved to {filename}")

def print_summary(data: List[Any]) -> None:
    unique_courses = {}
    for dept in data:
        for course in dept.get("COURSES", []):
            course_id = course.get("courseId")
            if course_id:
                unique_courses[course_id] = course

    total_sections = sum(
        len(course.get("sections", []))
        for dept in data
        for course in dept.get("COURSES", [])
    )

    courses_with_prereqs = sum(
        1 for course in unique_courses.values()
        if course.get("prerequisites", "").strip() and
           course.get("prerequisites") not in ["None.", ""]
    )

    dept_codes = set()
    for dept in data:
        for course in dept.get("COURSES", []):
            code = course.get("code", "")[:3]
            if code and code != "000":
                dept_codes.add(code)

    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Unique department codes: {len(dept_codes)}")
    print(f"Unique courses: {len(unique_courses)}")
    print(f"Total sections: {total_sections}")
    print(f"Courses with prerequisites: {courses_with_prereqs}")
    print(f"\nSample departments: {', '.join(sorted(list(dept_codes))[:20])}")
    if len(dept_codes) > 20:
        print(f"... and {len(dept_codes) - 20} more")
    print("="*70)

if __name__ == "__main__":
    courses_data = fetch_all_courses()
    save_to_json(courses_data, OUTPUT_FILE)
    print_summary(courses_data)
    print(f"\nAll done! Course data saved to {OUTPUT_FILE}")
