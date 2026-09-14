import { motion } from "motion/react";

const TIMELINE = [
  {
    period: "2023",
    title: "Started B.Sc. Information Technology",
    detail: "Mumbai University — began focusing coursework toward web engineering and databases.",
  },
  {
    period: "2024",
    title: "Shipped ChatSphere & LeadFlow",
    detail: "Built a real-time chat platform and a role-based CRM, both deployed and containerized.",
  },
  {
    period: "2025",
    title: "Shipped AI Resume Analyzer",
    detail: "Serverless, client-side resume evaluation tool with instant ATS feedback.",
  },
  {
    period: "2026",
    title: "Building Ranklytics",
    detail: "Enterprise SEO analytics platform with AI-generated audits, in active development.",
  },
];

export default function ExperienceSection() {
  return (
    <section aria-label="Timeline" className="py-24 md:py-32 border-t border-line dark:border-line-dark">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-md mb-14"
        >
          <span className="eyebrow">Timeline</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight">
            Coursework on one side, shipped projects on the other.
          </h2>
        </motion.div>

        <ol className="relative border-l border-line dark:border-line-dark pl-8 max-w-2xl">
          {TIMELINE.map((item, index) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="relative pb-12 last:pb-0"
            >
              <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-ink dark:bg-ink-dark" />
              <span className="font-mono text-xs text-muted dark:text-muted-dark">{item.period}</span>
              <h3 className="mt-1.5 text-lg font-medium">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted dark:text-muted-dark leading-relaxed">
                {item.detail}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
