import { motion, useReducedMotion } from "motion/react";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import ScrollHighlightBlock from "../components/ui/ScrollHighlightText.jsx";

const DETAILS = [
  {
    label: "Education",
    value: "B.Sc. IT · Mumbai University, 2026",
    Icon: GraduationCap,
  },
  { label: "Based in", value: "Mumbai, India", Icon: MapPin },
  {
    label: "Status",
    value: "Open to full-time opportunities",
    Icon: Briefcase,
  },
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
        staggerChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  return (
    <section
      id="about"
      className="pt-12 pb-20 border-t border-dashed border-line dark:border-line-dark sm:pt-14 md:pb-24 md:pt-16"
    >
      <div className="container-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <motion.span variants={reveal} className="block mb-6 eyebrow md:mb-8">
            A little about me
          </motion.span>

          <div className="grid items-start grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: narrative */}
            <motion.div
              variants={reveal}
              className="min-w-0 text-left lg:col-span-7"
            >
              <ScrollHighlightBlock
                headline="I like building things and figuring out how they work."
                body="I recently graduated with a B.Sc. in Information Technology from Mumbai University, and most of my learning has come from building projects. I enjoy taking an idea, working through the challenges, and turning it into something people can actually use. Projects like Ranklytics, LeadFlow, and ChatSphere have helped me learn a lot along the way."
              />
            </motion.div>

            {/* Right: key facts */}
            <motion.aside
              variants={reveal}
              className="min-w-0 lg:col-span-5 lg:pt-1"
            >
              <dl className="flex flex-col gap-6">
                {DETAILS.map(({ label, value, Icon }) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="grid w-10 h-10 border rounded-lg shrink-0 place-items-center border-line text-muted dark:border-line-dark dark:text-muted-dark">
                      <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <dt className="text-xs text-muted dark:text-muted-dark">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-[15px] font-medium leading-6 text-ink dark:text-ink-dark">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
