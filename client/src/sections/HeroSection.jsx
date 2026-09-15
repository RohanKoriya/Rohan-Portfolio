import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Button from "../components/ui/Button.jsx";
import TiltCard from "../components/ui/TiltCard.jsx";

import {
  GithubIcon,
  LinkedinIcon,
  GmailIcon,
  DownloadIcon,
} from "../components/ui/AnimatedIcons.jsx";
import { RESUME_FILE } from "../data/Site.js";
import { toast } from "sonner";

function useISTTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/rohankoriya", Icon: GithubIcon },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/rohankoriya",
    Icon: LinkedinIcon,
  },
  {
    label: "Email",
    action: async () => {
      try {
        await navigator.clipboard.writeText("koriyarohan123@gmail.com");
        toast.success("Email copied to clipboard");
      } catch {
        toast.error("Unable to copy email");
      }
    },
    Icon: GmailIcon,
  },
];

export default function HeroSection() {
  const time = useISTTime();
  const iconRefs = useRef({});
  const downloadRef = useRef(null);

  return (
    <section id="top" className="pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="container-content">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-line dark:border-line-dark px-3 py-1.5"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full animate-pulse-dot bg-signal" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted dark:text-muted-dark">
                Available for full-time roles
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-5xl font-medium tracking-tight md:text-7xl text-balance"
            >
              Hi, I'm Rohan Koriya.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-xl mt-6 text-base leading-relaxed md:text-lg text-muted dark:text-muted-dark"
            >
              I build full-stack web applications with React, Node.js, and
              MongoDB — from the UI and APIs to the database behind them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap items-center gap-4 mt-10"
            >
              <Button as="a" href="#work">
                View work
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

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-5 mt-12"
            >
              {SOCIALS.map(({ label, href, action, Icon }) => (
                <a
                  key={label}
                  href={href || "#"}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href?.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  aria-label={label}
                  className="transition-colors text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
                  onClick={(e) => {
                    if (action) {
                      e.preventDefault();
                      action();
                    }
                  }}
                  onMouseEnter={() => iconRefs.current[label]?.startAnimation()}
                  onMouseLeave={() => iconRefs.current[label]?.stopAnimation()}
                >
                  <Icon
                    ref={(node) => (iconRefs.current[label] = node)}
                    size={19}
                  />
                </a>
              ))}
            </motion.div>
          </div>

          <TiltCard>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative overflow-hidden border shadow-xl rounded-2xl border-line/80 bg-surface/80 shadow-ink/5 backdrop-blur-sm dark:border-line-dark/80 dark:bg-surface-dark/80 dark:shadow-none">
                {/* IDE Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line/60 bg-canvas/60 dark:border-line-dark/60 dark:bg-canvas-dark/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wide text-muted dark:text-muted-dark">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    rohan.config.js
                  </span>
                </div>

                {/* Code Area with Theme-Adaptive Colors */}
                <div className="p-5 font-mono text-[12px] leading-6 sm:text-[13px] selection:bg-accent/20">
                  <div>
                    <span className="text-purple-600 dark:text-purple-400">
                      export const{" "}
                    </span>
                    <span className="text-blue-600 dark:text-sky-400">
                      developer{" "}
                    </span>
                    <span className="text-ink dark:text-ink-dark">= </span>
                    <span className="text-muted dark:text-muted-dark">
                      {"{"}
                    </span>
                  </div>

                  <div className="pl-4">
                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        name
                      </span>
                      <span className="text-ink dark:text-ink-dark">: </span>
                      <span className="text-amber-700 dark:text-amber-300">
                        "Rohan Koriya"
                      </span>
                      <span className="text-muted dark:text-muted-dark">,</span>
                    </div>

                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        role
                      </span>
                      <span className="text-ink dark:text-ink-dark">: </span>
                      <span className="text-amber-700 dark:text-amber-300">
                        "Full-Stack Engineer"
                      </span>
                      <span className="text-muted dark:text-muted-dark">,</span>
                    </div>

                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        location
                      </span>
                      <span className="text-ink dark:text-ink-dark">: </span>
                      <span className="text-amber-700 dark:text-amber-300">
                        "Mumbai, IN"
                      </span>
                      <span className="text-muted dark:text-muted-dark">,</span>
                    </div>

                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        status
                      </span>
                      <span className="text-ink dark:text-ink-dark">: </span>
                      <span className="text-amber-700 dark:text-amber-300">
                        "Available for full-time roles"
                      </span>
                      <span className="text-muted dark:text-muted-dark">,</span>
                    </div>

                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        stack
                      </span>
                      <span className="text-ink dark:text-ink-dark">: </span>
                      <span className="text-muted dark:text-muted-dark">[</span>
                      <span className="text-blue-700 dark:text-sky-300">
                        "React"
                      </span>
                      <span className="text-muted dark:text-muted-dark">
                        ,{" "}
                      </span>
                      <span className="text-blue-700 dark:text-sky-300">
                        "Node.js"
                      </span>
                      <span className="text-muted dark:text-muted-dark">
                        ,{" "}
                      </span>
                      <span className="text-blue-700 dark:text-sky-300">
                        "Express"
                      </span>
                      <span className="text-muted dark:text-muted-dark">
                        ,{" "}
                      </span>
                      <span className="text-blue-700 dark:text-sky-300">
                        "MongoDB"
                      </span>
                      <span className="text-muted dark:text-muted-dark">]</span>
                      <span className="text-muted dark:text-muted-dark">,</span>
                    </div>

                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        building
                      </span>
                      <span className="text-ink dark:text-ink-dark">: </span>
                      <span className="text-amber-700 dark:text-amber-300">
                        "PredictSense"
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted dark:text-muted-dark">
                      {"};"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
