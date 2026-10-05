import { Code2, Menu, X, GitBranch } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">

        <a href="/" className="logo">
          <span className="logo-icon">
            <Code2 size={20} />
          </span>

          <span className="logo-text">
            Repo<span>Mentor</span>
          </span>
        </a>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="/#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>

          <a href="/#how-it-works" onClick={() => setMenuOpen(false)}>
            How It Works
          </a>

          <a href="/#about" onClick={() => setMenuOpen(false)}>
            About
          </a>

          <div className="mobile-buttons">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="github-btn"
            >
              <GitBranch size={17} />
              GitHub
            </a>

            <a href="/#analyze" className="primary-btn">
              Analyze Repo
            </a>
          </div>
        </div>

        <div className="nav-actions">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="github-btn"
          >
            <GitBranch size={17} />
            GitHub
          </a>

          <a href="/#analyze" className="primary-btn">
            Analyze Repo
          </a>
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;