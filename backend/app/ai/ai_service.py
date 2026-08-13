def generate_response(question: str):

    question = question.lower().strip()

    # Greeting
    if any(word in question for word in ["hello", "hi", "hey"]):
        return (
            "Hello! 👋 I'm CampusAI, your AI Campus Opportunity Assistant. "
            "You can ask me about hackathons, internships, scholarships, "
            "Python, AI, projects and more."
        )

    # CampusAI
    if "campusai" in question:
        return (
            "CampusAI is an AI-powered platform that helps college students "
            "discover hackathons, internships, scholarships and competitions. "
            "It also provides deadline tracking, personalized recommendations "
            "and application guidance."
        )

    # Hackathon
    if "hackathon" in question:
        return (
            "Hackathons are great opportunities to build real-world projects "
            "and showcase your skills. For a hackathon, focus on a strong "
            "problem statement, a working prototype, a good presentation and "
            "clear teamwork."
        )

    # Internship
    if "internship" in question:
        return (
            "For internships, focus on building projects, improving your "
            "technical skills and maintaining a strong resume and GitHub "
            "profile. Python, JavaScript, SQL and AI-related skills can be "
            "useful depending on the role."
        )

    # Python
    if "python" in question:
        return (
            "Python is a popular programming language used in web development, "
            "automation, AI, machine learning and data science. For students, "
            "a good path is Python basics → OOP → APIs → projects → AI/ML."
        )

    # AI / ML
    if "ai" in question or "machine learning" in question:
        return (
            "To start with AI/ML, learn Python first, then NumPy, Pandas and "
            "basic mathematics. After that, learn machine learning algorithms "
            "and build practical projects."
        )

    # Projects
    if "project" in question:
        return (
            "A good student project should solve a real problem. Start with "
            "the problem statement, define your users, build a simple MVP, "
            "connect the backend and database, and then add AI features."
        )

    # Skills
    if "skill" in question:
        return (
            "Some useful skills for CSE students are Python, JavaScript, SQL, "
            "Git/GitHub, APIs, databases and problem solving. Choose skills "
            "according to the career path you want to pursue."
        )

    # Default
    return (
        "I'm CampusAI 🤖. I can help you with hackathons, internships, "
        "scholarships, competitions, Python, AI/ML, projects and career "
        "preparation. Try asking me a specific question!"
    )