const API_URL = "https://campusai-1-hkxa.onrender.com";


// =====================================================
// SMART DISCOVERY
// =====================================================

async function loadOpportunities() {

    const opportunityList =
        document.getElementById("opportunity-list");

    try {

        const skill =
            document.getElementById("skill-filter").value.trim();

        const type =
            document.getElementById("type-filter").value;

        const params = new URLSearchParams();

        if (skill) {
            params.append("skill", skill);
        }

        if (type) {
            params.append("type", type);
        }

        const url =
            `${API_URL}/opportunities?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch opportunities");
        }

        const data = await response.json();

        opportunityList.innerHTML = "";

        if (!data.length) {

            opportunityList.innerHTML =
                "<p>No matching opportunities found.</p>";

            return;
        }

        data.forEach(opportunity => {

            const card =
                document.createElement("div");

            card.className =
                "opportunity-card";

            card.innerHTML = `

                <h3>
                    ${opportunity.title}
                </h3>

                <p class="type">
                    ${opportunity.type}
                </p>

                <p>
                    ${opportunity.description}
                </p>

                <div class="skills">

                    ${opportunity.skills.map(skill => `
                        <span>${skill}</span>
                    `).join("")}

                </div>

                <p class="deadline">
                    Deadline: ${opportunity.deadline}
                </p>

                <button>
                    View Opportunity
                </button>

            `;

            opportunityList.appendChild(card);

        });

    } catch (error) {

        opportunityList.innerHTML =
            "<p>Unable to load opportunities.</p>";

        console.error(
            "Backend connection failed:",
            error
        );
    }
}


// =====================================================
// DEADLINE TRACKER
// =====================================================

async function loadDeadlines() {

    const deadlineList =
        document.getElementById("deadline-list");

    try {

        const response =
            await fetch(
                `${API_URL}/opportunities/deadlines`
            );

        if (!response.ok) {
            throw new Error("Failed to fetch deadlines");
        }

        const data =
            await response.json();

        deadlineList.innerHTML = "";

        if (!data.length) {

            deadlineList.innerHTML =
                "<p>No upcoming deadlines.</p>";

            return;
        }

        data.forEach(opportunity => {

            const card =
                document.createElement("div");

            card.className =
                "deadline-card";

            card.innerHTML = `

                <h3>
                    ${opportunity.title}
                </h3>

                <p>
                    Type: ${opportunity.type}
                </p>

                <p>
                    Deadline: ${opportunity.deadline}
                </p>

                <p class="days-left">
                    ${opportunity.days_left} days left
                </p>

            `;

            deadlineList.appendChild(card);

        });

    } catch (error) {

        deadlineList.innerHTML =
            "<p>Unable to load deadlines.</p>";

        console.error(
            "Deadline loading failed:",
            error
        );
    }
}


// =====================================================
// STUDENT AI RECOMMENDATIONS
// =====================================================

async function loadRecommendations() {

    const recommendationList =
        document.getElementById(
            "recommendation-list"
        );

    const studentIdInput =
        document.getElementById(
            "student-id-input"
        );

    const studentId =
        studentIdInput.value.trim();


    if (!studentId) {

        recommendationList.innerHTML = `

            <div class="recommendation-card">

                <h3>⚠️ Student ID Required</h3>

                <p>
                    Please enter your Student ID first.
                </p>

            </div>

        `;

        return;
    }


    try {

        recommendationList.innerHTML = `

            <div class="recommendation-card">

                <p>
                    🤖 CampusAI is finding opportunities
                    for you...
                </p>

            </div>

        `;


        const response =
            await fetch(
                `${API_URL}/students/${studentId}/recommendations`
            );


        if (!response.ok) {

            if (response.status === 404) {

                throw new Error(
                    "Student not found. Please check your Student ID."
                );

            }

            throw new Error(
                "Failed to fetch recommendations."
            );
        }


        const data =
            await response.json();


        recommendationList.innerHTML = "";


        // =================================================
        // NO SKILLS
        // =================================================

        if (
            !data.skills ||
            (
                typeof data.skills === "string" &&
                data.skills.trim() === ""
            )
        ) {

            recommendationList.innerHTML = `

                <div class="recommendation-card">

                    <h3>
                        ⚠️ No Skills Found
                    </h3>

                    <p>
                        Student:
                        <strong>${data.student}</strong>
                    </p>

                    <p>
                        No skills are saved in this
                        student's profile.
                    </p>

                    <p>
                        Please add skills such as
                        Python, AI, FastAPI, JavaScript etc.
                    </p>

                </div>

            `;

            return;
        }


        // =================================================
        // STUDENT INFORMATION
        // =================================================

        const studentInfo =
            document.createElement("div");

        studentInfo.className =
            "student-recommendation-info";

        studentInfo.innerHTML = `

            <h3>
                🎯 Recommendations for
                ${data.student}
            </h3>

            <p>
                <strong>Your Skills:</strong>
                ${data.skills}
            </p>

        `;

        recommendationList.appendChild(
            studentInfo
        );


        // =================================================
        // NO RECOMMENDATIONS
        // =================================================

        if (
            !data.recommendations ||
            data.recommendations.length === 0
        ) {

            const noResult =
                document.createElement("div");

            noResult.className =
                "recommendation-card";

            noResult.innerHTML = `

                <h3>
                    No Matching Opportunities
                </h3>

                <p>
                    We couldn't find opportunities
                    matching your current skills.
                </p>

                <p>
                    Try adding more skills to your
                    student profile.
                </p>

            `;

            recommendationList.appendChild(
                noResult
            );

            return;
        }


        // =================================================
        // RECOMMENDATION CARDS
        // =================================================

        data.recommendations.forEach(
            opportunity => {

                const card =
                    document.createElement("div");

                card.className =
                    "recommendation-card";


                card.innerHTML = `

                    <h3>
                        ${opportunity.title}
                    </h3>

                    <p>
                        Type:
                        ${opportunity.type}
                    </p>

                    <p>
                        ${opportunity.description}
                    </p>

                    <div class="skills">

                        ${opportunity.skills.map(skill => `
                            <span>${skill}</span>
                        `).join("")}

                    </div>

                    <p class="match-score">

                        🎯
                        ${opportunity.match_count}
                        skill(s) matched

                    </p>

                    <p>

                        <strong>
                            Matched Skills:
                        </strong>

                        ${opportunity.matched_skills.join(", ")}

                    </p>

                    <p>

                        Deadline:
                        ${opportunity.deadline}

                    </p>

                `;


                recommendationList.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        recommendationList.innerHTML = `

            <div class="recommendation-card">

                <h3>
                    ⚠️ Unable to Load Recommendations
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

        console.error(
            "Recommendation loading failed:",
            error
        );
    }
}


// =====================================================
// APPLICATION HELPER
// =====================================================

async function getApplicationHelp() {

    const opportunity =
        document
            .getElementById(
                "opportunity-input"
            )
            .value
            .trim();


    const skills =
        document
            .getElementById(
                "application-skills"
            )
            .value
            .trim();


    const result =
        document.getElementById(
            "application-result"
        );


    if (!opportunity || !skills) {

        result.innerHTML =
            "<p>Please enter opportunity name and your skills.</p>";

        return;
    }


    try {

        const params =
            new URLSearchParams();

        params.append(
            "opportunity",
            opportunity
        );

        params.append(
            "skills",
            skills
        );


        const response =
            await fetch(
                `${API_URL}/application-helper?${params.toString()}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to get application help"
            );

        }


        const data =
            await response.json();


        result.innerHTML = `

            <div class="application-result-card">

                <h3>
                    ${data.opportunity}
                </h3>

                <p>
                    <strong>Your Skills:</strong>
                    ${data.skills.join(", ")}
                </p>

                <h4>
                    Preparation Guide
                </h4>

                <ul>

                    ${data.preparation.map(item => `
                        <li>${item}</li>
                    `).join("")}

                </ul>

            </div>

        `;


    } catch (error) {

        result.innerHTML =
            "<p>Unable to load application guide.</p>";

        console.error(
            "Application Helper error:",
            error
        );
    }
}


// =====================================================
// OPPORTUNITY INSIGHTS
// =====================================================

async function loadInsights() {

    const insightsResult =
        document.getElementById(
            "insights-result"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/opportunities/insights`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch insights"
            );

        }


        const data =
            await response.json();


        let typesHTML = "";


        for (
            const type in data.opportunities_by_type
        ) {

            typesHTML += `

                <p>

                    <strong>
                        ${type}:
                    </strong>

                    ${data.opportunities_by_type[type]}

                </p>

            `;

        }


        let skillsHTML = "";


        for (
            const skill in data.popular_skills
        ) {

            skillsHTML += `

                <span class="insight-skill">

                    ${skill}
                    (${data.popular_skills[skill]})

                </span>

            `;

        }


        insightsResult.innerHTML = `

            <div class="insights-card">

                <div class="total-opportunities">

                    <h3>
                        ${data.total_opportunities}
                    </h3>

                    <p>
                        Total Opportunities
                    </p>

                </div>


                <div class="insight-block">

                    <h3>
                        Opportunities by Type
                    </h3>

                    ${typesHTML}

                </div>


                <div class="insight-block">

                    <h3>
                        Popular Skills
                    </h3>

                    <div class="insight-skills">

                        ${skillsHTML}

                    </div>

                </div>

            </div>

        `;


    } catch (error) {

        insightsResult.innerHTML =
            "<p>Unable to load insights.</p>";

        console.error(
            "Insights loading failed:",
            error
        );
    }
}


// =====================================================
// AI ASSISTANT
// =====================================================

async function askAI() {

    const question =
        document
            .getElementById(
                "ai-question"
            )
            .value
            .trim();


    const responseBox =
        document.getElementById(
            "ai-response"
        );


    if (!question) {

        responseBox.innerHTML =
            "<p>Please enter a question first.</p>";

        return;
    }


    responseBox.innerHTML =
        "<p>🤔 CampusAI is thinking...</p>";


    try {

        const response =
            await fetch(
                `${API_URL}/ai/ask?question=${encodeURIComponent(question)}`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            throw new Error(
                "AI request failed"
            );

        }


        const data =
            await response.json();


        responseBox.innerHTML = `

            <p>
                ${data.answer}
            </p>

        `;


    } catch (error) {

        responseBox.innerHTML =
            "<p>Unable to connect to CampusAI AI.</p>";

        console.error(
            "AI Assistant error:",
            error
        );
    }
}


// =====================================================
// INITIAL LOAD
// =====================================================

loadOpportunities();
loadDeadlines();
loadInsights();
// ===============================
// STUDENT PROFILE
// ===============================

async function saveStudent() {

    const studentId =
        document.getElementById("student-id").value.trim();

    const name =
        document.getElementById("student-name").value.trim();

    const college =
        document.getElementById("student-college").value.trim();

    const skills =
        document.getElementById("student-skills").value.trim();

    const result =
        document.getElementById("profile-result");


    if (!name || !college) {

        result.innerHTML =
            "<p>Please enter your name and college.</p>";

        return;
    }


    try {

        const studentData = {
            name: name,
            college: college,
            skills: skills || null
        };


        let response;


        // UPDATE EXISTING STUDENT
        if (studentId) {

            response = await fetch(
                `${API_URL}/students/${studentId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(studentData)
                }
            );

        }

        // CREATE NEW STUDENT
        else {

            response = await fetch(
                `${API_URL}/students`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(studentData)
                }
            );

        }


        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("Student ID not found");
            }

            throw new Error(
                "Failed to save student profile"
            );
        }


        const data =
            await response.json();


        result.innerHTML = `
            <div class="profile-result-card">

                <h3>✅ Profile Saved</h3>

                <p>
                    <strong>Student ID:</strong>
                    ${data.id}
                </p>

                <p>
                    <strong>Name:</strong>
                    ${data.name}
                </p>

                <p>
                    <strong>College:</strong>
                    ${data.college}
                </p>

                <p>
                    <strong>Skills:</strong>
                    ${data.skills || "No skills added"}
                </p>

                <p>
                    Use Student ID
                    <strong>${data.id}</strong>
                    in the Recommendations section.
                </p>

            </div>
        `;


        // Automatically put ID into recommendation box

        const recommendationInput =
            document.getElementById("student-id-input");

        if (recommendationInput) {
            recommendationInput.value = data.id;
        }


    } catch (error) {

        result.innerHTML = `
            <div class="profile-result-card">

                <h3>⚠️ Error</h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

        console.error(
            "Student profile error:",
            error
        );
    }
}