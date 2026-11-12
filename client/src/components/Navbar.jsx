import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Check } from "lucide-react";

import ThemeToggle from "./ui/ThemeToggle.jsx";
import Button from "./ui/Button.jsx";

import { DownloadIcon, LetterRIcon } from "./ui/AnimatedIcons.jsx";

import { RESUME_FILE } from "../data/Site.js";
import { useActiveSection } from "../hooks/useActiveSection.js";

const NAV_LINKS = [
  { label: "Projects", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace("#", ""));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [resumeDownloaded, setResumeDownloaded] = useState(false);

  const menuContainerRef = useRef(null);
  const monogramRef = useRef(null);
  const downloadRef = useRef(null);
  const downloadTimeoutRef = useRef(null);

  const activeSection = useActiveSection(SECTION_IDS);

  // Resume download feedback
  const handleResumeDownload = () => {
    if (downloadTimeoutRef.current) {
      window.clearTimeout(downloadTimeoutRef.current);
    }

    setResumeDownloaded(true);

    downloadTimeoutRef.current = window.setTimeout(() => {
      setResumeDownloaded(false);
      downloadTimeoutRef.current = null;
    }, 2500);
  };

  // Clean up download timer
  useEffect(() => {
    return () => {
      if (downloadTimeoutRef.current) {
        window.clearTimeout(downloadTimeoutRef.current);
      }
    };
  }, []);

  // Close menu if viewport resizes to desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (event) => {
      if (event.matches) setOpen(false);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Close on Escape key or click outside
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handlePointerDown = (event) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 border-b border-line bg-canvas dark:border-line-dark dark:bg-canvas-dark">
      <div
        className="
          mx-auto grid max-w-content
          grid-cols-[1fr_auto] items-center
          px-5 py-3 sm:px-6
          md:grid-cols-[1fr_auto_1fr]
        "
      >
        {/* Logo */}
        <a
          href="#top"
          aria-label="Rohan Koriya, back to top"
          className="
            flex items-center justify-self-start gap-2.5
            text-sm font-semibold tracking-tight
            text-ink transition-opacity hover:opacity-70
            dark:text-ink-dark
          "
          onMouseEnter={() => monogramRef.current?.startAnimation()}
          onMouseLeave={() => monogramRef.current?.stopAnimation()}
        >
          <LetterRIcon ref={monogramRef} size={20} />
          <span className="font-medium">Rohan Koriya</span>
        </a>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary navigation"
          className="items-center hidden gap-1 justify-self-center md:flex"
        >
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                data-cursor="link"
                aria-current={isActive ? "location" : undefined}
                className={`
                  relative rounded-full px-4 py-1.5
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "text-ink dark:text-ink-dark"
                      : "text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark"
                  }
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 border rounded-full border-line/60 bg-surface dark:border-line-dark/60 dark:bg-surface-dark"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div
          className="
            hidden items-center justify-self-end
            gap-2.5 md:flex
          "
        >
          <ThemeToggle />

          <Button
            as="a"
            href={RESUME_FILE}
            download
            variant="primary"
            className="
              !rounded-lg !px-4 !py-2
              text-xs font-medium
            "
            onClick={handleResumeDownload}
            onMouseEnter={() => {
              if (!resumeDownloaded) {
                downloadRef.current?.startAnimation();
              }
            }}
            onMouseLeave={() => downloadRef.current?.stopAnimation()}
          >
            <span className="relative inline-grid w-4 h-4 shrink-0 place-items-center">
              <AnimatePresence mode="wait" initial={false}>
                {resumeDownloaded ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.5, y: 3 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -2 }}
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 20,
                    }}
                    className="absolute inset-0 grid place-items-center text-signal"
                  >
                    <Check size={16} strokeWidth={3} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="download"
                    initial={{ opacity: 0, scale: 0.7, y: -3 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: -3 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <DownloadIcon ref={downloadRef} size={15} />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            Resume
          </Button>
        </div>

        {/* Mobile controls + Floating Popover Menu */}
        <div
          ref={menuContainerRef}
          className="relative flex items-center gap-2 justify-self-end md:hidden"
        >
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-haspopup="menu"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            className="inline-flex items-center justify-center transition-colors border rounded-lg h-9 w-9 border-line text-ink hover:bg-surface dark:border-line-dark dark:text-ink-dark dark:hover:bg-surface-dark"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="grid place-items-center"
                >
                  <X size={18} strokeWidth={1.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="grid place-items-center"
                >
                  <Menu size={18} strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Compact Popover Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-navigation"
                role="menu"
                aria-label="Mobile primary navigation"
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{
                  duration: 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "top right" }}
                className="
        absolute right-0 top-[calc(100%+10px)] z-50
        w-56 overflow-hidden rounded-2xl
        border border-line bg-canvas p-2
        shadow-xl
        dark:border-line-dark dark:bg-canvas-dark
      "
              >
                <nav className="flex flex-col gap-0.5">
                  {NAV_LINKS.map((link) => {
                    const sectionId = link.href.replace("#", "");
                    const isActive = activeSection === sectionId;

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        role="menuitem"
                        aria-current={isActive ? "location" : undefined}
                        onClick={() => setOpen(false)}
                        className={`
                          flex items-center rounded-xl px-3.5 py-2.5
                          text-sm font-medium transition-colors
                          ${
                            isActive
                              ? "bg-surface text-ink font-semibold dark:bg-surface-dark dark:text-ink-dark"
                              : "text-muted hover:bg-surface/60 hover:text-ink dark:text-muted-dark dark:hover:bg-surface-dark/60 dark:hover:text-ink-dark"
                          }
                        `}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </nav>

                <div className="my-2 border-t border-line/70 dark:border-line-dark/70" />

                <Button
                  as="a"
                  href={RESUME_FILE}
                  download
                  variant="primary"
                  className="
                    !min-h-9 w-full justify-center
                    !rounded-xl !px-3 !py-2
                    text-xs font-medium
                  "
                  onClick={() => {
                    handleResumeDownload();
                    setOpen(false);
                  }}
                >
                  <span className="inline-grid w-3.5 h-3.5 shrink-0 place-items-center mr-1.5">
                    {resumeDownloaded ? (
                      <Check size={14} strokeWidth={2.5} />
                    ) : (
                      <DownloadIcon size={14} />
                    )}
                  </span>
                  Download Resume
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
