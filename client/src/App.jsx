import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Toaster } from "sonner";

import BlurText from "./components/ui/Blurtext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CustomCursor from "./components/Customcursor.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import { ThemeProvider } from "./hooks/useTheme.jsx";

import HeroSection from "./sections/HeroSection.jsx";
import AboutSection from "./sections/AboutSection.jsx";
import SkillsSection from "./sections/SkillsSection.jsx";
import ProjectsSection from "./sections/ProjectsSection.jsx";
import ContactSection from "./sections/ContactSection.jsx";
import ProgressiveBlur from "./components/ui/ProgressiveBlur.jsx";

const STATUS_MESSAGES = [
  "Setting things in motion",
  "Crafting the details",
  "Almost ready",
];

const INTRO_DURATION = 1600;
const SESSION_KEY = "portfolio-intro-seen";

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof window === "undefined") return true;
    if (prefersReducedMotion) return true;
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  });
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);

  const statusIndex =
    progress > 75 ? 3 : progress > 50 ? 2 : progress > 25 ? 1 : 0;

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
            className="fixed inset-0 z-[9999] flex cursor-pointer select-none flex-col justify-between overflow-hidden bg-canvas dark:bg-canvas-dark px-4 py-10 text-ink dark:text-ink-dark"
          >
            <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase text-muted dark:text-muted-dark">
              <div className="flex items-center gap-2">
                <span>Rohan Koriya</span>
              </div>
              <span>Mumbai, IN</span>
            </div>

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

            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between font-mono text-sm">
                <span className="text-xs tracking-wider uppercase text-muted dark:text-muted-dark">
                  Loading---
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
        inert={!introFinished ? "" : undefined}
        className={`min-h-screen transition-opacity duration-700 ${
          introFinished ? "opacity-100" : "opacity-0"
        }`}
      >
        <Toaster position="bottom-right" richColors closeButton />

        {/* Main wrapper featuring outer dashed vertical layout borders */}
        <div className="relative min-h-screen mx-auto border-dashed max-w-content border-x border-line dark:border-line-dark/50">
          <Navbar />

          <main>
            <HeroSection />
            <ProjectsSection />
            <AboutSection />
            <SkillsSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
        <ProgressiveBlur />
      </div>
    </ThemeProvider>
  );
}
