import { useRef } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme.jsx";

const TRANSITION_DURATION = 550;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef(null);
  const isDark = theme === "dark";

  const handleToggle = () => {
    const button = buttonRef.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Fall back to an instant swap when the API isn't supported, the button
    // ref isn't available yet, or the visitor has reduced motion enabled.
    if (!document.startViewTransition || !button || prefersReducedMotion) {
      toggleTheme();
      return;
    }

    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      // flushSync forces the state update (and DOM mutation) to happen
      // synchronously, so the browser's "new state" snapshot reflects the
      // flipped theme rather than a stale, pre-toggle frame.
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: TRANSITION_DURATION,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="inline-flex items-center justify-center transition-colors border rounded-full h-9 w-9 border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface dark:hover:bg-surface-dark"
    >
      {isDark ? (
        <Sun size={16} strokeWidth={1.75} />
      ) : (
        <Moon size={16} strokeWidth={1.75} />
      )}
    </button>
  );
}
