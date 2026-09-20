import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Database,
  FileCode2,
  FolderTree,
  GitBranch,
  Layers3,
  Sparkles,
  Star,
  GitFork,
  MessageCircle,
  Mic,
} from "lucide-react";

import "./Analysis.css";

function Analysis() {
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem(
      "repoMentorAnalysis"
    );

    if (!savedData) {
      navigate("/");
      return;
    }

    try {
      const parsedData = JSON.parse(savedData);
      setProjectData(parsedData);
    } catch (error) {
      console.error(
        "Failed to load analysis:",
        error
      );

      navigate("/");
    }
  }, [navigate]);

  if (!projectData) {
    return (
      <div className="analysis-loading-page">
        <div className="analysis-loader"></div>
        <p>Loading project analysis...</p>
      </div>
    );
  }

  const {
    repository,
    structure,
    analysis,
    ai,
  } = projectData;

  const toggleQuestion = (index) => {
    setOpenQuestion(
      openQuestion === index ? null : index
    );
  };

  const goBack = () => {
    sessionStorage.removeItem(
      "repoMentorAnalysis"
    );

    navigate("/");
  };

  const openAssistant = () => {
    navigate("/assistant");
  };

  const openMockInterview = () => {
    navigate("/mock-interview");
  };

  return (
    <div className="analysis-page">

      {/* TOP NAVBAR */}
      <header className="analysis-navbar">

        <div
          className="analysis-logo"
          onClick={() => navigate("/")}
        >
          <div className="logo-icon">
            <Sparkles size={19} />
          </div>

          <span>RepoMentor</span>
        </div>

        <button
          className="back-button"
          onClick={goBack}
        >
          <ArrowLeft size={17} />
          Analyze Another Project
        </button>

      </header>

      <main className="analysis-container">

        {/* PROJECT HEADER */}
        <section className="project-header">

          <div className="project-header-left">

            <div className="github-icon">
              <GitBranch size={25} />
            </div>

            <div>

              <div className="project-title-row">

                <h1>{repository.name}</h1>

                <span className="analyzed-badge">
                  <CheckCircle2 size={14} />
                  Analyzed
                </span>

              </div>

              <p>
                {repository.fullName}
              </p>

              {repository.description && (
                <span className="project-description">
                  {repository.description}
                </span>
              )}

            </div>

          </div>

          <a
            href={repository.url}
            target="_blank"
            rel="noreferrer"
            className="github-repo-button"
          >
            View Repository

            <ArrowLeft
              size={16}
              style={{
                transform: "rotate(135deg)",
              }}
            />
          </a>

        </section>

        {/* QUICK STATS */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              <FileCode2 size={19} />
            </div>

            <div>
              <span>Total Files</span>

              <strong>
                {structure.totalFiles}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <FolderTree size={19} />
            </div>

            <div>
              <span>Folders</span>

              <strong>
                {structure.totalFolders}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <Code2 size={19} />
            </div>

            <div>
              <span>Main Language</span>

              <strong>
                {repository.language ||
                  "Not detected"}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <Star size={19} />
            </div>

            <div>
              <span>Stars</span>

              <strong>
                {repository.stars}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <GitFork size={19} />
            </div>

            <div>
              <span>Forks</span>

              <strong>
                {repository.forks}
              </strong>
            </div>

          </div>

        </section>

        {/* AI OVERVIEW */}
        {ai?.projectOverview && (
          <section className="analysis-section overview-section">

            <div className="section-heading">

              <div className="heading-icon ai-icon">
                <Brain size={20} />
              </div>

              <div>

                <span className="section-label">
                  AI PROJECT UNDERSTANDING
                </span>

                <h2>
                  Project Overview
                </h2>

              </div>

            </div>

            <div className="overview-content">
              <p>
                {ai.projectOverview}
              </p>
            </div>

          </section>
        )}

        {/* PROBLEM + SOLUTION */}
        <section className="two-column-grid">

          <div className="analysis-card">

            <div className="card-heading">

              <div className="heading-icon">
                <Layers3 size={19} />
              </div>

              <div>

                <span>
                  UNDERSTANDING
                </span>

                <h3>
                  Problem Statement
                </h3>

              </div>

            </div>

            <p>
              {ai?.problemStatement ||
                "Not clearly identified from the repository."}
            </p>

          </div>

          <div className="analysis-card">

            <div className="card-heading">

              <div className="heading-icon">
                <Sparkles size={19} />
              </div>

              <div>

                <span>
                  SOLUTION
                </span>

                <h3>
                  How The Project Solves It
                </h3>

              </div>

            </div>

            <p>
              {ai?.solution ||
                "Not clearly identified from the repository."}
            </p>

          </div>

        </section>

        {/* TECH STACK */}
        <section className="analysis-section">

          <div className="section-heading">

            <div className="heading-icon">
              <Code2 size={20} />
            </div>

            <div>

              <span className="section-label">
                TECHNOLOGIES
              </span>

              <h2>
                Tech Stack
              </h2>

            </div>

          </div>

          <div className="tech-stack-grid">

            {ai?.techStack?.length > 0 ? (

              ai.techStack.map(
                (technology, index) => (

                  <div
                    className="tech-item"
                    key={`${technology}-${index}`}
                  >
                    <Code2 size={17} />

                    <span>
                      {technology}
                    </span>
                  </div>

                )
              )

            ) : analysis?.frameworks?.length > 0 ? (

              analysis.frameworks.map(
                (framework, index) => (

                  <div
                    className="tech-item"
                    key={`${framework}-${index}`}
                  >
                    <Code2 size={17} />

                    <span>
                      {framework}
                    </span>
                  </div>

                )
              )

            ) : (

              <div className="empty-state">
                Technology information not available.
              </div>

            )}

          </div>

        </section>

        {/* ARCHITECTURE */}
        <section className="analysis-section">

          <div className="section-heading">

            <div className="heading-icon">
              <FolderTree size={20} />
            </div>

            <div>

              <span className="section-label">
                PROJECT STRUCTURE
              </span>

              <h2>
                Architecture
              </h2>

            </div>

          </div>

          <div className="architecture-flow">

            {ai?.architecture?.length > 0 ? (

              ai.architecture.map(
                (item, index) => (

                  <div
                    className="architecture-item"
                    key={`${item}-${index}`}
                  >

                    <div className="architecture-number">
                      {index + 1}
                    </div>

                    <div>

                      <strong>
                        {item}
                      </strong>

                      <span>
                        Project architecture component
                      </span>

                    </div>

                  </div>

                )
              )

            ) : analysis?.architecture ? (

              Object.entries(
                analysis.architecture
              ).map(
                ([key, value], index) => (

                  <div
                    className="architecture-item"
                    key={key}
                  >

                    <div className="architecture-number">
                      {index + 1}
                    </div>

                    <div>

                      <strong>
                        {key}
                      </strong>

                      <span>
                        {typeof value === "string"
                          ? value
                          : "Detected in repository"}
                      </span>

                    </div>

                  </div>

                )
              )

            ) : (

              <div className="empty-state">
                Architecture information not available.
              </div>

            )}

          </div>

        </section>

        {/* PROJECT FLOW */}
        <section className="analysis-section">

          <div className="section-heading">

            <div className="heading-icon">
              <GitBranch size={20} />
            </div>

            <div>

              <span className="section-label">
                APPLICATION FLOW
              </span>

              <h2>
                Project Flow
              </h2>

            </div>

          </div>

          <div className="project-flow">

            {ai?.projectFlow?.length > 0 ? (

              ai.projectFlow.map(
                (step, index) => (

                  <div
                    className="flow-step"
                    key={index}
                  >

                    <div className="flow-number">
                      {index + 1}
                    </div>

                    <div className="flow-content">

                      <strong>
                        {typeof step === "string"
                          ? step
                          : step.step ||
                            "Project step"}
                      </strong>

                      {typeof step === "object" &&
                        step.description && (
                          <span>
                            {step.description}
                          </span>
                        )}

                    </div>

                    {index <
                      ai.projectFlow.length - 1 && (
                      <div className="flow-line"></div>
                    )}

                  </div>

                )
              )

            ) : analysis?.flow?.length > 0 ? (

              analysis.flow.map(
                (step, index) => (

                  <div
                    className="flow-step"
                    key={index}
                  >

                    <div className="flow-number">
                      {index + 1}
                    </div>

                    <div className="flow-content">

                      <strong>
                        {typeof step === "string"
                          ? step
                          : step.step ||
                            "Project step"}
                      </strong>

                    </div>

                    {index <
                      analysis.flow.length - 1 && (
                      <div className="flow-line"></div>
                    )}

                  </div>

                )
              )

            ) : (

              <div className="empty-state">
                Project flow information not available.
              </div>

            )}

          </div>

        </section>

        {/* ONE MINUTE EXPLANATION */}
        <section className="analysis-section explanation-section">

          <div className="section-heading">

            <div className="heading-icon ai-icon">
              <Sparkles size={20} />
            </div>

            <div>

              <span className="section-label">
                INTERVIEW READY
              </span>

              <h2>
                1-Minute Project Explanation
              </h2>

            </div>

          </div>

          <div className="explanation-box">

            <div className="explanation-top">

              <Sparkles size={18} />

              <span>
                AI Generated Interview Answer
              </span>

            </div>

            <p>
              {ai?.oneMinuteExplanation ||
                "Explanation not available."}
            </p>

          </div>

        </section>

        {/* IMPORTANT FILES */}
        <section className="analysis-section">

          <div className="section-heading">

            <div className="heading-icon">
              <FileCode2 size={20} />
            </div>

            <div>

              <span className="section-label">
                CODEBASE
              </span>

              <h2>
                Important Files
              </h2>

            </div>

          </div>

          <div className="files-list">

            {ai?.importantFiles?.length > 0 ? (

              ai.importantFiles.map(
                (file, index) => (

                  <div
                    className="file-item"
                    key={index}
                  >

                    <FileCode2 size={17} />

                    <span>
                      {typeof file === "string"
                        ? file
                        : file.path ||
                          "Important file"}
                    </span>

                  </div>

                )
              )

            ) : projectData.importantFiles?.length > 0 ? (

              projectData.importantFiles
                .slice(0, 20)
                .map((file, index) => (

                  <div
                    className="file-item"
                    key={index}
                  >

                    <FileCode2 size={17} />

                    <span>
                      {file.path}
                    </span>

                  </div>

                ))

            ) : (

              <div className="empty-state">
                No important files detected.
              </div>

            )}

          </div>

        </section>

        {/* INTERVIEW QUESTIONS */}
        <section className="analysis-section">

          <div className="section-heading">

            <div className="heading-icon ai-icon">
              <Brain size={20} />
            </div>

            <div>

              <span className="section-label">
                PREPARE FOR INTERVIEW
              </span>

              <h2>
                Interview Questions
              </h2>

            </div>

          </div>

          <div className="questions-list">

            {ai?.interviewQuestions?.length > 0 ? (

              ai.interviewQuestions.map(
                (item, index) => (

                  <div
                    className={`question-card ${
                      openQuestion === index
                        ? "question-open"
                        : ""
                    }`}
                    key={index}
                  >

                    <button
                      className="question-button"
                      onClick={() =>
                        toggleQuestion(index)
                      }
                    >

                      <div className="question-title">

                        <span>
                          Q{index + 1}
                        </span>

                        <strong>
                          {item.question}
                        </strong>

                      </div>

                      {openQuestion === index ? (
                        <ChevronUp size={19} />
                      ) : (
                        <ChevronDown size={19} />
                      )}

                    </button>

                    {openQuestion === index && (
                      <div className="answer-box">

                        <strong>
                          Answer
                        </strong>

                        <p>
                          {item.answer}
                        </p>

                      </div>
                    )}

                  </div>

                )
              )

            ) : (

              <div className="empty-state">
                Interview questions are not available.
              </div>

            )}

          </div>

        </section>

        {/* FOLLOW-UP QUESTIONS */}
        <section className="analysis-section">

          <div className="section-heading">

            <div className="heading-icon">
              <GitBranch size={20} />
            </div>

            <div>

              <span className="section-label">
                CROSS QUESTIONS
              </span>

              <h2>
                Follow-up Questions
              </h2>

            </div>

          </div>

          <div className="questions-list">

            {ai?.followUpQuestions?.length > 0 ? (

              ai.followUpQuestions.map(
                (item, index) => {

                  const questionIndex =
                    `follow-${index}`;

                  return (
                    <div
                      className={`question-card ${
                        openQuestion ===
                        questionIndex
                          ? "question-open"
                          : ""
                      }`}
                      key={questionIndex}
                    >

                      <button
                        className="question-button"
                        onClick={() =>
                          setOpenQuestion(
                            openQuestion ===
                              questionIndex
                              ? null
                              : questionIndex
                          )
                        }
                      >

                        <div className="question-title">

                          <span>
                            Q{index + 1}
                          </span>

                          <strong>
                            {item.question}
                          </strong>

                        </div>

                        {openQuestion ===
                        questionIndex ? (
                          <ChevronUp size={19} />
                        ) : (
                          <ChevronDown size={19} />
                        )}

                      </button>

                      {openQuestion ===
                        questionIndex && (
                        <div className="answer-box">

                          <strong>
                            Answer
                          </strong>

                          <p>
                            {item.answer}
                          </p>

                        </div>
                      )}

                    </div>
                  );
                }
              )

            ) : (

              <div className="empty-state">
                Follow-up questions are not available.
              </div>

            )}

          </div>

        </section>

        {/* BOTTOM CTA */}
        <section className="analysis-cta">

          <div className="cta-icon">
            <Sparkles size={24} />
          </div>

          <div>

            <h2>
              Ready to master your project?
            </h2>

            <p>
              Ask RepoMentor anything about your
              project or practice your project-based
              interview.
            </p>

          </div>

          <div className="cta-actions">

            <button
              onClick={openAssistant}
              className="cta-button assistant-cta-button"
            >
              <MessageCircle size={17} />
              Ask RepoMentor AI
            </button>

            <button
              onClick={openMockInterview}
              className="cta-button mock-interview-cta-button"
            >
              <Mic size={17} />
              Mock Interview
            </button>

            <button
              onClick={goBack}
              className="cta-button"
            >
              Analyze Another Project

              <ArrowLeft
                size={17}
                style={{
                  transform:
                    "rotate(180deg)",
                }}
              />
            </button>

          </div>

        </section>

      </main>

      <footer className="analysis-footer">

        <div>
          <Sparkles size={15} />
          RepoMentor
        </div>

        <span>
          Your AI Project Mentor
        </span>

      </footer>

    </div>
  );
}

export default Analysis;