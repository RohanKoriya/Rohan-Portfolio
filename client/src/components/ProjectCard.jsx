import { motion } from "motion/react";
import { useRef } from "react";
import Badge from "./ui/Badge.jsx";
import { GithubIcon, LinkIcon } from "./ui/AnimatedIcons.jsx";

export default function ProjectCard({
  project,
  index = 0,
  style,
  sticky = false,
}) {
  const githubRef = useRef(null);
  const demoRef = useRef(null);
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      style={style}
      className={`${
        sticky ? "sticky top-24" : ""
      } mb-2 rounded-xl border border-line bg-surface p-4 shadow-[0_12px_30px_-24px_rgba(0,0,0,0.10)]
dark:shadow-[0_12px_32px_-24px_rgba(0,0,0,0.35)] transition-shadow duration-300 dark:border-line-dark dark:bg-surface-dark sm:rounded-xl sm:p-5 md:rounded-xl md:p-10`}
    >
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1.1fr_auto_1fr] md:gap-10">
        {/* Left column: project details */}
        <div className="flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap items-center mb-4 gap-x-3 gap-y-2 md:flex-nowrap">
              <span className="font-mono text-xs font-light shrink-0 text-muted/60 dark:text-muted-dark/60">
                {formattedIndex}
              </span>

              <span className="shrink-0 text-line dark:text-line-dark">—</span>

              <span className="flex-1 min-w-0 eyebrow md:flex-initial">
                {project.category}
              </span>

              {project.featured && (
                <span className="flex basis-full items-center justify-end gap-1.5 text-[11px] font-medium text-signal dark:text-accent-dark md:ml-auto md:basis-auto">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal animate-pulse-dot" />
                  Featured
                </span>
              )}
            </div>

            <h3 className="mb-3 text-2xl font-medium tracking-tight md:text-3xl">
              {project.name}
            </h3>

            <p className="mb-5 text-[15px] leading-7 text-muted dark:text-muted-dark sm:text-base md:mb-6">
              {project.overview}
            </p>

            {project.highlights?.length > 0 && (
              <ul className="mb-5 space-y-2.5 md:mb-6">
                {project.highlights.map((point) => (
                  <li
                    key={point}
                    className="group flex gap-2.5 text-sm leading-6 text-ink/80 dark:text-ink-dark/80"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted transition-transform duration-200 group-hover:scale-125 dark:bg-muted-dark" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 mt-auto border-t border-line dark:border-line-dark md:pt-5">
            {project.links?.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark"
                onMouseEnter={() => githubRef.current?.startAnimation()}
                onMouseLeave={() => githubRef.current?.stopAnimation()}
              >
                <GithubIcon ref={githubRef} size={17} />
                GitHub
              </a>
            ) : (
              <span aria-hidden="true" />
            )}

            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-signal transition-colors hover:bg-signal/10 dark:text-accent-dark dark:hover:bg-accent-dark/10 sm:px-3.5"
                onMouseEnter={() => demoRef.current?.startAnimation()}
                onMouseLeave={() => demoRef.current?.stopAnimation()}
              >
                <LinkIcon ref={demoRef} size={15} />
                Live demo
              </a>
            )}
          </div>
        </div>

        {/* Divider remains desktop-only */}
        <div className="hidden w-px my-1 bg-line dark:bg-line-dark md:block" />

        {/* Preview and tech stack */}
        <div className="flex flex-col justify-between min-w-0 gap-5 md:gap-6">
          {/* Slightly wider than the text column on mobile, while keeping a small inset. */}
          <div className="relative -mx-2 group sm:-mx-3 md:mx-0">
            <div className="relative w-full overflow-hidden border rounded-lg aspect-video border-line bg-canvas dark:border-line-dark dark:bg-canvas-dark sm:rounded-lg md:aspect-auto md:h-56">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.name} preview`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain object-top transition-transform duration-700 group-hover:scale-[1.015] md:object-cover md:group-hover:scale-[1.025]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full min-h-0 gap-2 px-4 bg-line/40 dark:bg-line-dark/40">
                  <span className="eyebrow text-muted dark:text-muted-dark">
                    {project.name}
                  </span>
                  <span className="text-center text-[11px] text-muted/70 dark:text-muted-dark/70">
                    Preview coming soon
                  </span>
                </div>
              )}
            </div>
          </div>

          {project.stack?.length > 0 && (
            <div className="pt-2 md:pt-4">
              <span className="eyebrow mb-2.5 block">Tech stack</span>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
