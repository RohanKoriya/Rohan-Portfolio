import { motion } from "motion/react";
import Badge from "./ui/Badge.jsx";
import { GithubIcon, LinkIcon } from "./ui/AnimatedIcons.jsx";
import { useRef } from "react";

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
      } rounded-[28px] border border-slate-200/90 bg-white p-8 md:p-10 mb-6 shadow-xl shadow-slate-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none transition-shadow duration-300`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_auto_1fr] items-stretch gap-8 md:gap-10">
        {/* Left Column: Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs font-light text-slate-400 dark:text-zinc-500">
                {formattedIndex}
              </span>
              <span className="text-slate-300 dark:text-zinc-700">—</span>

              <span className="font-mono text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-500">
                {project.category}
              </span>

              {project.featured && (
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Featured
                </span>
              )}
            </div>

            <h3 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100 md:text-3xl">
              {project.name}
            </h3>

            <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-zinc-400">
              {project.overview}
            </p>

            {/* Interactive Bullet Highlights */}
            <ul className="mb-6 space-y-2.5">
              {project.highlights?.map((point) => (
                <li
                  key={point}
                  className="group flex gap-2.5 text-sm text-slate-700 dark:text-zinc-300"
                >
                  <span className="w-1.5 h-1.5 mt-2 rounded-full shrink-0 bg-emerald-500 dark:bg-emerald-400 transition-transform duration-200 group-hover:scale-125" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Links with CTA Differentiation */}
          <div className="flex items-center justify-between pt-4 mt-auto border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                  onMouseEnter={() => githubRef.current?.startAnimation()}
                  onMouseLeave={() => githubRef.current?.stopAnimation()}
                >
                  <GithubIcon ref={githubRef} size={17} />
                  Github
                </a>
              )}
            </div>

            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-emerald-500/90 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                onMouseEnter={() => demoRef.current?.startAnimation()}
                onMouseLeave={() => demoRef.current?.stopAnimation()}
              >
                <LinkIcon ref={demoRef} size={15} />
                Live demo
              </a>
            )}
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div className="hidden w-px my-1 md:block bg-slate-200/80 dark:bg-zinc-800" />

        {/* Right Column: Image with Subtle Glow + Tech Stack */}
        <div className="flex flex-col justify-between gap-6">
          <div className="relative group">
            {/* Image Box */}
            <div className="relative w-full h-56 overflow-hidden border md:h-60 rounded-2xl border-slate-200/80 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950/50">
              {project.image ? (
                <>
                  <img
                    src={project.image}
                    alt={`${project.name} preview`}
                    className="object-cover object-top w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full font-mono text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-600">
                  Project Image Preview
                </div>
              )}
            </div>
          </div>

          {/* Flattened Technologies */}
          <div className="pt-4 border-slate-200/80 dark:border-zinc-800">
            <span className="block mb-2.5 font-mono text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-500">
              TECH STACK
            </span>
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
