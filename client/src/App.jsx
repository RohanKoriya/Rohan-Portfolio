import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Toaster } from "sonner";

import BlurText from "./components/ui/BlurText.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import CustomCursor from "./components/Customcursor.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import { ThemeProvider } from "./hooks/useTheme.jsx";

import HeroSection from "./sections/HeroSection.jsx";
import AboutSection from "./sections/AboutSection.jsx";
import SkillsSection from "./sections/SkillsSection.jsx";
import ProjectsSection from "./sections/ProjectsSection.jsx";
import ContactSection from "./sections/ContactSection.jsx";

const STATUS_MESSAGES = [
  "Initializing system",
  "MERN stack architecture",
  "Indexing featured work",
  "Rohan Koriya — Portfolio 2026",
];

const INTRO_DURATION = 1600; // ms for the counter to reach 100
const SESSION_KEY = "portfolio-intro-seen";

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  // Skip entirely for reduced-motion visitors, and on repeat visits within
  // the same tab session — nobody wants to sit through this every reload.
  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof window === "undefined") return true;
    if (prefersReducedMotion) return true;
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  });
  const [progress, setProgress] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const startRef = useRef(null);

  const statusIndex =
    progress > 75 ? 3 : progress > 50 ? 2 : progress > 25 ? 1 : 0;

  // Cmd+K / Ctrl+K command palette shortcut
  useEffect(() => {
    const handler = (event) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;
      if (modifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Intro progress counter — a single requestAnimationFrame loop instead of
  // a setInterval chain, so it's one state update per frame, not per tick.
  useEffect(() => {
    if (introFinished) return;

    let frame;
    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const next = Math.min(100, Math.round((elapsed / INTRO_DURATION) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [introFinished]);

  // Once progress hits 100, hold briefly, then let the curtain lift.
  useEffect(() => {
    if (progress < 100 || introFinished) return;
    const timeout = setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      setIntroFinished(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [progress, introFinished]);

  const skipIntro = () => {
    window.sessionStorage.setItem(SESSION_KEY, "true");
    setIntroFinished(true);
  };

  // Lock scroll while the intro is up, and restore it once it lifts.
  useEffect(() => {
    document.body.style.overflow = introFinished ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introFinished]);

  return (
    <ThemeProvider>
      <CustomCursor />
      <ScrollProgress />
      <AnimatePresence>
        {!introFinished && (
          <motion.div
            key="intro-curtain"
            role="button"
            tabIndex={0}
            aria-label="Skip intro"
            onClick={skipIntro}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") skipIntro();
            }}
            initial={{ opacity: 1, y: 0 }}
            exit={{
              y: "-100%",
              transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
            }}
            className="fixed inset-0 z-[9999] flex cursor-pointer select-none flex-col justify-between overflow-hidden bg-canvas dark:bg-canvas-dark px-8 py-10 text-ink dark:text-ink-dark"
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase text-muted dark:text-muted-dark">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-signal animate-pulse-dot" />
                <span>Rohan Koriya</span>
              </div>
              <span>Mumbai, IN</span>
            </div>

            {/* Headline */}
            <div className="flex flex-col items-center justify-center my-auto text-center">
              <BlurText
                text="Designing & Engineering Web Products"
                delay={120}
                animateBy="words"
                direction="top"
                stepDuration={0.45}
                className="justify-center max-w-2xl text-3xl font-medium tracking-tight text-center text-ink dark:text-ink-dark sm:text-4xl md:text-5xl"
              />

              <div className="h-6 mt-6 overflow-hidden">
                <motion.p
                  key={statusIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-xs tracking-widest uppercase text-muted dark:text-muted-dark"
                >
                  {STATUS_MESSAGES[statusIndex]}
                </motion.p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between font-mono text-sm">
                <span className="text-xs tracking-wider uppercase text-muted dark:text-muted-dark">
                  Loading experience
                </span>
                <span className="text-4xl font-light tracking-tighter text-ink dark:text-ink-dark sm:text-5xl">
                  {String(progress).padStart(3, "0")}
                  <span className="ml-1 text-xs font-normal text-muted dark:text-muted-dark">
                    %
                  </span>
                </span>
              </div>

              <div className="relative h-[2px] w-full overflow-hidden bg-line dark:bg-line-dark">
                <div
                  className="h-full bg-ink dark:bg-ink-dark"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="text-center text-[11px] text-muted/70 dark:text-muted-dark/70">
                Click anywhere to skip
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        aria-hidden={!introFinished}
        inert={!introFinished}
        className={`min-h-screen transition-opacity duration-700 ${
          introFinished ? "opacity-100" : "opacity-0"
        }`}
      >
        <Toaster position="bottom-right" richColors closeButton />
        <Navbar onOpenPalette={() => setPaletteOpen(true)} />
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
        />
        <main>
          <HeroSection />
          <ProjectsSection />
          <AboutSection />
          <SkillsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
0;
