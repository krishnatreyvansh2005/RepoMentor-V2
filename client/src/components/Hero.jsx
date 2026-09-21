import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Sparkles,
  Code2,
  Database,
  Boxes,
  FileCode2,
} from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleAnalyze = async () => {
    setError("");

    if (!githubUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    const githubPattern =
      /^https?:\/\/github\.com\/[^/]+\/[^/]+\/?$/;

    if (!githubPattern.test(githubUrl.trim())) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            githubUrl: githubUrl.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to analyze repository."
        );
      }

      // Store analysis result temporarily
      sessionStorage.setItem(
        "repoMentorAnalysis",
        JSON.stringify(result.data)
      );

      // Open analysis dashboard
      navigate("/analysis");
    } catch (error) {
      console.error("Analysis error:", error);

      setError(
        error.message ||
          "Something went wrong while analyzing the repository."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleAnalyze();
    }
  };

  return (
    <section className="hero">
      <div className="hero-glow glow-one"></div>
      <div className="hero-glow glow-two"></div>

      <div className="hero-container">

        {/* LEFT */}
        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={15} />
            AI-Powered Project Understanding
          </div>

          <h1>
            Understand Your
            <br />
            Project <span>Like Never Before.</span>
          </h1>

          <p className="hero-description">
            Paste your GitHub repository link and let RepoMentor
            analyze your code, explain your project, and prepare
            you for interviews.
          </p>

          <div className="repo-input-wrapper">

            <div className="repo-input">
              <GitBranch size={20} />

              <input
                type="text"
                value={githubUrl}
                onChange={(event) => {
                  setGithubUrl(event.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="https://github.com/username/repository"
                disabled={loading}
              />
            </div>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  Analyzing...
                  <span className="loading-spinner"></span>
                </>
              ) : (
                <>
                  Analyze Project
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </div>

          {error && (
            <p className="analysis-error">
              {error}
            </p>
          )}

          <p className="input-hint">
            Example: https://github.com/facebook/react
          </p>

          <div className="hero-checks">

            <div>
              <CheckCircle2 size={17} />
              No complex setup
            </div>

            <div>
              <CheckCircle2 size={17} />
              AI-powered analysis
            </div>

            <div>
              <CheckCircle2 size={17} />
              Interview ready
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-visual">

          <div className="code-window">

            <div className="window-header">

              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span>RepoMentor AI Analysis</span>

              <div className="window-status">
                <CheckCircle2 size={13} />
                Analyzed
              </div>

            </div>

            <div className="code-body">

              <div className="code-line">
                <span className="line-number">01</span>
                <span className="purple">const</span>{" "}
                <span className="blue">project</span> = {"{"}
              </div>

              <div className="code-line indent">
                <span className="blue">name</span>:
                <span className="green">
                  {" "}
                  "Zerodha Clone"
                </span>
                ,
              </div>

              <div className="code-line indent">
                <span className="blue">frontend</span>:
                <span className="green">
                  {" "}
                  "React"
                </span>
                ,
              </div>

              <div className="code-line indent">
                <span className="blue">backend</span>:
                <span className="green">
                  {" "}
                  "Node.js"
                </span>
                ,
              </div>

              <div className="code-line indent">
                <span className="blue">database</span>:
                <span className="green">
                  {" "}
                  "MongoDB"
                </span>
              </div>

              <div className="code-line">
                <span className="line-number">06</span>
                {"};"}
              </div>

            </div>
          </div>

          <div className="floating-card card-tech">
            <Code2 size={19} />

            <div>
              <strong>Tech Stack</strong>
              <small>8 Technologies</small>
            </div>
          </div>

          <div className="floating-card card-structure">
            <Boxes size={19} />

            <div>
              <strong>Structure</strong>
              <small>52 Files analyzed</small>
            </div>
          </div>

          <div className="floating-card card-ai">
            <Sparkles size={19} />

            <div>
              <strong>AI Insights</strong>
              <small>24 Suggestions</small>
            </div>
          </div>

          <div className="floating-card card-db">
            <Database size={19} />

            <div>
              <strong>Database</strong>
              <small>MongoDB detected</small>
            </div>
          </div>

          <div className="ai-circle">
            <Sparkles size={34} />
            <span>AI</span>
          </div>

        </div>
      </div>

      {/* FEATURE STRIP */}
      <div className="hero-features">

        <div className="hero-feature">
          <div className="feature-icon">
            <FileCode2 />
          </div>

          <div>
            <strong>Project Analysis</strong>
            <span>Understand your codebase</span>
          </div>
        </div>

        <div className="hero-feature">
          <div className="feature-icon">
            <Code2 />
          </div>

          <div>
            <strong>Tech Stack & Libraries</strong>
            <span>Know what you actually used</span>
          </div>
        </div>

        <div className="hero-feature">
          <div className="feature-icon">
            <Sparkles />
          </div>

          <div>
            <strong>Interview Preparation</strong>
            <span>Get ready for real questions</span>
          </div>
        </div>

        <div className="hero-feature">
          <div className="feature-icon">
            <Boxes />
          </div>

          <div>
            <strong>AI Assistant</strong>
            <span>Your personal project mentor</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;