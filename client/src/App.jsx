import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

import Analysis from "./pages/Analysis";
import Assistant from "./pages/Assistant";
import MockInterview from "./pages/MockInterview";

function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>

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