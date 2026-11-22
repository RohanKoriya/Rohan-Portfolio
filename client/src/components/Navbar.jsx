import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import ThemeToggle from "./ui/ThemeToggle.jsx";
import { useActiveSection } from "../hooks/useActiveSection.js";

const NAV_LINKS = [
  { label: "Projects", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace("#", ""));

// Horizontal padding of each desktop link (px-3 = 12px).
// The underline is inset by this much so it sits under the text only.
const LINK_PAD = 12;

// Elastic "stretch" springs: the edge the line moves toward leads (fast),
// the edge it leaves from trails (slow). The line stretches, then snaps shut.
const SPRING_LEAD = { type: "spring", stiffness: 520, damping: 36 };
const SPRING_TRAIL = { type: "spring", stiffness: 190, damping: 26 };

/**
 * Desktop theme toggle with a hover / keyboard-focus tooltip.
 * - Shows "Toggle Mode  D" on hover or keyboard focus (never after a mouse click)
 * - Pressing "D" anywhere (outside inputs) toggles the theme
 * - Tooltip is anchored to the center of the button, with a caret pointing at it
 */
function ThemeToggleWithTooltip() {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // "D" shortcut: clicks the ThemeToggle button
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() !== "d") return;
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isTyping) return;

      setVisible(false);
      wrapperRef.current?.querySelector("button")?.click();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onPointerDown={() => setVisible(false)}
      onFocus={(event) => {
        // :focus-visible is true for keyboard focus only, not mouse clicks
        if (event.target.matches(":focus-visible")) setVisible(true);
      }}
      onBlur={() => setVisible(false)}
      className="relative inline-flex items-center"
    >
      <ThemeToggle />

      <AnimatePresence>
        {visible && (
          // Zero-width anchor at the toggle's horizontal center
          <span className="absolute z-50 pointer-events-none left-1/2 top-full mt-2.5">
            <motion.span
              role="tooltip"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -4, scale: 0.96 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -3, scale: 0.97 }
              }
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "calc(100% - 16px) 0" }}
              className="
                absolute top-0 -right-4
                flex items-center gap-2 whitespace-nowrap
                rounded-xl bg-ink px-3 py-1.5
                text-[13px] font-medium text-canvas
                shadow-[0_8px_20px_rgba(0,0,0,0.28)]
                ring-1 ring-canvas/10
                dark:bg-ink-dark dark:text-canvas-dark
                dark:shadow-[0_8px_20px_rgba(0,0,0,0.45)]
                dark:ring-canvas-dark/10
              "
            >
              {/* Caret: 16px from the right edge, over the toggle's center */}
              <span
                aria-hidden="true"
                className="
                  absolute -top-1 right-[11px] h-2.5 w-2.5 rotate-45 rounded-[2px]
                  bg-ink dark:bg-ink-dark
                "
              />
              <span className="relative z-10 tracking-[-0.01em]">
                Toggle Mode
              </span>
              <kbd
                className="
                  relative z-10 inline-flex h-[22px] min-w-[22px] items-center justify-center
                  rounded-[6px] bg-canvas/15 px-1.5
                  font-sans text-[12px] font-medium leading-none text-canvas
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
                  dark:bg-canvas-dark/15 dark:text-canvas-dark
                  dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
                "
              >
                D
              </kbd>
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({
    left: 0,
    right: 0,
    visible: false,
    ready: false,
  });

  const menuContainerRef = useRef(null);
  const navRef = useRef(null);
  const linkRefs = useRef([]);
  const prevIndexRef = useRef(-1);
  const directionRef = useRef(1); // 1 = moving right, -1 = moving left

  const prefersReducedMotion = useReducedMotion();
  const activeSection = useActiveSection(SECTION_IDS);
  const activeIndex = SECTION_IDS.indexOf(activeSection);

  // Measure the active link and position the sliding underline
  useLayoutEffect(() => {
    if (activeIndex !== prevIndexRef.current && activeIndex >= 0) {
      if (prevIndexRef.current >= 0) {
        directionRef.current = activeIndex > prevIndexRef.current ? 1 : -1;
      }
      prevIndexRef.current = activeIndex;
    }

    const measure = () => {
      const nav = navRef.current;
      const link = linkRefs.current[activeIndex];

      if (activeIndex < 0 || !nav || !link) {
        setIndicator((prev) => ({ ...prev, visible: false }));
        return;
      }

      const navWidth = nav.offsetWidth;
      if (navWidth === 0) return; // nav is hidden (mobile)

      const left = link.offsetLeft + LINK_PAD;
      const right = navWidth - (link.offsetLeft + link.offsetWidth - LINK_PAD);

      setIndicator({ left, right, visible: true, ready: true });
    };

    measure();

    if (!navRef.current) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, [activeIndex]);

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

  const movingRight = directionRef.current > 0;

  const indicatorTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        left: movingRight ? SPRING_TRAIL : SPRING_LEAD,
        right: movingRight ? SPRING_LEAD : SPRING_TRAIL,
        opacity: { duration: 0.2 },
      };

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
        <a
          href="#top"
          aria-label="RK, back to top"
          data-cursor="link"
          className="
            group inline-flex items-center justify-self-start
            font-['Poppins',sans-serif] text-xl font-semibold tracking-[0.12em]
            text-ink transition-opacity duration-200 hover:opacity-70
            dark:text-ink-dark
          "
        >
          <span>RK</span>
        </a>

        {/* Desktop navigation */}
        <nav
          ref={navRef}
          aria-label="Primary navigation"
          className="relative items-center hidden gap-2 justify-self-center md:flex"
        >
          {NAV_LINKS.map((link, index) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                ref={(el) => {
                  linkRefs.current[index] = el;
                }}
                href={link.href}
                data-cursor="link"
                aria-current={isActive ? "location" : undefined}
                className={`
                  group relative px-3 py-2
                  text-sm font-medium tracking-wide transition-colors duration-200
                  ${
                    isActive
                      ? "text-ink dark:text-ink-dark"
                      : "text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark"
                  }
                `}
              >
                <span className="relative z-10">{link.label}</span>

                {/* Hover underline: draws in from the left on inactive links */}
                {!isActive && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute bottom-0.5 left-3 right-3 h-px origin-left scale-x-0
                      bg-ink/40 transition-transform duration-300
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:scale-x-100
                      dark:bg-ink-dark/40
                    "
                  />
                )}
              </a>
            );
          })}

          {/* Active underline: stretches toward the next tab, then snaps shut */}
          {indicator.ready && (
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{
                left: indicator.left,
                right: indicator.right,
                opacity: indicator.visible ? 1 : 0,
              }}
              transition={indicatorTransition}
              className="absolute bottom-0.5 h-[2px] rounded-full bg-ink pointer-events-none dark:bg-ink-dark"
            />
          )}
        </nav>

        {/* Desktop actions (Theme Toggle + Tooltip) */}
        <div className="hidden items-center justify-self-end gap-2.5 md:flex">
          <ThemeToggleWithTooltip />
        </div>

        {/* Mobile controls + Floating Popover Menu */}
        <div
          ref={menuContainerRef}
          className="relative flex items-center gap-2 justify-self-end md:hidden"
        >
          <ThemeToggle />
          <span
            aria-hidden="true"
            className="w-px h-5 bg-line dark:bg-line-dark"
          />

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-haspopup="menu"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            className="inline-flex items-center justify-center transition-colors h-9 w-9 text-ink hover:bg-surface dark:text-ink-dark dark:hover:bg-surface-dark"
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
                  <X size={19} strokeWidth={1.75} />
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
                  <Menu size={19} strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

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
                          relative flex items-center rounded-xl py-2.5 pl-5 pr-3.5
                          text-sm font-medium transition-colors
                          ${
                            isActive
                              ? "font-semibold text-ink dark:text-ink-dark"
                              : "text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark"
                          }
                        `}
                      >
                        {/* inset-y-0 + my-auto centers the bar without a CSS transform,
                            which would clash with motion's layout animation */}
                        {isActive && (
                          <motion.span
                            layoutId="nav-active-bar"
                            aria-hidden="true"
                            className="absolute inset-y-0 left-2 my-auto h-4 w-0.5 rounded-full bg-ink dark:bg-ink-dark"
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 32,
                                  }
                            }
                          />
                        )}
                        {link.label}
                      </a>
                    );
                  })}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
