import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpIcon,
  GithubIcon,
  LinkedinIcon,
  GmailIcon,
} from "./ui/AnimatedIcons.jsx";
import { toast } from "sonner";

// Tip: move this into Site.js next to RESUME_FILE and import it, so the
// Hero and Footer can't drift apart.
const EMAIL = "koriyarohan123@gmail.com";

// One format everywhere on the site ("2:53 PM"), not en-IN's lowercase "pm".
const formatISTTime = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

function useISTClock() {
  // Lazy initial value: the time is there on first paint instead of
  // popping in after mount.
  const [time, setTime] = useState(formatISTTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatISTTime()), 10_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

// :focus-visible is missing in older browsers; fall back to "yes, show it".
const isKeyboardFocus = (element) => {
  try {
    return element.matches(":focus-visible");
  } catch {
    return true;
  }
};

const linkClass =
  "flex items-center gap-2 rounded-xl p-2.5 text-muted transition-colors duration-200 hover:text-ink focus-visible:rounded-xl dark:text-muted-dark dark:hover:text-ink-dark";

export default function Footer() {
  const time = useISTClock();
  const refs = useRef({});

  const [emailCopied, setEmailCopied] = useState(false);
  const [emailHovered, setEmailHovered] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    if (!emailCopied) return;
    const id = setTimeout(() => setEmailCopied(false), 2000);
    return () => clearTimeout(id);
  }, [emailCopied]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
    } catch {
      toast.error(`Couldn't copy the email. It's ${EMAIL}`);
    }
  };

  // The tooltip is also the success message, so it shows right after a copy.
  // That covers touch devices, where there is no hover.
  const showEmailTip = emailHovered || emailFocused || emailCopied;

  const scrollToTop = () => {
    // An explicit "smooth" ignores prefers-reduced-motion, so check it here.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="transition-colors duration-200 border-t border-line bg-canvas dark:border-line-dark dark:bg-canvas-dark">
      {/* Three columns (1fr / auto / 1fr) keep the links truly centered.
          With justify-between they drift toward whichever side is narrower. */}
      <div className="container-content grid gap-6 py-10 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        {/* Left: identity */}
        <div className="flex flex-col gap-1 sm:justify-self-start">
          <span className="text-sm font-semibold text-ink dark:text-ink-dark">
            Rohan Koriya
          </span>
          <div className="flex items-center gap-2 font-mono text-xs text-muted dark:text-muted-dark">
            <span>Mumbai, IN</span>
            <span aria-hidden="true" className="text-line dark:text-line-dark">
              •
            </span>
            <span>{time} IST</span>
          </div>
        </div>

        {/* Center: links, with the copy-email cue */}
        <div className="flex items-center gap-1 -mx-2 sm:mx-0">
          <a
            href="https://github.com/rohankoriya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={linkClass}
            onMouseEnter={() => refs.current["GitHub"]?.startAnimation()}
            onMouseLeave={() => refs.current["GitHub"]?.stopAnimation()}
          >
            <GithubIcon
              ref={(node) => (refs.current["GitHub"] = node)}
              size={18}
            />
            <span className="hidden text-xs font-medium md:inline-block">
              GitHub
            </span>
          </a>

          <a
            href="https://linkedin.com/in/rohankoriya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={linkClass}
            onMouseEnter={() => refs.current["LinkedIn"]?.startAnimation()}
            onMouseLeave={() => refs.current["LinkedIn"]?.stopAnimation()}
          >
            <LinkedinIcon
              ref={(node) => (refs.current["LinkedIn"] = node)}
              size={18}
            />
            <span className="hidden text-xs font-medium md:inline-block">
              LinkedIn
            </span>
          </a>

          <div className="relative flex items-center">
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              className={`${linkClass} cursor-pointer`}
              onMouseEnter={() => {
                setEmailHovered(true);
                refs.current["Email"]?.startAnimation();
              }}
              onMouseLeave={() => {
                setEmailHovered(false);
                refs.current["Email"]?.stopAnimation();
              }}
              // Keyboard focus only. A mouse click also focuses the button,
              // which would leave the tooltip stuck open after the pointer leaves.
              onFocus={(event) =>
                setEmailFocused(isKeyboardFocus(event.currentTarget))
              }
              onBlur={() => setEmailFocused(false)}
            >
              <GmailIcon
                ref={(node) => (refs.current["Email"] = node)}
                size={18}
              />
              <span className="hidden text-xs font-medium md:inline-block">
                Email
              </span>
            </button>

            <AnimatePresence>
              {showEmailTip && (
                <motion.div
                  aria-hidden="true"
                  // x is in motion's transform: a Tailwind -translate-x-1/2
                  // class would be overwritten by it.
                  style={{ x: "-50%" }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 font-mono text-[11px] font-medium text-canvas shadow-md dark:bg-ink-dark dark:text-canvas-dark"
                >
                  {emailCopied ? "✓ Copied" : EMAIL}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Screen readers don't see the tooltip, so announce the copy */}
            <span role="status" className="sr-only">
              {emailCopied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
        </div>

        {/* Right: year and back to top. The name is already on the left. */}
        <div className="flex items-center justify-between gap-4 sm:justify-end sm:justify-self-end">
          <p className="text-xs text-muted dark:text-muted-dark">
            © {new Date().getFullYear()}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line/80 bg-surface/40 px-2.5 py-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-line hover:text-ink focus-visible:rounded-lg dark:border-line-dark/80 dark:bg-surface-dark/40 dark:text-muted-dark dark:hover:border-line-dark dark:hover:text-ink-dark"
            onMouseEnter={() => refs.current["Top"]?.startAnimation()}
            onMouseLeave={() => refs.current["Top"]?.stopAnimation()}
          >
            <span>Top</span>
            <ArrowUpIcon
              ref={(node) => (refs.current["Top"] = node)}
              size={14}
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
