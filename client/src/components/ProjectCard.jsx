import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Badge from "./ui/Badge.jsx";
import { GithubIcon, LinkIcon } from "./ui/AnimatedIcons.jsx";

export default function ProjectCard({
  project,
  index = 0,
  style,
  sticky = false,
}) {
  // Desktop icons retain their hover animations. Mobile icons are static because
  // touch devices do not need a second set of animation refs.
  const githubRef = useRef(null);
  const demoRef = useRef(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = useId();
  const reduceMotion = useReducedMotion();
  const formattedIndex = String(index + 1).padStart(2, "0");

  const accordionTransition = reduceMotion
    ? { duration: 0 }
    : {
        height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.22, ease: "easeOut" },
      };

  return (
    <motion.article
      style={style}
      className={`${
        sticky ? "sticky top-24" : ""
      } mb-2 rounded-xl border border-line bg-surface p-4 shadow-[0_12px_30px_-24px_rgba(0,0,0,0.10)] transition-shadow duration-300 dark:border-line-dark dark:bg-surface-dark dark:shadow-[0_12px_32px_-24px_rgba(0,0,0,0.35)] sm:rounded-xl sm:p-5 md:rounded-xl md:p-10`}
    >
      {/* Mobile: show the essentials first and reveal technical details on demand. */}
      <div className="md:hidden">
        <div className="flex flex-wrap items-center mb-3 gap-x-3 gap-y-2">
          <span className="font-mono text-xs font-light shrink-0 text-muted/60 dark:text-muted-dark/60">
            {formattedIndex}
          </span>
          <span className="shrink-0 text-line dark:text-line-dark">—</span>
          <span className="flex-1 min-w-0 eyebrow">{project.category}</span>
          {project.featured && (
            <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-signal dark:text-accent-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-dot" />
              Featured
            </span>
          )}
        </div>

        <h3 className="mb-2 text-2xl font-medium tracking-tight">
          {project.name}
        </h3>

        <p className="mb-4 text-[14px] leading-6 text-muted dark:text-muted-dark">
          {project.overview}
        </p>

        {/* Keep the entire interface visible on both mobile and desktop. */}
        <div className="relative mb-4 -mx-1 overflow-hidden border rounded-lg border-line bg-canvas dark:border-line-dark dark:bg-canvas-dark">
          <div className="w-full aspect-video">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.name} preview`}
                loading="lazy"
                decoding="async"
                className="object-contain object-center w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-2 px-4">
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

        {/* Keep project links visible without opening the accordion. */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-line dark:border-line-dark">
          {project.links?.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors min-h-9 text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark"
            >
              <GithubIcon size={17} />
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
              className="inline-flex items-center gap-2 px-2 py-1 text-sm font-medium transition-colors rounded-full min-h-9 text-signal hover:bg-signal/10 dark:text-accent-dark dark:hover:bg-accent-dark/10"
            >
              <LinkIcon size={15} />
              Live demo
            </a>
          )}
        </div>

        {/* Animated, accessible mobile accordion. */}
        {(project.highlights?.length > 0 || project.stack?.length > 0) && (
          <div className="mt-2 border-t border-line dark:border-line-dark">
            <button
              type="button"
              aria-expanded={detailsOpen}
              aria-controls={detailsId}
              onClick={() => setDetailsOpen((open) => !open)}
              className="flex items-center justify-between w-full gap-3 py-3 text-sm font-medium text-left outline-none cursor-pointer min-h-12 text-ink focus-visible:ring-2 focus-visible:ring-ink/40 dark:text-ink-dark dark:focus-visible:ring-ink-dark/40"
            >
              <span>
                {detailsOpen ? "Hide project details" : "View project details"}
              </span>

              <span
                aria-hidden="true"
                className="relative inline-flex items-center justify-center w-5 h-5 text-lg font-normal leading-none shrink-0 text-muted dark:text-muted-dark"
              >
                <motion.span
                  initial={false}
                  animate={{
                    opacity: detailsOpen ? 0 : 1,
                    scale: detailsOpen ? 0.75 : 1,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  className="absolute"
                >
                  +
                </motion.span>
                <motion.span
                  initial={false}
                  animate={{
                    opacity: detailsOpen ? 1 : 0,
                    scale: detailsOpen ? 1 : 0.75,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  className="absolute"
                >
                  −
                </motion.span>
              </span>
            </button>

            <motion.div
              id={detailsId}
              initial={false}
              animate={{
                height: detailsOpen ? "auto" : 0,
                opacity: detailsOpen ? 1 : 0,
              }}
              transition={accordionTransition}
              aria-hidden={!detailsOpen}
              className="overflow-hidden"
            >
              <div className="pt-1 pb-3">
                {project.highlights?.length > 0 && (
                  <div>
                    <span className="block mb-3 eyebrow">Highlights</span>
                    <ul className="space-y-2.5">
                      {project.highlights.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2.5 text-sm leading-6 text-ink/80 dark:text-ink-dark/80"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted dark:bg-muted-dark" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.stack?.length > 0 && (
                  <div className="pt-4 mt-5 border-t border-line dark:border-line-dark">
                    <span className="block mb-3 eyebrow">Tech stack</span>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Desktop: existing two-column layout and full project details remain unchanged. */}
      <div className="hidden grid-cols-1 items-stretch gap-6 md:grid md:grid-cols-[1.1fr_auto_1fr] md:gap-10">
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

        {/* Desktop divider */}
        <div className="hidden w-px my-1 bg-line dark:bg-line-dark md:block" />

        {/* Preview and tech stack */}
        <div className="flex flex-col justify-between min-w-0 gap-5 md:gap-6">
          <div className="relative group">
            <div className="relative w-full overflow-hidden border rounded-lg aspect-video border-line bg-canvas dark:border-line-dark dark:bg-canvas-dark md:aspect-auto md:h-56">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.name} preview`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.015]"
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
