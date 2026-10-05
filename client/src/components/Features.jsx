import {
  Brain,
  MessageSquareCode,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Project Analysis",
    description:
      "Understand your project's purpose, architecture, tech stack, and how the different parts work together.",
  },
  {
    icon: MessageSquareCode,
    title: "Interview Preparation",
    description:
      "Get project-specific interview questions and learn how to confidently explain your implementation.",
  },
  {
    icon: BarChart3,
    title: "Project Insights",
    description:
      "Turn your repository into clear insights about technologies, structure, important files, and project flow.",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="section-heading">
          <span className="section-label">WHY REPOMENTOR</span>
          <h2>Everything you need to understand your project.</h2>
          <p>
            Stop memorizing your code before interviews. Understand it,
            explain it, and be ready to discuss it.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={22} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <span className="feature-arrow">→</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;