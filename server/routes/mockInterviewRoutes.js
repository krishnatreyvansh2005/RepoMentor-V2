const express = require("express");

const {
    startInterview,
    evaluateAnswer,
} = require("../controllers/mockInterviewController");

const router = express.Router();

router.post("/start", startInterview);

router.post("/evaluate", evaluateAnswer);

module.exports = router;