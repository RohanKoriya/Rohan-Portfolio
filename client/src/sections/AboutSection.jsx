// import { motion } from "motion/react";
// import ScrollHighlightBlock from "../components/ui/ScrollHighlightText.jsx";
// const QUICK_FACTS = [
//   { label: "Based in", value: "Mumbai, IN" },
//   { label: "Education", value: "B.Sc. IT (2023–2026)" },
//   { label: "Core Stack", value: "React · Node.js · Express · MongoDB" },
//   { label: "Status", value: "Available for full-time" },
// ];

// const PRINCIPLES = [
//   {
//     title: "Clean API Design",
//     body: "I keep endpoints predictable and validate data at the boundary.",
//   },
//   {
//     title: "State where it belongs",
//     body: "I keep state close to where it's used and introduce shared state only when it solves a real problem.",
//   },
//   {
//     title: "Polish is part of the build",
//     body: "Responsive behavior, small interactions, and visual details are considered while building—not added at the end.",
//   },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 16 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
//   },
// };

// export default function AboutSection() {
//   return (
//     <section
//       id="about"
//       className="py-24 border-t md:py-32 border-line dark:border-line-dark"
//     >
//       <div className="container-content">
//         <div className="grid grid-cols-1 gap-12 lg:gap-16 lg:grid-cols-2">
//           {/* Column 1: Narrative & Spec Sheet */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-80px" }}
//             variants={containerVariants}
//             className="flex flex-col"
//           >
//             <motion.span variants={itemVariants} className="eyebrow">
//               About
//             </motion.span>

//             {/* Single combined scroll highlight block for sequential highlighting */}
//             <div className="max-w-lg mt-3">
//               <ScrollHighlightBlock
//                 headline="I build full-stack web apps that feel simple to use and solid underneath."
//                 body="I recently completed my IT degree at Mumbai University. Most of my learning has come from building and shipping end-to-end applications like Ranklytics, LeadFlow, and ChatSphere. I enjoy working across the stack, from interfaces and APIs to the data behind them."
//               />
//             </div>

//             {/* Quick facts spec sheet */}
//             <motion.dl
//               variants={itemVariants}
//               className="grid max-w-lg grid-cols-2 mt-8 border-t border-line dark:border-line-dark"
//             >
//               {QUICK_FACTS.map((fact) => (
//                 <div
//                   key={fact.label}
//                   className="py-3.5 pr-4 border-b border-line dark:border-line-dark"
//                 >
//                   <dt className="eyebrow">{fact.label}</dt>
//                   <dd className="mt-1 text-sm font-medium text-ink dark:text-ink-dark">
//                     {fact.value}
//                   </dd>
//                 </div>
//               ))}
//             </motion.dl>
//           </motion.div>

//           {/* Column 2: Engineering Principles & Status */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-80px" }}
//             variants={containerVariants}
//             className="flex flex-col justify-between gap-10"
//           >
//             <div>
//               <motion.span variants={itemVariants} className="eyebrow">
//                 How I Work
//               </motion.span>

//               <div className="flex flex-col mt-3 border-t border-line dark:border-line-dark">
//                 {PRINCIPLES.map((principle, index) => (
//                   <motion.div
//                     key={principle.title}
//                     variants={itemVariants}
//                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                     className="flex gap-4 py-5 transition-colors duration-200 border-b cursor-default sm:gap-5 group border-line dark:border-line-dark"
//                   >
//                     <span className="font-mono text-xl font-light transition-colors duration-200 sm:text-2xl text-muted/40 dark:text-muted-dark/40 group-hover:text-emerald-400">
//                       {String(index + 1).padStart(2, "0")}
//                     </span>
//                     <div>
//                       <h3 className="mb-1 text-base font-medium transition-colors duration-200 text-ink dark:text-ink-dark group-hover:text-amber-500">
//                         {principle.title}
//                       </h3>
//                       <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
//                         {principle.body}
//                       </p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>

//             {/* Currently Learning */}
//             <motion.div
//               variants={itemVariants}
//               className="pt-5 border-line dark:border-line-dark/60"
//             >
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="w-2 h-2 rounded-full bg-emerald-500" />
//                 <span className="eyebrow text-emerald-600 dark:text-emerald-400">
//                   Currently Learning
//                 </span>
//               </div>

//               <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
//                 Exploring new frontend and backend concepts, with a growing
//                 focus on AI and ML.
//               </p>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

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

  return (
    <section
      id="about"
      className="py-24 border-t border-line dark:border-line-dark md:py-32"
    >
      <div className="container-content">
        <div className="max-w-5xl mx-auto">
          {/* Centered introduction */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : 0.1,
                },
              },
            }}
            className="flex flex-col items-center text-center"
          >
            <motion.span variants={reveal} className="eyebrow">
              A little about me
            </motion.span>

            <motion.div variants={reveal} className="w-full max-w-3xl mt-7">
              <ScrollHighlightBlock
                headline="I like building things and figuring out how they work."
                body="I recently graduated with a B.Sc. in Information Technology from Mumbai University, and most of my learning has come from building projects. I enjoy taking an idea, working through the challenges, and turning it into something people can actually use. Projects like Ranklytics, LeadFlow, and ChatSphere have helped me learn a lot along the way. I'm still exploring, experimenting, and figuring out what I want to build next."
              />
            </motion.div>
          </motion.div>

          {/* Personal details */}
          <motion.dl
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : 0.08,
                },
              },
            }}
            className="grid grid-cols-1 mt-16 border-y border-line dark:border-line-dark sm:grid-cols-3"
          >
            {DETAILS.map((detail, index) => (
              <motion.div
                key={detail.label}
                variants={reveal}
                className={`px-5 py-6 text-center sm:px-6 sm:py-7 ${
                  index !== DETAILS.length - 1
                    ? "border-b border-line dark:border-line-dark sm:border-b-0 sm:border-r"
                    : ""
                } ${
                  index !== 0 ? "sm:border-line dark:sm:border-line-dark" : ""
                }`}
              >
                <dt className="text-xs tracking-wide text-muted dark:text-muted-dark">
                  {detail.label}
                </dt>

                <dd className="mt-2 text-sm font-medium leading-relaxed text-ink dark:text-ink-dark">
                  {detail.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          {/* Personal closing note */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            className="flex flex-col items-center gap-3 mt-10 text-center sm:flex-row sm:justify-center sm:gap-4"
          >
            <span className="text-xs tracking-widest uppercase text-muted dark:text-muted-dark">
              Current focus
            </span>

            <span className="hidden w-1 h-1 rounded-full bg-muted/50 sm:block" />

            <p className="max-w-lg text-sm leading-7 text-muted dark:text-muted-dark">
              Exploring practical AI tool integrations and refining backend
              performance.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
