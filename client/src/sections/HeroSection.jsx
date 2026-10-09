import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Button from "../components/ui/Button.jsx";
import {
  GithubIcon,
  LinkedinIcon,
  GmailIcon,
  DownloadIcon,
} from "../components/ui/AnimatedIcons.jsx";
import { RESUME_FILE } from "../data/Site.js";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1];
const EMAIL = "koriyarohan123@gmail.com";

const formatMumbaiTime = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

/**
 * `ready` lets the parent hold the entrance until the page is actually
 * visible. The intro screen plays on top of the page, so animations that
 * start on mount finish behind it and are never seen. In App.jsx:
 *   <HeroSection ready={introFinished} />
 * Without the prop it defaults to true and plays on mount, as before.
 */
export default function HeroSection({ ready = true }) {
  const iconRefs = useRef({});
  const downloadRef = useRef(null);
  const reduced = useReducedMotion();
  const show = ready || reduced;

  const [mumbaiTime, setMumbaiTime] = useState(formatMumbaiTime);
  const [emailCopied, setEmailCopied] = useState(false);
  const [emailHovered, setEmailHovered] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setMumbaiTime(formatMumbaiTime()), 10000);
    return () => clearInterval(id);
  }, []);

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
      toast.error("Couldn't copy the email. It's " + EMAIL);
    }
  };

  // The tooltip is the success feedback, so it also shows right after a copy.
  // That covers touch devices, where there is no hover to trigger it.
  const showTip = emailHovered || emailFocused || emailCopied;

  const fade = (delay, y = 0) => ({
    initial: reduced ? false : { opacity: 0, y },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  const socialLink =
    "p-1.5 text-muted transition-colors hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark";

  return (
    <section id="top" className="relative pb-20 pt-36 md:pb-32 md:pt-48">
      <div className="container-content">
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center">
          {/* Status: the most useful fact for a recruiter comes first */}
          <motion.div
            {...fade(0.1)}
            className="relative mb-8 inline-flex max-w-full items-center gap-2.5 px-4 py-2"
          >
            <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-ink/25 dark:border-ink-dark/25" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-ink/25 dark:border-ink-dark/25" />
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-ink/25 dark:border-ink-dark/25" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-ink/25 dark:border-ink-dark/25" />

            <span className="w-2 h-2 rounded-full shrink-0 bg-signal" />
            <span className="font-mono text-[11px] font-medium uppercase leading-relaxed tracking-[0.16em] text-muted dark:text-muted-dark">
              Available for full-time roles • Mumbai {mumbaiTime} IST
            </span>
          </motion.div>

          {/* Name: the one line that gets the mask reveal */}
          <h1 className="text-[clamp(3rem,11vw,6rem)] font-medium leading-[0.98] tracking-tight text-ink dark:text-ink-dark">
            <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
              <motion.span
                className="block"
                initial={reduced ? false : { y: "110%" }}
                animate={{ y: show ? "0%" : "110%" }}
                transition={{ duration: 0.95, delay: 0.2, ease: EASE }}
              >
                Rohan Koriya
                <span className="text-signal">.</span>
              </motion.span>
            </span>
          </h1>

          {/* Role and pitch are separate, so they don't read as one run-on line */}
          <motion.p
            {...fade(0.5, 8)}
            className="mt-5 text-xl font-medium tracking-tight text-ink dark:text-ink-dark md:text-2xl"
          >
            Full-Stack Developer
          </motion.p>

          <motion.p
            {...fade(0.62, 8)}
            className="max-w-xl mt-4 text-base leading-relaxed text-muted dark:text-muted-dark md:text-lg"
          >
            I build web apps with React, Node.js, and MongoDB — from the screens
            people use to the database behind them.
          </motion.p>

          <motion.div
            {...fade(0.75, 8)}
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            <Button as="a" href="#work">
              View my work
            </Button>
            <Button
              as="a"
              href={RESUME_FILE}
              download
              variant="secondary"
              onMouseEnter={() => downloadRef.current?.startAnimation()}
              onMouseLeave={() => downloadRef.current?.stopAnimation()}
            >
              <DownloadIcon ref={downloadRef} size={16} />
              Download resume
            </Button>
          </motion.div>

          <motion.div {...fade(0.9)} className="flex items-center gap-5 mt-12">
            <a
              href="https://github.com/rohankoriya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={socialLink}
              onMouseEnter={() => iconRefs.current["GitHub"]?.startAnimation()}
              onMouseLeave={() => iconRefs.current["GitHub"]?.stopAnimation()}
            >
              <GithubIcon
                ref={(node) => (iconRefs.current["GitHub"] = node)}
                size={20}
              />
            </a>

            <a
              href="https://linkedin.com/in/rohankoriya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={socialLink}
              onMouseEnter={() =>
                iconRefs.current["LinkedIn"]?.startAnimation()
              }
              onMouseLeave={() => iconRefs.current["LinkedIn"]?.stopAnimation()}
            >
              <LinkedinIcon
                ref={(node) => (iconRefs.current["LinkedIn"] = node)}
                size={20}
              />
            </a>

            <div className="relative flex items-center">
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                className={`${socialLink} cursor-pointer`}
                onMouseEnter={() => {
                  setEmailHovered(true);
                  iconRefs.current["Email"]?.startAnimation();
                }}
                onMouseLeave={() => {
                  setEmailHovered(false);
                  iconRefs.current["Email"]?.stopAnimation();
                }}
                // Keyboard focus only: a mouse click also focuses the button,
                // which would leave the tooltip stuck open after the pointer left.
                onFocus={(event) =>
                  setEmailFocused(event.currentTarget.matches(":focus-visible"))
                }
                onBlur={() => setEmailFocused(false)}
              >
                <GmailIcon
                  ref={(node) => (iconRefs.current["Email"] = node)}
                  size={20}
                />
              </button>

              <AnimatePresence>
                {showTip && (
                  <motion.div
                    aria-hidden="true"
                    // x lives in motion's own transform: a Tailwind
                    // -translate-x-1/2 class would be overwritten by it.
                    style={{ x: "-50%" }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 font-mono text-[11px] font-medium text-canvas shadow-md dark:bg-ink-dark dark:text-canvas-dark"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
