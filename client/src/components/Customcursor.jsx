import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const SPRING_CONFIG = {
  stiffness: 450,
  damping: 28,
  mass: 0.3,
};

const CURSOR_CLASS = "custom-cursor-active";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  '[role="button"]',
  "input",
  "select",
  "textarea",
  "label",
  '[data-cursor="pointer"]',
].join(", ");

const NATIVE_CURSOR_SELECTOR = [
  "input",
  "select",
  "textarea",
  '[contenteditable="true"]',
  '[contenteditable=""]',
  '[role="textbox"]',
].join(", ");

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isNativeTarget, setIsNativeTarget] = useState(false);
  const [isTextSelecting, setIsTextSelecting] = useState(false);

  const cursorModeRef = useRef("default");
  const mouseIsDownRef = useRef(false);
  const selectionActiveRef = useRef(false);

  // Immediate center-dot position.
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth trailing reticle.
  const springX = useSpring(cursorX, SPRING_CONFIG);
  const springY = useSpring(cursorY, SPRING_CONFIG);

  useEffect(() => {
    const supportsCustomCursor = window.matchMedia(
      "(pointer: fine) and (hover: hover)",
    ).matches;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!supportsCustomCursor || prefersReducedMotion) return;

    const root = document.documentElement;

    root.classList.add(CURSOR_CLASS);
    setEnabled(true);

    const updateCursorMode = (target) => {
      if (!(target instanceof Element)) return;

      const isNative = Boolean(target.closest(NATIVE_CURSOR_SELECTOR));
      const isInteractive =
        !isNative && Boolean(target.closest(INTERACTIVE_SELECTOR));

      const nextMode = isNative
        ? "native"
        : isInteractive
          ? "interactive"
          : "default";

      if (cursorModeRef.current === nextMode) return;

      cursorModeRef.current = nextMode;
      setIsNativeTarget(isNative);
      setIsHovered(isInteractive);
    };

    const handleMove = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      setIsVisible(true);
      updateCursorMode(event.target);
    };

    const handleMouseDown = () => {
      mouseIsDownRef.current = true;
      setIsPressed(true);
    };

    const restoreAfterSelection = () => {
      if (!selectionActiveRef.current) return;
      selectionActiveRef.current = false;
      setIsTextSelecting(false);
      root.classList.add(CURSOR_CLASS);
    };

    const handleMouseUp = () => {
      mouseIsDownRef.current = false;
      setIsPressed(false);
      restoreAfterSelection();
    };

    const handleSelectionChange = () => {
      if (!mouseIsDownRef.current) return;
      const selection = window.getSelection();
      if (selection?.type !== "Range") return;
      if (selectionActiveRef.current) return;

      selectionActiveRef.current = true;
      setIsTextSelecting(true);
      root.classList.remove(CURSOR_CLASS);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsPressed(false);
      mouseIsDownRef.current = false;
      restoreAfterSelection();
    };

    const handleWindowBlur = () => {
      setIsPressed(false);
      mouseIsDownRef.current = false;
      restoreAfterSelection();
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("blur", handleWindowBlur);

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      root.classList.remove(CURSOR_CLASS);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  const cursorHidden = !isVisible || isNativeTarget || isTextSelecting;

  return (
    <>
      <style>{`
        .${CURSOR_CLASS},
        .${CURSOR_CLASS} * {
          cursor: none !important;
        }

        .${CURSOR_CLASS} input,
        .${CURSOR_CLASS} select,
        .${CURSOR_CLASS} textarea,
        .${CURSOR_CLASS} [contenteditable="true"],
        .${CURSOR_CLASS} [role="textbox"] {
          cursor: auto !important;
        }

        .${CURSOR_CLASS} input:not([type]),
        .${CURSOR_CLASS} input[type="text"],
        .${CURSOR_CLASS} input[type="search"],
        .${CURSOR_CLASS} input[type="email"],
        .${CURSOR_CLASS} input[type="password"],
        .${CURSOR_CLASS} textarea {
          cursor: text !important;
        }
      `}</style>

      {/* 1. Precision Center Dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isPressed ? 0.75 : isHovered ? 0 : 1,
          opacity: cursorHidden || isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent dark:bg-accent-dark" />
      </motion.div>

      {/* 2. Smooth Reticle (Zero Rotation, Clean Scale & Color Lock) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ x: springX, y: springY }}
        animate={{
          scale: isPressed ? 0.8 : isHovered ? 0.7 : 1,
          opacity: cursorHidden ? 0 : 1,
        }}
        transition={{
          scale: { type: "spring", stiffness: 450, damping: 25 },
          opacity: { duration: 0.12 },
        }}
      >
        <div className="flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-colors duration-200 ${
              isHovered ? "text-signal" : "text-ink/40 dark:text-ink-dark/40"
            }`}
          >
            <path
              d="M12 4H4V12"
              stroke="currentColor"
              strokeWidth={isHovered ? 2 : 1.5}
              strokeLinecap="round"
            />
            <path
              d="M32 4H40V12"
              stroke="currentColor"
              strokeWidth={isHovered ? 2 : 1.5}
              strokeLinecap="round"
            />
            <path
              d="M12 40H4V32"
              stroke="currentColor"
              strokeWidth={isHovered ? 2 : 1.5}
              strokeLinecap="round"
            />
            <path
              d="M32 40H40V32"
              stroke="currentColor"
              strokeWidth={isHovered ? 2 : 1.5}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>
    </>
  );
}
