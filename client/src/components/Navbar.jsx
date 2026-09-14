import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Command } from "lucide-react";
import ThemeToggle from "./ui/ThemeToggle.jsx";
import Button from "./ui/Button.jsx";
import { DownloadIcon, LetterRIcon } from "./ui/AnimatedIcons.jsx";
import { RESUME_FILE } from "../data/site.js";
import { useActiveSection } from "../hooks/useActiveSection.js";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace("#", ""));

export default function Navbar({ onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const monogramRef = useRef(null);
  const downloadRef = useRef(null);
  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll("a, button");
    focusable?.[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="pt-4 container-content">
        <div className="flex items-center justify-between rounded-full border border-line/70 dark:border-line-dark/70 bg-canvas/80 dark:bg-canvas-dark/80 px-4 py-2.5 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-200">
          {/* Logo / Monogram */}
          <a
            href="#top"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight transition-opacity text-ink dark:text-ink-dark hover:opacity-70"
            onMouseEnter={() => monogramRef.current?.startAnimation()}
            onMouseLeave={() => monogramRef.current?.stopAnimation()}
          >
            <LetterRIcon ref={monogramRef} size={20} />
            <span className="hidden font-medium sm:inline">Rohan Koriya</span>
          </a>

          {/* Desktop links */}
          <nav className="items-center hidden gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  data-cursor="link"
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-ink dark:text-ink-dark"
                      : "text-muted dark:text-muted-dark hover:bg-surface dark:hover:bg-surface-dark hover:text-ink dark:hover:text-ink-dark"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-surface dark:bg-surface-dark"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="items-center hidden gap-2 md:flex">
            <button
              type="button"
              onClick={onOpenPalette}
              className="flex items-center gap-1.5 rounded-full border border-line dark:border-line-dark bg-surface/60 dark:bg-surface-dark/60 px-3 py-1.5 text-xs font-mono text-muted dark:text-muted-dark transition-colors hover:border-ink/30 dark:hover:border-ink-dark/30 hover:text-ink dark:hover:text-ink-dark"
              aria-label="Open command palette"
            >
              <Command size={12} strokeWidth={2} />
              <kbd className="text-[10px] font-semibold tracking-wider">K</kbd>
            </button>
            <ThemeToggle />
            <Button
              as="a"
              href={RESUME_FILE}
              download
              variant="secondary"
              className="!px-4 !py-1.5 text-xs font-medium"
              onMouseEnter={() => downloadRef.current?.startAnimation()}
              onMouseLeave={() => downloadRef.current?.stopAnimation()}
            >
              <DownloadIcon ref={downloadRef} size={15} />
              Resume
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="inline-flex items-center justify-center transition-colors border rounded-full md:hidden h-9 w-9 border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface dark:hover:bg-surface-dark"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="absolute right-0 top-0 h-full w-[80%] max-w-xs bg-canvas dark:bg-canvas-dark border-l border-line dark:border-line-dark p-6 flex flex-col shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-semibold text-ink dark:text-ink-dark">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex items-center justify-center border rounded-full h-9 w-9 border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface dark:hover:bg-surface-dark"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-base font-medium transition-colors rounded-xl text-ink dark:text-ink-dark hover:bg-surface dark:hover:bg-surface-dark"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pt-6 mt-auto border-t border-line dark:border-line-dark">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenPalette();
                  }}
                  className="flex items-center gap-2 w-full rounded-xl border border-line dark:border-line-dark bg-surface/60 dark:bg-surface-dark/60 px-4 py-2.5 text-xs font-mono text-muted dark:text-muted-dark"
                >
                  <Command size={14} /> Command Palette
                </button>

                <div className="flex items-center justify-between pt-2">
                  <ThemeToggle />
                  <Button
                    as="a"
                    href={RESUME_FILE}
                    download
                    variant="secondary"
                    className="!px-4 !py-2 text-xs"
                  >
                    <DownloadIcon size={15} /> Resume
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
