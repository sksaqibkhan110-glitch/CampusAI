from app.ai.ai_service import generate_response
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date

from app.opportunities import opportunities
from app.database import SessionLocal
from app.models import Student
from app.schemas import StudentCreate, StudentResponse


app = FastAPI(
    title="CampusAI API",
    version="1.0.0"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",

        # Vercel production
        "https://campus-ai-dusky-sigma.vercel.app",

        # Vercel preview domains
        "https://campus-ai-git-main-sksaqibkhan110-glitchs-projects.vercel.app",
        "https://campus-drcdzf8md-sksaqibkhan110-glitchs-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# DATABASE
# =========================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "Welcome to CampusAI 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "Running",
        "server": "CampusAI Backend"
    }


# =========================
# STUDENTS
# =========================

@app.get("/students", response_model=list[StudentResponse])
def students(db: Session = Depends(get_db)):
    return db.query(Student).all()


@app.post("/students", response_model=StudentResponse)
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    new_student = Student(
        name=student.name,
        college=student.college,
        skills=student.skills
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


@app.put("/students/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    existing_student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not existing_student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    existing_student.name = student.name
    existing_student.college = student.college
    existing_student.skills = student.skills

    db.commit()
    db.refresh(existing_student)

    return existing_student


@app.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    db.delete(student)
    db.commit()

    return {
        "message": "Student deleted successfully"
    }


# =========================
# AI
# =========================

@app.post("/ai/ask")
def ask_ai(question: str):
    return {
        "question": question,
        "answer": generate_response(question)
    }


# =========================
# OPPORTUNITIES
# =========================

@app.get("/opportunities")
def get_opportunities(
    skill: str | None = None,
    type: str | None = None
):
    results = opportunities

    if skill:
        results = [
            opportunity
            for opportunity in results
            if skill.lower() in [
                s.lower()
                for s in opportunity["skills"]
            ]
        ]

    if type:
        results = [
            opportunity
            for opportunity in results
            if opportunity["type"].lower() == type.lower()
        ]

    return results


# =========================
# RECOMMENDED OPPORTUNITIES
# =========================

@app.get("/opportunities/recommended")
def recommended_opportunities(skills: str):

    student_skills = [
        skill.strip().lower()
        for skill in skills.split(",")
    ]

    recommendations = []

    for opportunity in opportunities:

        opportunity_skills = [
            skill.lower()
            for skill in opportunity["skills"]
        ]

        matched_skills = [
            skill
            for skill in student_skills
            if skill in opportunity_skills
        ]

        if matched_skills:
            recommendations.append({
                **opportunity,
                "matched_skills": matched_skills,
                "match_count": len(matched_skills)
            })

    recommendations.sort(
        key=lambda x: x["match_count"],
        reverse=True
    )

    return recommendations


# =========================
# DEADLINES
# =========================

@app.get("/opportunities/deadlines")
def upcoming_deadlines():

    today = date.today()

    upcoming = []

    for opportunity in opportunities:

        deadline = date.fromisoformat(
            opportunity["deadline"]
        )

        if deadline >= today:

            days_left = (
                deadline - today
            ).days

            upcoming.append({
                **opportunity,
                "days_left": days_left
            })

    upcoming.sort(
        key=lambda x: x["days_left"]
    )

    return upcoming


# =========================
# APPLICATION HELPER
# =========================

@app.get("/application-helper")
def application_helper(
    opportunity: str,
    skills: str
):

    skill_list = [
        skill.strip()
        for skill in skills.split(",")
    ]

    return {
        "opportunity": opportunity,
        "skills": skill_list,
        "preparation": [
            "Understand the opportunity requirements",
            "Prepare your resume",
            "Highlight relevant projects",
            "Prepare a short introduction",
            "Review your technical skills"
        ]
    }


# =========================
# STUDENT AI RECOMMENDATIONS
# =========================

@app.get("/students/{student_id}/recommendations")
def student_recommendations(
    student_id: int,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    if not student.skills:
        return {
            "student": student.name,
            "skills": [],
            "recommendations": []
        }

    student_skills = [
        skill.strip().lower()
        for skill in student.skills.split(",")
    ]

    recommendations = []

    for opportunity in opportunities:

        opportunity_skills = [
            skill.lower()
            for skill in opportunity["skills"]
        ]

        matched_skills = [
            skill
            for skill in student_skills
            if skill in opportunity_skills
        ]

        if matched_skills:
            recommendations.append({
                **opportunity,
                "matched_skills": matched_skills,
                "match_count": len(matched_skills)
            })

    recommendations.sort(
        key=lambda x: x["match_count"],
        reverse=True
    )

    return {
        "student": student.name,
        "skills": student.skills,
        "recommendations": recommendations
    }


# =========================
# OPPORTUNITY INSIGHTS
# =========================

@app.get("/opportunities/insights")
def opportunity_insights():

    total = len(opportunities)

    types = {}

    for opportunity in opportunities:

        opportunity_type = opportunity["type"]

        types[opportunity_type] = (
            types.get(opportunity_type, 0) + 1
        )

    skills = {}

    for opportunity in opportunities:

        for skill in opportunity["skills"]:

            skill = skill.lower()

            skills[skill] = (
                skills.get(skill, 0) + 1
            )

    return {
        "total_opportunities": total,
        "opportunities_by_type": types,
        "popular_skills": skills
    }