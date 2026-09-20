import {
  BrainCircuit,
  Code2,
  FolderTree,
  Database,
  Library,
  MessageSquareCode,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Project Analysis",
    text: "Get a complete understanding of what your project does and how it works.",
  },
  {
    icon: Code2,
    title: "Tech Stack Detection",
    text: "Automatically identify frameworks, languages, tools and technologies.",
  },
  {
    icon: FolderTree,
    title: "Project Structure",
    text: "Understand every important folder and file inside your repository.",
  },
  {
    icon: Database,
    title: "API & Database",
    text: "Discover API endpoints, database models and how your backend works.",
  },
  {
    icon: Library,
    title: "Libraries & Dependencies",
    text: "Know which packages you used and why they are important.",
  },
  {
    icon: MessageSquareCode,
    title: "Interview Preparation",
    text: "Generate project-specific questions and practice with an AI interviewer.",
  },
];

function Features() {
  return (
    <section className="features-section" id="features">

      <div className="section-heading">
        <span>POWERFUL FEATURES</span>

        <h2>
          Everything you need to
          <br />
          <strong>understand your project.</strong>
        </h2>

        <p>
          RepoMentor turns your GitHub repository into a complete
          project guide designed especially for developers and freshers.
        </p>
      </div>

      <div className="features-grid">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div className="feature-card" key={index}>

              <div className="feature-card-icon">
                <Icon size={24} />
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

              <div className="feature-number">
                0{index + 1}
              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Features;