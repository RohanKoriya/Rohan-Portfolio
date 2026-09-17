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
      } rounded-[24px] border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-8 mb-2 md:p-10 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-25px_rgba(0,0,0,0.7)] transition-shadow duration-300`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_auto_1fr] items-stretch gap-8 md:gap-10">
        {/* Left column: details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs font-light text-muted/60 dark:text-muted-dark/60">
                {formattedIndex}
              </span>
              <span className="text-line dark:text-line-dark">—</span>
              <span className="eyebrow">{project.category}</span>
              {project.featured && (
                <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-signal dark:text-accent-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-dot" />
                  Featured
                </span>
              )}
            </div>

            <h3 className="mb-3 text-2xl font-medium tracking-tight md:text-3xl">
              {project.name}
            </h3>

            <p className="mb-6 text-base leading-relaxed text-muted dark:text-muted-dark">
              {project.overview}
            </p>

            <ul className="mb-6 space-y-2.5">
              {project.highlights?.map((point) => (
                <li
                  key={point}
                  className="group flex gap-2.5 text-sm text-ink/80 dark:text-ink-dark/80"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted dark:bg-muted-dark transition-transform duration-200 group-hover:scale-125" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-5 mt-auto border-t border-line dark:border-line-dark">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
                onMouseEnter={() => githubRef.current?.startAnimation()}
                onMouseLeave={() => githubRef.current?.stopAnimation()}
              >
                <GithubIcon ref={githubRef} size={17} />
                Github
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-signal dark:text-accent-dark transition-colors hover:bg-signal/10 dark:hover:bg-accent-dark/10"
                onMouseEnter={() => demoRef.current?.startAnimation()}
                onMouseLeave={() => demoRef.current?.stopAnimation()}
              >
                <LinkIcon ref={demoRef} size={15} />
                Live demo
              </a>
            )}
          </div>
        </div>

        {/* Vertical divider (desktop only) */}
        <div className="hidden w-px my-1 md:block bg-line dark:bg-line-dark" />

        {/* Right column: preview + stack */}
        <div className="flex flex-col justify-between gap-6">
          <div className="relative group">
            <div className="relative w-full h-56 overflow-hidden border md:h-60 rounded-2xl border-line dark:border-line-dark bg-canvas dark:bg-canvas-dark">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.name} preview`}
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full gap-2 bg-line/40 dark:bg-line-dark/40">
                  <span className="eyebrow text-muted dark:text-muted-dark">
                    {project.name}
                  </span>
                  <span className="text-[11px] text-muted/70 dark:text-muted-dark/70">
                    Preview coming soon
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <span className="eyebrow mb-2.5 block">Tech stack</span>
            <div className="flex flex-wrap gap-2">
              {project.stack?.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
