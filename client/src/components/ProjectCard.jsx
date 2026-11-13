import { useRef, useState } from "react";
import Badge from "./ui/Badge.jsx";
import { GithubIcon, LinkIcon } from "./ui/AnimatedIcons.jsx";

const MAX_STACK = 3;
const MAX_STACK_FEATURED = 6;

const iconButton =
  "relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-line/50 hover:text-ink dark:text-muted-dark dark:hover:bg-line-dark/60 dark:hover:text-ink-dark";

export default function ProjectCard({ project, featured = false }) {
  const githubRef = useRef(null);
  const demoRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const [activeTooltip, setActiveTooltip] = useState(null); // "demo" | "github" | null

  const stack = project.stack ?? [];
  const visibleStack = stack.slice(
    0,
    featured ? MAX_STACK_FEATURED : MAX_STACK,
  );
  const hiddenStack = stack.slice(featured ? MAX_STACK_FEATURED : MAX_STACK);
  const hiddenCount = hiddenStack.length;
  const isLive = Boolean(project.links?.demo);

  return (
    <article
      className={`flex h-full flex-col border border-dashed border-line bg-canvas p-3.5 dark:border-line-dark dark:bg-canvas-dark sm:p-4 ${
        featured
          ? "md:grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-8 md:p-5"
          : ""
      }`}
    >
      {/* Screenshot */}
      <div className="overflow-hidden border rounded-lg border-line bg-line/40 dark:border-line-dark dark:bg-line-dark/40">
        <div className="w-full aspect-video">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name} preview`}
              loading="lazy"
              decoding="async"
              className="object-cover object-center w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-sm text-muted dark:text-muted-dark">
              Preview coming soon
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={`mt-4 flex min-w-0 flex-1 flex-col ${
          featured ? "md:mt-0 md:py-1" : ""
        }`}
      >
        {/* Title + status */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3
              className={`font-medium tracking-tight ${
                featured ? "text-xl md:text-3xl" : "text-xl"
              }`}
            >
              {project.name}
            </h3>
            {project.category && (
              <p className="mt-0.5 text-sm text-muted dark:text-muted-dark">
                {project.category}
              </p>
            )}
          </div>

          {isLive && (
            <span className="inline-flex items-center gap-2 mt-1 text-sm shrink-0 text-muted dark:text-muted-dark">
              <span className="w-2 h-2 rounded-full bg-signal dark:bg-accent-dark" />
              Live
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className={`mt-4 text-muted dark:text-muted-dark ${
            featured
              ? "text-sm leading-6 md:text-base md:leading-7"
              : "text-sm leading-6"
          }`}
        >
          {project.overview}
        </p>

        {/* Footer: stack on the left, links on the right */}
        <div className="flex items-center justify-between gap-4 pt-5 mt-auto">
          {stack.length > 0 ? (
            <ul
              className="flex flex-wrap items-center gap-2"
              aria-label="Tech stack"
            >
              {visibleStack.map((tech) => (
                <li key={tech}>
                  <Badge>{tech}</Badge>
                </li>
              ))}
              {hiddenCount > 0 && (
                <li className="relative">
                  <div
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="inline-block cursor-pointer"
                  >
                    <Badge>+{hiddenCount}</Badge>
                  </div>

                  {/* Hover Popover */}
                  {showTooltip && (
                    <div className="absolute bottom-full left-0 mb-2 z-20 flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-line bg-canvas shadow-xl w-48 dark:border-line-dark dark:bg-canvas-dark">
                      {hiddenStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs font-medium rounded-md bg-surface text-ink border border-line/60 dark:bg-surface-dark dark:text-ink-dark dark:border-line-dark/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              )}
            </ul>
          ) : (
            <span aria-hidden="true" />
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            {project.links?.demo && (
              <div
                className="relative"
                onMouseEnter={() => setActiveTooltip("demo")}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  aria-label={`${project.name} live demo`}
                  className={iconButton}
                  onMouseEnter={() => demoRef.current?.startAnimation()}
                  onMouseLeave={() => demoRef.current?.stopAnimation()}
                >
                  <LinkIcon ref={demoRef} size={18} />
                </a>

                {activeTooltip === "demo" && (
                  <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap rounded-md border border-line bg-canvas text-ink shadow-lg pointer-events-none z-20 dark:border-line-dark dark:bg-canvas-dark dark:text-ink-dark">
                    Live Demo
                  </div>
                )}
              </div>
            )}

            {project.links?.github && (
              <div
                className="relative"
                onMouseEnter={() => setActiveTooltip("github")}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  aria-label={`${project.name} on GitHub`}
                  className={iconButton}
                  onMouseEnter={() => githubRef.current?.startAnimation()}
                  onMouseLeave={() => githubRef.current?.stopAnimation()}
                >
                  <GithubIcon ref={githubRef} size={18} />
                </a>

                {activeTooltip === "github" && (
                  <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap rounded-md border border-line bg-canvas text-ink shadow-lg pointer-events-none z-20 dark:border-line-dark dark:bg-canvas-dark dark:text-ink-dark">
                    GitHub
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
