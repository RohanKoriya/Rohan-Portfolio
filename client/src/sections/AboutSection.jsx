import { motion, useReducedMotion } from "motion/react";
import ScrollHighlightBlock from "../components/ui/ScrollHighlightText.jsx";

const DETAILS = [
  { label: "Based in", value: "Mumbai, India" },
  { label: "Education", value: "B.Sc. IT · Mumbai University, 2026" },
  { label: "Currently", value: "Open to full-time opportunities" },
];

export default function AboutSection() {
  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };

  return (
    <section
      id="about"
      className="py-20 border-t border-line dark:border-line-dark sm:py-24 md:py-28 lg:py-32"
    >
      <div className="container-content">
        <div className="grid items-start grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Narrative */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="min-w-0 text-left lg:col-span-7"
          >
            <motion.span variants={reveal} className="eyebrow">
              A little about me
            </motion.span>

            <motion.div variants={reveal} className="w-full mt-6">
              <ScrollHighlightBlock
                headline="I like building things and figuring out how they work."
                body="I recently graduated with a B.Sc. in Information Technology from Mumbai University, and most of my learning has come from building projects. I enjoy taking an idea, working through the challenges, and turning it into something people can actually use. Projects like Ranklytics, LeadFlow, and ChatSphere have helped me learn a lot along the way. I'm still exploring, experimenting, and figuring out what I want to build next."
              />
            </motion.div>
          </motion.div>

          {/* Right: Connected profile timeline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="min-w-0 lg:col-span-5 lg:pt-1"
          >
            {/* Heading */}
            <motion.div variants={reveal} className="mb-8">
              <span className="block mb-2 eyebrow">Personal profile</span>

              <h3 className="text-2xl font-medium tracking-tight text-ink dark:text-ink-dark">
                The essentials
              </h3>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Connecting line centered inside the 20px node column */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-[9.5px] top-3 w-px bg-line dark:bg-line-dark"
              />

              <dl className="relative">
                {DETAILS.map((detail) => (
                  <motion.div
                    key={detail.label}
                    variants={reveal}
                    className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-x-5 pb-7 last:pb-0"
                  >
                    {/* High-contrast outlined node circle (Dark border in light mode, White border in dark mode) */}
                    <div className="relative z-10 flex justify-center pt-1.5">
                      <div className="w-3 h-3 border-2 rounded-full border-ink bg-canvas dark:border-white dark:bg-canvas-dark" />
                    </div>

                    {/* Detail */}
                    <div className="min-w-0 pt-0.5">
                      <dt className="mb-2 text-[10px] font-medium uppercase leading-5 tracking-[0.12em] text-muted dark:text-muted-dark">
                        {detail.label}
                      </dt>

                      <dd className="text-sm font-medium leading-6 text-ink dark:text-ink-dark sm:text-[14.5px]">
                        {detail.value}
                      </dd>
                    </div>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
