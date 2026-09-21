import { GitBranch, Bot, GraduationCap, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: GitBranch,
    title: "Paste your GitHub URL",
    text: "Give RepoMentor the link to your public GitHub repository.",
  },
  {
    number: "02",
    icon: Bot,
    title: "Let AI analyze it",
    text: "Our AI studies your project structure, code, dependencies and architecture.",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Understand & prepare",
    text: "Learn your project and practice questions before your interview.",
  },
];

function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="section-heading how-heading">
        <span>HOW IT WORKS</span>

        <h1>
          From GitHub link to
          <br />
          <strong>interview ready.</strong>
        </h1>

        <p>
          RepoMentor analyzes your GitHub project, explains how it works,
          and helps you prepare for project-based interview questions.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div className="step-wrapper" key={step.number}>
              <div className="step-card">
                <div className="step-top">
                  <span>{step.number}</span>

                  <div className="step-icon">
                    <Icon />
                  </div>
                </div>

                <h3>{step.title}</h3>

                <p>{step.text}</p>
              </div>

              {index !== steps.length - 1 && (
                <ArrowRight className="step-arrow" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;