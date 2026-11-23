import { motion, useReducedMotion } from "motion/react";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import ScrollHighlightBlock from "../components/ui/ScrollHighlightText.jsx";

const DETAILS = [
  {
    label: "Education",
    value: "Bachelor of Science in Information Technology",
    subtext: (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span>University of Mumbai</span>
        <span>·</span>
        <span>2023 - 2026</span>
      </span>
    ),
    Icon: GraduationCap,
    wide: true,
  },
  {
    label: "Based in",
    value: "Mumbai, India",
    Icon: MapPin,
  },
  {
    label: "Status",
    value: "Open to full-time roles",
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

  const stagger = (gap) => ({
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : gap,
      },
    },
  });

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
          variants={stagger(0.08)}
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
                body="I recently graduated with a B.Sc. in Information Technology from University of Mumbai, and most of my learning has come from building projects. I enjoy taking an idea, working through the challenges, and turning it into something people can actually use. Projects like Ranklytics, LeadFlow, and ChatSphere have helped me learn a lot along the way."
              />
            </motion.div>

            {/* Right: key facts. Rows cascade in one by one. */}
            <motion.aside
              variants={stagger(0.1)}
              className="min-w-0 lg:col-span-5 lg:pt-1"
            >
              <dl className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-1">
                {DETAILS.map(({ label, value, subtext, Icon, wide }) => (
                  <motion.div
                    key={label}
                    variants={reveal}
                    className={`flex items-start gap-4 ${
                      wide ? "sm:col-span-2 lg:col-span-1" : ""
                    }`}
                  >
                    <span className="grid w-10 h-10 mt-0.5 border rounded-lg shrink-0 place-items-center border-line text-muted dark:border-line-dark dark:text-muted-dark">
                      <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <dt className="text-xs text-muted dark:text-muted-dark">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-[15px] font-medium leading-snug text-ink dark:text-ink-dark">
                        {value}
                      </dd>
                      {subtext && (
                        <dd className="mt-1 text-xs text-muted dark:text-muted-dark">
                          {subtext}
                        </dd>
                      )}
                    </div>
                  </motion.div>
                ))}
              </dl>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
