import { motion } from "motion/react";
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

const TOTAL_SKILLS = skillGroups.reduce(
  (sum, group) => sum + group.skills.length,
  0,
);

// function SkillPill({ skill }) {
//   const Icon = ICONS[skill.icon] ?? Code2;
//   return (
//     <span className="group inline-flex items-center gap-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-3.5 py-2 text-sm text-ink dark:text-ink-dark transition-colors duration-200 hover:border-accent/40 dark:hover:border-accent-dark/40">
//       <Icon
//         size={15}
//         strokeWidth={1.75}
//         className="transition-colors duration-200 text-muted dark:text-muted-dark group-hover:text-accent dark:group-hover:text-accent-dark"
//       />
//       {skill.name}
//     </span>
//   );
// }

function SkillPill({ skill }) {
  const Icon = ICONS[skill.icon] ?? Code2;
  return (
    <span className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 border-b-zinc-300/90 dark:border-white/[0.08] dark:border-t-white/[0.14] bg-gradient-to-b from-white via-white to-zinc-100/70 dark:from-white/[0.06] dark:to-white/[0.015] px-3.5 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-200 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.03),inset_0_1px_0_0_#FFFFFF] dark:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 dark:hover:border-accent-dark/40 hover:from-white hover:to-zinc-50 dark:hover:from-white/[0.09] dark:hover:to-white/[0.025] hover:shadow-[0_6px_14px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_0_#FFFFFF] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.12)]">
      <Icon
        size={15}
        strokeWidth={1.75}
        className="transition-colors duration-200 text-zinc-500 dark:text-zinc-400 group-hover:text-accent dark:group-hover:text-accent-dark"
      />
      {skill.name}
    </span>
  );
}

function SkillGroupRow({ group, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="eyebrow">{group.label}</span>
        <div className="flex-1 h-px bg-line dark:bg-line-dark" />
        <span className="font-mono text-[11px] text-muted/70 dark:text-muted-dark/70">
          {group.skills.length} tools
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <SkillPill key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="pt-12 pb-20 border-t border-dashed border-line dark:border-line-dark sm:pt-14 md:pt-16 md:pb-24"
    >
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-md">
            <span className="eyebrow">Skills</span>
            <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              The tools I use to build.
            </h2>
          </div>
          <span className="font-mono text-xs text-muted dark:text-muted-dark">
            {TOTAL_SKILLS} tools · {skillGroups.length} layers
          </span>
        </motion.div>

        <div className="flex flex-col gap-10">
          {skillGroups.map((group, index) => (
            <SkillGroupRow key={group.key} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
