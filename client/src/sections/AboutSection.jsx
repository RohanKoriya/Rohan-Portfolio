import { motion } from "motion/react";
import Badge from "../components/ui/Badge.jsx";

const QUICK_FACTS = [
  { label: "Based in", value: "Mumbai, IN" },
  { label: "Education", value: "B.Sc. IT · 2023–2026" },
  { label: "Focus", value: "Full-stack (MERN)" },
  { label: "Availability", value: "Full-time roles" },
];

const PRINCIPLES = [
  {
    title: "Clean API design",
    body: "Predictable, versioned endpoints with clear contracts — so the frontend never has to guess.",
  },
  {
    title: "Deliberate state management",
    body: "Local state stays local. Shared state lives in one place, with a clear owner and update path.",
  },
  {
    title: "UI polish as a habit",
    body: "Spacing, motion, and copy are treated as part of the engineering task, not an afterthought.",
  },
];

const COURSEWORK = [
  "Data Structures & Algorithms",
  "Web Engineering",
  "Database Management Systems",
  "Software Architecture",
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 border-t md:py-32 border-line dark:border-line-dark"
    >
      <div className="container-content">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Column 1: narrative */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">About</span>
            <h2 className="max-w-md mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100 md:text-4xl">
              B.Sc. IT graduate who loves building real apps.
            </h2>
            <p className="max-w-md mt-6 text-base leading-relaxed text-slate-600 dark:text-zinc-400 md:text-lg">
              I completed my degree in Information Technology at Mumbai
              University. While my courses gave me a good CS foundation, I
              learned the most by actually building products — like
              PredictSense, Ranklytics, and ChatSphere. I enjoy working on
              full-stack apps, writing clean code, and solving the tricky
              problems that pop up along the way.
            </p>

            {/* Quick facts — scannable spec-sheet strip */}
            <dl className="grid max-w-md grid-cols-2 mt-10 border-t border-line dark:border-line-dark">
              {QUICK_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="py-4 pr-4 border-b border-line dark:border-line-dark"
                >
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-1.5 text-sm text-ink dark:text-ink-dark">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap max-w-md gap-2 mt-8">
              {COURSEWORK.map((course) => (
                <Badge key={course}>{course}</Badge>
              ))}
            </div>
          </motion.div>

          {/* Column 2: principles + currently building */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-col gap-10"
          >
            <div>
              <span className="eyebrow">Engineering principles</span>
              <div className="flex flex-col mt-4 border-t border-line dark:border-line-dark">
                {PRINCIPLES.map((principle, index) => (
                  <motion.div
                    key={principle.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="flex gap-5 py-6 transition-colors duration-200 border-b group border-line dark:border-line-dark hover:bg-surface/50 dark:hover:bg-surface-dark/50"
                  >
                    <span className="font-mono text-3xl leading-none transition-colors duration-200 text-line dark:text-line-dark group-hover:text-accent/40 dark:group-hover:text-accent-dark/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base font-medium mb-1.5 transition-colors duration-200 group-hover:text-accent dark:group-hover:text-accent-dark">
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

            <div className="p-6 border rounded-2xl border-line dark:border-line-dark bg-surface/70 dark:bg-surface-dark/70">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-dot" />
                <span className="eyebrow">Currently building</span>
              </div>
              <p className="mb-1 text-base font-medium">Ranklytics</p>
              <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
                Rolling out an async report queue and a keyword-tracking engine
                ahead of a public beta.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
