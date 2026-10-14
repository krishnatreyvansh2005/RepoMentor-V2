import {
  BrowserRouter,
  Routes,
  Route, useLocation,
} from "react-router-dom";

import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

import Analysis from "./pages/Analysis";
import Assistant from "./pages/Assistant";
import MockInterview from "./pages/MockInterview";

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (!sectionId) return;

    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.key, location.state]);
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <section className="about" id="about">
        <div className="about-container">
          <div className="about-content">
            <span className="section-label">ABOUT REPOMENTOR</span>

            <h2>
              Built for developers who want to
              <span> understand what they built.</span>
            </h2>

            <p>
              RepoMentor is an AI-powered developer tool that turns a GitHub
              repository into a clear, interview-friendly explanation of the
              project.
            </p>

            <p>
              Instead of revisiting hundreds of lines of code before an interview,
              developers can quickly understand their project's architecture,
              technologies, important files, and implementation flow.
            </p>

            <div className="about-points">
              <div>
                <strong>01</strong>
                <span>Understand your codebase</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Explain your project clearly</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Prepare for technical interviews</span>
              </div>
            </div>
          </div>

          <div className="about-panel">
            <div className="about-panel-top">
              <span className="status-dot"></span>
              <span>repository.status</span>
            </div>

            <div className="about-code">
              <span>project</span>
              <strong>understood</strong>
            </div>

            <div className="about-stats">
              <div>
                <span>Architecture</span>
                <strong>Mapped</strong>
              </div>

              <div>
                <span>Tech Stack</span>
                <strong>Detected</strong>
              </div>

              <div>
                <span>Interview</span>
                <strong>Ready</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/analysis"
          element={<Analysis />}
        />

        <Route
          path="/assistant"
          element={<Assistant />}
        />

        <Route
          path="/mock-interview"
          element={<MockInterview />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;