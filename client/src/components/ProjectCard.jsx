import { motion } from "motion/react";
import Badge from "./ui/Badge.jsx";
import { GithubIcon, LinkIcon } from "./ui/AnimatedIcons.jsx";
import { useRef } from "react";

export default function ProjectCard({ project, style, sticky = false }) {
  const githubRef = useRef(null);
  const demoRef = useRef(null);

  return (
    <motion.article
      style={style}
      className={`${
        sticky ? "sticky top-24" : ""
      } rounded-[28px] border border-slate-200/90 bg-white p-8 md:p-10 mb-6 shadow-xl shadow-slate-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none transition-all duration-300`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 md:gap-12">
        {/* Left Column: Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Featured
              </span>
            )}
            <span className="font-mono text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-500">
              {project.category}
            </span>
          </div>

          <h3 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100 md:text-3xl">
            {project.name}
          </h3>

          <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-zinc-400">
            {project.overview}
          </p>

          <ul className="mb-6 space-y-2.5">
            {project.highlights.map((point) => (
              <li
                key={point}
                className="flex gap-2.5 text-sm text-slate-700 dark:text-zinc-300"
              >
                <span className="w-1.5 h-1.5 mt-2 rounded-full shrink-0 bg-emerald-500/80 dark:bg-emerald-400/80" />
                {point}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5 pt-4 mt-auto">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                onMouseEnter={() => githubRef.current?.startAnimation()}
                onMouseLeave={() => githubRef.current?.stopAnimation()}
              >
                <GithubIcon ref={githubRef} size={17} />
                Source
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                onMouseEnter={() => demoRef.current?.startAnimation()}
                onMouseLeave={() => demoRef.current?.stopAnimation()}
              >
                <LinkIcon ref={demoRef} size={17} />
                Live demo
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Image Preview + Technologies */}
        <div className="flex flex-col justify-between gap-4">
          {/* Compact Project Image Container */}
          <div className="relative w-full h-56 overflow-hidden border rounded-2xl border-slate-200/80 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950/50 group">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.name} preview`}
                className="object-cover object-top w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full font-mono text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-600">
                Project Image Preview
              </div>
            )}
          </div>

          {/* Stack Box Container */}
          <div className="p-5 border rounded-2xl border-slate-200/80 bg-slate-50/70 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="block mb-3 font-mono text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-500">
              Technologies Used
            </span>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
