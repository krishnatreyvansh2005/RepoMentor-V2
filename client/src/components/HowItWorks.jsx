import { GitBranch, Brain, MessageCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: GitBranch,
    title: "Connect your repository",
    description:
      "Paste the URL of your public GitHub repository and let RepoMentor inspect the project.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI understands your code",
    description:
      "RepoMentor analyzes the structure, technologies, important files, and project flow.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Prepare for interviews",
    description:
      "Use the generated explanations and project-specific questions to prepare with confidence.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-container">
        <div className="section-heading">
          <span className="section-label">HOW IT WORKS</span>
          <h2>From repository to interview-ready.</h2>
          <p>
            Three simple steps to turn a codebase you built into a project
            you can confidently explain.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div className="step" key={step.number}>
                <div className="step-number">{step.number}</div>

                <div className="step-icon">
                  <Icon size={21} />
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>

                {index !== steps.length - 1 && (
                  <div className="step-line" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;