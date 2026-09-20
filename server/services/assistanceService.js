const {
    generateAIResponse,
} = require("./aiServices");

function createProjectContext(projectData) {
    const repository = projectData?.repository || {};
    const structure = projectData?.structure || {};
    const analysis = projectData?.analysis || {};

    const importantFiles =
        Array.isArray(projectData?.importantFiles)
            ? projectData.importantFiles
            : [];

    const files = importantFiles
        .slice(0, 25)
        .map((file) => {
            const content =
                typeof file.content === "string"
                    ? file.content.slice(0, 6000)
                    : "";

            return {
                path: file.path,
                content,
            };
        });

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
                ? structure.files.slice(0, 200)
                : [],
        },

        analysis,

        importantFiles: files,
    };
}

async function askProjectAssistant(
    projectData,
    question
) {
    const projectContext =
        createProjectContext(projectData);

    const prompt = `
You are RepoMentor, an AI project mentor.

You are helping a fresher understand their own GitHub project for interviews.

Answer the user's question using ONLY the repository information provided below.

IMPORTANT RULES:

1. Do not invent anything.
2. Do not assume functionality that is not visible in the provided repository data.
3. If the answer cannot be determined from the repository data, clearly say:
   "I could not clearly identify this from the analyzed repository."
4. Explain technical concepts in simple English.
5. Keep the answer interview-friendly.
6. When useful, mention relevant file paths.
7. If the user asks how something works, explain the flow step-by-step.
8. If the user asks an interview question, provide an answer that a fresher can naturally speak.
9. Do not claim the user personally wrote code unless the repository data proves it.
10. Do not exaggerate the project.
11. Keep the answer concise but useful.

USER QUESTION:

${question}

PROJECT CONTEXT:

${JSON.stringify(
    projectContext,
    null,
    2
)}
`;

    return await generateAIResponse(prompt);
}

module.exports = {
    askProjectAssistant,
};