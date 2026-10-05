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

function SkillPill({ skill }) {
  const Icon = ICONS[skill.icon] ?? Code2;
  return (
    <span className="group inline-flex items-center gap-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-3.5 py-2 text-sm text-ink dark:text-ink-dark transition-colors duration-200 hover:border-accent/40 dark:hover:border-accent-dark/40">
      <Icon
        size={15}
        strokeWidth={1.75}
        className="transition-colors duration-200 text-muted dark:text-muted-dark group-hover:text-accent dark:group-hover:text-accent-dark"
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
      className="py-24 border-t md:py-32 border-line dark:border-line-dark"
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
