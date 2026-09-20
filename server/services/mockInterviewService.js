const {
    generateAIResponse,
} = require("./aiServices");

function createInterviewContext(projectData) {
    const repository = projectData?.repository || {};
    const structure = projectData?.structure || {};
    const analysis = projectData?.analysis || {};

    const importantFiles = Array.isArray(
        projectData?.importantFiles
    )
        ? projectData.importantFiles
        : [];

    return {
        repository: {
            name: repository.name,
            fullName: repository.fullName,
            description: repository.description,
            language: repository.language,
        },

        structure: {
            totalFiles: structure.totalFiles,
            totalFolders: structure.totalFolders,
            files: Array.isArray(structure.files)
                ? structure.files.slice(0, 150)
                : [],
        },

        analysis: {
            languages: analysis.languages || [],
            frameworks: analysis.frameworks || [],
            libraries: analysis.libraries || [],
            frontend: analysis.frontend || [],
            backend: analysis.backend || [],
            database: analysis.database || [],
            projectType: analysis.projectType || "",
            architecture: analysis.architecture || [],
            projectFlow: analysis.projectFlow || [],
            realCodeFlow: analysis.realCodeFlow || [],
        },

        importantFiles: importantFiles
            .slice(0, 20)
            .map((file) => ({
                path: file.path,
                content:
                    typeof file.content === "string"
                        ? file.content.slice(0, 3000)
                        : "",
            })),
    };
}

function cleanAIJson(output) {
    let cleaned = output.trim();

    if (cleaned.startsWith("```")) {
        cleaned = cleaned
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
    }

    return cleaned;
}

async function startMockInterview(projectData) {
    const projectContext =
        createInterviewContext(projectData);

    const prompt = `
You are RepoMentor, an AI mock interviewer for fresher software developers.

Your job is to conduct a realistic project-based technical interview.

The candidate has provided the following GitHub project information.

IMPORTANT RULES:

1. Ask exactly ONE interview question.
2. The question must be based ONLY on the provided project data.
3. Do not invent technologies, features, APIs, databases, or implementation details.
4. Start with a realistic fresher-level project question.
5. Prefer questions that an interviewer could actually ask after seeing this project.
6. The question should encourage the candidate to explain their project.
7. Do not provide the answer.
8. Do not provide hints.
9. Keep the question clear and natural.
10. Avoid asking multiple questions in one question.
11. Do not assume that the candidate personally wrote every part of the repository.
12. If the project information is limited, ask a question that can still be answered from the available information.

Return valid JSON only.

Use exactly this structure:

{
    "question": "",
    "category": "",
    "difficulty": ""
}

Allowed category values:

- Project Introduction
- Tech Stack
- Architecture
- Frontend
- Backend
- Database
- Authentication
- API
- Code Flow
- Problem Solving
- Deployment
- General Project

Allowed difficulty values:

- Easy
- Medium
- Hard

PROJECT CONTEXT:

${JSON.stringify(
    projectContext,
    null,
    2
)}
`;

    const output =
        await generateAIResponse(prompt);

    try {
        const cleanedOutput =
            cleanAIJson(output);

        const result =
            JSON.parse(cleanedOutput);

        if (
            !result.question ||
            !result.category ||
            !result.difficulty
        ) {
            throw new Error(
                "Incomplete mock interview question"
            );
        }

        return result;
    } catch (error) {
        console.error(
            "Invalid mock interview JSON:",
            output
        );

        throw new Error(
            "AI returned an invalid interview question."
        );
    }
}

async function evaluateMockAnswer(
    projectData,
    question,
    answer
) {
    const projectContext =
        createInterviewContext(projectData);

    const prompt = `
You are RepoMentor, an AI technical interviewer helping a fresher prepare for a software development interview.

Evaluate the candidate's answer to the project-related interview question.

IMPORTANT RULES:

1. Evaluate ONLY using the provided project context and question.
2. Do not invent project details.
3. Do not judge the candidate personally.
4. Focus on technical accuracy, clarity, relevance, and interview communication.
5. Be supportive but honest.
6. Identify what the candidate explained correctly.
7. Identify what is missing or could be improved.
8. Give a better sample answer that a fresher can naturally speak.
9. Do not make the answer unnecessarily complex.
10. If the candidate's answer contains a claim that cannot be verified from the project context, clearly mention that it is not confirmed by the provided repository data.
11. Keep the feedback practical.

Return valid JSON only.

Use exactly this structure:

{
    "score": 0,
    "overallFeedback": "",
    "whatWasGood": [],
    "whatCanImprove": [],
    "betterAnswer": "",
    "followUpQuestion": ""
}

The score must be from 0 to 10.

INTERVIEW QUESTION:

${question}

CANDIDATE ANSWER:

${answer}

PROJECT CONTEXT:

${JSON.stringify(
    projectContext,
    null,
    2
)}
`;

    const output =
        await generateAIResponse(prompt);

    try {
        const cleanedOutput =
            cleanAIJson(output);

        const result =
            JSON.parse(cleanedOutput);

        if (
            typeof result.score !== "number" ||
            !result.overallFeedback ||
            !result.betterAnswer
        ) {
            throw new Error(
                "Incomplete interview evaluation"
            );
        }

        result.score = Math.max(
            0,
            Math.min(10, result.score)
        );

        return result;
    } catch (error) {
        console.error(
            "Invalid mock interview evaluation JSON:",
            output
        );

        throw new Error(
            "AI returned an invalid interview evaluation."
        );
    }
}

module.exports = {
    startMockInterview,
    evaluateMockAnswer,
};