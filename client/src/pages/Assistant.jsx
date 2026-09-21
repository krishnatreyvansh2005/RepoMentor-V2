import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Send,
  Sparkles,
  User,
  Code2,
  Database,
  GitBranch,
  MessageCircle,
} from "lucide-react";

import "./Assistant.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Assistant() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const savedData = sessionStorage.getItem(
    "repoMentorAnalysis"
  );

  if (!savedData) {
    navigate("/");
    return null;
  }

  let projectData;

  try {
    projectData = JSON.parse(savedData);
  } catch (error) {
    console.error(
      "Failed to parse project data:",
      error
    );

    navigate("/");
    return null;
  }

  const repository = projectData.repository;

  const suggestedQuestions = [
    "Explain this project in simple words.",
    "How does the backend work?",
    "How does authentication work?",
    "What database is used and why?",
    "How should I explain this project in an interview?",
    "What questions can an interviewer ask about this project?",
  ];

  const askQuestion = async (selectedQuestion) => {
    const currentQuestion =
      selectedQuestion || question.trim();

    if (!currentQuestion || loading) {
      return;
    }

    setQuestion("");

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: currentQuestion,
      },
    ]);

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectData,
            question: currentQuestion,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to get AI response."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          type: "assistant",
          text: result.answer,
        },
      ]);
    } catch (error) {
      console.error(
        "Assistant error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          type: "assistant",
          text:
            error.message ||
            "Something went wrong. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuestion();
  };

  return (
    <div className="assistant-page">
      <header className="assistant-navbar">
        <div
          className="assistant-brand"
          onClick={() => navigate("/")}
        >
          <div className="assistant-logo">
            <Sparkles size={18} />
          </div>

          <span>RepoMentor</span>
        </div>

        <button
          className="assistant-back-button"
          onClick={() => navigate("/analysis")}
        >
          <ArrowLeft size={17} />
          Back to Analysis
        </button>
      </header>

      <main className="assistant-container">
        <section className="assistant-header">
          <div className="assistant-header-icon">
            <Brain size={28} />
          </div>

          <div>
            <span className="assistant-label">
              AI PROJECT MENTOR
            </span>

            <h1>
              Ask anything about your project
            </h1>

            <p>
              Understand{" "}
              <strong>
                {repository?.name}
              </strong>{" "}
              with simple, interview-friendly explanations.
            </p>
          </div>
        </section>

        {messages.length === 0 && (
          <section className="welcome-card">
            <div className="welcome-icon">
              <MessageCircle size={24} />
            </div>

            <div>
              <h2>
                What do you want to understand?
              </h2>

              <p>
                Ask questions about your project's
                code, architecture, database,
                authentication, technologies,
                or interview preparation.
              </p>
            </div>
          </section>
        )}

        <section className="suggestions-section">
          <div className="suggestions-title">
            <Sparkles size={16} />
            Try asking
          </div>

          <div className="suggestions-grid">
            {suggestedQuestions.map(
              (item, index) => (
                <button
                  key={index}
                  className="suggestion-card"
                  onClick={() =>
                    askQuestion(item)
                  }
                  disabled={loading}
                >
                  <span>{item}</span>

                  <ArrowLeft
                    size={15}
                    style={{
                      transform:
                        "rotate(135deg)",
                    }}
                  />
                </button>
              )
            )}
          </div>
        </section>

        <section className="chat-container">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">
                <Brain size={25} />
              </div>

              <h3>
                Your AI mentor is ready
              </h3>

              <p>
                Ask your first question below.
              </p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map(
                (message, index) => (
                  <div
                    className={`message-row ${
                      message.type ===
                      "user"
                        ? "user-row"
                        : "assistant-row"
                    }`}
                    key={index}
                  >
                    <div className="message-avatar">
                      {message.type ===
                      "user" ? (
                        <User size={17} />
                      ) : (
                        <Sparkles size={17} />
                      )}
                    </div>

                    <div
                      className={`message-bubble ${
                        message.error
                          ? "message-error"
                          : ""
                      }`}
                    >
                      {message.type ===
                        "assistant" && (
                        <div className="answer-label">
                          RepoMentor AI
                        </div>
                      )}

                      <p>{message.text}</p>
                    </div>
                  </div>
                )
              )}

              {loading && (
                <div className="message-row assistant-row">
                  <div className="message-avatar">
                    <Sparkles size={17} />
                  </div>

                  <div className="message-bubble typing-bubble">
                    <div className="answer-label">
                      RepoMentor AI
                    </div>

                    <div className="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="context-info">
          <div>
            <Code2 size={17} />
            <span>
              Repository context loaded
            </span>
          </div>

          <div>
            <GitBranch size={17} />
            <span>
              {projectData.structure?.totalFiles ||
                0}{" "}
              files analyzed
            </span>
          </div>

          <div>
            <Database size={17} />
            <span>
              Project-aware answers
            </span>
          </div>
        </section>

        <form
          className="assistant-input-area"
          onSubmit={handleSubmit}
        >
          <div className="assistant-input">
            <MessageCircle size={19} />

            <input
              type="text"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              placeholder="Ask about your project..."
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={
              loading || !question.trim()
            }
            className="send-button"
          >
            <Send size={18} />
            Ask AI
          </button>
        </form>
      </main>
    </div>
  );
}

export default Assistant;