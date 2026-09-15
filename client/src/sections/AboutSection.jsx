import { motion } from "motion/react";
import Badge from "../components/ui/Badge.jsx";

const QUICK_FACTS = [
  { label: "Based in", value: "Mumbai, IN" },
  { label: "Education", value: "B.Sc. IT (2023–2026)" },
  { label: "Core Stack", value: "React · Node.js · MongoDB" },
  { label: "Status", value: "Available for full-time" },
];

const PRINCIPLES = [
  {
    title: "Clean API Design",
    body: "Predictable, versioned REST endpoints with explicit validation schemas so frontends consume data effortlessly.",
  },
  {
    title: "Deliberate State Management",
    body: "Keep UI state localized where possible. Global state is reserved for shared contexts with deterministic data paths.",
  },
  {
    title: "Craft as an Engineering Habit",
    body: "Micro-interactions, spatial rhythm, and responsive performance are core requirements, not post-launch polish.",
  },
];

const COURSEWORK = [
  "Data Structures & Algorithms",
  "Web Engineering",
  "Database Management",
  "Software Architecture",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 border-t md:py-32 border-line dark:border-line-dark"
    >
      <div className="container-content">
        <div className="grid grid-cols-1 gap-12 lg:gap-16 lg:grid-cols-2">
          {/* Column 1: Narrative & Spec Sheet */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="flex flex-col"
          >
            <motion.span variants={itemVariants} className="eyebrow">
              About
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="max-w-lg mt-3 text-3xl font-medium tracking-tight md:text-4xl text-ink dark:text-ink-dark"
            >
              Full-stack developer focused on building scalable, polished web
              apps.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="max-w-lg mt-5 text-base leading-relaxed text-muted dark:text-muted-dark md:text-lg"
            >
              I recently completed my IT degree at Mumbai University. While my
              coursework established strong CS foundations, I developed my
              engineering skills by shipping end-to-end applications like
              Ranklytics, Leadflow and ChatSphere. I thrive on solving complex
              state problems and designing intuitive user interfaces.
            </motion.p>

            {/* Quick facts spec sheet */}
            <motion.dl
              variants={itemVariants}
              className="grid max-w-lg grid-cols-2 mt-8 border-t border-line dark:border-line-dark"
            >
              {QUICK_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="py-3.5 pr-4 border-b border-line dark:border-line-dark"
                >
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink dark:text-ink-dark">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            {/* Coursework Tags */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap max-w-lg gap-2 mt-6"
            >
              {COURSEWORK.map((course) => (
                <Badge key={course}>{course}</Badge>
              ))}
            </motion.div>
          </motion.div>

          {/* Column 2: Engineering Principles & Status */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="flex flex-col justify-between gap-10"
          >
            <div>
              <motion.span variants={itemVariants} className="eyebrow">
                Engineering Principles
              </motion.span>

              <div className="flex flex-col mt-3 border-t border-line dark:border-line-dark">
                {PRINCIPLES.map((principle, index) => (
                  <motion.div
                    key={principle.title}
                    variants={itemVariants}
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex gap-4 py-5 transition-colors duration-200 border-b cursor-default sm:gap-5 group border-line dark:border-line-dark"
                  >
                    <span className="font-mono text-xl font-light transition-colors duration-200 sm:text-2xl text-muted/40 dark:text-muted-dark/40 group-hover:text-amber-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="mb-1 text-base font-medium transition-colors duration-200 text-ink dark:text-ink-dark group-hover:text-amber-500">
                        {principle.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
                        {principle.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Currently Learning Card */}
            <motion.div
              variants={itemVariants}
              className="p-5 border shadow-sm sm:p-6 rounded-2xl border-line/80 dark:border-line-dark/80 bg-surface/50 dark:bg-surface-dark/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                <span className="eyebrow text-emerald-600 dark:text-emerald-400">
                  Currently Learning
                </span>
              </div>

              <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
                Currently exploring new frontend and backend concepts, along
                with AI and ML.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
