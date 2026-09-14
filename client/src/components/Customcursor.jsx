import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const SPRING_CONFIG = { stiffness: 400, damping: 28, mass: 0.35 };

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPressed, setIsPressed] = useState(false);

  // Raw position for zero-latency center dot
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring position for smooth trailing reticle
  const springX = useSpring(cursorX, SPRING_CONFIG);
  const springY = useSpring(cursorY, SPRING_CONFIG);

  useEffect(() => {
    const isCoarse = window.matchMedia(
      "(pointer: coarse), (hover: none)",
    ).matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isCoarse || prefersReducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const handleMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        .custom-cursor-active,
        .custom-cursor-active * {
          cursor: none !important;
        }
      `}</style>

      {/* 1. Precision Center Dot (Instant follow) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{ scale: isPressed ? 0.75 : 1 }}
        transition={{ duration: 0.1 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent dark:bg-accent-dark" />
      </motion.div>

      {/* 2. SVG Reticle (Smooth spring trail + scale physics) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{
          x: springX,
          y: springY,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{ scale: isPressed ? 0.85 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-ink/40 dark:text-ink-dark/40"
          >
            {/* Corner Brackets */}
            <path
              d="M12 4H4V12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M32 4H40V12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 40H4V32"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M32 40H40V32"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>
    </>
  );
}
