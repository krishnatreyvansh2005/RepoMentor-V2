import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

import "./MockInterview.css";

function MockInterview() {
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const [starting, setStarting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  const [questionNumber, setQuestionNumber] =
    useState(1);

  // Speaking states
  const [isListening, setIsListening] =
    useState(false);

  const [speakingSeconds, setSpeakingSeconds] =
    useState(0);

  const [speechSupported, setSpeechSupported] =
    useState(true);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Prevent duplicate transcript updates
  const finalTranscriptRef = useRef("");

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
        "Failed to parse project data:",
        error
      );

      navigate("/");
    }
  }, [navigate]);

  /*
   * -----------------------------------------
   * SPEECH RECOGNITION SETUP
   * -----------------------------------------
   */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      console.log(
        "Speech recognition started"
      );

      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      let finalTranscript =
        finalTranscriptRef.current;

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript +=
            transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      finalTranscriptRef.current =
        finalTranscript;

      setAnswer(
        `${finalTranscript}${interimTranscript}`.trim()
      );
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setError(
          "Microphone permission was denied. Please allow microphone access in your browser."
        );
      } else if (
        event.error === "no-speech"
      ) {
        setError(
          "No speech detected. Please speak clearly and try again."
        );
      } else if (
        event.error === "audio-capture"
      ) {
        setError(
          "No microphone was detected. Please check your microphone."
        );
      } else {
        setError(
          "Speech recognition encountered an error. Please try again."
        );
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      console.log(
        "Speech recognition ended"
      );

      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        console.log(
          "Speech recognition cleanup:",
          error.message
        );
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  /*
   * -----------------------------------------
   * SPEAKING TIMER
   * -----------------------------------------
   */

  useEffect(() => {
    if (isListening) {
      timerRef.current = setInterval(() => {
        setSpeakingSeconds(
          (previous) => previous + 1
        );
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isListening]);

  /*
   * -----------------------------------------
   * FORMAT SPEAKING TIME
   * -----------------------------------------
   */

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  /*
   * -----------------------------------------
   * START SPEAKING
   * -----------------------------------------
   */

  const startSpeaking = () => {
    if (!speechSupported) {
      setError(
        "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );

      return;
    }

    if (!recognitionRef.current) {
      setError(
        "Speech recognition is not available. Please refresh the page and try again."
      );

      return;
    }

    setError("");

    finalTranscriptRef.current =
      answer || "";

    setSpeakingSeconds(0);

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error(
        "Unable to start speech recognition:",
        error
      );

      setError(
        "Could not start the microphone. Please try again."
      );
    }
  };

  /*
   * -----------------------------------------
   * STOP SPEAKING
   * -----------------------------------------
   */

  const stopSpeaking = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error(
        "Unable to stop speech recognition:",
        error
      );
    }

    setIsListening(false);
  };

  /*
   * -----------------------------------------
   * START MOCK INTERVIEW
   * -----------------------------------------
   */

  const startInterview = async () => {
    if (!projectData || starting) {
      return;
    }

    setError("");
    setEvaluation(null);
    setAnswer("");
    setQuestion(null);
    setSpeakingSeconds(0);

    finalTranscriptRef.current = "";

    try {
      setStarting(true);

      const response = await fetch(
        "http://localhost:5000/api/mock-interview/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectData,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to start mock interview."
        );
      }

      setQuestion(result.question);
    } catch (error) {
      console.error(
        "Mock interview start error:",
        error
      );

      setError(
        error.message ||
          "Unable to start the mock interview. Please try again."
      );
    } finally {
      setStarting(false);
    }
  };

  /*
   * -----------------------------------------
   * SUBMIT ANSWER
   * -----------------------------------------
   */

  const submitAnswer = async () => {
    if (
      !projectData ||
      !question ||
      !answer.trim() ||
      evaluating
    ) {
      return;
    }

    // Stop microphone before submitting
    if (isListening) {
      stopSpeaking();
    }

    setError("");

    try {
      setEvaluating(true);

      const response = await fetch(
        "http://localhost:5000/api/mock-interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectData,
            question: question.question,
            answer: answer.trim(),
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to evaluate your answer."
        );
      }

      setEvaluation(
        result.evaluation
      );
    } catch (error) {
      console.error(
        "Mock interview evaluation error:",
        error
      );

      setError(
        error.message ||
          "Unable to evaluate your answer. Please try again."
      );
    } finally {
      setEvaluating(false);
    }
  };

  /*
   * -----------------------------------------
   * NEXT QUESTION
   * -----------------------------------------
   */

  const nextQuestion = async () => {
    if (isListening) {
      stopSpeaking();
    }

    setQuestionNumber(
      (previous) => previous + 1
    );

    setEvaluation(null);
    setAnswer("");
    setQuestion(null);
    setSpeakingSeconds(0);

    finalTranscriptRef.current = "";

    await startInterview();
  };

  /*
   * -----------------------------------------
   * RESET INTERVIEW
   * -----------------------------------------
   */

  const resetInterview = () => {
    if (isListening) {
      stopSpeaking();
    }

    setQuestion(null);
    setEvaluation(null);
    setAnswer("");
    setError("");
    setQuestionNumber(1);
    setSpeakingSeconds(0);

    finalTranscriptRef.current = "";
  };

  /*
   * -----------------------------------------
   * HANDLE MANUAL TEXT EDIT
   * -----------------------------------------
   */

  const handleAnswerChange = (
    event
  ) => {
    const value =
      event.target.value;

    setAnswer(value);

    finalTranscriptRef.current =
      value;
  };

  if (!projectData) {
    return null;
  }

  const repository =
    projectData.repository || {};

  return (
    <div className="mock-interview-page">
      {/* ---------------------------------- */}
      {/* NAVBAR */}
      {/* ---------------------------------- */}

      <header className="mock-navbar">
        <div
          className="mock-brand"
          onClick={() => navigate("/")}
        >
          <div className="mock-logo">
            <Sparkles size={18} />
          </div>

          <span>RepoMentor</span>
        </div>

        <button
          className="mock-back-button"
          onClick={() =>
            navigate("/analysis")
          }
        >
          <ArrowLeft size={17} />
          Back to Analysis
        </button>
      </header>

      <main className="mock-container">
        {/* ---------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------- */}

        <section className="mock-header">
          <div className="mock-header-icon">
            <Brain size={30} />
          </div>

          <div>
            <span className="mock-label">
              AI MOCK INTERVIEW
            </span>

            <h1>
              Test your project knowledge
            </h1>

            <p>
              Practice realistic
              project-based interview
              questions for{" "}
              <strong>
                {repository.name}
              </strong>
              .
            </p>
          </div>
        </section>

        {/* ---------------------------------- */}
        {/* PROGRESS */}
        {/* ---------------------------------- */}

        <section className="mock-progress-card">
          <div className="progress-left">
            <div className="progress-icon">
              <Target size={19} />
            </div>

            <div>
              <strong>
                Question{" "}
                {questionNumber}
              </strong>

              <span>
                Project-based technical
                interview
              </span>
            </div>
          </div>

          <div className="progress-indicator">
            <span className="progress-dot active"></span>

            <span className="progress-line"></span>

            <span className="progress-dot"></span>

            <span className="progress-line"></span>

            <span className="progress-dot"></span>
          </div>
        </section>

        {/* ---------------------------------- */}
        {/* ERROR */}
        {/* ---------------------------------- */}

        {error && (
          <div className="mock-error">
            <XCircle size={18} />

            <span>{error}</span>
          </div>
        )}

        {/* ---------------------------------- */}
        {/* START SCREEN */}
        {/* ---------------------------------- */}

        {!question &&
          !starting && (
            <section className="mock-start-card">
              <div className="start-icon">
                <Brain size={34} />
              </div>

              <span className="start-badge">
                AI INTERVIEWER
              </span>

              <h2>
                Ready for your interview?
              </h2>

              <p>
                RepoMentor will ask
                questions based on your
                actual project analysis.
                Answer naturally, just like
                you would in a real
                interview.
              </p>

              <div className="start-features">
                <div>
                  <CheckCircle2
                    size={17}
                  />
                  Project-specific
                  questions
                </div>

                <div>
                  <CheckCircle2
                    size={17}
                  />
                  AI-powered evaluation
                </div>

                <div>
                  <CheckCircle2
                    size={17}
                  />
                  Interview-ready feedback
                </div>
              </div>

              <button
                className="start-interview-button"
                onClick={
                  startInterview
                }
              >
                <Sparkles size={18} />

                Start Mock Interview

                <ChevronRight
                  size={18}
                />
              </button>
            </section>
          )}

        {/* ---------------------------------- */}
        {/* QUESTION LOADING */}
        {/* ---------------------------------- */}

        {starting && (
          <section className="mock-loading-card">
            <div className="loading-brain">
              <Brain size={32} />
            </div>

            <h2>
              Preparing your question...
            </h2>

            <p>
              RepoMentor is analyzing
              your project context and
              preparing a relevant
              interview question.
            </p>

            <div className="mock-loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </section>
        )}

        {/* ---------------------------------- */}
        {/* QUESTION + SPEAKING */}
        {/* ---------------------------------- */}

        {question &&
          !evaluation && (
            <section className="question-card">
              <div className="question-top">
                <div className="question-number">
                  Q{questionNumber}
                </div>

                <div className="question-meta">
                  <span>
                    {question.category}
                  </span>

                  <span>
                    {question.difficulty}
                  </span>
                </div>
              </div>

              {/* QUESTION */}
              <div className="question-content">
                <MessageCircle
                  size={21}
                />

                <h2>
                  {question.question}
                </h2>
              </div>

              {/* ANSWER */}
              <div className="answer-section">
                <div className="answer-label-row">
                  <label htmlFor="answer">
                    Your Answer
                  </label>

                  <span>
                    {answer.length}/3000
                  </span>
                </div>

                <textarea
                  id="answer"
                  value={answer}
                  onChange={
                    handleAnswerChange
                  }
                  placeholder="You can type your answer or use the microphone to speak..."
                  maxLength={3000}
                  disabled={evaluating}
                />

                {/* -------------------------------- */}
                {/* SPEAKING CONTROLS */}
                {/* -------------------------------- */}

                <div className="speaking-panel">
                  <div className="speaking-info">
                    <div
                      className={`speaking-status ${
                        isListening
                          ? "listening"
                          : ""
                      }`}
                    >
                      <span className="speaking-status-dot"></span>

                      {isListening
                        ? "Listening..."
                        : "Voice Answer"}
                    </div>

                    <span className="speaking-time">
                      {formatTime(
                        speakingSeconds
                      )}
                    </span>
                  </div>

                  <div className="speaking-controls">
                    {!isListening ? (
                      <button
                        type="button"
                        className="start-speaking-button"
                        onClick={
                          startSpeaking
                        }
                        disabled={
                          evaluating ||
                          !speechSupported
                        }
                      >
                        <Mic
                          size={20}
                        />

                        Start Speaking
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="stop-speaking-button"
                        onClick={
                          stopSpeaking
                        }
                      >
                        <MicOff
                          size={20}
                        />

                        Stop Speaking
                      </button>
                    )}
                  </div>

                  {!speechSupported && (
                    <p className="speech-support-message">
                      Voice input is not
                      supported in this
                      browser. Please use
                      Google Chrome or
                      Microsoft Edge.
                    </p>
                  )}

                  {speechSupported &&
                    !isListening && (
                      <p className="speech-hint">
                        <Mic size={14} />
                        Click "Start
                        Speaking" and
                        answer naturally.
                        Your speech will
                        appear in the text
                        box above.
                      </p>
                    )}

                  {isListening && (
                    <div className="live-listening">
                      <span className="live-dot"></span>

                      <span>
                        I'm listening...
                        Speak clearly and
                        naturally.
                      </span>

                      <div className="voice-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* HINT */}
                <div className="answer-hint">
                  <Sparkles size={15} />

                  Tip: Keep your answer
                  simple, structured, and
                  honest.
                </div>
              </div>

              {/* SUBMIT */}
              <button
                className="submit-answer-button"
                onClick={
                  submitAnswer
                }
                disabled={
                  evaluating ||
                  !answer.trim() ||
                  isListening
                }
              >
                {evaluating ? (
                  <>
                    Evaluating

                    <span className="button-spinner"></span>
                  </>
                ) : (
                  <>
                    Submit Answer

                    <Send size={17} />
                  </>
                )}
              </button>

              {isListening && (
                <p className="submit-disabled-message">
                  Stop speaking before
                  submitting your answer.
                </p>
              )}
            </section>
          )}

        {/* ---------------------------------- */}
        {/* EVALUATION LOADING */}
        {/* ---------------------------------- */}

        {evaluating && (
          <section className="evaluation-loading">
            <div className="loading-brain">
              <Sparkles size={28} />
            </div>

            <h2>
              Evaluating your answer...
            </h2>

            <p>
              AI is reviewing your
              technical explanation and
              preparing feedback.
            </p>
          </section>
        )}

        {/* ---------------------------------- */}
        {/* EVALUATION */}
        {/* ---------------------------------- */}

        {evaluation && (
          <section className="evaluation-section">
            <div className="evaluation-header">
              <div>
                <span className="evaluation-label">
                  AI FEEDBACK
                </span>

                <h2>
                  Here's how you
                  performed
                </h2>
              </div>

              <div className="score-card">
                <Trophy size={20} />

                <strong>
                  {evaluation.score}

                  <small>/10</small>
                </strong>

                <span>
                  Interview Score
                </span>
              </div>
            </div>

            {/* OVERALL FEEDBACK */}
            <div className="feedback-card">
              <div className="feedback-title">
                <Sparkles size={18} />

                Overall Feedback
              </div>

              <p>
                {
                  evaluation.overallFeedback
                }
              </p>
            </div>

            {/* WHAT WAS GOOD */}
            {Array.isArray(
              evaluation.whatWasGood
            ) &&
              evaluation.whatWasGood
                .length > 0 && (
                <div className="feedback-card good-card">
                  <div className="feedback-title">
                    <CheckCircle2
                      size={18}
                    />

                    What You Did Well
                  </div>

                  <ul>
                    {evaluation.whatWasGood.map(
                      (
                        item,
                        index
                      ) => (
                        <li
                          key={index}
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* WHAT CAN IMPROVE */}
            {Array.isArray(
              evaluation.whatCanImprove
            ) &&
              evaluation.whatCanImprove
                .length > 0 && (
                <div className="feedback-card improve-card">
                  <div className="feedback-title">
                    <Target size={18} />

                    What You Can
                    Improve
                  </div>

                  <ul>
                    {evaluation.whatCanImprove.map(
                      (
                        item,
                        index
                      ) => (
                        <li
                          key={index}
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* BETTER ANSWER */}
            <div className="better-answer-card">
              <div className="better-answer-title">
                <MessageCircle
                  size={18}
                />

                Better Interview
                Answer
              </div>

              <p>
                {
                  evaluation.betterAnswer
                }
              </p>
            </div>

            {/* FOLLOW UP */}
            {evaluation.followUpQuestion && (
              <div className="follow-up-card">
                <span>
                  FOLLOW-UP QUESTION
                </span>

                <h3>
                  {
                    evaluation.followUpQuestion
                  }
                </h3>
              </div>
            )}

            {/* ACTIONS */}
            <div className="evaluation-actions">
              <button
                className="secondary-interview-button"
                onClick={
                  resetInterview
                }
              >
                <RotateCcw
                  size={17}
                />

                Restart
              </button>

              <button
                className="next-question-button"
                onClick={
                  nextQuestion
                }
              >
                Next Question

                <ChevronRight
                  size={18}
                />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default MockInterview;