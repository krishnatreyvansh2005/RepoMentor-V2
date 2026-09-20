const express = require("express");
const cors = require("cors");
require("dotenv").config();

const analyzeRoutes = require("./routes/analyzeRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const mockInterviewRoutes = require("./routes/mockInterviewRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
    res.json({
        message: "RepoMentor API is running 🚀",
    });
});

app.use("/api/analyze", analyzeRoutes);

app.use("/api/assistant", assistantRoutes);

app.use(
    "/api/mock-interview",
    mockInterviewRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});