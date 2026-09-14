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
              I build scalable full-stack web applications with React, Node.js,
              and MongoDB — focusing on performance, intuitive UI, and clean
              architecture.
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
              <div className="relative overflow-hidden bg-white border shadow-xl rounded-2xl border-slate-200/80 shadow-slate-200/40 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200/80 bg-slate-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-muted/30 dark:bg-muted-dark/30" />
                    <span className="w-3 h-3 rounded-full bg-muted/50 dark:bg-muted-dark/50" />
                    <span className="w-3 h-3 rounded-full bg-muted/70 dark:bg-muted-dark/70" />
                  </div>
                  <span className="ml-auto font-mono text-[11px] font-medium tracking-wide text-slate-400 dark:text-zinc-500">
                    status.sh
                  </span>
                </div>

                {/* Terminal Content */}
                <div className="p-5 font-mono text-[13px] leading-7">
                  <p>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ➜
                    </span>{" "}
                    <span className="text-slate-400 dark:text-zinc-400">
                      whoami
                    </span>
                  </p>
                  <p className="font-medium text-slate-900 dark:text-zinc-100">
                    rohan_koriya — full-stack engineer
                  </p>

                  <p className="mt-2.5">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ➜
                    </span>{" "}
                    <span className="text-slate-400 dark:text-zinc-400">
                      location
                    </span>
                  </p>
                  <p className="text-slate-700 dark:text-zinc-300">
                    Mumbai, IN · {time || "01:21:50 pm"} IST
                  </p>

                  <p className="mt-2.5">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ➜
                    </span>{" "}
                    <span className="text-slate-400 dark:text-zinc-400">
                      stack
                    </span>
                  </p>
                  <p className="text-slate-700 dark:text-zinc-300">
                    MongoDB · Express · React · Node.js
                  </p>

                  <p className="mt-2.5">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ➜
                    </span>{" "}
                    <span className="text-slate-400 dark:text-zinc-400">
                      building
                    </span>
                  </p>
                  <p className="text-slate-700 dark:text-zinc-300">
                    Ranklytics — AI SEO analytics platform
                  </p>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
