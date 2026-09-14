import { useEffect, useRef, useState } from "react";
import { GithubIcon, LinkedinIcon, GmailIcon } from "./ui/AnimatedIcons.jsx";
import { toast } from "sonner";

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

export default function Footer() {
  const time = useISTClock();
  const refs = useRef({});
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="transition-colors duration-200 border-t bg-canvas border-line dark:border-line-dark dark:bg-canvas-dark">
      <div className="flex flex-col gap-6 py-10 container-content sm:flex-row sm:items-center sm:justify-between">
        {/* Left Column: Name & Live IST Time */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-ink dark:text-ink-dark">
            Rohan Koriya
          </span>
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

        {/* Center: Interactive Social Links */}
        <div className="flex items-center gap-1 -mx-2 sm:mx-0">
          {SOCIALS.map(({ label, href, action, Icon }) => (
            <a
              key={label}
              href={href || "#"}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="group flex items-center gap-2 rounded-xl p-2.5 text-muted dark:text-muted-dark transition-all duration-200 hover:text-ink dark:hover:text-ink-dark outline-none focus:outline-none"
              onClick={(e) => {
                if (action) {
                  e.preventDefault();
                  action();
                }
              }}
              onMouseEnter={() => refs.current[label]?.startAnimation()}
              onMouseLeave={() => refs.current[label]?.stopAnimation()}
            >
              <Icon ref={(node) => (refs.current[label] = node)} size={18} />

              <span className="hidden text-xs font-medium md:inline-block">
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Right Column: Copyright */}
        <p className="text-xs text-muted dark:text-muted-dark">
          Built by Rohan Koriya {currentYear ? `© ${currentYear}` : ""}.
        </p>
      </div>
    </footer>
  );
}
