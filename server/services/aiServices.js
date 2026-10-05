const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const models = [
    process.env.GEMINI_MODEL || "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
];

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function isTemporaryError(error) {
    const errorMessage = error?.message || "";

    return (
        errorMessage.includes("503") ||
        errorMessage.includes("UNAVAILABLE") ||
        errorMessage.includes("high demand") ||
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("500") ||
        errorMessage.includes("INTERNAL")
    );
}

async function generateWithModel(model, prompt) {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(
                `Trying Gemini model: ${model} | Attempt ${attempt}/${maxRetries}`
            );

            const response = await ai.models.generateContent({
                model,
                contents: prompt,
            });

            const output = response.text;

            if (!output) {
                throw new Error(
                    "Gemini returned an empty response"
                );
            }

            return output;
        } catch (error) {
            console.error(
                `Gemini request failed (${model}, attempt ${attempt}):`,
                error.message
            );

            if (!isTemporaryError(error)) {
                throw error;
            }

            if (attempt === maxRetries) {
                throw error;
            }

            const waitTime = 2000 * Math.pow(2, attempt - 1);

            console.log(
                `Gemini temporarily unavailable. Retrying in ${waitTime / 1000
                } seconds...`
            );

            await sleep(waitTime);
        }
    }
}

async function generateAIResponse(prompt) {
    let lastError = null;

    for (const model of models) {
        try {
            const response = await generateWithModel(
                model,
                prompt
            );

            console.log(
                `Gemini response generated successfully using ${model}`
            );

            return response;
        } catch (error) {
            lastError = error;

            console.error(
                `Gemini model failed completely (${model}):`,
                error.message
            );

            if (!isTemporaryError(error)) {
                break;
            }

            console.log(
                `Trying next Gemini model: ${model}`
            );
        }
    }

    console.error(
        "All Gemini models failed:",
        lastError?.message
    );

    throw new Error(
        "Gemini AI is temporarily unavailable. Please try again after a short time."
    );
}

async function generateProjectExplanation(projectData) {
    const prompt = `
You are RepoMentor, an AI project mentor for fresher software developers.

Analyze the provided GitHub project information and explain the project in simple, interview-friendly English.

IMPORTANT RULES:

1. Only use information provided in the project data.
2. Do not invent features, technologies, APIs, databases, or functionality.
3. If something is not clear from the data, say:
   "Not clearly identified from the repository."
4. Use simple English suitable for a fresher interview.
5. Avoid unnecessary complex technical words.
6. Make every answer easy to speak naturally in an interview.
7. Focus on what the project actually contains.
8. Do not exaggerate the project.
9. Keep answers practical and understandable.
10. The candidate should be able to explain the answer if asked a follow-up question.
11. Keep the response reasonably concise.

Generate valid JSON only.

Use exactly this structure:

{
    "projectOverview": "",
    "problemStatement": "",
    "solution": "",
    "techStack": [],
    "architecture": [],
    "projectFlow": [],
    "importantFiles": [],
    "oneMinuteExplanation": "",
    "interviewQuestions": [
        {
            "question": "",
            "answer": ""
        }
    ],
    "followUpQuestions": [
        {
            "question": "",
            "answer": ""
        }
    ]
}

Generate around 8 interview questions and around 5 follow-up questions.

PROJECT DATA:

${JSON.stringify(projectData, null, 2)}
`;

    const output = await generateAIResponse(prompt);

    try {
        const cleanedOutput = output
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        return JSON.parse(cleanedOutput);
    } catch (error) {
        console.error(
            "Invalid JSON returned by Gemini:",
            output
        );

        throw new Error(
            "Gemini returned an invalid JSON response"
        );
    }
}

module.exports = {
    generateAIResponse,
    generateProjectExplanation,
};