import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">

        <a href="#" className="logo">
          <span className="logo-icon">
            <Code2 size={22} />
          </span>
          <span>Repo<span>Mentor</span></span>
        </a>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>

          <div className="mobile-buttons">
            <button className="login-btn">Login</button>
            <button className="primary-btn">Get Started</button>
          </div>
        </div>

        <div className="nav-actions">
          <button className="login-btn">Login</button>
          <button className="primary-btn">Get Started</button>
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;