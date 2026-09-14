import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Copy, MoonStar, SunMedium } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../hooks/useTheme.jsx";

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const commands = useMemo(
    () => [
      { id: "work", label: "Go to Work", action: () => scrollTo("#work") },
      { id: "about", label: "Go to About", action: () => scrollTo("#about") },
      {
        id: "skills",
        label: "Go to Skills",
        action: () => scrollTo("#skills"),
      },
      {
        id: "contact",
        label: "Go to Contact",
        action: () => scrollTo("#contact"),
      },
      {
        id: "copy-email",
        label: "Copy email address",
        icon: Copy,
        action: () => {
          navigator.clipboard?.writeText("koriyarohan123@gmail.com");
          toast.success("Email copied to clipboard");
        },
      },
      {
        id: "theme",
        label:
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        icon: theme === "dark" ? SunMedium : MoonStar,
        action: toggleTheme,
      },
      {
        id: "github",
        label: "Open GitHub profile",
        icon: ArrowUpRight,
        action: () =>
          window.open("https://github.com/rohankoriya", "_blank", "noopener"),
      },
    ],
    [theme, toggleTheme],
  );

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  function scrollTo(hash) {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-ink/30 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-md overflow-hidden border shadow-xl rounded-2xl border-line dark:border-line-dark bg-canvas dark:bg-canvas-dark"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Type a command…"
              className="w-full border-b border-line dark:border-line-dark bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted dark:placeholder:text-muted-dark"
            />
            <ul className="p-2 overflow-y-auto max-h-72">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-sm text-center text-muted dark:text-muted-dark">
                  No matches
                </li>
              )}
              {filtered.map((command) => (
                <li key={command.id}>
                  <button
                    type="button"
                    onClick={() => {
                      command.action();
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-ink dark:text-ink-dark hover:bg-surface dark:hover:bg-surface-dark"
                  >
                    {command.label}
                    {command.icon ? (
                      <command.icon size={14} strokeWidth={1.75} />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
