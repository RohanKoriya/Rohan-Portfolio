import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Component,
  Braces,
  Code2,
  Wind,
  Boxes,
  Server,
  Network,
  Globe,
  KeyRound,
  Radio,
  Database,
  Link2,
  Table2,
  GitBranch,
  Container,
  Triangle,
  Cloud,
} from "lucide-react";
import { skillGroups } from "../data/skills.js";

const ICONS = {
  Component,
  Braces,
  Code2,
  Wind,
  Boxes,
  Server,
  Network,
  Globe,
  KeyRound,
  Radio,
  Database,
  Link2,
  Table2,
  GitBranch,
  Container,
  Triangle,
  Cloud,
};

const ALL_SKILLS = skillGroups.flatMap((group) =>
  group.skills.map((skill) => ({
    ...skill,
    groupLabel: group.label,
    groupKey: group.key,
  })),
);

const FILTERS = [
  { label: "All", key: "all" },
  ...skillGroups.map((g) => ({ label: g.label, key: g.key })),
];

export default function SkillsSection() {
  const [active, setActive] = useState("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? ALL_SKILLS
        : ALL_SKILLS.filter((s) => s.groupKey === active),
    [active],
  );

  return (
    <section
      id="skills"
      className="py-24 border-t md:py-32 border-line dark:border-line-dark"
    >
      <div className="container-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 mb-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-md">
            <span className="font-mono text-xs font-semibold tracking-wider uppercase text-accent dark:text-accent">
              Skills
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl text-ink dark:text-ink-dark">
              The tools I use to build.
            </h2>
          </div>
          <span className="font-mono text-xs text-muted dark:text-muted-dark">
            {ALL_SKILLS.length} tools · {skillGroups.length} layers
          </span>
        </motion.div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((filter) => {
            const isActive = filter.key === active;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActive(filter.key)}
                aria-pressed={isActive}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-canvas dark:text-canvas-dark"
                    : "text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="skill-filter-pill"
                    className="absolute inset-0 rounded-full bg-ink dark:bg-ink-dark"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skill grid */}
        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((skill) => {
              const Icon = ICONS[skill.icon] ?? Code2;
              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex flex-col justify-between gap-4 p-4 transition-all duration-200 border group rounded-2xl border-line dark:border-line-dark bg-surface dark:bg-surface-dark hover:bg-canvas hover:border-accent/40 hover:shadow-md hover:shadow-line dark:hover:bg-surface-dark dark:hover:border-accent/40 dark:hover:shadow-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 transition-colors border bg-canvas rounded-xl dark:bg-surface-dark border-line dark:border-line-dark ">
                      <Icon
                        size={18}
                        strokeWidth={1.75}
                        className="transition-colors duration-200 text-muted dark:text-muted-dark group-hover:text-accent dark:group-hover:text-accent"
                      />
                    </div>
                    {active === "all" && (
                      <span className="text-[10px] font-mono uppercase text-muted dark:text-muted-dark">
                        {skill.groupLabel}
                      </span>
                    )}
                  </div>

                  <span className="text-sm font-medium leading-snug text-ink dark:text-ink-dark group-hover:text-ink dark:group-hover:text-ink-dark">
                    {skill.name}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
