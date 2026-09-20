const {
    getRepository,
    getRepositoryContents,
    getFileContent,
} = require("../services/githubService");

const { analyzeProject } = require("../services/projectAnalyzer");

const {
    generateProjectExplanation,
} = require("../services/aiServices");

const importantFileNames = [
    "package.json",
    "README.md",
    "server.js",
    "app.js",
    "index.js",
    "App.jsx",
    "main.jsx",
    "vite.config.js",
    "next.config.js",
    "requirements.txt",
];

function isImportantFile(filePath) {
    const fileName = filePath.split("/").pop();

    return importantFileNames.includes(fileName);
}

function isArchitectureFile(filePath) {
    const path = filePath.toLowerCase();

    return (
        path.includes("/routes/") ||
        path.includes("/route/") ||
        path.includes("/controllers/") ||
        path.includes("/controller/") ||
        path.includes("/models/") ||
        path.includes("/model/") ||
        path.includes("/schemas/") ||
        path.includes("/schema/") ||
        path.includes("/middleware/") ||
        path.includes("/middlewares/") ||
        path.includes("/services/") ||
        path.includes("/service/") ||
        path.includes("/components/") ||
        path.includes("/pages/")
    );
}

function shouldAnalyzeFile(filePath) {
    return (
        isImportantFile(filePath) ||
        isArchitectureFile(filePath)
    );
}

async function analyzeRepository(req, res) {
    try {
        const { githubUrl } = req.body;

        // 1. Validate GitHub URL
        if (!githubUrl) {
            return res.status(400).json({
                success: false,
                message: "GitHub repository URL is required",
            });
        }

        const url = githubUrl.trim();

        const match = url.match(
            /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/
        );

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid GitHub repository URL",
            });
        }

        const owner = match[1];
        const repo = match[2];

        // 2. Get repository information
        const repository = await getRepository(owner, repo);

        // 3. Get complete repository file tree
        const contents = await getRepositoryContents(
            owner,
            repo
        );

        const files = contents.filter(
            (item) => item.type === "blob"
        );

        const folders = contents.filter(
            (item) => item.type === "tree"
        );

        // 4. Find useful files
        const filesToAnalyze = files.filter((file) =>
            shouldAnalyzeFile(file.path)
        );

        console.log(
            `Found ${filesToAnalyze.length} files for analysis`
        );

        // 5. Fetch actual file contents
        const analyzedFiles = [];

        const filesForContent = filesToAnalyze.slice(0, 50);

        for (const file of filesForContent) {
            try {
                const content = await getFileContent(
                    owner,
                    repo,
                    file.path
                );

                if (content) {
                    analyzedFiles.push({
                        path: file.path,
                        content,
                    });
                }
            } catch (error) {
                console.log(
                    `Could not fetch ${file.path}: ${error.message}`
                );
            }
        }

        console.log(
            `Successfully analyzed ${analyzedFiles.length} files`
        );

        // 6. Analyze project structure and code
        const analysis = analyzeProject(
            repository,
            files,
            analyzedFiles
        );

        // 7. Prepare data for AI
        const projectData = {
            repository: {
                name: repository.name,
                fullName: repository.full_name,
                description: repository.description,
                language: repository.language,
                stars: repository.stargazers_count,
                forks: repository.forks_count,
                url: repository.html_url,
            },

            structure: {
                totalFiles: files.length,
                totalFolders: folders.length,

                files: files.map(
                    (file) => file.path
                ),

                folders: folders.map(
                    (folder) => folder.path
                ),
            },

            importantFiles: analyzedFiles,

            analysis: analysis,
        };

        // 8. Generate AI explanation
        console.log("Generating AI explanation...");

        const aiExplanation =
            await generateProjectExplanation(
                projectData
            );

        console.log("AI explanation generated successfully.");

        // 9. Send final response
        return res.status(200).json({
            success: true,

            data: {
                repository: projectData.repository,

                structure: projectData.structure,

                importantFiles: projectData.importantFiles,

                analysis: projectData.analysis,

                ai: aiExplanation,
            },
        });
    } catch (error) {
        console.error(
            "Repository analysis error:",
            error.message
        );

        if (error.response?.status === 404) {
            return res.status(404).json({
                success: false,
                message: "Repository not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to analyze repository",
        });
    }
}

module.exports = {
    analyzeRepository,
};