import { useRef } from "react";
import Badge from "./ui/Badge.jsx";
import { GithubIcon, LinkIcon } from "./ui/AnimatedIcons.jsx";

const MAX_STACK = 3;
const MAX_STACK_FEATURED = 6;

const iconButton =
  "peer relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted " +
  "transition-colors hover:bg-line/50 hover:text-ink " +
  "focus-visible:bg-line/50 focus-visible:text-ink focus-visible:outline-none " +
  "dark:text-muted-dark dark:hover:bg-line-dark/60 dark:hover:text-ink-dark " +
  "dark:focus-visible:bg-line-dark/60 dark:focus-visible:text-ink-dark";

/* Small label that appears on hover or keyboard focus of the link before it */
const tooltip =
  "pointer-events-none absolute bottom-full right-0 z-20 mb-2 translate-y-1 whitespace-nowrap " +
  "rounded-md border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink opacity-0 " +
  "transition duration-150 " +
  "peer-hover:translate-y-0 peer-hover:opacity-100 " +
  "peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100 " +
  "dark:border-line-dark dark:bg-canvas-dark dark:text-ink-dark";

function IconLink({ label, tip, href, Icon, iconRef }) {
  return (
    <div className="relative">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        aria-label={label}
        className={iconButton}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        <Icon ref={iconRef} size={18} />
      </a>
      <span aria-hidden="true" className={tooltip}>
        {tip}
      </span>
    </div>
  );
}

export default function ProjectCard({ project, featured = false }) {
  const githubRef = useRef(null);
  const demoRef = useRef(null);

  const limit = featured ? MAX_STACK_FEATURED : MAX_STACK;
  const stack = project.stack ?? [];
  const visibleStack = stack.slice(0, limit);
  const hiddenStack = stack.slice(limit);
  const isLive = Boolean(project.links?.demo);

  /* The screenshot links to the live demo when there is one */
  const screenshot = (
    /*
      Framed screenshot. The padding is a percentage of the width, so the area
      inside it is exactly 16:9 (the frame is 1.711:1). A 16:9 screenshot fills
      it with no cropping, and anything slightly different is shown whole
      (object-contain) instead of being cut off.
    */
    <div className="relative flex aspect-[1.711] w-full items-center justify-center overflow-hidden rounded-lg bg-line/40 p-[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-inset after:ring-line dark:bg-[#111113] dark:after:ring-line-dark">
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.name} preview`}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full rounded-md transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-sm text-muted dark:text-muted-dark">
          Preview coming soon
        </div>
      )}
    </div>
  );

  return (
    <article
      className={`flex h-full flex-col border border-dashed border-line bg-canvas p-3.5 dark:border-line-dark dark:bg-canvas-dark sm:p-4 ${
        featured
          ? "md:grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-8 md:p-5"
          : ""
      }`}
    >
      {/* Screenshot */}
      {isLive ? (
        <a
          href={project.links.demo}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          tabIndex={-1}
          aria-hidden="true"
          className="block group"
        >
          {screenshot}
        </a>
      ) : (
        screenshot
      )}

      {/* Content */}
      <div
        className={`mt-5 flex min-w-0 flex-1 flex-col ${
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
              <p className="mt-1 text-sm text-muted dark:text-muted-dark">
                {project.category}
              </p>
            )}
          </div>

          {isLive && (
            <span
              className={`inline-flex shrink-0 items-center gap-2 text-sm text-muted dark:text-muted-dark ${
                featured ? "mt-1 md:mt-2.5" : "mt-1"
              }`}
            >
              <span className="h-1.5 w-1.5  rounded-full bg-signal dark:bg-accent-dark" />
              Live
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className={`mt-3 text-muted dark:text-muted-dark ${
            featured
              ? "text-sm leading-6 md:text-base md:leading-7"
              : "text-sm leading-6"
          }`}
        >
          {project.overview}
        </p>

        {/* Footer: stack on the left, links on the right */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-auto">
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

              {hiddenStack.length > 0 && (
                <li className="relative">
                  {/* Focusable, so the list also opens from the keyboard or a tap */}
                  <button
                    type="button"
                    aria-label={`${hiddenStack.length} more: ${hiddenStack.join(", ")}`}
                    className="block rounded-full cursor-pointer peer focus-visible:outline-none"
                  >
                    <Badge>+{hiddenStack.length}</Badge>
                  </button>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 flex w-max max-w-[14rem] translate-y-1 flex-wrap gap-1.5 rounded-xl border border-line bg-canvas p-2.5 opacity-0 shadow-md shadow-black/5 transition duration-150 peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus:translate-y-0 peer-focus:opacity-100 dark:border-line-dark dark:bg-canvas-dark"
                  >
                    {hiddenStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-line px-2 py-0.5 text-xs font-medium text-ink dark:border-line-dark dark:text-ink-dark"
                      >
                        {tech}
                      </span>
                    ))}
                  </span>
                </li>
              )}
            </ul>
          ) : (
            <span aria-hidden="true" />
          )}

          <div className="flex shrink-0 items-center gap-1.5">
            {project.links?.demo && (
              <IconLink
                label={`${project.name} live demo`}
                tip="Live demo"
                href={project.links.demo}
                Icon={LinkIcon}
                iconRef={demoRef}
              />
            )}

            {project.links?.github && (
              <IconLink
                label={`${project.name} on GitHub`}
                tip="GitHub"
                href={project.links.github}
                Icon={GithubIcon}
                iconRef={githubRef}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
