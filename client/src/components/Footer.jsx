import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpIcon,
  GithubIcon,
  LinkedinIcon,
  GmailIcon,
} from "./ui/AnimatedIcons.jsx";
import { toast } from "sonner";

const EMAIL = "koriyarohan123@gmail.com";

function useISTClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

    setTime(format());
    const interval = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

export default function Footer() {
  const time = useISTClock();
  const refs = useRef({});
  const [currentYear, setCurrentYear] = useState("");

  // Interactive Email Cue State
  const [emailCopied, setEmailCopied] = useState(false);
  const [emailHovered, setEmailHovered] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  useEffect(() => {
    if (!emailCopied) return;
    const id = setTimeout(() => setEmailCopied(false), 2000);
    return () => clearInterval(id);
  }, [emailCopied]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
    } catch {
      toast.error("Couldn't copy the email. It's " + EMAIL);
    }
  };

  const showEmailTip = emailHovered || emailFocused || emailCopied;

  return (
    <footer className="transition-colors duration-200 border-t bg-canvas border-line dark:border-line-dark dark:bg-canvas-dark">
      <div className="flex flex-col gap-6 py-10 container-content sm:flex-row sm:items-center sm:justify-between">
        {/* Left Column: Identity & Operational Status */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink dark:text-ink-dark">
              Rohan Koriya
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted dark:text-muted-dark">
            <span>Mumbai, IN</span>
            {time && (
              <>
                <span className="text-line dark:text-line-dark">•</span>
                <span>{time} IST</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Interactive Socials with Quick-Copy Email Cue */}
        <div className="flex items-center gap-1 -mx-2 sm:mx-0">
          {/* GitHub */}
          <a
            href="https://github.com/rohankoriya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="group flex items-center gap-2 rounded-xl p-2.5 text-muted dark:text-muted-dark transition-all duration-200 hover:text-ink dark:hover:text-ink-dark outline-none focus:outline-none"
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

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/rohankoriya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="group flex items-center gap-2 rounded-xl p-2.5 text-muted dark:text-muted-dark transition-all duration-200 hover:text-ink dark:hover:text-ink-dark outline-none focus:outline-none"
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

          {/* Interactive Email Button with Dynamic Cue Tooltip */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              className="group flex items-center gap-2 rounded-xl p-2.5 text-muted dark:text-muted-dark transition-all duration-200 hover:text-ink dark:hover:text-ink-dark outline-none focus:outline-none cursor-pointer"
              onMouseEnter={() => {
                setEmailHovered(true);
                refs.current["Email"]?.startAnimation();
              }}
              onMouseLeave={() => {
                setEmailHovered(false);
                refs.current["Email"]?.stopAnimation();
              }}
              onFocus={(event) =>
                setEmailFocused(event.currentTarget.matches(":focus-visible"))
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

            {/* Dynamic Tooltip Pill */}
            <AnimatePresence>
              {showEmailTip && (
                <motion.div
                  aria-hidden="true"
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

            {/* Accessibility Announcement */}
            <span role="status" className="sr-only">
              {emailCopied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
        </div>

        {/* Right Column: Copyright & Back to Top */}
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="text-xs text-muted dark:text-muted-dark">
            Built by Rohan Koriya {currentYear ? `© ${currentYear}` : ""}.
          </p>

          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            aria-label="Back to top"
            className="group flex items-center gap-1.5 rounded-lg border border-line/80 dark:border-line-dark/80 bg-surface/40 dark:bg-surface-dark/40 px-2.5 py-1.5 font-mono text-xs text-muted dark:text-muted-dark transition-colors duration-200 hover:border-line dark:hover:border-line-dark hover:text-ink dark:hover:text-ink-dark backdrop-blur-sm cursor-pointer"
          >
            <span>Top</span>
            <ArrowUpIcon
              size={14}
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
