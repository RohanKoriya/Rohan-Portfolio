import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [resumeDownloaded, setResumeDownloaded] = useState(false);

  const drawerRef = useRef(null);
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

  // Close the drawer if the viewport changes to desktop.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (event) => {
      if (event.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // Mobile drawer accessibility and scroll locking
  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;

    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const previousBodyPadding = document.body.style.paddingRight;

    // Prevent background scrolling.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Focus the first interactive element after the portal mounts.
    const focusFrame = window.requestAnimationFrame(() => {
      const drawer = drawerRef.current;

      const focusable = drawer?.querySelectorAll(FOCUSABLE_SELECTOR);

      try {
        focusable?.[0]?.focus({ preventScroll: true });
      } catch {
        focusable?.[0]?.focus();
      }
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;

      const focusable = drawer?.querySelectorAll(FOCUSABLE_SELECTOR);

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);

      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;

      document.body.style.paddingRight = previousBodyPadding;

      // Return focus to the menu button.
      try {
        previouslyFocused?.focus?.({ preventScroll: true });
      } catch {
        previouslyFocused?.focus?.();
      }
    };
  }, [open]);

  return (
    <>
      {/* Main navbar */}
      <header className="sticky top-0 z-40 w-full transition-colors duration-200 border-b border-line bg-canvas/95 backdrop-blur-md dark:border-line-dark dark:bg-canvas-dark/95">
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

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="inline-flex items-center justify-center transition-colors border rounded-md h-9 w-9 justify-self-end border-line text-ink hover:bg-surface dark:border-line-dark dark:text-ink-dark dark:hover:bg-surface-dark md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-controls="mobile-navigation"
            aria-expanded={open}
          >
            <Menu size={19} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/*
        Mobile drawer is rendered directly inside document.body
        using createPortal.

        This prevents the sticky header's backdrop-filter,
        stacking context and positioning from affecting it.
      */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="mobile-drawer"
                className="
                  fixed inset-0 z-[9999]
                  md:hidden
                "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {/* Background overlay */}
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setOpen(false)}
                  className="
                    absolute inset-0 z-0
                    h-full w-full cursor-default
                    border-0 bg-black/45
                    backdrop-blur-[2px]
                  "
                />

                {/* Actual drawer panel */}
                <motion.aside
                  ref={drawerRef}
                  id="mobile-navigation"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="mobile-navigation-title"
                  className="
                    absolute inset-y-0 right-0 z-10
                    flex w-[86vw] max-w-[380px]
                    flex-col overflow-y-auto
                    overscroll-contain
                    border-l border-line
                    bg-canvas text-ink
                    shadow-2xl
                    dark:border-line-dark
                    dark:bg-canvas-dark
                    dark:text-ink-dark
                  "
                  style={{
                    height: "100dvh",
                    maxHeight: "100dvh",
                  }}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Drawer top section */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-line dark:border-line-dark">
                    <div className="flex items-center gap-2.5">
                      <LetterRIcon size={20} />

                      <span
                        id="mobile-navigation-title"
                        className="text-sm font-semibold tracking-tight "
                      >
                        Rohan Koriya
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                      className="grid transition-colors border rounded-md h-9 w-9 shrink-0 place-items-center border-line text-ink hover:bg-surface dark:border-line-dark dark:text-ink-dark dark:hover:bg-surface-dark"
                    >
                      <X size={18} strokeWidth={1.75} />
                    </button>
                  </div>

                  {/* Navigation items */}
                  <div className="px-6 pt-8">
                    <p
                      className="
                        mb-4 font-mono text-[10px]
                        uppercase tracking-[0.16em]
                        text-muted dark:text-muted-dark
                      "
                    >
                      Navigation
                    </p>

                    <nav
                      aria-label="Mobile primary navigation"
                      className="flex flex-col"
                    >
                      {NAV_LINKS.map((link, index) => {
                        const sectionId = link.href.replace("#", "");

                        const isActive = activeSection === sectionId;

                        return (
                          <a
                            key={link.href}
                            href={link.href}
                            aria-current={isActive ? "location" : undefined}
                            onClick={() => setOpen(false)}
                            className={`
                              flex min-h-[58px]
                              items-center justify-between
                              border-b border-line
                              py-3 text-base font-medium
                              transition-colors
                              dark:border-line-dark
                              ${
                                isActive
                                  ? "text-ink dark:text-ink-dark"
                                  : "text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark"
                              }
                            `}
                          >
                            <span>{link.label}</span>

                            <span
                              className="
                                font-mono text-[10px]
                                text-muted/60
                                dark:text-muted-dark/60
                              "
                            >
                              0{index + 1}
                            </span>
                          </a>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Bottom actions */}
                  <div className="p-6 mt-auto border-t border-line dark:border-line-dark">
                    <div className="flex items-center justify-between gap-4 ">
                      <ThemeToggle />

                      <Button
                        as="a"
                        href={RESUME_FILE}
                        download
                        variant="primary"
                        className="
                          !min-h-10 flex-1
                          !rounded-md !px-4 !py-2.5
                          text-xs font-medium
                        "
                        onClick={() => {
                          handleResumeDownload();
                          setOpen(false);
                        }}
                      >
                        <span className="inline-grid w-4 h-4 shrink-0 place-items-center">
                          {resumeDownloaded ? (
                            <Check size={15} strokeWidth={2.5} />
                          ) : (
                            <DownloadIcon size={15} />
                          )}
                        </span>
                        Download Resume
                      </Button>
                    </div>
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
