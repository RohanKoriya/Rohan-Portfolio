import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Toaster } from "sonner";

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
import DotsBackground from "./components/DotsBackground.jsx";

const INTRO_DURATION = 1500;
const SESSION_KEY = "portfolio-intro-seen";

// Smooth start and finish so the count feels natural, not mechanical
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof window === "undefined") return true;
    if (prefersReducedMotion) return true;
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  });
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (introFinished) return;

    let frame;
    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const t = Math.min(1, (timestamp - startRef.current) / INTRO_DURATION);
      const next = Math.round(easeInOutCubic(t) * 100);
      setProgress(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [introFinished]);

  useEffect(() => {
    if (progress < 100 || introFinished) return;
    const timeout = setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      setIntroFinished(true);
    }, 600);
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

  // Three digits so the width never shifts while counting
  const padded = String(progress).padStart(3, "0");
  // Soft-edged mask that rises from the bottom (edge runs from -14% to 100%)
  const edge = progress * 1.14 - 14;
  const fillMask = `linear-gradient(to top, #000 ${edge}%, transparent ${edge + 14}%)`;

  return (
    <ThemeProvider>
      <CustomCursor />
      <ScrollProgress />
      <DotsBackground />
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
            initial={{ y: 0 }}
            exit={{
              y: "-100%",
              transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
            }}
            className="fixed inset-y-0 left-0 right-0 z-[9999] mx-auto flex w-full max-w-content cursor-pointer select-none items-center justify-center overflow-hidden border-x border-dashed border-line bg-canvas text-ink dark:border-line-dark/50 dark:bg-canvas-dark dark:text-ink-dark"
          >
            {/* Centered counter: the number fills from the bottom up as it loads */}
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                y: -28,
                filter: "blur(8px)",
                transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
              }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-baseline"
              role="progressbar"
              aria-label="Loading"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span className="relative font-light leading-none tracking-tighter tabular-nums text-7xl sm:text-8xl md:text-9xl">
                {/* Dim base layer */}
                <span className="opacity-[0.16]">{padded}</span>
                {/* Bright layer revealed with a soft edge that rises with progress */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    WebkitMaskImage: fillMask,
                    maskImage: fillMask,
                  }}
                >
                  {padded}
                </span>
              </span>
              <span className="ml-1 text-xl font-light sm:text-2xl md:text-3xl text-muted dark:text-muted-dark">
                %
              </span>
            </motion.div>

            {/* Skip hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute left-0 right-0 text-xs tracking-wide text-center bottom-8 sm:bottom-10 text-muted dark:text-muted-dark"
            >
              Click or tap anywhere to skip
            </motion.span>
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
