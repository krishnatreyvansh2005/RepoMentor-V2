import { Code2, GitBranch, BriefcaseBusiness, MessageCircle } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <div className="logo">
            <span className="logo-icon">
              <Code2 size={20} />
            </span>
            Repo<span>Mentor</span>
          </div>

          <p>
            Understand your code.
            <br />
            Master your interview.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#">Pricing</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
          </div>

          <div>
            <h4>Connect</h4>

            <div className="social-links">
              <a href="#"><GitBranch /></a>
              <a href="#"><BriefcaseBusiness /></a>
              <a href="#"><MessageCircle /></a>
            </div>
          </div>

        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2026 RepoMentor. All rights reserved.</span>
        <span>Built for developers 🚀</span>
      </div>

    </footer>
  );
}

export default Footer;