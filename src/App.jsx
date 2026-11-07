import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';

// Pages
import Home from './pages/Home';
import Universe from './pages/Universe';
import CaseDetails from './pages/CaseDetails';
import Investigation from './pages/Investigation';
import TimeMachine from './pages/TimeMachine';
import Multiverse from './pages/Multiverse';
import CrossExamination from './pages/CrossExamination';
import ExperienceCreator from './pages/ExperienceCreator';
import DecisionDNA from './pages/DecisionDNA';
import Verification from './pages/Verification';
import About from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-mneme-950 text-slate-100 flex flex-col font-sans selection:bg-mneme-accent/30 selection:text-white">
      {/* Dynamic ambient particles */}
      <ParticleBackground />

      {/* Auto scroll-to-top */}
      <ScrollToTop />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/universe" element={<Universe />} />
          <Route path="/case/:id" element={<CaseDetails />} />
          <Route path="/investigate/:id" element={<Investigation />} />
          <Route path="/time-machine/:id" element={<TimeMachine />} />
          <Route path="/multiverse/:id" element={<Multiverse />} />
          <Route path="/cross-examination/:id" element={<CrossExamination />} />
          <Route path="/experience/create" element={<ExperienceCreator />} />
          <Route path="/dashboard" element={<DecisionDNA />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/about" element={<About />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
