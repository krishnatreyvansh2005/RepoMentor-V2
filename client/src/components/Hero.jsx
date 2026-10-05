import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Hero() {
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setError("");

    const url = githubUrl.trim();

    const isValidGithubUrl =
      /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(url);

    if (!isValidGithubUrl) {
      setError("Enter a valid public GitHub repository URL.");
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
            githubUrl: url,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to analyze repository."
        );
      }

      sessionStorage.setItem(
        "repoMentorAnalysis",
        JSON.stringify(result.data)
      );

      navigate("/analysis");
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong while analyzing the repository."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero">
      <div className="hero-grid" />

      <div className="hero-container">
        <div className="hero-badge">
          <Sparkles size={15} />
          AI-powered project understanding
        </div>

        <h1>
          Turn your GitHub project into
          <span> an interview advantage.</span>
        </h1>

        <p className="hero-description">
          RepoMentor analyzes your repository, explains how it
          works, and helps you prepare for project-based technical
          interviews.
        </p>

        <form
          className="analyze-form"
          onSubmit={handleAnalyze}
          id="analyze"
        >
          <div className="input-wrapper">
            <Zap size={19} />

            <input
              type="url"
              placeholder="https://github.com/username/project"
              value={githubUrl}
              onChange={(event) =>
                setGithubUrl(event.target.value)
              }
              disabled={loading}
            />

            <button
              type="submit"
              className="analyze-btn"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Repository"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </div>

          {error && (
            <p className="hero-error">
              {error}
            </p>
          )}
        </form>

        <div className="hero-trust">
          <div>
            <ShieldCheck size={16} />
            Public repositories
          </div>

          <div>
            <Zap size={16} />
            AI-powered analysis
          </div>

          <div>
            <Zap size={16} />
            GitHub-based insights
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-topbar">
            <div className="window-dots">
              <span />
              <span />
              <span />
            </div>

            <span className="preview-label">
              repository-analysis
            </span>
          </div>

          <div className="preview-content">
            <div className="preview-sidebar">
              <div className="preview-sidebar-title">
                ANALYSIS
              </div>

              <div className="preview-nav active">
                Overview
              </div>

              <div className="preview-nav">
                Tech Stack
              </div>

              <div className="preview-nav">
                Architecture
              </div>

              <div className="preview-nav">
                Interview
              </div>
            </div>

            <div className="preview-main">
              <div className="preview-heading">
                <div>
                  <small>PROJECT OVERVIEW</small>
                  <h3>Understand your project.</h3>
                </div>

                <span className="status-pill">
                  Analyzed
                </span>
              </div>

              <div className="preview-cards">
                <div className="preview-card">
                  <small>TECH STACK</small>
                  <strong>React · Node · MongoDB</strong>
                </div>

                <div className="preview-card">
                  <small>PROJECT TYPE</small>
                  <strong>Full Stack Application</strong>
                </div>

                <div className="preview-card">
                  <small>INTERVIEW READY</small>
                  <strong>Project insights generated</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;