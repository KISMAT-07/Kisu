from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import AsyncSessionLocal
from app.models.content import (
    About,
    Blog,
    Certificate,
    Education,
    Experience,
    Project,
    Service,
    Skill,
    Testimonial,
)
from app.models.user import User
from app.repositories.users import get_user_by_username_or_email


async def create_bootstrap_admin() -> None:
    """Create the first admin from deployment secrets, without changing existing users."""
    email = settings.bootstrap_admin_email
    username = settings.bootstrap_admin_username
    password = settings.bootstrap_admin_password
    if not all((email, username, password)):
        return

    password_length = len(password.encode("utf-8"))
    if not 8 <= password_length <= 72:
        raise RuntimeError("BOOTSTRAP_ADMIN_PASSWORD must be between 8 and 72 bytes.")

    async with AsyncSessionLocal() as session:
        existing_user = await get_user_by_username_or_email(session, username)
        existing_email = await get_user_by_username_or_email(session, email)
        if existing_user or existing_email:
            return

        session.add(
            User(
                email=email,
                username=username,
                hashed_password=hash_password(password),
                is_active=True,
                is_superuser=True,
            )
        )
        try:
            await session.commit()
        except IntegrityError:
            await session.rollback()


DEFAULT_ABOUT = {
    "headline": "Kismat Kanwar Rathod",
    "summary": (
        "B.Tech Computer Science and Engineering student focused on operating systems, "
        "computer architecture, high-performance computing, ML systems, and data analytics."
    ),
    "bio": (
        "Kismat is a Computer Science and Engineering student from Udaipur with hands-on "
        "experience in data analytics, Flutter development, and core CS projects. She has "
        "built a CPU Scheduling Simulator and is interested in long-term research work "
        "that can grow into a final-year project."
    ),
    "resume_url": "/kismat-kanwar-rathod-resume.pdf",
    "location": "Udaipur, Rajasthan, India",
    "email": "kkismatkanwar2007@gmail.com",
    "phone_number": "7851831225",
    "whatsapp_number": "7851831225",
    "github_url": "https://github.com/KISMAT-07",
    "linkedin_url": "https://www.linkedin.com/in/rathorekismat2007",
}

DEFAULT_SKILLS = [
    {"name": "C++", "category": "Programming", "proficiency": 82, "display_order": 1, "is_featured": True},
    {"name": "Python", "category": "Programming", "proficiency": 84, "display_order": 2, "is_featured": True},
    {"name": "Java", "category": "Programming", "proficiency": 78, "display_order": 3, "is_featured": True},
    {"name": "SQL", "category": "Databases", "proficiency": 82, "display_order": 4, "is_featured": True},
    {"name": "Microsoft Excel", "category": "Analytics", "proficiency": 86, "display_order": 5, "is_featured": True},
    {"name": "Power BI", "category": "Analytics", "proficiency": 78, "display_order": 6, "is_featured": True},
    {"name": "MySQL", "category": "Databases", "proficiency": 80, "display_order": 7, "is_featured": False},
    {"name": "Data Structures and Algorithms", "category": "Core CS", "proficiency": 76, "display_order": 8, "is_featured": False},
]

DEFAULT_PROJECTS = [
    {
        "title": "CPU Scheduling Simulator",
        "slug": "cpu-scheduling-simulator",
        "summary": (
            "A web-based simulator for FCFS, SJF, SRTF, Round Robin, Priority, and HRRN "
            "scheduling with metric calculations and Gantt-chart visualization."
        ),
        "description": (
            "Implemented dynamic process input, waiting time, turnaround time, response time, "
            "average scheduling metrics, and visual comparison of scheduling algorithms."
        ),
        "tech_stack": ["Java", "HTML", "CSS", "JavaScript"],
        "display_order": 1,
        "is_featured": True,
        "is_published": True,
    },
    {
        "title": "Operational Data Analysis",
        "slug": "operational-data-analysis",
        "summary": (
            "Cleaned, transformed, and explored structured operational datasets using Excel, "
            "Power Query, Power BI transformations, custom columns, and interactive reporting."
        ),
        "tech_stack": ["Microsoft Excel", "Power Query", "Power BI"],
        "display_order": 2,
        "is_featured": True,
        "is_published": True,
    },
    {
        "title": "Flutter UI Practice",
        "slug": "flutter-ui-practice",
        "summary": (
            "Built Flutter UI layouts and practiced application structure, navigation flow, "
            "debugging, and cross-platform development fundamentals."
        ),
        "tech_stack": ["Flutter", "Dart"],
        "display_order": 3,
        "is_featured": True,
        "is_published": True,
    },
]

DEFAULT_EXPERIENCE = [
    {
        "title": "Data Analytics Intern",
        "company": "Hindustan Zinc Limited",
        "location": "Udaipur, Rajasthan",
        "start_date": "Jun 2026",
        "end_date": "Present",
        "description": (
            "Cleaned and preprocessed structured operational datasets, conducted exploratory "
            "analysis, and used Power Query and Power BI transformations for interactive reporting."
        ),
        "highlights": [
            "Cleaned and preprocessed structured operational datasets using Microsoft Excel",
            "Conducted exploratory analysis on structured operational datasets",
            "Used Power Query and Power BI transformations, custom columns, and interactive reporting",
        ],
        "display_order": 1,
        "is_current": True,
    },
    {
        "title": "Flutter Development Intern",
        "company": "Marvik Academy for Technical Education (MATE)",
        "location": "Udaipur",
        "start_date": "Nov 2024",
        "end_date": "Nov 2024",
        "description": (
            "Assisted with Flutter UI layouts, application structure, navigation flow, debugging, "
            "and cross-platform development basics."
        ),
        "highlights": [
            "Worked on Flutter UI layouts and application structure",
            "Practiced navigation flow, debugging, and development fundamentals",
        ],
        "display_order": 2,
        "is_current": False,
    },
]

DEFAULT_EDUCATION = [
    {
        "degree": "B.Tech",
        "institution": "Institute of Engineering and Technology, Mohanlal Sukhadia University",
        "field_of_study": "Computer Science and Engineering",
        "location": "Udaipur, Rajasthan",
        "start_date": "2023",
        "end_date": "2027",
        "description": "Current CGPA: 7.78/10.",
        "display_order": 1,
    },
    {
        "degree": "Senior Secondary",
        "institution": "Board of Secondary Education, Rajasthan",
        "field_of_study": "Science (PCM)",
        "location": "Rajasthan",
        "start_date": "2023",
        "end_date": "2023",
        "description": "Percentage: 71.40%.",
        "display_order": 2,
    },
    {
        "degree": "Secondary",
        "institution": "Board of Secondary Education, Rajasthan",
        "location": "Rajasthan",
        "start_date": "2021",
        "end_date": "2021",
        "description": "Percentage: 89.00%.",
        "display_order": 3,
    },
]

DEFAULT_CERTIFICATES = [
    {"title": "Programming Fundamentals using Python", "issuer": "Infosys", "issue_date": "May 2026", "display_order": 1},
    {"title": "Smart India Hackathon Participation", "issuer": "HackNRoll", "issue_date": "Sep 2025", "display_order": 2},
    {"title": "Data Analytics Job Simulation", "issuer": "Deloitte", "issue_date": "Jul 2025", "display_order": 3},
    {"title": "Core Java Training", "issuer": "Internshala", "issue_date": "Jun 2025", "description": "Grade B.", "display_order": 4},
    {"title": "SQL for Data Science", "issuer": "Great Learning Academy", "issue_date": "Oct 2024", "display_order": 5},
    {"title": "C Programming", "issuer": "Great Learning Academy", "issue_date": "Oct 2024", "display_order": 6},
]

DEFAULT_BLOGS = [
    {
        "title": "Building a CPU Scheduling Simulator",
        "slug": "building-a-cpu-scheduling-simulator",
        "excerpt": "Notes on comparing process scheduling algorithms through dynamic input, metrics, and visualization.",
        "content": (
            "The simulator explores FCFS, SJF, SRTF, Round Robin, Priority, and HRRN scheduling "
            "by calculating waiting time, turnaround time, response time, and average metrics with "
            "a visual Gantt chart."
        ),
        "tags": ["Operating Systems", "Java", "Visualization"],
        "is_published": True,
    },
    {
        "title": "Learning Data Analytics Through Operations Data",
        "slug": "learning-data-analytics-through-operations-data",
        "excerpt": "A short reflection on cleaning structured datasets and turning them into useful reporting views.",
        "content": (
            "During the data analytics internship, Excel, Power Query, Power BI transformations, "
            "and custom columns helped turn structured operational data into clearer exploratory insights."
        ),
        "tags": ["Data Analytics", "Excel", "Power BI"],
        "is_published": True,
    },
]

DEFAULT_SERVICES = [
    {
        "title": "Data Cleaning and Reporting",
        "slug": "data-cleaning-and-reporting",
        "summary": "Structured data cleanup, exploratory analysis, and practical reporting with Excel, Power Query, and Power BI.",
        "display_order": 1,
        "is_published": True,
    },
    {
        "title": "Core CS Project Development",
        "slug": "core-cs-project-development",
        "summary": "Student research and project work across operating systems, algorithms, DBMS, and web-based visualization.",
        "display_order": 2,
        "is_published": True,
    },
]

DEFAULT_TESTIMONIALS = [
    {
        "name": "Portfolio note",
        "role": "Resume highlight",
        "quote": "Kismat combines core computer science fundamentals with practical analytics, web, and mobile development experience.",
        "display_order": 1,
        "is_published": True,
    }
]


async def table_is_empty(session, model: type) -> bool:
    count = await session.scalar(select(func.count()).select_from(model))
    return count == 0


async def create_default_portfolio_content() -> None:
    """Seed a fresh Kisu database without overwriting content edited in the CMS."""
    async with AsyncSessionLocal() as session:
        if await table_is_empty(session, About):
            session.add(About(**DEFAULT_ABOUT))
        for model, rows in (
            (Skill, DEFAULT_SKILLS),
            (Project, DEFAULT_PROJECTS),
            (Experience, DEFAULT_EXPERIENCE),
            (Education, DEFAULT_EDUCATION),
            (Certificate, DEFAULT_CERTIFICATES),
            (Blog, DEFAULT_BLOGS),
            (Service, DEFAULT_SERVICES),
            (Testimonial, DEFAULT_TESTIMONIALS),
        ):
            if await table_is_empty(session, model):
                session.add_all(model(**row) for row in rows)
        await session.commit()
