import { Code2, Menu, X, GitBranch } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = (sectionId) => {
    setMenuOpen(false);


    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });


  };

  return (<nav className="navbar"> <div className="nav-container">
    <Link
      to="/"
      className="logo"
      onClick={() => setMenuOpen(false)}
    > <span className="logo-icon"> <Code2 size={20} /> </span>


      <span className="logo-text">
        Repo<span>Mentor</span>
      </span>
    </Link>

    <div className={`nav-links ${menuOpen ? "active" : ""}`}>
      <button onClick={() => goToSection("features")}>
        Features
      </button>

      <button onClick={() => goToSection("how-it-works")}>
        How It Works
      </button>

      <button onClick={() => goToSection("about")}>
        About
      </button>

      <div className="mobile-buttons">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="github-btn"
          onClick={() => setMenuOpen(false)}
        >
          <GitBranch size={17} />
          GitHub
        </a>

        <button
          className="primary-btn"
          onClick={() => goToSection("analyze")}
        >
          Analyze Repo
        </button>
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

      <button
        className="primary-btn"
        onClick={() => goToSection("analyze")}
      >
        Analyze Repo
      </button>
    </div>

    <button
      className="menu-btn"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle navigation"
      aria-expanded={menuOpen}
    >
      {menuOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  </div>
  </nav>


  );
}

export default Navbar;
