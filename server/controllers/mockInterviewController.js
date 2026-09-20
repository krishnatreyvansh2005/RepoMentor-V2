const {
    startMockInterview,
    evaluateMockAnswer,
} = require("../services/mockInterviewService");

async function startInterview(req, res) {
    try {
        const { projectData } = req.body;

        if (!projectData) {
            return res.status(400).json({
                success: false,
                message: "Project data is required",
            });
        }

        console.log("Starting mock interview...");

        const question =
            await startMockInterview(projectData);

        return res.status(200).json({
            success: true,
            question,
        });
    } catch (error) {
        console.error(
            "Mock interview start error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to start mock interview. Please try again.",
        });
    }
}

async function evaluateAnswer(req, res) {
    try {
        const {
            projectData,
            question,
            answer,
        } = req.body;

        if (!projectData) {
            return res.status(400).json({
                success: false,
                message: "Project data is required",
            });
        }

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Interview question is required",
            });
        }

        if (!answer || !answer.trim()) {
            return res.status(400).json({
                success: false,
                message: "Your answer is required",
            });
        }

        if (answer.trim().length > 3000) {
            return res.status(400).json({
                success: false,
                message:
                    "Please keep your answer under 3000 characters.",
            });
        }

        console.log("Evaluating mock interview answer...");

        const evaluation =
            await evaluateMockAnswer(
                projectData,
                question.trim(),
                answer.trim()
            );

        return res.status(200).json({
            success: true,
            evaluation,
        });
    } catch (error) {
        console.error(
            "Mock interview evaluation error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to evaluate your answer. Please try again.",
        });
    }
}

module.exports = {
    startInterview,
    evaluateAnswer,
};