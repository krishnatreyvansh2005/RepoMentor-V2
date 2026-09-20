const {
    askProjectAssistant,
} = require("../services/assistanceService");

async function askAssistant(req, res) {
    try {
        const { projectData, question } = req.body;

        if (!projectData) {
            return res.status(400).json({
                success: false,
                message: "Project data is required",
            });
        }

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }

        if (question.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message:
                    "Question is too long. Please keep it under 1000 characters.",
            });
        }

        console.log(
            `AI Assistant question: ${question.trim()}`
        );

        const answer = await askProjectAssistant(
            projectData,
            question.trim()
        );

        return res.status(200).json({
            success: true,
            answer,
        });
    } catch (error) {
        console.error(
            "AI Assistant error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to generate AI assistant response.",
        });
    }
}

module.exports = {
    askAssistant,
};