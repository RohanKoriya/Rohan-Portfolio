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
import { Check, MapPin } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const EMAIL = "koriyarohan123@gmail.com";

const SOCIAL_CLASS =
  "inline-flex items-center justify-center p-2 text-muted " +
  "transition-colors duration-200 hover:text-ink " +
  "dark:text-muted-dark dark:hover:text-ink-dark";

const formatMumbaiTime = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

/* Reusable social link */
function SocialLink({
  label,
  href,
  Icon,
  hovered,
  focused,
  setHovered,
  setFocused,
}) {
  const iconRef = useRef(null);
  const active = hovered === label || focused === label;

  return (
    <div className="relative flex items-center justify-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={SOCIAL_CLASS}
        onMouseEnter={() => {
          setHovered(label);
          iconRef.current?.startAnimation();
        }}
        onMouseLeave={() => {
          setHovered(null);
          iconRef.current?.stopAnimation();
        }}
        onFocus={(event) =>
          setFocused(
            event.currentTarget.matches(":focus-visible") ? label : null,
          )
        }
        onBlur={() => setFocused(null)}
      >
        <Icon ref={iconRef} size={19} />
      </a>

      <AnimatePresence>
        {active && (
          <motion.span
            aria-hidden="true"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="
              pointer-events-none absolute bottom-full left-1/2
              z-20 mb-2 whitespace-nowrap rounded-md
              bg-ink px-2.5 py-1 font-mono
              text-[11px] font-medium text-canvas shadow-sm
              dark:bg-ink-dark dark:text-canvas-dark
            "
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HeroSection({ ready = true }) {
  const emailIconRef = useRef(null);
  const downloadRef = useRef(null);

  const reduced = useReducedMotion();
  const show = ready || reduced;

  const [mumbaiTime, setMumbaiTime] = useState(formatMumbaiTime);
  const [emailCopied, setEmailCopied] = useState(false);
  const [emailHovered, setEmailHovered] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [socialHovered, setSocialHovered] = useState(null);
  const [socialFocused, setSocialFocused] = useState(null);
  const [resumeDownloaded, setResumeDownloaded] = useState(false);

  /* Mumbai clock */
  useEffect(() => {
    const id = setInterval(() => {
      setMumbaiTime(formatMumbaiTime());
    }, 10000);

    return () => clearInterval(id);
  }, []);

  /* Email copy feedback */
  useEffect(() => {
    if (!emailCopied) return;

    const id = setTimeout(() => setEmailCopied(false), 2000);
    return () => clearTimeout(id);
  }, [emailCopied]);

  /* Resume feedback */
  useEffect(() => {
    if (!resumeDownloaded) return;

    const id = setTimeout(() => setResumeDownloaded(false), 2500);
    return () => clearTimeout(id);
  }, [resumeDownloaded]);

  const fade = (delay, y = 8) => ({
    initial: reduced ? false : { opacity: 0, y },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: {
      duration: 0.7,
      delay,
      ease: EASE,
    },
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
    } catch {
      toast.error("Couldn't copy the email. It's " + EMAIL);
    }
  };

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/rohankoriya",
      Icon: GithubIcon,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/rohankoriya",
      Icon: LinkedinIcon,
    },
  ];

  const showEmailTip = emailHovered || emailFocused || emailCopied;

  return (
    <section
      id="top"
      className="relative pt-32 pb-24 overflow-hidden sm:pb-28 sm:pt-40 md:pb-32 md:pt-44"
    >
      <div className="container-content">
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center">
          {/* Availability and local time */}
          <motion.div
            {...fade(0.1, 6)}
            className="flex items-center justify-center mb-6"
          >
            <div
              className="
                inline-flex flex-wrap items-center justify-center
                gap-x-2.5 gap-y-1
                font-mono text-[10px] font-medium uppercase
                tracking-[0.13em]
                text-muted dark:text-muted-dark
                sm:text-[11px] sm:tracking-[0.15em]
              "
            >
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex w-full h-full rounded-full animate-ping bg-signal opacity-30" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                </span>

                <span>
                  <span className="font-semibold text-signal">Available</span>{" "}
                  for full-time roles
                </span>
              </span>

              <span className="text-border dark:text-border-dark">/</span>

              <span className="whitespace-nowrap">{mumbaiTime} IST</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <h1
            className="
    w-full max-w-full
    text-[clamp(2.8rem,10.5vw,6.5rem)]
    font-medium leading-[0.94]
    tracking-[-0.065em]
    text-ink dark:text-ink-dark
  "
          >
            <span className="block overflow-hidden py-[0.12em]">
              <motion.span
                className="block whitespace-nowrap"
                initial={reduced ? false : { y: "110%" }}
                animate={{ y: show ? "0%" : "110%" }}
                transition={{
                  duration: 0.95,
                  delay: 0.2,
                  ease: EASE,
                }}
              >
                Rohan Koriya
                <span className="text-signal">.</span>
              </motion.span>
            </span>
          </h1>

          {/* Role and location */}
          <motion.div
            {...fade(0.48)}
            className="flex flex-wrap items-center justify-center mt-6 gap-x-3 gap-y-2"
          >
            <span className="text-lg font-medium tracking-tight text-ink dark:text-ink-dark sm:text-xl">
              Full-Stack Developer
            </span>

            <span className="hidden w-px h-4 bg-border dark:bg-border-dark sm:block" />

            <span
              className="
                inline-flex items-center gap-1.5
                text-sm text-muted dark:text-muted-dark
              "
            >
              <MapPin size={14} strokeWidth={1.7} />
              Mumbai, India
            </span>
          </motion.div>

          {/* Introduction */}
          <motion.p
            {...fade(0.58)}
            className="
              mt-5 max-w-[34rem] px-2
              text-[15px] leading-[1.85]
              text-muted dark:text-muted-dark
              sm:text-base
            "
          >
            I build web applications with React, Node.js, and MongoDB — from the
            interfaces people use to the systems behind them.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            {...fade(0.72)}
            className="flex flex-col items-center justify-center gap-3 mt-9 sm:flex-row"
          >
            <Button as="a" href="#work" className="w-48 sm:w-auto">
              View my work
            </Button>

            <Button
              as="a"
              href={RESUME_FILE}
              download
              variant="secondary"
              className="w-48 sm:w-auto"
              onClick={() => setResumeDownloaded(true)}
              onMouseEnter={() => {
                if (!resumeDownloaded) {
                  downloadRef.current?.startAnimation();
                }
              }}
              onMouseLeave={() => downloadRef.current?.stopAnimation()}
            >
              <span className="relative grid w-4 h-4 shrink-0 place-items-center">
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
                      <Check size={17} strokeWidth={3} />
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
                      <DownloadIcon ref={downloadRef} size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>

              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={resumeDownloaded ? "downloaded" : "default"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18 }}
                >
                  {resumeDownloaded ? "Resume downloaded" : "Download resume"}
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div
            {...fade(0.86)}
            className="flex items-center justify-center gap-5 mt-10"
          >
            {socialLinks.map(({ label, href, Icon }) => (
              <SocialLink
                key={label}
                label={label}
                href={href}
                Icon={Icon}
                hovered={socialHovered}
                focused={socialFocused}
                setHovered={setSocialHovered}
                setFocused={setSocialFocused}
              />
            ))}

            {/* Email copy */}
            <div className="relative flex items-center justify-center">
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                className={`${SOCIAL_CLASS} cursor-pointer`}
                onMouseEnter={() => {
                  setEmailHovered(true);
                  emailIconRef.current?.startAnimation();
                }}
                onMouseLeave={() => {
                  setEmailHovered(false);
                  emailIconRef.current?.stopAnimation();
                }}
                onFocus={(event) =>
                  setEmailFocused(event.currentTarget.matches(":focus-visible"))
                }
                onBlur={() => setEmailFocused(false)}
              >
                <GmailIcon ref={emailIconRef} size={19} />
              </button>

              <AnimatePresence>
                {showEmailTip && (
                  <motion.span
                    aria-hidden="true"
                    style={{ x: "-50%" }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="
                      pointer-events-none absolute bottom-full
                      left-1/2 z-20 mb-2 whitespace-nowrap
                      rounded-md bg-ink px-2.5 py-1
                      font-mono text-[11px] font-medium
                      text-canvas shadow-sm
                      dark:bg-ink-dark dark:text-canvas-dark
                    "
                  >
                    {emailCopied ? "✓ Copied" : EMAIL}
                  </motion.span>
                )}
              </AnimatePresence>

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
